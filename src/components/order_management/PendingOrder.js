import React, { Component } from 'react';
import { Layout,  Table, Steps, Button, message, Form, Input, Select, Row  } from 'antd';

const Option = Select.Option;
const Step = Steps.Step;
const { Header } = Layout;
const { Column } = Table;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };
const formTailLayout = {
labelCol: { span: 4 },
wrapperCol: { span: 8, offset: 6 },
};

const steps = [{
  title: 'Customer Details',
  content: <Form> 
                <Row>
                    <Form.Item  {...formItemLayout} label="Name">
                        <Input name="name" />
                    </Form.Item>
                    <Form.Item  {...formItemLayout} label="Contact Number">
                        <Input name="contact_num" />
                    </Form.Item>
                </Row>
                
                <Form.Item  {...formItemLayout} label="Email">
                    <Input name="email" />
                </Form.Item>
                <Form.Item  {...formItemLayout} label="Shipping Address">
                    <Input name="address" />
                </Form.Item>
                <Form.Item  {...formItemLayout} label="Postcode">
                    <Input name="postcode" />
                </Form.Item>
            </Form>
}, {
  title: 'Order Details',
  content:
  <div>
    <Form> 
        <Form.Item  {...formItemLayout} label="Package ID">
            <Input name="name" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Package name">
            <Input name="contact_num" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Quantity">
            <Input name="email" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Unit Prize">
            <Input name="address" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Total Prize">
            <Input name="postcode" />
        </Form.Item>
    </Form>
    <Form.Item {...formTailLayout}>
        <Button type="primary">
            Request Stock
        </Button>
    </Form.Item>  
  </div>
  
}, {
  title: 'Shipping Details',
  content:  
  <div>
    <Form> 
        <Form.Item  {...formItemLayout} label="Courier">
            <Select
                showSearch
                placeholder="Please select courier"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
            </Select>
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Recipient Name">
            <Input name="name" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Shipping Address">
            <Input name="address" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Contact Number">
            <Input name="contact_num" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Email">
            <Input name="email" />
        </Form.Item>
        <Form.Item  {...formItemLayout} label="Tracking Number">
            <Input name="tracking" />
        </Form.Item>
    </Form>
</div>
},
{
    title: 'Confirm Order',
    content: 'Confirm Package',
}];



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
                    <Column title="Product Items" dataIndex="items" key="items" />
                    <Column title="Quantity" dataIndex="quantity" key="quantity" />
                    <Column title="Unit Prize" dataIndex="unit_prize" key="unit_prize" />
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

export default PendingOrder;

