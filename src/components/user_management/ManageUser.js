import React, { Component } from 'react';
import { listUser, createUser, updateUser, listRole, deleteUser } from '../../helpers/AdminControl';
import { Layout, Table, Button, Modal, Form, Input, Checkbox } from 'antd';

const { Column } = Table;
const { Header } = Layout;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            roles: [],
            loading: false,
            visible: false,
            clickAdd: false,
            confirmDirty: false,
        };
    }

    componentDidMount() {
        this.showListUser();
        this.showListRole();
    }

    showListUser() {
        var access_token = sessionStorage.getItem('access_token');

        listUser(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ data: result.data });
                }
            })
    }

    showListRole() {
        var access_token = sessionStorage.getItem('access_token');

        listRole(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ roles: result.data });
                }
            })
    }

    showAddModal = () => {
        this.setState({ visible: true, clickAdd: true });
    }

    showEditModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visible: false }, () => this.setState({ clickAdd: false }));
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        }
        else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (value && this.state.confirmDirty) {
            form.validateFieldsAndScroll(['confirm_password'], { force: true });
        }

        callback();
    }

    handleCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            createUser(values.name, values.username, values.email, values.password, values.confirm_password, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.showListUser();
                        this.setState({ visible: false, clickAdd: false });
                    }
                })
        });
    }

    handleEdit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        const { user_id } = this.state;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            updateUser(user_id, values.name, values.username, values.email, values.password, values.confirm_password, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.showListUser();
                        this.setState({ visible: false, clickAdd: false });
                    }
                })
        });
    }

    handleDelete = (user_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete User',
            content: 'Are you sure you want to delete this user?',
            onOk: () => {
                deleteUser(user_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.handleCancel();
                            this.showListUser();
                        }
                    })
            }
        })
    }

    onChangeNewUser = () => {
        this.setState({
            user: {
                name: '',
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            }
        }, () => this.showAddModal());
    }

    render() {
        const { data, visible, clickAdd, user, roles, user_id } = this.state;
        const { getFieldDecorator } = this.props.form;

        let addModalFooter =
            <div>
                <Button type="primary" onClick={this.handleCreate}>Create</Button>
            </div>

        let editModalFooter =
            <div>
                <Button onClick={() => this.handleDelete(user_id)}>Delete</Button>
                <Button type="primary" onClick={this.handleEdit}>Save</Button>
            </div>

        return (
            <div>
                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>User Management</span>
                </Header>

                <div style={{ padding: '30px' }}>
                    <Button
                        onClick={this.onChangeNewUser}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="user"
                        size={'large'}>
                        New User
                    </Button>
                    <Table
                        dataSource={data}
                        rowKey={data => data.id}
                        onRow={(record) => {
                            return {
                                onClick: () => {this.setState({ user: Object.assign({}, record), user_id: record.id }, this.showEditModal)}
                            };
                        }}>
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Username" dataIndex="username" key="username" />
                        <Column title="Email" dataIndex="email" key="email" />
                        <Column title="Roles" dataIndex="roles_name" key="roles_name" />
                        <Column title="Status" dataIndex="status" key="status" />
                    </Table>
                    
                    <Modal
                        visible={visible}
                        title={clickAdd ? "Create New User" : "Edit User"}
                        onCancel={this.handleCancel}
                        footer={clickAdd ? addModalFooter : editModalFooter}>
                        {user && <Form layout="vertical">
                            <FormItem label="Name">
                                {getFieldDecorator('name', {
                                    initialValue: user.name,
                                    rules: [{ required: true, message: 'Please input the name!' }]
                                })(
                                    <Input name="name" />
                                )}
                            </FormItem>

                            <FormItem label="Username">
                                {getFieldDecorator('username', {
                                    initialValue: user.username,
                                    rules: [{ required: true, message: 'Please input the username!' }]
                                })(
                                    <Input name="username" onBlur={this.handleConfirmBlur} />
                                )}
                            </FormItem>

                            <FormItem label="Email">
                                {getFieldDecorator(user.email ? user.email : 'email', {
                                    initialValue: user.email,
                                    rules: [{ message: 'Please input the E-mail!' }],
                                })(
                                    <Input name="email" />
                                )}
                            </FormItem>

                            <FormItem label="Password">
                                {getFieldDecorator('password', {
                                    initialValue: user.password,
                                    rules: [{
                                        required: clickAdd ? true : false,
                                        message: 'Please input the password!'
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }],
                                })(
                                    <Input name="password" type="password" />
                                )}
                            </FormItem>

                            <FormItem label="Confirm Password">
                                {getFieldDecorator('confirm_password', {
                                    initialValue: user.confirm_password,
                                    rules: [{
                                        required: clickAdd ? true : false,
                                        message: 'Please confirm your password!'
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }],
                                })(
                                    <Input name="confirm_password" type="password" onBlur={this.handleConfirmBlur} />
                                )}
                            </FormItem>

                            <FormItem label="Role">
                                {getFieldDecorator('role', {
                                    initialValue: user.roles_id,
                                    rules: [{ required: true, message: 'Please check the roles!' }]
                                })(
                                    <CheckboxGroup name="role">
                                        {roles.map((role) =>
                                            <Checkbox key={role.id} value={role.id}>{role.name}</Checkbox>
                                        )}
                                    </CheckboxGroup>
                                )}
                            </FormItem>
                        </Form>}
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Form.create()(ManageUser);