import React, { Component } from 'react';
import { Layout, Form, Input, Button, Modal } from 'antd';
import { Helmet } from 'react-helmet';
import { changePassword } from '../helpers/AccountController';
import { checkAccess } from '../helpers/PermissionController';

const { Header } = Layout;

class ChangePassword extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            required: ['changePassword'],
            allowed: []
        };
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

    handleSubmit = (e) => {
        e.preventDefault();
        var access_token = sessionStorage.getItem('access_token');
        const { form } = this.props;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            changePassword(values.current, values.password, values.password_confirmation, access_token)
                .then(result => {
                    if(this._isMounted) this.setState({ loading: false });
                    form.resetFields();

                    Modal.success({
                        title: 'Success',
                        content: 'You have successfully changed your password.',
                    });
                })
                .catch(error => {
                    Modal.error({
                        title: 'Error',
                        content: error
                    });
                });
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const { loading, allowed } = this.state;

        if (allowed.includes('changePassword')) {
            return (
                <div>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Global Sim - Change Password</title>
                    </Helmet>

                    <Header style={{ color: 'white', fontSize: '30px' }}>
                        <span>Change Password</span>
                    </Header>

                    <div style={{ padding: '30px', width:'50%'}}>
                        <Form > 
                            <Form.Item  label="Current Password" >
                                {getFieldDecorator('current', {
                                        rules: [{    
                                            required: true, message: 'Please enter your current password.'
                                        }]
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item  label="New Password" >
                                {getFieldDecorator('password', {
                                        rules: [{    
                                            required: true, message: 'Please enter your new password.'
                                        }]
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item  label="Confirm Password" >
                                {getFieldDecorator('password_confirmation', {
                                        rules: [{    
                                            required: true, message: 'Please confirm your new password.'
                                        }]
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item >
                                <Button icon="check-circle" type="primary" onClick={this.handleSubmit}>Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }  
    }
}

export default  Form.create()( ChangePassword );