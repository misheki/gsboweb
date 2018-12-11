import React, { Component } from 'react';
import { listRole, createRole, deleteRole, updateRole, listPermission } from '../../helpers/AdminControl';
import { Layout, Table, Button, Modal, Form, Input, Checkbox } from 'antd';

const { Column } = Table;
const { Header } = Layout;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

class ManageRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            permissions: [],
            visible: false,
            clickAdd: false
        }
    }

    componentDidMount() {
        this.showListRole();
        this.showListPermission();
    }

    showListRole() {
        var access_token = sessionStorage.getItem('access_token');

        listRole(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ roles: result.permission_role });
                }
            })
    }

    showListPermission() {
        var access_token = sessionStorage.getItem('access_token');

        listPermission(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({
                        permissions: result.data,
                    });
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

    handleCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            createRole(values.name, values.permission, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListRole();
                        this.setState({ visible: false, clickAdd: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleEdit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        const { role_id } = this.state;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            updateRole(role_id, values.name, values.permission, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListRole();
                        this.setState({ visible: false, clickAdd: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleDelete = (role_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Role',
            content: 'Are you sure you want to delete this role?',
            onOk: () => {
                deleteRole(role_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.handleCancel();
                            this.showListRole();
                        }
                    })
            }
        })
    }

    onChangeNewRole = () => {
        this.setState({
            role: {
                name: ''
            }
        }, () => this.showAddModal());
    }

    render() {
        const { visible, clickAdd, roles, role, role_id, permissions } = this.state;
        const { getFieldDecorator } = this.props.form;
        
        let addModalFooter =
            <div>
                <Button type="primary" onClick={this.handleCreate}>Create</Button>
            </div>

        let editModalFooter =
            <div>
                <Button onClick={() => this.handleDelete(role_id)}>Delete</Button>
                <Button type="primary" onClick={this.handleEdit}>Save</Button>
            </div>

        return (
            <div>
                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>User Management</span>
                </Header>

                <div style={{ padding: '30px' }}>
                    <Button
                        onClick={this.onChangeNewRole}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="user"
                        size={'large'}>
                        New Role
                    </Button>

                    <Table
                        dataSource={roles}
                        rowKey={roles => roles.role_id}
                        onRow={(record) => {
                            return {
                                onClick: () => {this.setState({ role: Object.assign({}, record), role_id: record.role_id }, this.showEditModal)}
                            };
                        }}>
                        <Column title="Role" dataIndex="role_name" key="role_name" />
                        <Column title="Permissions" dataIndex="permissions_name" key="permissions_name" />
                    </Table>

                    <Modal
                        visible={visible}
                        title={clickAdd ? "Create New Role" : "Edit Role"}
                        onCancel={this.handleCancel}
                        footer={clickAdd ? addModalFooter : editModalFooter}>
                        {role && <Form layout="vertical">
                            <FormItem label="Name">
                                {getFieldDecorator('name', {
                                    initialValue: role.role_name,
                                    rules: [{ required: true, message: 'Please input the role name!' }]
                                })(
                                    <Input name="name" />
                                )}
                            </FormItem>

                            <FormItem label="Permission">
                                {getFieldDecorator('permission', {
                                    initialValue: role.permissions_id,
                                    rules: [{ required: true, message: 'Please check the permissions!' }]
                                })(
                                    <CheckboxGroup name="permission">
                                        {permissions.map((permission) =>
                                            <Checkbox key={permission.id} value={permission.id}>{permission.name}</Checkbox>
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

export default Form.create()(ManageRole);