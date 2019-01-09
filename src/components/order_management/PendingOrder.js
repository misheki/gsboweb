import React, { Component } from 'react';
import { Layout, Table, Button, Modal } from 'antd';
import { listPending } from '../../helpers/OrderController';
import { checkAccess } from '../../helpers/PermissionController';
import  OrderSteps from '../order_management/order_management_components/OrderSteps';
import { Helmet } from 'react-helmet';
import PrintOrder from '../order_management/order_management_components/PrintOrder';

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
            allowed: [],
            print_order: false
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

    componentWillReceiveProps() {
        if(this._isMounted) this.setState({ processOrder: false });
        this.showOrderlistPending();
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
                    if(this._isMounted) this.setState({ pending_orders: result.data });
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
        this.showOrderlistPending();
    }

    handlePrint() {
        this.setState({ print_order: true });
        this.props.showSideBar(false);
    }

    handleHidePrintOrder() {
        this.setState({ print_order: false });
        this.props.showSideBar(true);
    }

    render() {
        const { pending_orders, processOrder, allowed, order_id, print_order } = this.state;

        if (print_order) {
            return (
                <PrintOrder order_id={order_id} hidePrintOrder={this.handleHidePrintOrder.bind(this)} />
            );
        }
        else if (processOrder === false) {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Pending Order</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Pending Order</span>
                    </Header>
                    <div style={{ padding: '30px' }}>
                        {allowed.includes('viewOrderHistory') ? <Table
                            dataSource={pending_orders}
                            rowKey={pending_orders => pending_orders.id}>
                            <Column title="Order Number" dataIndex="order_ref_num" key="order_ref_num" />
                            <Column title="Order Date" dataIndex="order_date" key="order_date" />
                            <Column title="Customer Name" dataIndex="customer_name" key="customer_name" />
                            <Column title="Total (RM)" dataIndex="total_amount" key="total_amount" />
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
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Process Pending Order</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Pending Order</span>
                    </Header>
                    <OrderSteps order_id={order_id} process_order={this.handleProcessOrder.bind(this)} print_order={this.handlePrint.bind(this)} />
                </div>
            );
        }
    }
}

export default PendingOrder;