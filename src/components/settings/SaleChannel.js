import React, { Component } from 'react';
import { Layout, Table, Button, Modal, Input, Form } from 'antd';
import { listSalesChannels, createSalesChannel, editSalesChannel, deleteSalesChannel } from '../../helpers/SalesChannels';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class SaleChannel extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            clickView:false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showSalesChannelsList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    showSalesChannelsList() {
        var access_token = sessionStorage.getItem('access_token');
        listSalesChannels(access_token)
            .then(result => {
                if (result.result === 'GOOD') {    
                    if(this._isMounted) this.setState({ sales_channels: result.data });
                }
            })
    }

    showModal = () => {
        if(this._isMounted) this.setState({ visible: true , clickView: true});
    }

    showEditModal = () => {
        if(this._isMounted) this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visible: false, clickView: false  });
    }

    handleDelete() {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this Sales Channel?',
            onOk: () => {
                deleteSalesChannel(this.state.id, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        Modal.success({
                            title:'Success',
                            content:'You have successfully deleted this package.',
                            onOk: () => {
                                this.showSalesChannelsList();
                        }});
                    }   
                })
              
            }
        })
    }

    submitSaleChannel = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            createSalesChannel(values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({ loading: false });
                        this.handleCancel();
                        this.showSalesChannelsList();
                    }
                })
        });
    }

    editSaleChannel = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            editSalesChannel(this.state.id, values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({ loading: false });
                        this.handleCancel();
                        this.showSalesChannelsList();
                    }
                })
        });
    }

    onClickModal = () => {
        if(this._isMounted) this.setState({
            channel: {
               name:'',
            }
        }, () => this.showModal());
    }

    render() {
        const { channel, loading, clickView } = this.state;
        const { getFieldDecorator } = this.props.form;
        const data = this.state.sales_channels;

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Sales Channels</span>
            </Header>
                <div style={{ padding: '30px', width:'80%'}}>
                    <Button
                        onClick={this.onClickModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        New Sales Channel
                    </Button>
                    <Table
                        dataSource={data}
                        rowKey={data => data.id }
                        bordered
                    >
                    <Column width={'50%'} title="Channel Name" dataIndex="name" key="name" />
                    <Column
                        title='Action'
                        key="action"
                        render={(record) => (
                            <div>
                                <Button
                                    style={{ margin:'10px' }}
                                    type="primary"
                                    onClick={() => this._isMounted === true ? this.setState({ channel: Object.assign({}, record), id: record.id }, ()=> this.showEditModal()) : null}>
                                    Edit
                                </Button>

                                <Button
                                    style={{ margin:'10px' }}
                                    type="primary"
                                    onClick={() => this._isMounted === true ? this.setState({ channel: Object.assign({}, record), id: record.id }, ()=> this.handleDelete()) : null}>
                                    Delete
                                </Button>
                            </div>
                        )} />
                    </Table>
                </div>
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    title={clickView ? 'Add Channel' : 'Edit' }
                    footer={<Button type="primary" loading={loading} onClick={clickView ? this.submitSaleChannel : this.editSaleChannel }>Save</Button>}>
                    { channel && <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                  initialValue: channel.name,
                                rules: [{ required: true, message: 'Please enter a sales channel.' }]
                            })(
                                <Input  name = 'Name'/>
                            )}
                        </FormItem>
                    </Form>}
                </Modal>
            </div>
            
            );   
        }      
}

export default Form.create()(SaleChannel);