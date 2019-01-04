import React, { Component } from 'react';
import { Layout,  Table, Button } from 'antd';
import  OrderSteps from '../order_management/order_management_components/OrderSteps';
import { listReadyShip } from '../../helpers/OrderController';

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
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showOrderlistReadyToShip();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showOrderlistReadyToShip() {
        var access_token = sessionStorage.getItem('access_token');
        listReadyShip(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ confirmed_orders: result.data });
                }
            })
    }

    processOrder(order_id) {
        this.setState({ order_id: order_id }, this.setState({ processOrder: true }));       
    }

    render() {
        const { confirmed_orders, processOrder, order_id } = this.state;

        if (processOrder === false) {
            return (
                <div>
                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Ready to Ship Orders</span>
                    </Header>
                    <div style={{ padding: '30px' }}>
                        <Table
                            dataSource={confirmed_orders}
                            rowKey={confirmed_orders => confirmed_orders.id}>
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
                                        <Button
                                            style={{ margin: '10px' }}
                                            type="primary"
                                            onClick={() => this.processOrder(record.id)}>
                                            Process Order
                                        </Button>
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
                        <span>Ready to Ship</span>
                    </Header>
                    <OrderSteps order_id={order_id} />
                </div>
            );
        }
    }
}

export default ReadyToShip;

