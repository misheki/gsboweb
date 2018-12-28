import React, { Component } from 'react';
import { Layout,  Table, AutoComplete, Input, Button, Icon  } from 'antd';


const { Header } = Layout;
const { Column } = Table;


class Completed extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }


    render() {
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Completed Order</span>
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
                    // dataSource={packages}
                    // rowKey={pakages => packages.id}
                    >
                    <Column title="Order Number" dataIndex="order_number" key="order_number" />
                    <Column title="Order Date" dataIndex="items" key="items" />
                    <Column title="Customer Name" dataIndex="quantity" key="quantity" />
                    <Column title="Total" dataIndex="total" key="total" />
                    <Column title="Order Status" dataIndex="status" key="status" />
                </Table>
            </div>
            </div>
            );   
        }      
}

export default Completed;