import React, { Component } from 'react';
import { Layout,  Table, Modal, Form, Input, Button, Row, Col, Select  } from 'antd';


const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  };
const formLayoutInline = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 8 },
  };

class NewOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form;
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>New Order</span>
            </Header>
            <div style={{padding:'30px'}}>
                <Form layout="vertical">
                    <Row gutter={8}>
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
                            <FormItem label="Order Number">
                                {getFieldDecorator('order_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input name="order_number" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="Customer Name">
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

                    <Row gutter={8}>
                        <Col span={14}>
                            <FormItem label='gg'>
                                {getFieldDecorator('website', {
                                
                                })(
                                    <Input disabled />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label='ll'>
                                {getFieldDecorator('status', {
                                    
                                })(
                                    <Select />
                                    
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    
                    <FormItem {...formTailLayout}>
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

