import React, { Component } from 'react';
import { Layout, Form, Table, DatePicker , Select, Button } from 'antd';
import { Helmet } from 'react-helmet';
import moment from 'moment';

const { Header } = Layout;
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';

class StockImport extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            user:null,
            user_filter:null
        };
    }
    onChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString)
        
    }

    handleClearFilter = () => {
        // if(this._isMounted) this.setState({user_filter:null}, () => this.showStockImportReport());
    }

    handleUserFilter = (value)  => {
        // if(this._isMounted) this.setState({ user_filter : value }, () => this.showStockImportReport());
    }

    showUserFilter() {
        const { user } = this.state;

        // if(user != null){

            return (
                <Select
                    showSearch
                    style={{ width: 200, marginLeft:10}}
                    placeholder="Filter by User"
                    // value={this.state.user_filter ? this.state.user_filter : undefined}
                    // onChange={this.handleUserFilter}
                    >
                    {/* {statuses.map(status => <Option key={status.id} value={status.id}>{status.name}</Option>)} */}
                </Select>
            );
        // }
    }

    showStockImportReport(){
        var access_token = sessionStorage.getItem('access_token');
        // listPackage(access_token)
        //     .then(result => {
        //         if (result.result === 'GOOD') {
        //             if(this._isMounted) this.setState({ data: result.data });
        //         }
        //     })
    }

    render() {

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Global Sim - Stock Import Report</title>
                </Helmet>

                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>Stock Import Report</span>
                </Header>

                <div style={{ padding: '30px', width:'90%'}}>
                     <div style={{ paddingBottom: '20px'}}>
                        <b>Filter by range date : </b>
                        <RangePicker
                            defaultValue={[moment('01/01/2019', dateFormat), moment('01/01/2019', dateFormat)]}
                            format={dateFormat}
                            onChange={this.onChange}
                        />
                        {this.showUserFilter()}
                        <Button type="primary" style={{marginLeft:60 }} onClick={this.handleClearFilter}>Clear Filter</Button>  
                    </div> 
                    <Table
                        // dataSource={data}
                        // rowKey={data => data.id }
                        bordered
                    >
                    <Column width={'30%'} title="Date" dataIndex="date" key="date" />
                    <Column width={'30%'} title="Import by" dataIndex="user" key="user" />
                    <Column width={'30%'} title="Report file" dataIndex="file" key="file" />
                   
                    </Table>
                </div>
            </div>
        );
    }
}

export default  Form.create()( StockImport );