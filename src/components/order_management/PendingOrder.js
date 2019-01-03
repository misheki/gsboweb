import React, { Component } from 'react';
import { Layout,  Table, Steps, Button, message, Form, Input, Select, Col, Row, Divider, Modal } from 'antd';
import { listPending, showOrders, requestStock, courierList, shippingUpdate, completeOrder } from '../../helpers/OrderController';

const Option = Select.Option;
const Step = Steps.Step;
const { Header } = Layout;
const { Column } = Table;
const confirm = Modal.confirm;

class PendingOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            pending_orders: [],
            processOrder: false,
            order: '',
            package_details: [],
            // process_order_loading: false,
            request_stock_loading: false,
            complete_order_loading: false,
            next_loading: false,
            couriers: [],
            method: 'Self Pickup',
            tracking_number: '',
            shipping_method_id: ''
        };
    }

    componentDidMount() {
        this.showOrderlistPending();
        this.showCourierList();
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

    showCourierList() {
        var access_token = sessionStorage.getItem('access_token');
        courierList(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ couriers: result.data });
                }
            })
    }

    next() {
        const current = this.state.current + 1;
        var form = this.props.form;
        const { method, order } = this.state;
        var access_token = sessionStorage.getItem('access_token');

        if (method === 'Courier') {
            form.validateFields(['customer_address', 'customer_contact_num', 'customer_state', 'customer_postcode', 'shipping_method_id', 'tracking_number', 'shipping_fee'], (err, values) => {
                if (err) {
                    return;
                }
    
                this.setState({ next_loading: true });
                shippingUpdate(order.id, values.customer_address, values.customer_contact_num, values.customer_state, values.customer_postcode, values.shipping_method_id, values.tracking_number, values.shipping_fee, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.setState({ next_loading: false, current, method: 'Courier', tracking_number: values.tracking_number, shipping_method_id: values.shipping_method_id });
                        }
                    })
            })   
        }
        else {
            // set shipping detail to null
            this.setState({ current });
        }
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    processOrder(order_id) {
        var access_token = sessionStorage.getItem('access_token');
        this.setState({ process_order_loading: true });

        showOrders(order_id, access_token)
            .then(result => {
                this.setState({ order: result.order, package_details: result.package_details }, this.setState({ processOrder: true, process_order_loading: false }));
            })
    }

    handleMethod(value) {
        this.setState({ method: value });
    }

    handleRequestStock() {
        const { order } = this.state;
        var order_id = order.id;
        var form = this.props.form;
        const current = this.state.current + 1;
        var access_token = sessionStorage.getItem('access_token');

        form.validateFields(['customer_name', 'customer_email', 'customer_contact_num', 'package_details'], (err, values) => {
            if (err) {
                return;
            }

            confirm({
                title: 'Confirm',
                content: 'Are you sure you want to request the stocks? By doing this you will not be able to revert back.',
                onOk: () => {
                    console.log(values);
                    // this.setState({ request_stock_loading: true });
                    // requestStock(order_id, values.package_details, access_token)
                    //     .then(result => {
                    //         if (result.result === 'GOOD') {
                    //             this.setState({ request_stock_loading: false });
                    //             this.setState({ current });
                    //         }
                    //     })
                }
            })
        });
    }

    handleCompleteOrder() {
        const { order, tracking_number, shipping_method_id } = this.state;
        var access_token = sessionStorage.getItem('access_token');

        this.setState({ complete_order_loading: true });
        completeOrder(order.id, shipping_method_id, tracking_number, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ complete_order_loading: false });
                    message.success('Processing complete!');      
                }
            })
    }

    renderProcessOrder() {
        const { current, order, package_details, request_stock_loading, couriers, method, next_loading, complete_order_loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        var order_status = order.status === 'pending' ? false : true;

        // package_details.map((package_detail) =>
        //     package_detail.stocks.map((stock) =>
        //         console.log(`package_details[${stock.id}]sku`)
        //     )
        // )

        // if (order.status === 'pending' && current === 0) {
        //     this.setState({ current: 1 });
        // }

        // if (order.shipping_method_id) {
        //     this.setState({ method: 'Courier' });
        // }
        
        const packageDetailItems = package_details.map((package_detail) =>
            package_detail.stocks.map((stock) =>
                <React.Fragment key={stock.id}>
                    <Row gutter={16}>
                        <Col span={2}>
                            <Form.Item>
                                {getFieldDecorator('id', {
                                    initialValue: package_detail.id
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                {getFieldDecorator(`package_details[${stock.id}]sku`, {
                                    initialValue: package_detail.sku
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                {getFieldDecorator(`package_details[${stock.id}]package_name`, {
                                    initialValue: package_detail.package_name
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item>
                                {getFieldDecorator(`package_details[${stock.id}]sim_card_number`, {
                                    initialValue: stock.sim_card_number
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item>
                                {getFieldDecorator(`package_details[${stock.id}]serial_number`, {
                                    initialValue: stock.serial_number
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>

                        {getFieldDecorator(`package_details[${stock.id}]stock_id`, {
                            initialValue: stock.id
                        })(
                            <Input type="hidden" disabled />
                        )}

                        {getFieldDecorator(`package_details[${stock.id}]order_detail_id`, {
                            initialValue: package_detail.order_detail_id
                        })(
                            <Input type="hidden" disabled />
                        )}
                    </Row>
                </React.Fragment>
            )
        )

        const steps = [{
            title: 'Order Details',
            content:  
                <Form layout="vertical" style={{ width: '90%', paddingLeft: '40px' }}>
                    <Divider orientation="left">Customer Details</Divider>
                    <Row style={{ paddingTop: '20px' }} gutter={8}>
                        <Col span={8}>
                            <Form.Item label="Order Number">
                                {getFieldDecorator('order_ref_num', {
                                    initialValue: order.order_ref_num
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Order Date">
                                {getFieldDecorator('created_at', {
                                    initialValue: order.created_at
                                })(
                                    <Input disabled/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Sale Channel">
                                {getFieldDecorator('sale_channel_name', {
                                    initialValue: order.sale_channel_name
                                })(
                                    <Input disabled/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item  label="Customer Name">
                        {getFieldDecorator('customer_name', {
                            initialValue: order.customer_name,
                            rules: [{ required: true, message: 'Please fill in the customer name field!' }]
                        })(
                            <Input disabled={order_status} />
                        )}
                    </Form.Item>
                
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item label="Email">
                                {getFieldDecorator('customer_email', {
                                    initialValue: order.customer_email,
                                    rules: [{
                                        type: 'email', message: 'The input is not valid E-mail!'
                                    }, {
                                        required: true, message: 'Please fill in the email field!'
                                    }]
                                })(
                                    <Input disabled={order_status} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Contact Number">
                                {getFieldDecorator('customer_contact_num', {
                                    initialValue: order.customer_contact_num,
                                    rules: [{ required: true, message: 'Please fill in the customer contact number field!' }]
                                })(
                                    <Input disabled={order_status} />
                                )}
                            </Form.Item>  
                        </Col>
                    </Row>

                    <Divider orientation="left">Package Details</Divider>

                    <Row gutter={8} style={{ backgroundColor: '#e8e8e8', padding: '10px', paddingBottom: '0px', marginBottom: '10px', paddingLeft:'0px' }}>
                         <Col span={2}>
                            <p>Item</p>
                        </Col>
                        <Col span={2}>
                            <p>SKU</p>
                        </Col>
                        <Col span={9}>
                            <p>Package</p>
                        </Col>
                        <Col span={5}>
                            <p>Sim Card Number</p>
                        </Col>
                        <Col span={5}>
                            <p>Serial Number</p>
                        </Col>
                    </Row>
                    {packageDetailItems}
                </Form>
        }, {
            title: 'Shipping Details',
            content:
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item label='Method'>
                                <Select style={{ width: '90%', paddingLeft: '40px' }} value={method}>
                                    <Option value="Self Pickup" onClick={() => this.handleMethod('Self Pickup')}>Self Pickup</Option>
                                    <Option value="Courier" onClick={() => this.handleMethod('Courier')}>Courier</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {method === 'Courier' ? <Form layout="vertical" style={{ width: '90%', paddingLeft: '40px' }}> 
                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item label="Courier">
                                    {getFieldDecorator('shipping_method_id', {
                                        initialValue: order.shipping_method_id,
                                        rules: [{ required: true, message: 'Pelase select the courier!' }]
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="Please select courier"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {couriers.map((courier) =>
                                                <Option key={courier.id} value={courier.id}>{courier.courier_name}</Option>
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Tracking Number">
                                    {getFieldDecorator('tracking_number', {
                                        initialValue: order.tracking_number,
                                        rules: [{ required: true, message: 'Please fill in the tracking number field!' }]
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label='Shipping Amount'>
                                    {getFieldDecorator('shipping_fee', {
                                        initialValue: order.shipping_fee,
                                        rules: [{ required: true, message: 'Please fill in the shipping amount field!' }] 
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Shipping Adddress">
                                {getFieldDecorator('customer_address', {
                                    initialValue: order.customer_address,
                                    rules: [{ required: true, message: 'Please fill in the customer address field!' }]
                                })(
                                    <Input />
                                )}
                        </Form.Item>
                        <Row gutter={8}>
                            <Col span={14}>
                                <Form.Item label='State'>
                                    {getFieldDecorator('customer_state', {
                                        initialValue: order.customer_state,
                                        rules: [{ required: true, message: 'Please fill in the customer state field!' }]
                                    })(
                                        <Select />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label='Postcode'>
                                    {getFieldDecorator('customer_postcode', {
                                        initialValue: order.customer_postcode,
                                        rules: [{ required: true, message: 'Please fill in the customer postcode field!' }] 
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form> : null}
                </div>
        }, {
            title: 'Confirm Order',
            content: 'Confirm Package',
        }];
     
        return (
            <div style={{padding: '30px' }}>
                <Steps current={current}>
                    {steps.map(item =>
                        <Step key={item.title} title={item.title} />
                    )}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current > 0 && (<Button style={{ marginRight: 8 }} onClick={() => this.prev()}>Previous</Button>)}
                    {current === steps.length - 1 && <Button loading={complete_order_loading} type="primary" onClick={() => this.handleCompleteOrder()}>Complete Order</Button>}
                    {current < steps.length - 1 && current !== 0 && <Button loading={next_loading} type="primary" onClick={() => this.next()}>Next</Button>}
                    {current === 0 && (order.status === 'pending' ? <Button loading={request_stock_loading} type="primary" onClick={() => this.handleRequestStock()}>Save, Request Stock & Continue</Button> : <Button type="primary" onClick={() => this.next()}>Next</Button>)}
                </div>
            </div>
        );
    }

    render() {
        const { pending_orders, processOrder } = this.state;

        if (processOrder === false) {
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
                                        <Button style={{ margin:'10px' }} type="primary" onClick={() => this.processOrder(record.id)}>Process Order</Button>
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

