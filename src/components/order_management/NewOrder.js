import React, { Component } from 'react';
import { Layout, Form, Input, Button, Row, Col, Select, Icon, Modal } from 'antd';
import { createOrder, saleChannelList } from '../../helpers/OrderController';
import { listSku, listSkuPackage } from '../../helpers/SkuController';

const { Header } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
let id = 0;

class NewOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skus: [],
            packages: [],
            sale_channels: [],
            loading: false,
            package_key: 0
        };
    }

    componentDidMount() {
        this.showListSku();
        this.showCourierList();
    }

    showListSku() {
        var access_token = sessionStorage.getItem('access_token');
        listSku(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ skus: result.data });
                }
            })
    }

    showListPackage(k, sku_id) {
        var access_token = sessionStorage.getItem('access_token');
        listSkuPackage(sku_id, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ packages: result.data });
                }
            })
    }

    showCourierList() {
        var access_token = sessionStorage.getItem('access_token');
        saleChannelList(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ sale_channels: result.data });
                }
            })
    }

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
    
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        var access_token = sessionStorage.getItem('access_token');
        const { form } = this.props;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            this.setState({ loading: true });
            createOrder(values.sale_channel_id, values.order_ref_num, values.customer_name, values.customer_email, values.customer_contact_num, values.customer_address, values.customer_postcode, values.customer_state, values.package_details, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.setState({ loading: false });
                        form.resetFields();
                        Modal.success({
                            title: 'Success',
                            content: 'You have successfully created a new order.',
                        });
                    }
                })
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { skus, packages, sale_channels, loading } = this.state;

        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <React.Fragment key={k}>
                <Row gutter={8}>
                    <Col span={6}>
                        <FormItem>
                            {getFieldDecorator(`package_details[${k}]sku_id`, {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Select placeholder="Please select the product SKU">
                                    {skus.map((sku) =>
                                        <Option key={sku.id} value={sku.id} onClick={() => this.showListPackage(k, sku.id)}>{sku.sku}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`package_details[${k}]package_id`, {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Select placeholder="Please select the product package">
                                    {packages.map((product_package) =>
                                        <Option key={product_package.id} value={product_package.id}>{product_package.code + ' - ' + product_package.name}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem>
                            {getFieldDecorator(`package_details[${k}]quantity`, {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem>
                            {getFieldDecorator(`package_details[${k}]unit_price`, {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    {/* <Col span={3}>
                        <FormItem>
                            {getFieldDecorator(`package_details[${k}]total_price`, {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            <Input disabled/>
                            
                        </FormItem>
                    </Col> */}
                    <Col span={2}> {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)} />
                            ) : null} 
                        </Col>
                </Row>
            </React.Fragment>
        ));
       
         return (
            <div>
                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>New Order</span>
                </Header>
                <div style={{padding:'30px', width:'90%'}}>
                    <Form layout="vertical">
                        <div style={{backgroundColor:'white', padding:'20px', marginBottom:'10px'}}>
                            <h3 style={{paddingBottom:'10px'}}>Customer Details</h3>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <FormItem label="Order Number">
                                        {getFieldDecorator('order_ref_num', {
                                            rules: [{ required: true, message: '' }]
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Sale Channel">
                                        {getFieldDecorator('sale_channel_id', {
                                            rules: [{ required: true, message: '' }]
                                        })(
                                            <Select placeholder="Please select the courier">
                                                {sale_channels.map((sale_channel) =>
                                                    <Option key={sale_channel.id} value={sale_channel.id}>{sale_channel.name}</Option>
                                                )}
                                        </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem  label="Customer Name">
                                {getFieldDecorator('customer_name', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <Row gutter={8}>
                                <Col span={12}>
                                    <FormItem label="Email">
                                        {getFieldDecorator('customer_email', {
                                            rules: [{
                                                type: 'email', message: 'The input is not valid E-mail!'
                                            }, {    
                                                required: true, message: ''
                                            }]
                                        })(
                                            <Input />
                                        )}
                                    </FormItem> 
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Contact Number">
                                        {getFieldDecorator('customer_contact_num', {
                                            rules: [{ required: true, message: '' }]
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>  
                                </Col>
                            </Row>
                            <FormItem  label="Shipping Adddress">
                                {getFieldDecorator('customer_address', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <Row gutter={8}>
                                <Col span={14}>
                                    <FormItem label='State'>
                                        {getFieldDecorator('customer_state', {
                                        
                                        })(
                                            <Select>
                                                <Option value="Selangor">Selangor</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem label='Postcode'>
                                        {getFieldDecorator('customer_postcode', {
                                            
                                        })(
                                            <Input />
                                            
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>

                        <div style={{backgroundColor:'white', padding:'10px', marginBottom:'20px'}}>
                            <h3 style={{paddingBottom:'10px'}}>Package Details</h3>
                            <Form.Item >
                                <Button type="dashed" onClick={this.add} style={{ width: '20%', }}>
                                    <Icon type="plus" /> Add Package
                                </Button>
                            </Form.Item>
                            <Row gutter={8} style={{backgroundColor:'#e8e8e8', padding:'10px', paddingBottom:'0px', marginBottom:'10px' }}>
                                <Col span={6}>
                                    <p>SKU</p>
                                </Col>
                                <Col span={8}>
                                    <p>Code-Package</p>
                                </Col>
                                <Col span={4}>
                                    <p>Quantity</p>
                                </Col>
                                <Col span={4}>
                                    <p>Unit Price</p>
                                </Col>
                                {/* <Col span={3}>
                                    <p>Total</p>
                                </Col> */}
                                <Col span={1}>
                                    <p style={{color:'#e8e8e8'}}>  </p>
                                </Col>
                            </Row>
                            {formItems}
                        </div>
                        
                        <FormItem>
                            <Button loading={loading} className="button-right" type="primary" onClick={this.handleSubmit}>
                                Add order
                            </Button>
                        </FormItem>   
                    </Form>
                </div>  
            </div>
        );
    }   
}

export default  Form.create()(NewOrder);

