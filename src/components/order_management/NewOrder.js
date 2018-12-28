import React, { Component } from 'react';
import { Layout,  Table, Modal, Form, Input, Button, Row, Col, Select, Icon  } from 'antd';


const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
let id = 0;

class NewOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }
    
      add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
      }
    
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
          const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 4 },
            },
          };

          getFieldDecorator('keys', { initialValue: [] });
          const keys = getFieldValue('keys');
          const formItems = keys.map((k, index) => (
              <Form key={k}>
                <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="SKU ID">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Select />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="Package">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Select />
                                )}
                            </FormItem>
                        </Col>
                </Row>
                <Row gutter={24}>
                        <Col span={8}>
                            <FormItem label="Quantity">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Select />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Unit Price">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Total Price">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input disabled />
                                )}
                           {keys.length > 1 ? (
                                    <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    disabled={keys.length === 1}
                                    onClick={() => this.remove(k)}
                                    />
                             ) : null}
                            </FormItem>
                        </Col>
                    </Row>
                  
              </Form>
          
          ));

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>New Order</span>
            </Header>
            <div style={{padding:'30px', width:'80%'}}>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="Order Number">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input name="order_number" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="Sale Channel">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Select />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem  label="Customer Name">
                        {getFieldDecorator('order_number', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="order_number" />
                        )}
                    </FormItem>
                    <Row gutter={8}>
                        <Col span={12}>
                            <FormItem label="Email">
                                {getFieldDecorator('email', {
                                    rules: [{ 
                                    type: 'email', message: 'The input is not valid E-mail!',
                                    required: true, message: '' }]
                                })(
                                    <Input name="email" />
                                )}
                            </FormItem> 
                        </Col>
                        <Col span={12}>
                            <FormItem label="Contact Number">
                                {getFieldDecorator('contact_num', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input name="contact_num" />
                                )}
                            </FormItem>  
                        </Col>
                    </Row>
                    <FormItem  label="Shipping Adddress">
                        {getFieldDecorator('order_number', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="order_number" />
                        )}
                    </FormItem>
                    <Row gutter={8}>
                        <Col span={14}>
                            <FormItem label='State'>
                                {getFieldDecorator('website', {
                                
                                })(
                                    <Select />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label='Postcode'>
                                {getFieldDecorator('status', {
                                    
                                })(
                                    <Input />
                                    
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <h3 style={{paddingBottom:'10px'}}>Package Details</h3>
                    <Form>
                        {formItems}
                        <Form.Item >
                            <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                                <Icon type="plus" /> Add Package
                            </Button>
                        </Form.Item>
                    </Form>
                    <FormItem>
                        <Button type="primary">
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

