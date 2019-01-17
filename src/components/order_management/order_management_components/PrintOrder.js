import React, { Component } from 'react';
import { Form, Row, Col, Button, Modal, Table } from 'antd';
import { listCompleted } from '../../../helpers/OrderController';
import { Helmet } from 'react-helmet';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import logo from '../../../logo.png';

const FormItem = Form.Item;
const { Column } = Table;

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
                            console.log(order);
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
            labelCol: { span: 9 },
            wrapperCol: { span: 10 }
        };

        const packageDetailItems = order.order_details.reduce(function(newArray, item, i) {
            return newArray.concat(item.stocks.map(function(stock, j) { 
                return {
                    id: i + j + 1,
                    sku: item.sku,
                    package_name: item.package,
                    serial_number: stock.serial_number,
                    sim_card_number: stock.sim_card_number,
                    unit_price: item.unit_price
                };
            }));
        }, []);
                                  
        console.log(packageDetailItems);

        return (
            <PrintProvider>
                <NoPrint>
                    <div style={{padding: '10px', paddingLeft: '30px', paddingRight: '30px', backgroundColor:' white' }}>
                        <Print>
                            <div className="logo">
                                <img src={logo} alt="logo" style={{ width: '15%' }} />
                            </div>

                            <Form layout="vertical"> 
                                <div style={{ padding: '20px', paddingBottom: '0px', fontSize: '12px' }}>
                                    <h1 style={{ textAlign: "center" }}>ORDER CONFIRMATION</h1><hr></hr>
                                    <h3 style={{ paddingBottom: '10px' }}>Order Ref. No. {order.order_ref_num}</h3>

                                    <Row gutter={8}>
                                        <Col span={10} style={{border: '1px solid black', padding: '10px'}}>
                                            <h4 style={{paddingBottom:'10px'}}>Customer Details</h4>  
                                            <Row gutter={8}>
                                                <Col span={8}>Name</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.customer_name}</Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8}>Address</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.customer_address ? order.customer_address : 'N/A'}</Col>
                                            </Row>
                                            {order.customer_postcode ? 
                                                <Row gutter={8}>
                                                    <Col span={8}></Col>
                                                    <Col span={2}></Col>
                                                    <Col span={8}> {order.customer_postcode ? order.customer_postcode + ', ' : null} {order.customer_state}</Col>
                                                </Row>
                                            : null}
                                            <Row gutter={8}>
                                                <Col span={8}>Contact No.</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}> {order.customer_contact_num ? order.customer_contact_num : 'N/A'}</Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8}>Email</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.customer_email ? order.customer_email : 'N/A'}</Col>
                                            </Row>
                                            Attn: {order.customer_name}<br />
                                            Address: {order.customer_address ? order.customer_address : 'N/A'}<br />
                                            {order.customer_postcode ? order.customer_postcode + ', ' : null} {order.customer_state}<br />
                                            Tel: {order.customer_contact_num ? order.customer_contact_num : 'N/A'} <br />
                                            Email: {order.customer_email ? order.customer_email : 'N/A'}<br />
                                        </Col>
                                        <Col span={1}>
                                           
                                        </Col>
                                        <Col span={13} style={{border: '1px solid black', padding: '10px', fontSize: '10px'}}>
                                            <h4 style={{paddingBottom:'10px'}}>Order Details </h4>
                                            <Row gutter={8}>
                                                <Col span={8}>Order ID</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.order_ref_num}</Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8}>Order Date</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.order_date}</Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8}>Shipping Method</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.shipping_method ? order.shipping_method : 'Self Pickup'}</Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8}>Tracking No.</Col>
                                                <Col span={2}>:</Col>
                                                <Col span={8}>{order.tracking_number ? order.tracking_number : 'N/A'}</Col>
                                            </Row>
                                            Order Date: {order.order_date}<br /> 
                                            Shipping Method: {order.shipping_method ? order.shipping_method : 'Self Pickup'}<br />
                                            {order.shipping_method ? <p>{'Tracking Number: ' + order.tracking_number}</p> : <br />}
                                        </Col>
                                       
                                    </Row>
                                </div>

                                <div style={{ padding: '20px' }}>
                                    <h4 style={{paddingBottom:' 10px' }}>Product Details</h4>

                                    <Table
                                        bordered
                                        pagination={false}
                                        dataSource={packageDetailItems}
                                        rowKey={item => packageDetailItems.id}>
                                            <Column title="Item" dataIndex="id" key="id" className="printOrder" />
                                            <Column title="SKU" dataIndex="sku" key="sku" className="printOrder" />
                                            <Column title="Package" dataIndex="package_name" key="package_name" className="printOrder" />
                                            <Column title="Serial Number" dataIndex="serial_number" key="serial_number" className="printOrder" />
                                            <Column title="Mobile Number" dataIndex="sim_card_number" key="sim_card_number" className="printOrder" />
                                            <Column title="Unit Price (RM)" dataIndex="unit_price" key="unit_price" className="printOrder" />
                                    </Table>

                                    {/* <table>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Subtotal:</td>
                                            <td>RM {order.order_total}</td>
                                        </tr>
                                    </table> */}
                                    <div style={{ paddingTop: '40px', fontSize: '12px' }} className="form-item-right">
                                        <span className="font-bold">Subtotal: </span>RM {order.order_total}<br />
                                        <span className="font-bold">Shipping: </span>RM {order.shipping_fee ? order.shipping_fee : '0.00'}<br />
                                        <span className="font-bold">Less (Discount): </span> RM {order.discount ? order.discount : '0.00'}<br />
                                        <span className="font-bold">Total Amount: </span>RM {order.total}<br />
                                    </div>

                                    <div className="form-item-center" style={{ paddingTop: '40px', fontSize: '10px' }}>
                                        <span className="p-no-bottom">For assistance, you may reach out to our Customer Service via:</span><br />
                                        <span className="font-bold p-no-bottom">WhatsApp/SMS - +6016-339-9967</span><br />
                                        <span className="font-bold">Email - cs@globalsim.my</span><br />
                                        <span className="p-top-40">This is a computer-generated document. The signature is not required.</span><br />
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