import React, { Component } from 'react';
import { Layout, Form, Row, Col, Table, AutoComplete, Input, Button, Icon  } from 'antd';
import { listCompleted } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;

class Completed extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            completed_orders: [],
            order: null,
            displayDetails: false,
            required: ['viewOrderHistory'],
            allowed: []
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

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    showOrderlistCompleted() {
        var access_token = sessionStorage.getItem('access_token');
        listCompleted(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ completed_orders: result.data });
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

    showOrder(order) {
        this.setState({ order : order}, () => this.setState({ displayDetails : true }))
    }

    renderDetails() {
        this.state.order.order_details.map((item) => console.log(item));

        const formItemLayout = {
            labelCol: {span:8},
            wrapperCol: { span: 10 },
    
          };

        const packageDetailItems =  this.state.order.order_details.map((item, i) =>
        item.stocks.map((stock, j) =>
            <React.Fragment key={item.id}>
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
            <div style={{padding:'30px',}}>
                <Form layout="vertical"> 
                    <div style={{padding:'20px', marginBottom:'10px', backgroundColor:'white'}}>
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
                    <div style={{ padding:'20px', backgroundColor:'white'}}>
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
                                <FormItem  labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Shipping Fee : "  className="form-item-right">
                                        <p>RM {this.state.order.shipping_fee} </p> 
                                </FormItem>
                                <FormItem  labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Total Amount : "  className="form-item-right">
                                        <p>RM {this.state.order.total}</p> 
                                </FormItem>
                            {/* </div> */}
                    </div>
                </Form>
            </div>
        );
    }

    render() {

        const { completed_orders, allowed } = this.state;

        if(this.state.displayDetails){
            return(this.renderDetails());
        }
        else if (allowed.includes('viewOrderHistory')) {
            return (
                <div>
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Completed Orders</span>
                    </Header>
                    <div className="global-search-wrapper" >
                        {/* <AutoComplete
                            className="global-search"
                            size="large"
                            // onSearch={(search) => this.setState({ search })}
                            placeholder="Search..">
                            <Input suffix={(
                                <Button className="search-btn" size="large" type="primary" >
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete> */}
                    </div>
                    <div style={{ padding: '30px', paddingTop:'0px' }}>
                        <Table
                            dataSource={completed_orders}
                            rowKey={completed_orders => completed_orders.id}
                            onRow={(order) => {
                                return {
                                onClick: () => {this.showOrder(order)}
                                };
                            }}
                            >
                            <Column title="Order Number" dataIndex="order_ref_num" key="order_ref_num" />
                                <Column title="Order Date" dataIndex="order_date" key="order_date" />
                                <Column title="Customer Name" dataIndex="customer_name" key="customer_name" />
                                <Column title="Total" dataIndex="total" key="total" />
                                <Column title="Order Status" dataIndex="order_status" key="order_status" />
                        </Table>
                    </div>
                </div>
            ); 
        }
        else {
            return (
                <div></div>
            );
        }
    }      
}

export default Completed;