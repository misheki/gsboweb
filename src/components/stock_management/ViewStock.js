import React, { Component } from 'react';
import { Layout,  Table, AutoComplete, Input, Button, Icon, Modal, Form } from 'antd';
import { listStock, writeOff } from '../../helpers/StockController';
import { checkAccess } from '../../helpers/PermissionController';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ViewStock extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
           stocks: [],
           search: '',
           visible: false,
           loading: false,
           stock_id: '',
           show_table_stock: false,
           show_button_write_off: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showListStock();
        this.showTableStock();
        this.showButtonWriteOff();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showTableStock() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(['viewStock'], access_token).then(result => result !== false ? (this._isMounted === true ? this.setState({ show_table_stock: result }) : null) : null);
    }

    showButtonWriteOff() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(['writeoffStock'], access_token).then(result => result !== false ? (this._isMounted === true ? this.setState({ show_button_write_off: result }) : null) : null);
    }

    showListStock() {
        var access_token = sessionStorage.getItem('access_token');
        listStock(null, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ stocks: result.data });
                }
            })
    }

    handleSearch() {
        var access_token = sessionStorage.getItem('access_token');
        var { search } = this.state;

        listStock(search, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ stocks: result.data });
                }
            })
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visible: false });
    }

    showWriteOffModal = () => {
        this.setState({ visible: true });
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
                    this.setState({ loading: true });
                    writeOff(stock_id, values.remarks, access_token)
                        .then(result => {
                            if (result.result === 'GOOD') {
                                this.showListStock();
                                this.setState({ loading: false, visible: false });
                                form.resetFields();
                                Modal.success({
                                    title: 'Success',
                                    content: 'You have successfully wrote off this stock!',
                                });
                            }
                        })
                }
            })
        });
    }

    render() {
        const { stocks, visible, loading, show_table_stock, show_button_write_off } = this.state;
        const { getFieldDecorator } = this.props.form;

        if (show_table_stock === true) {
            return (
                <div>
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>View Stock</span>
                    </Header>    
                    <div className="global-search-wrapper" >
                        <AutoComplete
                            className="global-search"
                            size="large"
                            onSearch={(search) => this.setState({ search })}
                            placeholder="Search sim card number">
                            <Input suffix={(
                                <Button className="search-btn" size="large" type="primary" onClick={() => this.handleSearch()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
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
                                        {show_button_write_off === true ? <Button
                                            style={{ margin:'10px' }}
                                            type="primary" onClick={() => this.setState({ stock_id: record.id }, this.showWriteOffModal)}>
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
                <div></div>
            );
        }
    }
}

export default Form.create()(ViewStock);