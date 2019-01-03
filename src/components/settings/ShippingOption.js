import React, { Component } from 'react';
import { Layout, Table, Button,  Modal, Input, Form  } from 'antd';
import { listShippingMethods, createShippingMethod } from '../../helpers/ShippingMethods';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ShippingOption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            clickView:false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showShippingMethodsList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    showShippingMethodsList() {
        var access_token = sessionStorage.getItem('access_token');
        listShippingMethods(access_token)
            .then(result => {
                if (result.result === 'GOOD') {    
                    this.setState({ shipping_methods: result.data });
                }
            })
    }
 
    showModal = () => {
        this.setState({ visible: true , clickView: true});
    }

    showEditModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visible: false, clickView: false  });
    }

    handleDelete() {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this shipping provider?',
            onOk: () => {
                
            }
        })
    }

    submitShippingMethod = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            this.setState({ loading: true });
            createShippingMethod(values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.setState({ loading: false });
                        this.handleCancel();
                        this.showShippingMethodsList();
                    }
                })
        });
    }

    onClickModal = () => {
        this.setState({
            shipping: {
               name:'',
            }
        }, () => this.showModal());
    }

    render() {
        const { shipping, loading, clickView } = this.state;
        const { getFieldDecorator } = this.props.form;
        const data = this.state.shipping_methods;

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Shipping Options</span>
            </Header>
                <div style={{ padding: '30px', width:'80%'}}>
                    <Button
                        onClick={this.onClickModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        New Shipping Option
                    </Button>
                    <Table
                        dataSource={data}
                        rowKey={data => data.id }
                        bordered
                    >
                    <Column width={'50%'} title="Shipping Provider" dataIndex="courier_name" key="courier_name" />
                    {/* <Column
                        title='Action'
                        key="action"
                        render={(record) => (
                            <div>
                                <Button style={{ margin:'10px' }} type="primary"
                                onClick={()=> this.showEditModal()}>Edit</Button>
                                <Button style={{ margin:'10px' }} type="primary"
                                onClick={()=> this.handleDelete()}>Delete</Button>
                            </div>
                        )} /> */}
                    </Table>
                </div>
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    title={clickView ? 'Add Shipping Provider' : 'Edit Shipping Provider' }
                    footer={<Button type="primary" loading={loading} onClick={this.submitShippingMethod}>Save</Button>}>
                    { shipping && <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                  initialValue: shipping.name,
                                rules: [{ required: true, message: 'Please input the shipping provider' }]
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

export default  Form.create()(ShippingOption);