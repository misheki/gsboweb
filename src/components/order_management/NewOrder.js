import React, { Component } from 'react';
import { Layout,  Table, Modal  } from 'antd';


const { Header } = Layout;

class NewOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }


    render() {
         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>New Order</span>
            </Header>
           
            </div>
            );   
        }
       
}

export default NewOrder;