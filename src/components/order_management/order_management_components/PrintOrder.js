import React, { Component } from 'react';
import { Form, Row, Col, Button, Modal } from 'antd';
import { listCompleted } from '../../../helpers/OrderController';
import { Helmet } from 'react-helmet';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import logo from '../../../logo.png';

const FormItem = Form.Item;

class PrintOrder extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            order: null
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.showOrderlistCompleted();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showOrderlistCompleted() {
        var access_token = sessionStorage.getItem('access_token');
        listCompleted(null, null, null, null, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    result.data.forEach(order => {
                        if (order.id === this.props.order_id) {
                            if(this._isMounted) this.setState({ order }, () => window.print());
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

    handleDone() {
        this.props.hidePrintOrder();
    }

    handlePrint() {
        window.print();
    }

    renderDetails() {
        const { order } = this.state;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 }
        };

        const packageDetailItems = order.order_details.map((item, i) =>
            item.stocks.map((stock, j) =>
                <React.Fragment key={j}>
                    <Row gutter={8} style={{ paddingBottom: '20px' }}>
                        <Col span={2}>
                            <div>
                                { i + j + 1}
                            </div>
                        </Col>
                        <Col span={3}>
                            <div>
                                {item.sku}
                            </div>
                        </Col>
                        <Col span={6}>
                            <div>
                                {item.package}
                            </div>
                        </Col>
                        
                        <Col span={5}>
                            <div>
                                {stock.serial_number}
                            </div>
                        </Col>
                        <Col span={5}>
                            <div>
                                {stock.sim_card_number}
                            </div>
                        </Col>
                        <Col span={3}>
                            <div>
                                {item.unit_price}
                            </div>
                        </Col>
                    </Row>
                </React.Fragment>    
                )
        )

        return (
            <PrintProvider>
                <NoPrint>
                    <div style={{padding: '10px', paddingLeft: '30px', paddingRight: '30px', backgroundColor:' white' }}>
                        <Print>
                            <div className="logo">
                                <img src={logo} alt="logo" style={{ width: '15%' }} />
                            </div>

                            <Form layout="vertical"> 
                                <div style={{ padding: '20px', paddingBottom: '0px' }}>
                                    <h2 style={{ paddingBottom: '10px' }}>Order Ref. No. {order.order_ref_num}</h2>

                                    <Row gutter={8}>
                                        <Col span={12}>
                                        <h3 style={{paddingBottom:'10px'}}>Order Details </h3>
                                            <FormItem {...formItemLayout} label="Order Date : " className="form-item">
                                            <p>{order.order_date}</p> 
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="Sales Channel : " className="form-item">
                                                <p>{order.sales_channel}</p>
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="Shipping Method : " className="form-item">
                                                <p>{order.shipping_method}</p>
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="Tracking Number : " className="form-item">
                                                <p>{order.tracking_number}</p>
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <h3 style={{paddingBottom:'10px'}}>Customer Details</h3>  
                                            <p>{order.customer_name}</p> 
                                            <p>{order.customer_address}</p> 
                                            <p>{order.customer_postcode}, {order.customer_state}</p> 
                                            <p>{order.customer_contact_num}</p> 
                                            <p>{order.customer_email}</p> 
                                        </Col>
                                    </Row>
                                </div>

                                <div style={{ padding: '20px' }}>
                                    <h3 style={{paddingBottom:' 10px' }}>Product Details</h3>
                                    <Row gutter={16} style={{ backgroundColor: '#e8e8e8', padding: '10px', paddingBottom: '0px', marginBottom: '10px' }}>
                                        <Col span={2}>
                                            <p className="font-bold">Item</p>
                                        </Col>
                                        <Col span={3}>
                                            <p className="font-bold">SKU</p>
                                        </Col>
                                        <Col span={6}>
                                            <p className="font-bold">Package</p>
                                        </Col>
                                        <Col span={5}>
                                            <p className="font-bold">Sim Card Number</p>
                                        </Col>
                                        <Col span={5}>
                                            <p className="font-bold">Serial Number</p>
                                        </Col>
                                        <Col span={3}>
                                            <p className="font-bold">Unit Price</p>
                                        </Col>
                                    </Row>
                                    {packageDetailItems}

                                    <div style={{ paddingTop: '40px' }} className="form-item-right">
                                        <p><span className="font-bold">Subtotal: </span>RM {order.order_total}</p>
                                        <p><span className="font-bold">Discount: </span>RM {order.discount ? order.shipping_fee : '0.00'}</p>
                                        <p><span className="font-bold">Shipping Fee: </span>RM {order.shipping_fee ? order.shipping_fee : '0.00'}</p>
                                        <p><span className="font-bold">Total Amount: </span>RM {order.total}</p>
                                    </div>

                                    <div className="form-item-center" style={{ paddingTop: '40px' }}>
                                        <p className="p-no-bottom">This is a computer-generated document. The signature is not required.</p>
                                        <p>For assistance, you may reach out to our Customer Service via:</p>
                                        <p className="font-bold p-no-bottom">WhatsApp/SMS - +6016-339-9967</p>
                                        <p className="font-bold">Email - cs@globalsim.my</p>
                                    </div>
                                </div>
                            </Form>
                        </Print>

                        <div className="steps-action">
                            <Button
                                style={{ marginRight: 8 }}
                                icon="printer"
                                onClick={() => this.handlePrint()}>
                                Print this order
                            </Button>

                            <Button
                                type="primary"
                                icon="check"
                                onClick={() => this.handleDone()}>
                                Done
                            </Button>
                        </div>
                    </div>
                </NoPrint>
            </PrintProvider>
        );
    }

    render () {
        const { order } = this.state;

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Global Sim - Print Order</title>
                </Helmet>
                
                {order ? this.renderDetails() : null}
            </div>
        );
    }
}

export default PrintOrder;