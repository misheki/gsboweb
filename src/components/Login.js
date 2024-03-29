import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { login, verify } from '../helpers/Auth';

const FormItem = Form.Item;

class Login extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            login(values.username, values.password)
                .then(access_token => {
                    if (access_token) {
                        verify(access_token)
                            .then(result => {
                                this.props.doLogin(true);
                            })
                    }
                })
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
          <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>

                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
          </Form>
        );
    }
}

export default Form.create()(Login);