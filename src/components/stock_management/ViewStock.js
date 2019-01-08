import React, { Component } from 'react';
import { Layout,  Table, AutoComplete, Input, Button, Icon, Modal, Form, Select } from 'antd';
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
           search: null,
           sku_filter: null,
           package_filter: null,
           status_filter: null,
           visible: false,
           loading: false,
           stock_id: '',
           required: ['viewStock', 'writeoffStock'],
           allowed: [],

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

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    showListStock() {
        var access_token = sessionStorage.getItem('access_token');
        listStock(null, access_token)
            .then(result => {               
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ 
                                            stocks: result.data, 
                                            sku_filter: result.sku_list, 
                                            package_filter:result.packages_list, 
                                            status_filter:result.status_list  });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    handleSearch() {
        var access_token = sessionStorage.getItem('access_token');
        var { search } = this.state;

        listStock(search, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ stocks: result.data });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    handleClearFilter(){
        this.setState({search: null, sku_filter:null, package_filter:null, status_filter:null})
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

    render() {
        const { stocks, visible, loading, allowed, status_filter, sku_filter, package_filter } = this.state;
        const { getFieldDecorator } = this.props.form;
        console.warn(sku_filter);
        console.warn(package_filter);

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
                         <Select
                            showSearch
                            style={{ width: 180, marginRight:5}}
                            placeholder="Filter by SKU"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           >
                            {/* {sku_filter.map(sku => <Option key={sku[0]}>{sku[1]}</Option>)} */}
                        </Select>
                        <Select
                            showSearch
                            style={{ width: 180,  marginRight:5 }}
                            placeholder="Filter by Packages"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            
                        </Select>
                        <Select
                            showSearch
                            style={{ width: 180,  marginRight:5 }}
                            placeholder="Filter by Status"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            
                        </Select>
                        <AutoComplete
                            className="global-search"
                            onSearch={(search) => (this._isMounted === true) ? this.setState({ search }) : null}
                            placeholder="Search sim card number">
                            <Input suffix={(
                                <Button className="search-btn" type="primary" onClick={() => this.handleSearch()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
                        <Button type="primary" style={{marginLeft:60 }} onClick={this.handleClearFilter}>Clear Filter</Button>
                    </div>
                    <div style={{ padding:'30px', paddingTop:'0px' }}>
                        <Table
                            dataSource={stocks}
                            rowKey={stocks => stocks.id}>
                            <Column title="Serial Number" dataIndex="serial_number" key="serial_number" />
                            <Column title="Stock Status" dataIndex="stock_status" key="stock_status" />
                            <Column title="Package Code" dataIndex="package_code" key="package_code" />
                            <Column title="Sim Card Number" dataIndex="sim_card_number" key="sim_card_number" />
                            <Column
                                title='Action'
                                key="action"
                                render={(record) => (
                                    <div>
                                        {allowed.includes('writeoffStock') === true ? <Button
                                            disabled={record.stock_status === 'Sold' ? true : false}
                                            style={{ margin:'10px' }}
                                            type="primary" onClick={() => (this._isMounted === true) ? this.setState({ stock_id: record.id }, this.showWriteOffModal) : null}>
                                            Write Off
                                        </Button> : null}
                                    </div>
                                )} />
                        </Table>
    
                        <Modal
                            visible={visible}
                            onCancel={this.handleCancel}
                            title="Write Off"
                            footer={<Button type="primary" loading={loading} onClick={this.handleWriteOff}>Write Off</Button>}>
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