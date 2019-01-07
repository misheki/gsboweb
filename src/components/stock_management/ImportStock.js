import React, { Component } from 'react';
import { Layout } from 'antd';
import { importStocks } from '../../helpers/Upload';
import { checkAccess } from '../../helpers/PermissionController';
import { Helmet } from 'react-helmet';

const { Header } = Layout;

class ImportStock extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            stocksfile : '',
            displaygoodresult: false,
            displaybadresult: false,
            required: ['importStock'],
            allowed: []
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.getPermissions();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        checkAccess(this.state.required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }) : null);
    }

    onFormSubmit(e){
        e.preventDefault();
        var access_token = sessionStorage.getItem('access_token');
        importStocks(this.state.stocksfile, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({
                        skipped : result.skipped,
                        uploaded : result.uploaded,
                        csv : result.csv,
                    }, () => this.setState({ displaybadresult : false, displaygoodresult : true }));
                }
            })
            .catch(err => {
                if(this._isMounted) this.setState({ displaybadresult : true, displaygoodresult : false })
            })

    }

    onChange(e) {
        let files = e.target.files || e.dataTransfer.files;

        if (!files.length)
            return;

        if(this._isMounted) this.setState({ stocksfile : files[0]});
    }

    renderResult() {

        if(this.state.displaygoodresult){
            var report = global.URL + 'storage/csv/' + this.state.csv;
            return (
                <div style={{ margin: '3%', padding: '1%', backgroundColor: '#dfefd8', width: '60%' }}>
                    <p style={{color: '#008000'}}>You have successfully imported the stocks to the database.  <br/>
                    <strong>{this.state.uploaded}</strong> records were uploaded.<br/> 
                    <strong>{this.state.skipped}</strong> records were skipped due to incomplete/duplicate data.<br/> 
                    Please refer to the report: <a href={report}>{this.state.csv}</a></p>
                </div>
            );
        }
        else if(this.state.displaybadresult){
            return (
                <div style={{ margin: '3%', padding: '1%', backgroundColor: '#ffb2b2', width: '60%' }}>
                    <p style={{color: '#990000'}}>Upload failed.  <br />Please verify your file contents and make sure that you are uploading a CSV file.</p>
                </div>
            );
        }
        
    }

    
    render() {
        const { allowed } = this.state;
        var template = global.URL + 'storage/csv/gs_stocks_template_csv.csv';

        if (allowed.includes('importStock')) {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Import Stocks</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Import Stocks</span>
                    </Header>
                    <div style={{ padding: '1%', margin: '3%' }}>
                        <h2>Upload a CSV file using this template: <a href={template} download>STOCKS UPLOAD TEMPLATE</a></h2>
                        <p>Note:  Please use the format dd/mm/yyyy for the EXPIRY DATE column. </p>
                    </div> 
                    <div style={{ padding: '2%', border: '1px solid #d2d2d2', margin: '3%' }}>
                        <form onSubmit={this.onFormSubmit}>
                            <input type="file"  onChange={this.onChange} />
                            <button type="submit">Upload</button>
                        </form>
                    </div> 
                    {this.renderResult()}  
                </div>
            );   
        }
        else {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Import Stocks</title>
                    </Helmet>
                </div>
            );
        }
    }
}

export default ImportStock;