import React, { Component } from 'react';
import { Layout, Table, Button, Modal, AutoComplete, DatePicker, Input, Icon } from 'antd';
import  OrderSteps from '../order_management/order_management_components/OrderSteps';
import { listReadyShip } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';
import moment from 'moment';
import { Helmet } from 'react-helmet';

const { Header } = Layout;
const { Column } = Table
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class ReadyToShip extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            confirmed_orders: [],
            processOrder: false,
            order_id: '',
            required: ['viewOrderHistory', 'processOrder'],
            allowed: [],
            date_from_filter: null,
            date_to_filter: null,
            search: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showOrderlistReadyToShip();
        this.getPermissions();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps() {
        if(this._isMounted) this.setState({ processOrder: false });
        this.showOrderlistReadyToShip();
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    showOrderlistReadyToShip() {
        var access_token = sessionStorage.getItem('access_token');

        const { date_from_filter, date_to_filter, search } = this.state;

        listReadyShip(date_from_filter, date_to_filter, search, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ confirmed_orders: result.data });
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
        if(this._isMounted)  this.setState({date_from_filter:dateString[0], date_to_filter:dateString[1]}, () => this.showOrderlistReadyToShip());  
    }

    handleClearFilter = () => {
        if(this._isMounted) this.setState({search: null, date_from_filter:null, date_to_filter:null }, () => this.showOrderlistReadyToShip());
    }

    processOrder(order_id) {
        if(this._isMounted) this.setState({ order_id: order_id }, this.setState({ processOrder: true }));
    }

    handleProcessOrder(value) {
        if(this._isMounted) this.setState({ processOrder: value });
        this.showOrderlistReadyToShip();
    }

    render() {
        const { confirmed_orders, processOrder, allowed, order_id } = this.state;

        if (processOrder === false) {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Confirm Order</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Ready to Ship Orders</span>
                    </Header>
                    <div className="global-search-wrapper" >
                        <b>Filter by range date : </b>
                        <RangePicker
                            defaultValue={[moment('2019-01-01', dateFormat), moment('2019-01-01', dateFormat)]}
                            format={dateFormat}
                            onChange={this.onDateChange}
                            style={{marginRight:'10px', width:'30%'}}
                        />
                        <AutoComplete
                            className="global-search"
                            onSearch={(search) => this._isMounted === true ? (search.length > 0 ? this.setState({ search }) : this.setState({ search : null })) : null}
                            placeholder="Search Order Number/Customer Name"
                            value={this.state.search}
                            >
                            <Input suffix={(
                                <Button className="search-btn"  type="primary" onClick={() => this.showOrderlistReadyToShip()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
                        <Button type="primary"  icon="close-circle" style={{marginLeft:60 }} onClick={this.handleClearFilter}>Clear Filter</Button>  
                    </div>
                    <div style={{ padding: '30px', paddingTop:'0px' }}>
                        {allowed.includes('viewOrderHistory') ? <Table
                            bordered
                            dataSource={confirmed_orders}
                            rowKey={confirmed_orders => confirmed_orders.id}>
                            <Column title="Order Number" dataIndex="order_ref_num" key="order_ref_num" />
                            <Column title="Order Date" dataIndex="order_date" key="order_date" />
                            <Column title="Customer Name" dataIndex="customer_name" key="customer_name" />
                            <Column title="Total (RM)" dataIndex="total_amount" key="total_amount" />
                            <Column
                                title="Order Status"
                                key="order_status"
                                render={(record) => (
                                    <span style={{ color: 'blue' }}>{record.order_status}</span>
                                )} />
                            <Column
                                title='Action'
                                key="action"
                                render={(record) => (
                                    <div>
                                        {allowed.includes('processOrder') ? <Button
                                            style={{ margin: '10px' }}
                                            icon="file-sync"
                                            type="primary"
                                            onClick={() => this.processOrder(record.id)}>
                                            Process Order
                                        </Button> : null}
                                    </div>
                                )} />
                        </Table> : null}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Process Confirm Order</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Ready to Ship</span>
                    </Header>
                    <OrderSteps order_id={order_id} process_order={this.handleProcessOrder.bind(this)} />
                </div>
            );
        }
    }
}

export default ReadyToShip;

