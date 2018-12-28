import React, { Component } from 'react';
import { Layout,  Table, Modal, Button, Form, Input, Select } from 'antd';
import { listPackage, createPackage } from '../../helpers/PackageController';
import { listSku } from '../../helpers/SkuController';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;

class ProductPackage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            packages: [],
            skus: [],
            require_activation: true,
            loading: false
        };
    }

    componentDidMount() {
        this.showPackageList();
        this.showSkuList();
    }

    showPackageList() {
        var access_token = sessionStorage.getItem('access_token');
        listPackage(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ packages: result.data });
                }
            })
    }

    showSkuList() {
        var access_token = sessionStorage.getItem('access_token');
        listSku(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ skus: result.data });
                }
            })
    }

    showAddPackagesModal = () => {
        this.setState({ visible: true });
    }
    
    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visible: false });
    }

    // onChangeSwitch = (value) => {
    //     this.setState({ require_activation: value });
    // }

    handleSubmit = (e) => {
        e.preventDefault();
        var access_token = sessionStorage.getItem('access_token');
        // const { require_activation } = this.state;
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            this.setState({ loading: true });
            createPackage(values.sku_id, values.code, values.name, values.description, values.cost_price, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.setState({ loading: false });
                        this.handleCancel();
                        this.showPackageList();
                    }
                })
        });
    }

    render() {
        const { packages, skus, loading } = this.state;
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
                    dataSource={packages}
                    rowKey={packages => packages.id}>
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="SKU" dataIndex="sku_name" key="sku_name" />
                    <Column title="Code" dataIndex="code" key="code" />
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="Cost Price" dataIndex="cost_price" key="cost_price" />
                    <Column title="Description" dataIndex="description" key="description" />
                    <Column title="Req Activation" dataIndex="require_activation" key="require_activation" />
                </Table>

                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    title={"Add new package"}
                    footer={<Button type="primary" loading={loading} onClick={this.handleSubmit}>Add Package</Button>}>
                    <Form layout="vertical">
                        <FormItem label="SKU">
                            {getFieldDecorator('sku_id', {
                                rules: [{ required: true, message: 'Please select the product SKU!' }]
                            })(
                                <Select placeholder="Please select the product SKU">
                                    {skus.map((sku) =>
                                        <Option key={sku.id} value={sku.id}>{sku.sku}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem label="Code">
                            {getFieldDecorator('code', {
                                rules: [{ required: true, message: 'Please input the product code!' }]
                            })(
                                <Input />
                            )}
                        </FormItem> 

                        <FormItem label="Package Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input the product name!' }]
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem label="Cost Price (RM)">
                            {getFieldDecorator('cost_price', {
                                rules: [{ required: true, message: 'Please input the product cost price!' }]
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem label="Description">
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: 'Please input the product description!' }]
                            })(
                                <Input />
                            )}
                        </FormItem>

                        {/* <FormItem label="Required Activation">
                            {getFieldDecorator('require_activation', {
                            })(
                                <Switch onChange={this.onChangeSwitch} checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
                            )}
                        </FormItem> */}
                    </Form>
                </Modal>
            </div>
        </div>
        );   
    }
}

export default Form.create()(ProductPackage);