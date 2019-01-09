import React, { Component } from 'react';
import { Layout, Form, Table, DatePicker , Select, Button, AutoComplete, Input, Icon } from 'antd';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { listImportLogs } from '../../helpers/ReportController';

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
            date_from_filter:null,
            date_to_filter:null,
            search:null
        };
    }

    onChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString)
        
    }

    handleClearFilter = () => {
        if(this._isMounted) this.setState({ search:null }, () => this.showStockImportReport());
    }

    handleUserFilter = (value)  => {
        // if(this._isMounted) this.setState({ user_filter : value }, () => this.showStockImportReport());
    }

    showStockImportReport(){
        var access_token = sessionStorage.getItem('access_token');
        listImportLogs(access_token)
            .then(result => {
                console.log(result.data);
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ data: result.data });
                }
            })
    }

    render() {

        const { data, allowed } = this.state;

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
                        <AutoComplete
                            className="global-search"
                            onSearch={(search) => (this._isMounted === true) ? (search.length > 0 ? this.setState({ search }) : this.setState({ search : null })) : null}
                            placeholder="Search Serial Number"
                            value={this.state.search}>
                            <Input suffix={(
                                <Button className="search-btn" type="primary" onClick={() => this.showStockImportReport()}>
                                    <Icon type="search" />
                                </Button>
                            )} />
                        </AutoComplete>
                        <Button type="primary" style={{marginLeft:60 }} onClick={this.handleClearFilter}>Clear Filter</Button>  
                    </div> 
                    <Table
                        dataSource={data}
                        rowKey={data => data.id }
                        bordered
                    >
                    <Column width={'30%'} title="Date" dataIndex="created_at" key="created_at" />
                    <Column width={'30%'} title="Import by" dataIndex="user" key="user" />
                    <Column width={'30%'} title="Report file" dataIndex="file" key="file" />
                   
                    </Table>
                </div>
            </div>
        );
    }
}

export default  Form.create()( StockImport );