import React, { Component } from 'react';
import { Layout, Table, Button, Modal } from 'antd';
import  OrderSteps from '../order_management/order_management_components/OrderSteps';
import { listReadyShip } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';
import { Helmet } from 'react-helmet';

const { Header } = Layout;
const { Column } = Table;

class ReadyToShip extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            confirmed_orders: [],
            processOrder: false,
            order_id: '',
            required: ['viewOrderHistory', 'processOrder'],
            allowed: []
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
        listReadyShip(access_token)
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
                    <div style={{ padding: '30px' }}>
                        {allowed.includes('viewOrderHistory') ? <Table
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

