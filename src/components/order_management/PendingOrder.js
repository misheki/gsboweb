import React, { Component } from 'react';
import { Layout,  Table, Modal  } from 'antd';


const { Header } = Layout;

class PendingOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }


    render() {
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Pending Order</span>
            </Header>
           
            </div>
            );   
        }
       
}

export default PendingOrder;