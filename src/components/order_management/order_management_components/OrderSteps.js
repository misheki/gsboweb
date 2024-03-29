import React, { Component } from 'react';
import { Steps, Button, Form, Input, Select, Col, Row, Divider, Modal, Icon } from 'antd';
import { showOrders, requestStock, courierList, completeOrder, shippingUpdateWithCourier, shippingUpdateWithoutCourier, listReadyShip, cancelOrder } from '../../../helpers/OrderController';
import { checkAccess } from '../../../helpers/PermissionController';
import { validateName, validateNumber, validateAmount } from '../../../helpers/Validator';

const Option = Select.Option;
const Step = Steps.Step;
const confirm = Modal.confirm;
const { TextArea } = Input;

class OrderSteps extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            pending_orders: [],
            processOrder: false,
            order: '',
            package_details: [],
            request_stock_loading: false,
            complete_order_loading: false,
            next_loading: false,
            cancel_loading: false,
            couriers: [],
            method: 'Self Pickup',
            tracking_number: '',
            shipping_method_id: '',
            required: ['processOrder', 'shipOrder', 'cancelPendingOrder', 'cancelConfirmedOrder'],
            allowed: [],
            incomplete: false,
            order_overview: '',
            reason_modal_visible: false,
            reason: ''
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showCourierList();
        this.getPermissions();
        this.processOrder(this.props.order_id);
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    showCourierList() {
        var access_token = sessionStorage.getItem('access_token');
        courierList(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ couriers: result.data });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    next() {
        const current = this.state.current + 1;
        var form = this.props.form;
        const { method, order } = this.state;
        var access_token = sessionStorage.getItem('access_token');

        if (this.state.current === 0) {
            if(this._isMounted) this.setState({ current });
        }
        else if (method === 'Courier') {
            form.validateFields(['customer_address', 'customer_contact_num', 'customer_state', 'customer_postcode', 'shipping_method_id', 'tracking_number', 'shipping_fee'], (err, values) => {
                
                if (err) { return;}
    
                this.setState({ next_loading: true });

                shippingUpdateWithCourier(order.id, values.customer_address, values.customer_contact_num, values.customer_state, values.customer_postcode, values.shipping_method_id, values.tracking_number, values.shipping_fee, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({
                                next_loading: false,
                                current,
                                method: 'Courier',
                                tracking_number: values.tracking_number,
                                shipping_method_id: values.shipping_method_id
                            }, this.fetchListReadyShip());
                        }
                    })
                    .catch(error => {
                        if(this._isMounted) this.setState({ next_loading: false });
                        Modal.error({
                            title: 'Error',
                            content: error
                        })
                    })
            })
        }
        else {
            this.setState({ next_loading: true });
            shippingUpdateWithoutCourier(order.id, null, null, null, access_token)
                .then(result => {     
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({
                            next_loading: false,
                            current,
                            method: 'Self Pickup',
                            shipping_method_id: null
                        }, this.fetchListReadyShip());
                    }
                })
                .catch(error => {
                    if(this._isMounted) this.setState({ next_loading: false });
                    Modal.error({
                        title: 'Error',
                        content: error
                    })
                })
        }
    }

    fetchListReadyShip() {
        var access_token = sessionStorage.getItem('access_token');

        listReadyShip(null, null, null, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    result.data.forEach(order => {
                        if (order.id === this.props.order_id) {
                            if(this._isMounted) this.setState({ order_overview: order });
                        }
                    });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    prev() {
        this.processOrder(this.state.order.id);
        const current = this.state.current - 1;
        if(this._isMounted) this.setState({ current });
    }

    processOrder(order_id) {
        var access_token = sessionStorage.getItem('access_token');

        showOrders(order_id, access_token)
            .then(result => {
                if(this._isMounted) this.setState({
                    order: result.order,
                    package_details: result.package_details,
                    incomplete: result.incomplete
                }, this.setState({
                    processOrder: true,
                    method: result.order.shipping_method_id !== null ? 'Courier' : 'Self Pickup'
                }));
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    handleMethod(value) {
        if(this._isMounted) this.setState({ method: value });
    }

    handleRequestStock() {
        const { order } = this.state;
        var order_id = order.id;
        var form = this.props.form;
        const current = this.state.current + 1;
        var access_token = sessionStorage.getItem('access_token');

        form.validateFields(['customer_name', 'customer_email', 'customer_contact_num', 'discount', 'stock_details'], (err, values) => {
            if (err) {
                return;
            }

            confirm({
                title: 'Confirm',
                content: 'Are you sure you want to request the stocks? By doing this you will not be able to revert back.',
                onOk: () => {
                    var filtered_stocks = values.stock_details.filter(function (s) {
                        return s != null;
                    });

                    this.setState({ request_stock_loading: true });
                    requestStock(order_id, filtered_stocks, values.customer_name, values.customer_email, values.customer_contact_num, values.discount, access_token)
                        .then(result => {
                            if (result.result === 'GOOD') {
                                if(this._isMounted) this.setState({ request_stock_loading: false, current });
                            }
                        })
                        .catch(error => {
                            if(this._isMounted) this.setState({ request_stock_loading: false });
                            Modal.error({
                                title: 'Error',
                                content: error
                            })
                        })
                }
            })
        });
    }

    handleCancelOrder() {
        const { order, reason } = this.state;
        var order_id = order.id;
        var access_token = sessionStorage.getItem('access_token');

        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to cancel this order?',
            onOk: () => {
                if(this._isMounted) this.setState({ cancel_loading: true });
                cancelOrder(order_id, reason, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({ cancel_loading: false });
                            Modal.success({
                                title:'Success',
                                content:'You have successfully cancelled this order.',
                                onOk: () => {
                                    this.props.process_order(false);
                                }
                            });
                        }
                    })
                    .catch(error => {
                        if(this._isMounted) this.setState({ cancel_loading: false });
                        Modal.error({
                            title: 'Error',
                            content: error
                        })
                    })
            }
        })
    }

    handleCompleteOrder() {
        const { order, tracking_number, shipping_method_id } = this.state;
        var access_token = sessionStorage.getItem('access_token');

        if(this._isMounted) this.setState({ complete_order_loading: true });
        
        completeOrder(order.id, shipping_method_id, tracking_number, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ complete_order_loading: false });
                    Modal.success({
                        title: 'Sucess',
                        content: 'You have sucessfully completed this order. Press OK to print',
                        onOk: () => {
                            this.props.process_order(false);
                            this.props.print_order();
                        }
                    })
                }
            })
            .catch(error => {
                if(this._isMounted) this.setState({ complete_order_loading: false });
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    packageDetailItems() {
        var array = [];
        const { package_details } = this.state;
        const { getFieldDecorator } = this.props.form;
        let counter = 0;

        package_details.forEach(package_detail => {
            if (package_detail.stocks.length === 0) {
                counter++;
                array.push(<React.Fragment key={counter}>
                    <Row gutter={8}>
                        <Col span={2}>
                            <Form.Item>
                                {getFieldDecorator('id', {
                                    initialValue: counter
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                {getFieldDecorator(`stock_details.sku`, {
                                    initialValue: package_detail.sku
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item>
                                {getFieldDecorator(`stock_details.package_name`, {
                                    initialValue: package_detail.package_name
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item>
                                {getFieldDecorator(`stock_details.sim_card_number`, {
                                    initialValue: 'No Stock'
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item>
                                {getFieldDecorator(`stock_details.serial_number`, {
                                    initialValue: 'No Stock'
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item>
                                {getFieldDecorator(`stock_details.unit_price`, {
                                    initialValue: package_detail.unit_price
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>

                        {getFieldDecorator(`stock_details.stock_id`, {
                            initialValue: 'No Stock'
                        })(
                            <Input type="hidden" disabled />
                        )}

                        {getFieldDecorator(`stock_details.order_detail_id`, {
                            initialValue: package_detail.order_detail_id
                        })(
                            <Input type="hidden" disabled />
                        )}
                    </Row>
                </React.Fragment>)
            }
            else {
                package_detail.stocks.forEach(stock => {
                    counter++;
                    array.push(<React.Fragment key={counter}>
                        <Row gutter={8}>
                            <Col span={2}>
                                <Form.Item>
                                    {getFieldDecorator('id', {
                                        initialValue: counter
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details[${stock.id}].sku`, {
                                        initialValue: package_detail.sku
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details[${stock.id}].package_name`, {
                                        initialValue: package_detail.package_name
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details[${stock.id}].sim_card_number`, {
                                        initialValue: stock.sim_card_number
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details[${stock.id}].serial_number`, {
                                        initialValue: stock.serial_number
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={2}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details[${stock.id}].unit_price`, {
                                        initialValue: package_detail.unit_price
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>

                            {getFieldDecorator(`stock_details[${stock.id}].stock_id`, {
                                initialValue: stock.id
                            })(
                                <Input type="hidden" disabled />
                            )}

                            {getFieldDecorator(`stock_details[${stock.id}].order_detail_id`, {
                                initialValue: package_detail.order_detail_id
                            })(
                                <Input type="hidden" disabled />
                            )}
                        </Row>
                    </React.Fragment>)
                })

                if (package_detail.missing > 0) {
                    counter++;
                    array.push(<React.Fragment key={counter}>
                        <Row gutter={8}>
                            <Col span={2}>
                                <Form.Item>
                                    {getFieldDecorator('id', {
                                        initialValue: counter
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details.sku`, {
                                        initialValue: package_detail.sku
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details.package_name`, {
                                        initialValue: package_detail.package_name
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details.sim_card_number`, {
                                        initialValue: 'No Stock'
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details.serial_number`, {
                                        initialValue: 'No Stock'
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item>
                                    {getFieldDecorator(`stock_details.unit_price`, {
                                        initialValue: package_detail.unit_price
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>

                            {getFieldDecorator(`stock_details.stock_id`, {
                                initialValue: 'No Stock'
                            })(
                                <Input type="hidden" disabled />
                            )}

                            {getFieldDecorator(`stock_details.order_detail_id`, {
                                initialValue: package_detail.order_detail_id
                            })(
                                <Input type="hidden" disabled />
                            )}
                        </Row>
                    </React.Fragment>)
                }
            }
        });

        return array;
    }

    renderProcessOrder() {
        const { current, order, request_stock_loading, couriers, method, next_loading, complete_order_loading, allowed, incomplete, order_overview, cancel_loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        var order_status = order.status === 'pending' ? false : true;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 },
        };

        // if (order.status === 'pending' && current === 0) {
        //     this.setState({ current: 1 });
        // }

        const steps = [{
            title: 'Order Details',
            content:  
                <Form layout="vertical" style={{ width: '95%', paddingLeft: '40px' }}>
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
                            <Form.Item label="Sales Channel">
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
                            rules: [{
                                pattern: new RegExp(validateName), message: 'Alphabet or Chinese characters only!'
                            }, {
                                required: true, message: 'Please fill in the customer name field!'
                            }]
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
                                    rules: [{
                                        pattern: new RegExp(validateNumber), message: 'The customer contact number must be a number!'
                                    }, {
                                        required: true, message: 'Please fill in the customer contact number field!'
                                    }]
                                })(
                                    <Input disabled={order_status} />
                                )}
                            </Form.Item>  
                        </Col>
                    </Row>

                    <Divider orientation="left">Package Details</Divider>

                    <Row gutter={16} style={{ backgroundColor: '#e8e8e8', padding: '10px', paddingBottom: '0px', marginBottom: '10px',   textAlign: 'left' }}>
                        <Col span={2}>
                            <p>Item</p>
                        </Col>
                        <Col span={3}>
                            <p>SKU</p>
                        </Col>
                        <Col span={7}>
                            <p>Package</p>
                        </Col>
                        <Col span={4}>
                            <p>Sim Card Number</p>
                        </Col>
                        <Col span={6}>
                            <p>Serial Number</p>
                        </Col>
                        <Col span={2}>
                            <p>Unit Price</p>
                        </Col>
                    </Row>
                    {this.packageDetailItems()}
                    <Form.Item
                        label="Discount"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 4 }}
                        >
                            {getFieldDecorator('discount', {
                                initialValue: order.discount ? order.discount : '0.00',
                                rules: [{
                                    pattern: new RegExp(validateAmount), message: 'The discount amount must be a decimal number.'
                                }]
                            })(
                                <Input addonBefore={'RM'} disabled={order_status} />
                            )}
                    </Form.Item>
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
                                        rules: [{ required: true, message: 'Please select the courier!' }]
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
                                        rules: [{
                                            pattern: new RegExp(validateAmount), message: 'The shipping amount must be a decimal number.'
                                        }, {
                                            required: true, message: 'Please fill in the shipping amount field!'
                                        }]
                                    })(
                                        <Input addonBefore={'RM'} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Shipping Address">
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
                                        <Select>
                                            <Option value="JHR">Johor</Option>
                                            <Option value="KDH">Kedah</Option>
                                            <Option value="KTN">Kelantan</Option>
                                            <Option value="KUL">Wilayah Persekutuan Kuala Lumpur</Option>
                                            <Option value="LBN">Wilayah Persekutuan Labuan</Option>
                                            <Option value="MLK">Melaka</Option>
                                            <Option value="NSN">Negeri Sembilan</Option>
                                            <Option value="PHG">Pahang</Option>
                                            <Option value="PJY">Wilayah Persekutuan Putra Jaya</Option>
                                            <Option value="PLS">Perlis</Option>
                                            <Option value="PNG">Pulau Pinang</Option>
                                            <Option value="PRK">Perak</Option>
                                            <Option value="SBH">Sabah</Option>
                                            <Option value="SGR">Selangor</Option>
                                            <Option value="SRW">Sarawak</Option>
                                            <Option value="TRG">Terengganu</Option>
                                            </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label='Postcode'>
                                    {getFieldDecorator('customer_postcode', {
                                        initialValue: order.customer_postcode,
                                        rules: [{
                                            pattern: new RegExp(validateNumber), message: 'The postcode must be a number!'
                                        }, {
                                            required: true, message: 'Please fill in the customer postcode field!'
                                        }]
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
            content: 
                <Form> 
                    <div style={{padding:'20px', marginBottom:'10px', textAlign:'left'}}>
                        <h2 style={{paddingBottom:'10px'}}>Order Ref. No.{order.order_ref_num}</h2>    
                        <Row gutter={8}>
                            <Col span={12}>
                            <h3 style={{paddingBottom:'10px'}}>Order Details </h3>  
                                <Form.Item {...formItemLayout} label="Order Date : "  className="form-item">
                                <p>{order_overview.order_date}</p> 
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="Sales Channel : " className="form-item">
                                    <p>{order.sale_channel_name} </p>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="Shipping Method : " className="form-item">
                                    <p>{order_overview.shipping_method ? order_overview.shipping_method : 'Self Pickup'} </p>
                                </Form.Item>
                                {order_overview.shipping_method_id !== null ? <Form.Item {...formItemLayout} label="Tracking Number : " className="form-item">
                                    <p>{order_overview.tracking_number} </p>
                                </Form.Item> : null}

                            </Col>
                            <Col span={12}>
                                <h3 style={{paddingBottom: '10px' }}>Customer Details</h3>  
                                <p>{order.customer_name}</p> 
                                <p>{order_overview.customer_address}</p> 
                                {order_overview.customer_postcode ? <p>{order_overview.customer_postcode}, {order_overview.customer_state}</p> : null} 
                                <p>{order.customer_contact_num}</p> 
                                <p>{order_overview.customer_email}</p> 
                            </Col>
                        </Row>
                    </div>
                    <div style={{padding: '20px', textAlign: 'left' }}>
                        <h3 style={{paddingBottom: '10px' }}>Product Details</h3>
                        <Row gutter={16} style={{ backgroundColor: '#e8e8e8', padding: '10px', paddingBottom: '0px', marginBottom: '10px' }}>
                            <Col span={2}>
                                <p>Item</p>
                            </Col>
                            <Col span={3}>
                                <p>SKU</p>
                            </Col>
                            <Col span={7}>
                                <p>Package</p>
                            </Col>
                            <Col span={4}>
                                <p>Sim Card Number</p>
                            </Col>
                            <Col span={6}>
                                <p>Serial Number</p>
                            </Col>
                            <Col span={2}>
                                <p>Unit Price</p>
                            </Col>
                        </Row>
                        {this.packageDetailItems()}
                        <Form.Item labelCol={{ span: 20 }} wrapperCol={{ span: 4 }} label="Subtotal : " className="form-item-right">
                            <p>RM {order_overview.total_amount}</p> 
                        </Form.Item>
                        <Form.Item labelCol={{ span: 20 }} wrapperCol={{ span: 4 }} label="Shipping : " className="form-item-right">
                            <p>RM {order_overview.shipping_fee ? order_overview.shipping_fee : '0.00'}</p>
                        </Form.Item>
                        <Form.Item labelCol={{ span: 20 }} wrapperCol={{ span: 4 }} label="Less : " className="form-item-right">
                            <p>RM {order_overview.discount ? order_overview.discount : '0.00'}</p> 
                        </Form.Item>
                        <Form.Item labelCol={{ span: 20 }} wrapperCol={{ span: 4 }} label="Total Amount : " className="form-item-right">
                            <p>RM {order_overview.total}</p> 
                        </Form.Item>
                    </div>
                </Form>
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
                    {current > 0 && (<Button style={{ marginRight: 8 }} onClick={() => this.prev()}><Icon type="left" />Previous</Button>)}
                    {current === steps.length - 1 && <Button icon="file-done" loading={complete_order_loading} type="primary" onClick={() => this.handleCompleteOrder()}>Complete Order</Button>}
                    {allowed.includes('shipOrder') ? (current < steps.length - 1 && current !== 0 && <Button loading={next_loading} type="primary" onClick={() => this.next()}>Next <Icon type="right" /></Button>) : null}
                    {allowed.includes('processOrder') ? (current === 0 && (order.status === 'pending' ?
                    <div>
                        <Button disabled={incomplete} loading={request_stock_loading} type="primary" onClick={() => this.handleRequestStock()}>Save, Request Stock & Continue</Button>
                    </div>
                    : <Button  type="primary" onClick={() => this.next()}>Next <Icon type="right" /></Button>)) : null}
                </div>
            </div>
        );
    }

    render() {
        const { allowed, order, cancel_loading } = this.state;
        return (
            <div>
                <Button
                    type="primary"
                    icon="left"
                    onClick={() => this.props.process_order(false)}
                    style={{ margin: '20px', marginLeft: '40px' }}>
                    Back
                </Button>
                {(allowed.includes('cancelPendingOrder') && (order.status == 'pending')) || (allowed.includes('cancelConfirmedOrder') && (order.status == 'confirmed')) ? <Button loading={cancel_loading} type="danger" style={{ marginRight: 8 }} onClick={() => this.setState({ reason_modal_visible : true })}>Cancel this order</Button> : null}
                {this.renderProcessOrder()}
                <Modal
                    title="What is your reason for cancellation?"
                    visible={this.state.reason_modal_visible}
                    onOk={() => this.setState({ reason_modal_visible : false }, this.handleCancelOrder)}
                    onCancel={() => this.setState({ reason_modal_visible : false })}
                >
                    <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 4 }} onChange = {(e) => this.setState({reason : e.target.value}) } />
                </Modal>
            </div>
        );
    }
}

export default Form.create()(OrderSteps);