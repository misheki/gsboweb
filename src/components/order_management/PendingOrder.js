import React, { Component } from 'react';
import { Layout, Table, Button } from 'antd';
import { listPending } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';
import  OrderSteps from '../order_management/order_management_components/OrderSteps';

const { Header } = Layout;
const { Column } = Table

class PendingOrder extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            pending_orders: [],
            processOrder: false,
            order_id: '',
            required: ['viewOrderHistory', 'processOrder'],
            allowed: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showOrderlistPending();
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

    showOrderlistPending() {
        var access_token = sessionStorage.getItem('access_token');
        listPending(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ pending_orders: result.data });
                }
            })
    }

    processOrder(order_id) {
        this.setState({ order_id: order_id }, this.setState({ processOrder: true }));
    }

    render() {
        const { pending_orders, processOrder, allowed, order_id } = this.state;

        if (processOrder === false) {
            return (             
                <div>
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Pending Order</span>
                    </Header>
                    <div style={{ padding: '30px' }}>
                        {allowed.includes('viewOrderHistory') ? <Table
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
                                        {allowed.includes('processOrder') ? <Button
                                            style={{ margin:'10px' }}
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
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Pending Order</span>
                    </Header>
                    <OrderSteps order_id={order_id} />
                </div>
            );
        }
    }
}

export default PendingOrder;