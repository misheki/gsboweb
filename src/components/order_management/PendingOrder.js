import React, { Component } from 'react';
import { Layout,  Table, Steps, Button, message, Form, Input, Select, Col, Row, Divider   } from 'antd';
import { listPending } from '../../helpers/OrderController';

const Option = Select.Option;
const Step = Steps.Step;
const { Header } = Layout;
const { Column } = Table;
const formItemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  };
const formTailLayout = {
labelCol: { span: 4 },
wrapperCol: { span: 8, offset: 6 },
};


class PendingOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            pending_orders: [],
            processOrder: false
        };
    }

    componentDidMount() {
        this.showOrderlistPending();
    }

    showOrderlistPending() {
        var access_token = sessionStorage.getItem('access_token');
        listPending(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ pending_orders: result.data });
                }
            })
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    processOrder(){
        this.setState({ processOrder: true });       
    }

    renderProcessOrder(){
        const { current } = this.state;
        const { getFieldDecorator } = this.props.form;
        const steps = [{
            title: 'Order Details',
            content:  
            <Form layout="vertical" style={{width:'90%', paddingLeft:'40px',}}>
             <Divider orientation="left">Customer Details</Divider>
                <Row style={{paddingTop:'20px'}} gutter={8}>
                    <Col span={8}>
                        <Form.Item label="Order Number">
                            {getFieldDecorator('order_number', {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input disabled />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Order Date">
                            {getFieldDecorator('order_number', {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input disabled/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Sale Channel">
                            {getFieldDecorator('order_number', {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input disabled/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item  label="Customer Name">
                    {getFieldDecorator('order_number', {
                        rules: [{ required: true, message: '' }]
                    })(
                        <Input name="order_number" />
                    )}
                </Form.Item>
             
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item label="Email">
                            {getFieldDecorator('email', {
                                rules: [{ 
                                type: 'email', message: 'The input is not valid E-mail!',
                                required: true }]
                            })(
                                <Input name="email" />
                            )}
                        </Form.Item> 
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Contact Number">
                            {getFieldDecorator('contact_num', {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input name="contact_num" />
                            )}
                        </Form.Item>  
                    </Col>
                </Row>
                <Divider orientation="left">Package Details</Divider>
                <Row  style={{paddingTop:'20px'}} gutter={16}>
                    <Col span={2}>
                        <Form.Item   label="No">
                            <Input className="input-field"  disabled  />
                            <Input disabled  />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item   label="SKU">
                            <Input className="input-field"  disabled  />
                            <Input disabled  />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item   label="Package">
                            <Input className="input-field"  disabled  />
                            <Input disabled  />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item   label="Sim Card Number">
                            <Input className="input-field" disabled />
                            <Input  disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item   label="Serial Number">
                            <Input className="input-field" disabled />
                            <Input  disabled/>
                        </Form.Item>
                    </Col>
                </Row>
          </Form>
          }, {
            title: 'Shipping Details',
            content:  
              <Form  layout="vertical" style={{width:'90%', paddingLeft:'40px',}}> 
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item label="Courier">
                            {getFieldDecorator('courier', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                <Select
                                    showSearch
                                    placeholder="Please select courier"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="jack">Gdex</Option>
                                    <Option value="lucy">Pos Laju</Option>
                                    <Option value="tom">AirPax</Option>
                                </Select>
                                )}
                               
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item  label="Tracking Number">
                                    {getFieldDecorator('tracking_number', {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Input name="tracking_number" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Shipping Amount'>
                                {getFieldDecorator('postcode', {
                                rules: [{ required: true, message: '' }] 
                                })(
                                    <Input />
                                    
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item  label="Shipping Adddress">
                                {getFieldDecorator('order_number', {
                                rules: [{ required: true, message: '' }]
                            })(
                                <Input name="order_number" />
                            )}
                    </Form.Item>
                    <Row gutter={8}>
                        <Col span={14}>
                            <Form.Item label='State'>
                                {getFieldDecorator('state', {
                                 rules: [{ required: true, message: '' }]
                                })(
                                    <Select />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label='Postcode'>
                                {getFieldDecorator('postcode', {
                                rules: [{ required: true, message: '' }] 
                                })(
                                    <Input />
                                    
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
              </Form>
          },
          {
              title: 'Confirm Order',
              content: 'Confirm Package',
          }];
     
            return(
                <div style={{padding:'30px'}}>
                    <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>
                    <div className="steps-action">
                    {
                        current > 0
                        && (
                        <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                        Previous
                        </Button>
                        )
                    }
                    {
                        current === steps.length - 1
                        && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        current < steps.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    </div>
                </div>
            )
        
    }

    render() {
        const { pending_orders } = this.state;

        if (this.state.processOrder === false) {
            return (             
                <div>
                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>Pending Order</span>
                </Header>
                <div style={{ padding: '30px' }}>
                     <Table
                        dataSource={pending_orders}
                        rowKey={pending_orders => pending_orders.id}>
                        <Column title="Order Number" dataIndex="order_ref_num" key="order_ref_num" />
                        <Column title="Order Date" dataIndex="created_at" key="created_at" />
                        <Column title="Customer Name" dataIndex="customer_name" key="customer_name" />
                        <Column title="Total" dataIndex="total_amount" key="total_amount" />
                        <Column title="Order Status" dataIndex="order_status" key="order_status" />
                        <Column
                                title='Action'
                                key="action"
                                render={(record) => (
                                    <div>
                                        <Button style={{ margin:'10px' }} type="primary" onClick={() => this.processOrder()}>Process Order</Button>
                                    </div>
                                )} />
                    </Table>
                </div>
                </div>
                );   
            }
            else {
                return (             
                    <div>
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Pending Order</span>
                    </Header>
                     {this.renderProcessOrder()}
                    </div>
                    );   

            }
        }
        
       
}

export default Form.create()( PendingOrder);

