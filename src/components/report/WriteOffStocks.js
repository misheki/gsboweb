import React, { Component } from 'react';
import { Layout, Form, Table, DatePicker, AutoComplete, Input, Icon, Button } from 'antd';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { listWriteoffLogs } from '../../helpers/ReportController';
import { checkAccess } from '../../helpers/PermissionController';


const { Header } = Layout;
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class WriteOffStocks extends Component {

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
        this.showWriteOffReport();
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
            }, () => this.showWriteOffReport());
    }

    handleClearFilter = () => {
        if(this._isMounted) this.setState({ date_from_filter : null, date_to_filter : null, search : null }, () => this.showWriteOffReport());
    }

    showWriteOffReport() {
        var access_token = sessionStorage.getItem('access_token');
        const { date_from_filter, date_to_filter, search } = this.state;

        listWriteoffLogs(date_from_filter, date_to_filter, search, access_token)
            .then(result => {
                console.log(result.data);
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
                        <title>Global Sim - Write-off Stocks Report</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Write-off Stocks Report</span>
                    </Header>
                    <div style={{ padding: '30px', width:'90%'}}>
                        <div style={{ paddingBottom: '20px'}}>
                            <b>Filter by range date : </b>
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
                                    <Button className="search-btn" type="primary" onClick={() => this.showWriteOffReport()}>
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
                        <Column width={'10%'} title="SKU" dataIndex="sku_name" key="sku_name" />
                        <Column width={'20%'} title="Date" dataIndex="created_at" key="created_at" />
                        <Column width={'10%'} title="Previous Status" dataIndex="status_from" key="status_from" />
                        <Column width={'20%'} title="Written-off by" dataIndex="actor" key="actor" />
                        <Column width={'40%'} title="Reason" dataIndex="remarks" key="remarks" render={(val) => <p style={{marginTop: 10}}>{val}</p>} />
                        
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


export default  Form.create()( WriteOffStocks );