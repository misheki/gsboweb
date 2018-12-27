import React, { Component } from 'react';
import { Layout,  Table, AutoComplete, Input, Button, Icon  } from 'antd';


const { Header } = Layout;
const { Column } = Table;

class ViewStock extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }


    render() {
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>View Stock</span>
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
                    <Column title="Package ID" dataIndex="package_id" key="package_id" />
                    <Column title="Sim Card Number" dataIndex="sim_card_number" key="sim_card_number" />
                    <Column title="Variation ID" dataIndex="variation_id" key="variation_id" />
                    <Column title="Serial Number" dataIndex="serial_number" key="serial_number" />
                    <Column title="Stock Status" dataIndex="status" key="status" />
                    <Column title="Action" dataIndex="action" key="action" />
                </Table>
            </div>
           
            </div>
            );   
        }
       
}

export default ViewStock;