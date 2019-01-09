import React, { Component } from 'react';
import { Layout, Form, Table, DatePicker, AutoComplete, Input, Icon, Button } from 'antd';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { listImportLogs } from '../../helpers/ReportController';
import { checkAccess } from '../../helpers/PermissionController';

const { Header } = Layout;
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class StockImport extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            date_from_filter:null,
            date_to_filter:null,
            search:null,
            required: ['viewReports'],
            allowed: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showStockImportReport();
        this.getPermissions();
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    onChange = (value, dateString) => {
        if(this._isMounted)
            this.setState({
                date_from_filter : dateString[0],
                date_to_filter : dateString[1]
            }, () => this.showStockImportReport());
    }

    handleClearFilter = () => {
        if(this._isMounted) this.setState({ date_from_filter : null, date_to_filter : null, search : null }, () => this.showStockImportReport());
    }

    showStockImportReport(){
        var access_token = sessionStorage.getItem('access_token');

        const { date_from_filter, date_to_filter, search } = this.state;
        listImportLogs(date_from_filter, date_to_filter, search, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ data: result.data });
                }
            });
    }

    render() {

        const { data, allowed } = this.state;

        if (allowed.includes('viewReports')) {
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
                            <b>Filter by Date : </b>
                            <RangePicker
                                defaultValue={[moment('2019-01-01', dateFormat), moment('2019-01-01', dateFormat)]}
                                format={dateFormat}
                                onChange={this.onChange}
                            />
                            <AutoComplete
                                className="global-search"
                                onSearch={(search) => (this._isMounted === true) ? (search.length > 0 ? this.setState({ search }) : this.setState({ search : null })) : null}
                                placeholder="Search User"
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
                        <Column width={'30%'} title="Imported by" dataIndex="actor" key="actor" />
                        <Column width={'30%'} title="Report file" dataIndex="report" key="report" render={(val) => <p style={{marginTop: 10}}><a href={global.URL + 'storage/csv/' + val}>{val}</a></p>} />
                    
                        </Table>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - View Stocks</title>
                    </Helmet>
                </div>
            );
        }
    }
}

export default  Form.create()( StockImport );