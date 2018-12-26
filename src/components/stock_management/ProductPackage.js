import React, { Component } from 'react';
import { Layout,  Table, Modal, Button, Form, Input, Switch } from 'antd';


const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;

class ProductPackage extends Component {

    constructor(props) {
        super(props);
        this.state = {
           visible:false
        };
    }

    showAddPackagesModal = () => {
        this.setState({ visible: true});
    }
    
    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visible: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Product Package</span>
            </Header>
            <div style={{ padding: '30px' }}>
                    <Button
                        onClick={this.showAddPackagesModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        New Package
                    </Button>

                    <Table
                        // dataSource={packages}
                        // rowKey={pakages => packages.id}
                        >
                        <Column title="ID" dataIndex="id" key="id" />
                        <Column title="Provider ID" dataIndex="provider_id" key="rovider_id" />
                        <Column title="SKU" dataIndex="sku" key="sku" />
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Cost Price" dataIndex="cost_price" key="cost_price" />
                        <Column title="Description" dataIndex="description" key="description" />
                        <Column title="Activation" dataIndex="activation" key="activation" />
                    </Table>

                    <Modal
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        title={"Add new package"}
                        footer={<Button type="primary">Add Package</Button>}>
                        <Form layout="vertical">
                            <FormItem label="Provider ID">
                                {getFieldDecorator('order', {
                                    rules: [{ required: true, message: 'Please input the provider id!' }]
                                })(
                                    <Input name="provider_id" />
                                )}
                            </FormItem>

                            <FormItem label="SKU">
                                {getFieldDecorator('sku', {
                                    rules: [{ required: true, message: 'Please input the product SKU!' }]
                                })(
                                    <Input name="sku" />
                                )}

                            </FormItem>
                            <FormItem label="Name">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Please input the product name!' }]
                                })(
                                    <Input name="name" />
                                )}
                            </FormItem>

                            <FormItem label="Cost Price">
                                {getFieldDecorator('costprice', {
                                    rules: [{ required: true, message: 'Please input the product cost prize!' }]
                                })(
                                    <Input name="costprice" />
                                )}
                            </FormItem>

                            <FormItem label="Description">
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: 'Please input the product description!' }]
                                })(
                                    <Input name="description" />
                                )}
                            </FormItem>

                            <FormItem label="Required Activation">
                                {(
                                    <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </div>
            );   
        }
       
}

export default Form.create()(ProductPackage);