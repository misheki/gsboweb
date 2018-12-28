import React, { Component } from 'react';
import { Layout,  Table, Steps, Button, message, Form, Input, Select, Col, Row, Divider   } from 'antd';

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
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    render() {
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
                                required: true, message: '' }]
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
                            <Input className="input-field"  />
                            <Input  />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item   label="Serial Number">
                            <Input className="input-field"  />
                            <Input  />
                        </Form.Item>
                    </Col>
                </Row>
          </Form>
          }, {
            title: 'Shipping Details',
            content:  
              <Form  layout="vertical" style={{width:'90%', paddingLeft:'40px',}}> 
                  <Form.Item label="Courier">
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
                  </Form.Item>
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
                                    {getFieldDecorator('website', {
                                    
                                    })(
                                        <Select />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label='Postcode'>
                                    {getFieldDecorator('status', {
                                        
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
          
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Pending Order</span>
            </Header>
            <div style={{ padding: '30px'}}>
                 <Table
                    // dataSource={packages}
                    // rowKey={pakages => packages.id}
                    >
                    <Column title="Order Number" dataIndex="order_number" key="order_number" />
                    <Column title="Order Date" dataIndex="items" key="items" />
                    <Column title="Customer Name" dataIndex="items" key="items" />
                    <Column title="Total" dataIndex="total" key="total" />
                    <Column title="Order Status" dataIndex="status" key="status" />
                    <Column title="Action" dataIndex="action" key="action" />
                </Table>
            </div>
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
            </div>
            );   
        }
       
}

export default Form.create()( PendingOrder);

