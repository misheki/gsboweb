import React, { Component } from 'react';
import { Layout,  Table, Modal  } from 'antd';


const { Header } = Layout;

class ProductPackage extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }


    render() {
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Product Package</span>
            </Header>
           
            </div>
            );   
        }
       
}

export default ProductPackage;