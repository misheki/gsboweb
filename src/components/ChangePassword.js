import React, { Component } from 'react';
import { Layout, Form, Input, Button  } from 'antd';

const { Header } = Layout;

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
        
        };
    }

    render() {

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Change Password</span>
            </Header>
                <div style={{ padding: '30px', width:'50%'}}>
                    <Form > 
                        <Form.Item  label="Current Password" >
                            <Input />
                        </Form.Item>
                        <Form.Item  label="New Password" >
                            <Input />
                        </Form.Item>
                        <Form.Item  label="Confirm Password" >
                            <Input  />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary">Submit</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            );   
        }      
}

export default ChangePassword;