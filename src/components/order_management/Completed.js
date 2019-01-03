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
            show_table: false
        };
    }


    componentDidMount() {
        this._isMounted = true;
        this.showOrderlistCompleted();
        this.showTable();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showTable() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(['viewOrderHistory'], access_token).then(result => result !== false ? (this._isMounted === true ? this.setState({ show_table: result }) : null) : null);
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
        console.log(order);
        this.setState({ order : order}, () => this.setState({ displayDetails : true }))
    }

    renderDetails() {
        this.state.order.order_details.map((item) => console.log(item));
        return(
            <div style={{padding:'30px', width:'90%'}}>
                <Form layout="vertical">
                    <div style={{backgroundColor:'white', padding:'20px', marginBottom:'10px'}}>
                        <h2 style={{paddingBottom:'10px'}}>Order Ref. No. {this.state.order.order_ref_num}</h2>
                        <Row gutter={16}>
                            <Col span={8}>
                                <FormItem label="Order Date">
                                    <Input value={this.state.order.order_date} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Total Amount">
                                    <Input value={'RM ' + this.state.order.total} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Sales Channel">
                                    <Input value={this.state.order.sales_channel} disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                        <h3 style={{paddingBottom:'10px'}}>Items</h3>
                        <Row style={{backgroundColor: '#d2d2d2', padding: '1% 2% 0 2%'}}>
                                <h4>Subtotal: RM {this.state.order.order_total}</h4>
                            {this.state.order.order_details.map((item) =>
                            <Row key={item.id} gutter={16}>
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <Form.Item label="SKU">
                                            <Input value={item.sku} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item label="Package">
                                            <Input value={item.package} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="Quantity">
                                            <Input value={item.quantity} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item label="Unit Price">
                                            <Input value={item.unit_price} disabled />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {item.stocks.map((stock) =>
                                    <Row gutter={16}>
                                        <Col span={2} style={{textAlign: 'right'}} >
                                            <Form.Item>
                                            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{ fontSize: '30pt',display: 'inline-block', verticalAlign: 'middle', lineHeight: '2.1em' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Serial Number">
                                                <Input value={stock.serial_number} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Sim Card Number">
                                                <Input value={stock.sim_card_number} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item>
                                                
                                            </Form.Item>                                           
                                        </Col>
                                    </Row>
                                )}
                            </Row>
                        )}
                        </Row>
                        <h3 style={{paddingBottom:'10px', paddingTop:'50px'}}>Customer Information</h3>
                        <Row gutter={16}>
                            <Col span={8}>
                                <FormItem  label="Customer Name">
                                    <Input value={this.state.order.customer_name} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Email">
                                    <Input value={this.state.order.customer_email} disabled/>
                                </FormItem> 
                            </Col> 
                            <Col span={8}>
                                <FormItem label="Contact Number">
                                    <Input value={this.state.order.customer_contact_num} disabled/>
                                </FormItem>  
                            </Col>    
                        </Row>
                        <FormItem  label="Shipping Address">
                            <Input value={this.state.order.customer_address} disabled/>
                        </FormItem>
                        <Row gutter={16}>
                            <Col span={8}>
                                <FormItem label='State'>
                                    <Input value={this.state.order.customer_state} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='Postcode'>
                                    <Input value={this.state.order.customer_postcode} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Contact Number">
                                    <Input value={this.state.order.customer_contact_num} disabled/>
                                </FormItem>  
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={6}>
                                <FormItem label='Shipping Method'>
                                    <Input value={this.state.order.shipping_method} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label='Shipping Date'>
                                    <Input value={this.state.order.shipped_at} disabled/>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="Shipping Fee">
                                    <Input value={this.state.order.shipping_fee} disabled/>
                                </FormItem>  
                            </Col>
                            <Col span={6}>
                                <FormItem label="Tracking Number">
                                    <Input value={this.state.order.tracking_number} disabled/>
                                </FormItem>  
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }

    render() {

        const { completed_orders, show_table } = this.state;

        if(this.state.displayDetails){
            return(this.renderDetails());
        }
        else if (show_table === true) {
            return (
                <div>
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Completed Orders</span>
                    </Header>
                    <div className="global-search-wrapper" >
                        <AutoComplete
                            className="global-search"
                            size="large"
                            // onSearch={(search) => this.setState({ search })}
                            placeholder="Search..">
                            <Input suffix={(
                                <Button className="search-btn" size="large" type="primary" >
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