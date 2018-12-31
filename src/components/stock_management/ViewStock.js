import React, { Component } from 'react';
import { Layout,  Table, AutoComplete, Input, Button, Icon  } from 'antd';
import { listStock } from '../../helpers/StockController';

const { Header } = Layout;
const { Column } = Table;

class ViewStock extends Component {
    constructor(props) {
        super(props);
        this.state = {
           stocks: [],
           search: ''
        };
    }

    componentDidMount() {
        this.showListStock();
    }

    showListStock() {
        var access_token = sessionStorage.getItem('access_token');
        listStock(null, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ stocks: result.data });
                }
            })
    }

    handleSearch() {
        var access_token = sessionStorage.getItem('access_token');
        var { search } = this.state;

        listStock(search, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ stocks: result.data });
                }
            })
    }

    render() {
        const { stocks } = this.state;

         return (
            <div>
                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>View Stock</span>
                </Header>    
                <div className="global-search-wrapper" >
                    <AutoComplete
                        className="global-search"
                        size="large"
                        onSearch={(search) => this.setState({ search })}
                        placeholder="Search sim card number">
                        <Input suffix={(
                            <Button className="search-btn" size="large" type="primary" onClick={() => this.handleSearch()}>
                                <Icon type="search" />
                            </Button>
                        )} />
                    </AutoComplete>
                </div>
                <div style={{ padding:'30px', paddingTop:'0px' }}>
                    <Table
                        dataSource={stocks}
                        rowKey={stocks => stocks.id}>
                        <Column title="Serial Number" dataIndex="serial_number" key="serial_number" />
                        <Column title="Stock Status" dataIndex="stock_status" key="stock_status" />
                        <Column title="Package Code" dataIndex="package_code" key="package_code" />
                        <Column title="Sim Card Number" dataIndex="sim_card_number" key="sim_card_number" />
                       
                        {/* <Column title="Action" dataIndex="action" key="action" /> */}
                        <Column
                            title='Action'
                            key="action"
                            render={(record) => (
                                <div>
                                    <Button style={{ margin:'10px' }} type="primary" >Write Off</Button>
                                </div>
                            )} />
                    </Table>
                </div>           
            </div>
        );
    }
}

export default ViewStock;