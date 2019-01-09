import React, { Component } from 'react';
import { Layout, Form, Row, Col, Table, AutoComplete, Input, Button, Icon, Modal } from 'antd';
import { listCompleted } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';
import { Helmet } from 'react-helmet';
import PrintOrder from '../order_management/order_management_components/PrintOrder';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;

class Completed extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            completed_orders: [],
            order: null,
            displayDetails: false,
            required: ['viewOrderHistory'],
            allowed: [],
            search: '',
            print_order: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showOrderlistCompleted();
        this.getPermissions();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps() {
        if(this._isMounted) this.setState({ displayDetails: false });
        this.showOrderlistCompleted();
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    showOrderlistCompleted() {
        var access_token = sessionStorage.getItem('access_token');
        listCompleted(null, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ completed_orders: result.data });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    handleSearch() {
        var access_token = sessionStorage.getItem('access_token');
        const { search } = this.state;

        listCompleted(search, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ completed_orders: result.data });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    showOrder(order) {
        if(this._isMounted) this.setState({ order : order}, () => this.setState({ displayDetails : true }))
    }

    handlePrint() {
        this.setState({ print_order: true });
        this.props.showSideBar(false);
    }

    handleHidePrintOrder() {
        this.setState({ print_order: false });
        this.props.showSideBar(true);
    }

    renderDetails() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 }
        };

        const packageDetailItems =  this.state.order.order_details.map((item, i) =>
        item.stocks.map((stock, j) =>
            <React.Fragment key={j}>
                <Row gutter={8}>
                    <Col span={2}>
                        <Form.Item>
                            <Input value={ i + j + 1} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            <Input value={item.sku} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item>
                            <Input value={item.package} disabled />
                        </Form.Item>
                    </Col>
                    
                    <Col span={6}>
                        <Form.Item>
                            <Input value={stock.serial_number} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            <Input  value={stock.sim_card_number} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item>
                            <Input  value={item.unit_price} disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>    
            )
        )
        return(
            <div style={{padding:'30px', backgroundColor:'white'}}>
                <Button
                    type="primary"
                    icon="left"
                    onClick={() => this.setState({ displayDetails: false })}>
                    Back
                </Button>

                <Form layout="vertical"> 
                    <div style={{padding:'20px', marginBottom:'10px'}}>
                        <h2 style={{paddingBottom:'10px'}}>Order Ref. No. {this.state.order.order_ref_num}</h2>    
                        <Row gutter={8}>
                            <Col span={12}>
                            <h3 style={{paddingBottom:'10px'}}>Order Details </h3>  
                                <FormItem {...formItemLayout} label="Order Date : "  className="form-item">
                                <p>{this.state.order.order_date}</p> 
                                </FormItem>
                                <FormItem  {...formItemLayout} label="Sales Channel : " className="form-item">
                                    <p>{this.state.order.sales_channel} </p>
                                </FormItem>
                                <FormItem  {...formItemLayout} label="Shipping Method : " className="form-item">
                                    <p>{this.state.order.shipping_method} </p>
                                </FormItem>
                                <FormItem  {...formItemLayout} label="Tracking Number : " className="form-item">
                                    <p>{this.state.order.tracking_number} </p>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <h3 style={{paddingBottom:'10px'}}>Customer Details </h3>  
                                <p>{this.state.order.customer_name}</p> 
                                <p>{this.state.order.customer_address}</p> 
                                <p>{this.state.order.customer_postcode}, {this.state.order.customer_state}</p> 
                                <p>{this.state.order.customer_contact_num}</p> 
                                <p>{this.state.order.customer_email}</p> 
                            </Col>
                        </Row>
                    </div>  
                    <div style={{ padding:'20px'}}>
                        <h3 style={{paddingBottom:'10px'}}>Product Details</h3>
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
                                <Col span={6}>
                                    <p>Sim Card Number</p>
                                </Col>
                                <Col span={3}>
                                    <p>Serial Number</p>
                                </Col>
                                <Col span={2}>
                                    <p>Unit Price</p>
                                </Col>
                            </Row>
                            {packageDetailItems}
                            {/* <div style={{float:'right', width:'23%'}}> */}
                                <FormItem  labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Subtotal : "  className="form-item-right">
                                        <p>RM {this.state.order.order_total}</p> 
                                </FormItem>
                                {this.state.order.shipping_fee != null ? 
                                <FormItem  labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Shipping Fee : "  className="form-item-right">
                                        <p>RM {this.state.order.shipping_fee} </p> 
                                </FormItem>: <FormItem  labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Shipping Fee : "  className="form-item-right">
                                        <p>RM 0.00 </p> 
                                </FormItem>}
                                <FormItem  labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Total Amount : "  className="form-item-right">
                                        <p>RM {this.state.order.total}</p> 
                                </FormItem>
                            {/* </div> */}
                    </div>
                </Form>
                <div className="steps-action">
                    <Button type="primary" onClick={() => this.handlePrint()}>Print this order</Button>
                </div>
            </div>
        );
    }

    render() {

        const { displayDetails, completed_orders, allowed, print_order, order } = this.state;

        if (print_order) {
            return (
                <PrintOrder order_id={order.id} hidePrintOrder={this.handleHidePrintOrder.bind(this)} />
            );
        }
        else if (displayDetails) {
            return(this.renderDetails());
        }
        else if (allowed.includes('viewOrderHistory')) {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Completed Order</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Completed Orders</span>
                    </Header>
                    <div className="global-search-wrapper" >
                        <AutoComplete
                            className="global-search"
                            size="large"
                            onSearch={(search) => this._isMounted === true ? this.setState({ search }) : null}
                            placeholder="Search Order Number">
                            <Input suffix={(
                                <Button className="search-btn" size="large" type="primary" onClick={() => this.handleSearch()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
                    </div>
                    <div style={{ padding: '30px', paddingTop:'0px' }}>
                        <Table
                            dataSource={completed_orders}
                            rowKey={completed_orders => completed_orders.id}
                            onRow={(order) => {
                                return {
                                    onClick: () => {this.showOrder(order)}
                                };
                            }}>
                            <Column title="Order Number" dataIndex="order_ref_num" key="order_ref_num" />
                            <Column title="Order Date" dataIndex="order_date" key="order_date" />
                            <Column title="Customer Name" dataIndex="customer_name" key="customer_name" />
                            <Column title="Total (RM)" dataIndex="total" key="total" />
                            <Column
                                title="Order Status"
                                key="order_status"
                                render={(record) => (
                                    <span style={record.order_status === 'Shipped' ? { color: 'green' } : { color: 'red' }}>{record.order_status}</span>
                                )} />
                        </Table>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Completed Order</title>
                    </Helmet>
                </div>
            );
        }
    }      
}

export default Completed;