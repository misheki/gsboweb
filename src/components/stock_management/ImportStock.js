import React, { Component } from 'react';
import { Layout,  Upload, Icon, message  } from 'antd';
import { importStocks } from '../../helpers/Upload';

const { Header } = Layout;
const Dragger = Upload.Dragger;

const props = {
    name: 'file',
    multiple: true,
    action: global.URL + 'stock/create',
    onChange(info) {
        console.log(info);
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList); }
      else if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
};

class ImportStock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stocksfile : ''
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.importStock = this.importStock.bind(this);
    }

    importStock(f) {
        var access_token = sessionStorage.getItem('access_token');
        console.log(access_token);
        importStocks(f, access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    
                }
                console.log(result);
            })
    }

    onFormSubmit(e){
        e.preventDefault() 
        this.importStock(this.state.stocksfile);
    }

    onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
                return;

        console.log(files[0]);
        this.createImage(files[0]);
    }

    createImage(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                stocksfile: e.target.result
            })
        };
        reader.readAsDataURL(file);
    }
    
    render() {
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Import Stock</span>
            </Header>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                {/* <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p> */}
            </Dragger>,
            </div>
            );   
        }
       
}

export default ImportStock;