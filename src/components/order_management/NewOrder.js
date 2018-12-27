import React, { Component } from 'react';
import { Layout,  Table, Modal, Form, Input, Button  } from 'antd';


const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
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
                    <FormItem {...formItemLayout} label="Order Number">
                        {getFieldDecorator('order_number', {
                            rules: [{ required: true, message: '' }]
                        })(
                            <Input name="order_number" />
                        )}
                    </FormItem>

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

                    <FormItem   {...formItemLayout} label="Unit Prize">
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