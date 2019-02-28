import React, { Component } from 'react';
import { Layout, Form, Row, Col, Table, AutoComplete, Input, Button, Icon, Modal, DatePicker, Select } from 'antd';
import { listCompleted, cancelOrder } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import PrintOrder from '../order_management/order_management_components/PrintOrder';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;
const { TextArea } = Input;

class Completed extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            completed_orders: [],
            order: null,
            displayDetails: false,
            required: ['viewOrderHistory', 'cancelCompletedOrder'],
            allowed: [],
            date_from_filter: null,
            date_to_filter: null,
            status_filter: null,
            search: null,
            statuses: null,
            print_order: false,
            cancel_loading: false,
            reason_modal_visible: false,
            reason: ''
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
        const { date_from_filter, date_to_filter, status_filter, search } = this.state;
        listCompleted(date_from_filter, date_to_filter, status_filter, search, access_token)
            .then(result => {                              
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ completed_orders: result.data,  statuses:result.status_list, });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }
    
    onDateChange = (value, dateString) => {     
      if(this._isMounted)  this.setState({date_from_filter:dateString[0], date_to_filter:dateString[1]}, () => this.showOrderlistCompleted());  
    }

    handleClearFilter = () => {
        if(this._isMounted) this.setState({search: null, date_from_filter:null, date_to_filter:null, status_filter:null}, () => this.showOrderlistCompleted());
    }

    handleStatusFilter = (value)  => {
        if(this._isMounted) this.setState({ status_filter : value }, () => this.showOrderlistCompleted());
    }

    showStatusFilter() {
        const { statuses } = this.state;
        if(statuses != null){
            return (
                <Select
                    showSearch
                    style={{ width: 150, marginRight:5}}
                    placeholder="Filter by Status"
                    value={this.state.status_filter ? this.state.status_filter : undefined}
                    onChange={this.handleStatusFilter}>
                    {statuses.map(status => <Option key={status.id} value={status.id}>{status.name}</Option>)}
                </Select>
            );
        }
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
                                    this.showOrderlistCompleted();
                                    this.setState({ displayDetails: false })
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

    renderDetails() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 }
        };

        const { cancel_loading, allowed } = this.state;

        const packageDetailItems =  this.state.order.order_details.map((item, i) => {
            if(this.state.order.order_status == 'Cancelled'){
                return <React.Fragment key={i}>
                    <Row gutter={8}>
                        <Col span={2}>
                            <Form.Item>
                                <Input value={item.quantity} disabled />
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
                        
                        <Col span={4}>
                            <Form.Item>
                                <Input value={''} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item>
                                <Input  value={''} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item>
                                <Input  value={item.unit_price} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </React.Fragment>  
            }else {
                return item.stocks.map((stock, j) =>
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
                            
                            <Col span={4}>
                                <Form.Item>
                                    <Input value={stock.sim_card_number} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item>
                                    <Input  value={stock.serial_number} disabled />
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
            }
        }
        )

        
        return(
            <div style={{padding:'30px', backgroundColor:'white'}}>
                <Button
                    type="primary"
                    icon="left"
                    onClick={() => this.setState({ displayDetails: false })}>
                    Back
                </Button> 

                { allowed.includes('cancelCompletedOrder') && this.state.order.order_status != 'Cancelled' &&
                    <Button loading={cancel_loading} type="danger" style={{ marginLeft: 8 }} onClick={() => this.setState({ reason_modal_visible : true })}>Cancel this order</Button>}

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
                                    <p>{this.state.order.shipping_method ? this.state.order.shipping_method : 'Self Pickup'} </p>
                                </FormItem>
                                {this.state.order.shipping_method ?
                                <FormItem  {...formItemLayout} label="Tracking Number : " className="form-item">
                                    <p>{this.state.order.tracking_number}</p>
                                </FormItem> : null}
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
                                {this.state.order.order_status == 'Cancelled' ? <p>Qty</p> : <p>Item</p> }
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
                                <Col span={5}>
                                    <p>Serial Number</p>
                                </Col>
                                <Col span={2}>
                                    <p>Unit Price</p>
                                </Col>
                            </Row>
                            {packageDetailItems}
                            {/* <div style={{float:'right', width:'23%'}}> */}
                                <FormItem labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Subtotal : "  className="form-item-right">
                                        <p>RM {this.state.order.order_total}</p> 
                                </FormItem>
                                <Form.Item labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Shipping : " className="form-item-right">
                                    <p>RM {this.state.order.shipping_fee ? this.state.order.shipping_fee : '0.00'}</p>
                                </Form.Item>
                                <Form.Item labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Less : " className="form-item-right">
                                    <p>RM {this.state.order.discount ? this.state.order.discount : '0.00'}</p> 
                                </Form.Item>
                                <FormItem labelCol={{ span: 20 }} wrapperCol={{ span: 3 }} label="Total Amount : "  className="form-item-right">
                                        <p>RM {this.state.order.total}</p> 
                                </FormItem>
                            {/* </div> */}
                    </div>
                </Form>
                <div className="steps-action">
                    <Button icon="printer" type="primary" onClick={() => this.handlePrint()}>Print this order</Button>
                </div>
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
                        <b>Filter by range date : </b>
                        <RangePicker
                            defaultValue={[moment('2019-01-01', dateFormat), moment()]}
                            format={dateFormat}
                            onChange={this.onDateChange}
                            style={{marginRight:'10px', width:'25%'}}
                        />
                        {this.showStatusFilter()}
                        <AutoComplete
                            className="global-search"
                            onSearch={(search) => this._isMounted === true ? (search.length > 0 ? this.setState({ search }) : this.setState({ search : null })) : null}
                            placeholder="Search Order Number/Customer Name"
                            value={this.state.search}>
                            <Input suffix={(
                                <Button className="search-btn"  type="primary" onClick={() => this.showOrderlistCompleted()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
                        <Button type="primary"  icon="close-circle" style={{marginLeft:60 }} onClick={this.handleClearFilter}>Clear Filter</Button>  
                    </div>
                    <div style={{ padding: '30px', paddingTop:'0px', cursor: 'pointer' }}>
                        <Table
                            bordered
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
                                    <p style={record.order_status === 'Shipped' ? { color: 'green',paddingTop:'10px' } : { color: 'red',paddingTop:'10px'  }}>{record.order_status}</p>
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