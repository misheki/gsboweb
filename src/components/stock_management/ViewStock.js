import React, { Component } from 'react';
import { Layout,  Table, AutoComplete, Input, Button, Icon, Modal, Form, Select, Row, Col,  } from 'antd';
import { listStock, writeOff } from '../../helpers/StockController';
import { checkAccess } from '../../helpers/PermissionController';
import { Helmet } from 'react-helmet';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class ViewStock extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
           stocks: [],
           skus: null,
           packages: null,
           statuses: null,
           search: null,
           sku_filter: null,
           package_filter: null,
           status_filter: null,
           visible: false,
           loading: false,
           stock_id: '',
           required: ['viewStock', 'writeoffStock'],
           allowed: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getPermissions();
        this.showListStock();   
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps() {
        this.showListStock();
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    showListStock() {
        var access_token = sessionStorage.getItem('access_token');
        const {search, sku_filter, package_filter, status_filter} = this.state;

        listStock(search, sku_filter, package_filter, status_filter, access_token)
            .then(result => {            
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ 
                                                stocks: result.data, 
                                                skus: result.sku_list, 
                                                packages:result.packages_list, 
                                                statuses:result.status_list,
                                                available_count:result.available_count,
                                                reserved_count:result.reserved_count,
                                                sold_count: result.sold_count,
                                                writeoff_count: result.writeoff_count
                                          });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    handleSkuFilter = (value)  => {
        if(this._isMounted) this.setState({ sku_filter : value }, () => this.showListStock());
    }

    handlePackageFilter = (value)  => {
        if(this._isMounted) this.setState({ package_filter : value }, () => this.showListStock());
    }

    handleStatusFilter = (value)  => {
        if(this._isMounted) this.setState({ status_filter : value }, () => this.showListStock());
    }

    handleClearFilter = () => {
        if(this._isMounted) this.setState({search: null, sku_filter:null, package_filter:null, status_filter:null}, () => this.showListStock());
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visible: false });
    }

    showWriteOffModal = () => {
        if(this._isMounted) this.setState({ visible: true });
    }

    handleWriteOff = () => {
        var access_token = sessionStorage.getItem('access_token');
        var form = this.props.form;
        const { stock_id } = this.state;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            confirm({
                title: 'Confirm',
                content: 'Are you sure you want to write off this stock?',
                onOk: () => {
                    if(this._isMounted) this.setState({ loading: true });
                    writeOff(stock_id, values.remarks, access_token)
                        .then(result => {
                            if (result.result === 'GOOD') {
                                this.showListStock();
                                if(this._isMounted) this.setState({ loading: false, visible: false });
                                form.resetFields();
                                Modal.success({
                                    title: 'Success',
                                    content: 'You have successfully wrote off this stock!',
                                });
                            }
                        })
                        .catch(error => {
                            if(this._isMounted) this.setState({ loading: false });
                            Modal.error({
                                title: 'Error',
                                content: error
                            })
                        })
                }
            })
        });
    }

    showSkuFilter() {
        const { skus } = this.state;

        if(skus != null){
            return (
                <Select
                    showSearch
                    style={{ width: 150, marginRight:5}}
                    placeholder="Filter by SKU"
                    value={this.state.sku_filter ? this.state.sku_filter : undefined}
                    onChange={this.handleSkuFilter}>
                    {skus.map(sku => <Option key={sku.id} value={sku.id}>{sku.sku}</Option>)}
                </Select>
            );
        }
    }

    showPackageFilter() {
        const { packages } = this.state;

        if(packages != null){

            return (
                <Select
                    showSearch
                    style={{ width: 180, marginRight:5}}
                    placeholder="Filter by Package"
                    value={this.state.package_filter ? this.state.package_filter : undefined}
                    onChange={this.handlePackageFilter}>
                    {packages.map(pkg => <Option key={pkg.id} value={pkg.id}>{pkg.code}</Option>)}
                </Select>
            );
        }
    }

    showStatusFilter() {
        const { statuses } = this.state;

        if(statuses != null){

            return (
                <Select
                    showSearch
                    style={{ width: 150, marginRight:5}}
                    placeholder="Filter by Status"
                    value={this.state.status_filter ? this.state.status_filter : undefined}
                    onChange={this.handleStatusFilter}>
                    {statuses.map(status => <Option key={status.id} value={status.id}>{status.name}</Option>)}
                </Select>
            );
        }
    }

    render() {
        const { stocks, visible, loading, allowed } = this.state;
        const { getFieldDecorator } = this.props.form;

        if (allowed.includes('viewStock')) {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - View Stocks</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>View Stock</span>
                    </Header>    
                    <div className="global-search-wrapper" >
                        {this.showSkuFilter()}
                        {this.showPackageFilter()}
                        {this.showStatusFilter()}
                        <AutoComplete
                            className="global-search"
                            onSearch={(search) => (this._isMounted === true) ? (search.length > 0 ? this.setState({ search }) : this.setState({ search : null })) : null}
                            placeholder="Search Serial Number"
                            value={this.state.search}>
                            <Input suffix={(
                                <Button className="search-btn" type="primary" onClick={() => this.showListStock()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
                        <Button type="primary"  icon="close-circle" style={{marginLeft:60 }} onClick={this.handleClearFilter}>Clear Filter</Button>   
                    </div>
                    <Row gutter={16} style={{paddingLeft:'30px'}}>
                        <Col span={3} >
                          <p style={{color:'green' }}>Available : {this.state.available_count}</p>
                        </Col>
                        <Col span={3} >
                           <p style={{color:'orange'}}>Reserved  : {this.state.reserved_count}</p>
                        </Col>
                        <Col span={3} >
                           <p style={{color:'grey'}}>Sold : {this.state.sold_count}</p>
                        </Col>
                        <Col span={3} >
                            <p style={{color:'red'}}>Write Off :  {this.state.writeoff_count}</p>
                        </Col>
                    </Row>
                    <div style={{ padding:'30px', paddingTop:'0px' }}>
                        <Table
                            bordered
                            dataSource={stocks}
                            rowKey={stocks => stocks.id}>
                            <Column title="SKU" dataIndex="sku_name" key="sku_name" />
                            <Column title="Serial Number" dataIndex="serial_number" key="serial_number" />
                            <Column title="Stock Status" dataIndex="stock_status" key="stock_status" />
                            <Column title="Package Code" dataIndex="package_code" key="package_code" />
                            <Column title="Sim Card Number" dataIndex="sim_card_number" key="sim_card_number" />
                            <Column
                                title='Action'
                                key="action"
                                render={(record) => (
                                    <div>
                                        {allowed.includes('writeoffStock') === true ? 
                                        <Button
                                            disabled={record.stock_status === 'Sold' ? true : false}
                                            style={{ margin:'10px' }}
                                            icon="stop" 
                                            type="primary" onClick={() => (this._isMounted === true) ? this.setState({ stock_id: record.id }, this.showWriteOffModal) : null}>
                                            Write Off
                                        </Button> : null}
                                        <Button
                                            style={{ margin:'10px' }}
                                            icon="eye" 
                                            type="primary">
                                            View
                                        </Button> 
                                    </div>
                                )} />
                        </Table>
    
                        <Modal
                            visible={visible}
                            onCancel={this.handleCancel}
                            title="Write Off"
                            footer={<Button icon="stop" type="primary" loading={loading} onClick={this.handleWriteOff}>Write Off</Button>}>
                            <Form layout="vertical">
                                <FormItem label="Reason to Write Off">
                                    {getFieldDecorator('remarks', {
                                        rules: [{ required: true, message: 'Please state your reason to write off this stock!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>
                    </div>           
                </div>
            );   
        }
        else {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - View Stocks</title>
                    </Helmet>
                </div>
            );
        }
    }
}

export default Form.create()(ViewStock);