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
                 <Form>
                    <Row gutter={24}>
                            <Col span={10} >
                                <FormItem {...formLayoutInline} label="Order Number">
                                    {getFieldDecorator('order_number', {
                                        rules: [{ required: true, message: '' }]
                                    })(
                                        <Input name="order_number" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...formLayoutInline} label="Sale Channel">
                                    {getFieldDecorator('sale_channel', {
                                        rules: [{ required: true, message: '' }]
                                    })(
                                        <Select />
                                    )}
                                </FormItem>
                            </Col>
                    </Row>
                    <Row gutter={24}>
                            <Col span={10} >
                                <FormItem {...formLayoutInline} label="Customer Name">
                                    {getFieldDecorator('order_number', {
                                        rules: [{ required: true, message: '' }]
                                    })(
                                        <Input name="order_number" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}> 
                                <FormItem {...formLayoutInline} label="Contact Number">
                                    {getFieldDecorator('sale_channel', {
                                        rules: [{ required: true, message: '' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                    </Row>

                    <FormItem  {...formItemLayout} label="SKU">
                        {getFieldDecorator('sku', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="sku" />
                        )}

                    </FormItem>
                    <FormItem   {...formItemLayout} label="Product Packages">
                        {getFieldDecorator('product_purchase', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="product_purchase" />
                        )}
                    </FormItem>

                    <FormItem   {...formItemLayout} label="Quantity">
                        {getFieldDecorator('quantity', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="quantity" />
                        )}
                    </FormItem>

                    <FormItem   {...formItemLayout} label="Unit Price">
                        {getFieldDecorator('unit_prize', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="unit_prize" />
                        )}
                    </FormItem>

                    <FormItem  {...formItemLayout} label="Order Date">
                        {getFieldDecorator('date', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="date" />
                        )}
                    </FormItem>   
                    
                    <FormItem  {...formItemLayout} label="Total">
                        {getFieldDecorator('total', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="total" />
                        )}
                    </FormItem> 
                    <FormItem  {...formItemLayout} label="Customer Name">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="name" />
                        )}
                    </FormItem>

                    <FormItem  {...formItemLayout} label="Contact Number">
                        {getFieldDecorator('contact_num', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="contact_num" />
                        )}
                    </FormItem>  

                    <FormItem  {...formItemLayout} label="Email">
                        {getFieldDecorator('email', {
                            rules: [{ 
                             type: 'email', message: 'The input is not valid E-mail!',
                             required: true, message: '' }]
                        })(
                            <Input name="email" />
                        )}
                    </FormItem> 

                    <FormItem  {...formItemLayout} label="Billing Address">
                        {getFieldDecorator('billing_address', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="billing_address" />
                        )}
                    </FormItem>     

                    <FormItem  {...formItemLayout} label="Postcode">
                        {getFieldDecorator('postcode', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="postcode" />
                        )}
                    </FormItem> 
  

                    <FormItem {...formTailLayout}>
                        <Button type="primary">
                            Add order
                        </Button>
                    </FormItem>   

                    <Form layout="vertical">
                                <FormItem label='aaaaa'>
                                    {getFieldDecorator('name', {
                                       
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <FormItem label='ffff'>
                                            {getFieldDecorator('registration_number', {
                                              
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label='kkk'>
                                            {getFieldDecorator('business_category_code', {
                                              
                                            })(
                                                // <Select placeholder="Select your business category" disabled>
                                                //     {business_categories.map((business_category) =>
                                                //         <Option key={business_category.code} value={business_category.code}>{business_category.name}</Option>
                                                //     )}
                                                // </Select>
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem label='tttt'>
                                    {getFieldDecorator('business_name', {
                                     
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                                <FormItem label='jjj'>
                                    {getFieldDecorator('owner_name', {
                                       
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                                <FormItem label='hhh'>
                                    {getFieldDecorator('address', {
                                        
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <FormItem label='tt'>
                                            {getFieldDecorator('phone', {
                                               
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label='ggg'>
                                            {getFieldDecorator('mobile_number', {
                                                
                                            })(
                                                <Input disabled />
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
                            </Form>
                </Form>
            </div>
               
            </div>
            );   
        }
       
}

export default  Form.create()(NewOrder);

// import { Steps, Button, message } from 'antd';

// const Step = Steps.Step;

// const steps = [{
//   title: 'First',
//   content: 'First-content',
// }, {
//   title: 'Second',
//   content: 'Second-content',
// }, {
//   title: 'Last',
//   content: 'Last-content',
// }];

// class NewOrder extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       current: 0,
//     };
//   }

//   next() {
//     const current = this.state.current + 1;
//     this.setState({ current });
//   }

//   prev() {
//     const current = this.state.current - 1;
//     this.setState({ current });
//   }

//   render() {
//     const { current } = this.state;
//     return (
//       <div style={{padding:'30px'}}>
//         <Steps current={current}>
//           {steps.map(item => <Step key={item.title} title={item.title} />)}
//         </Steps>
//         <div className="steps-content">{steps[current].content}</div>
//         <div className="steps-action">
//           {
//             current < steps.length - 1
//             && <Button type="primary" onClick={() => this.next()}>Next</Button>
//           }
//           {
//             current === steps.length - 1
//             && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
//           }
//           {
//             current > 0
//             && (
//             <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
//               Previous
//             </Button>
//             )
//           }
//         </div>
//       </div>
//     );
//   }
// }

// export default NewOrder;