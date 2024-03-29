import React, { Component } from 'react';
import { listPermission, createPermission, deletePermission, updatePermission } from '../../helpers/AdminControl';
import { Layout, Table, Button, Modal, Form, Input } from 'antd';
import { Helmet } from 'react-helmet';

const { Column } = Table;
const { Header } = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ManagePermission extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            permissions: [],
            visible: false,
            clickAdd: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.showListPermission();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showListPermission() {
        var access_token = sessionStorage.getItem('access_token');

        listPermission(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ permissions: result.data });
                }
            })
    }

    showAddModal = () => {
        if(this._isMounted) this.setState({ visible: true, clickAdd: true });
    }

    showEditModal = () => {
        if(this._isMounted) this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visible: false }, () => this.setState({ clickAdd: false }));
    }

    handleCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            createPermission(values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListPermission();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleEdit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        const { permission_id } = this.state;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            updatePermission(permission_id, values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListPermission();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleDelete = (permission_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Role',
            content: 'Are you sure you want to delete this role?',
            onOk: () => {
                deletePermission(permission_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.handleCancel();
                            this.showListPermission();
                        }
                    })
            }
        })
    }

    onChangeNewPermission = () => {
        if(this._isMounted) this.setState({
            permission: {
                name: ''
            }
        }, () => this.showAddModal());
    }

    render() {
        const { visible, clickAdd, permissions, permission, permission_id } = this.state;
        const { getFieldDecorator } = this.props.form;

        let addModalFooter =
            <div>
                <Button icon="file-add" type="primary" onClick={this.handleCreate}>Create</Button>
            </div>

        let editModalFooter =
            <div>
                <Button icon="delete" onClick={() => this.handleDelete(permission_id)}>Delete</Button>
                <Button icon="save" type="primary" onClick={this.handleEdit}>Save</Button>
            </div>

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Global Sim - Manage Permission</title>
                </Helmet>

                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>User Management</span>
                </Header>

                <div style={{ padding: '30px' }}>
                    <Button
                        onClick={this.onChangeNewPermission}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="user"
                        size={'large'}>
                        New Permission
                    </Button>

                    <Table
                        dataSource={permissions}
                        rowKey={permissions => permissions.id}
                        onRow={(record) => {
                            return {
                                onClick: () => {if(this._isMounted) this.setState({ permission: Object.assign({}, record), permission_id: record.id }, this.showEditModal)}
                            };
                        }}>
                        <Column title="Permission Name" dataIndex="name" key="name"  render={(val) => <p style={{marginTop: 10}}>{val}</p>}/>
                    </Table>

                    <Modal
                        visible={visible}
                        title={clickAdd ? "Create New Permission" : "Edit Permission"}
                        onCancel={this.handleCancel}
                        footer={clickAdd ? addModalFooter : editModalFooter}>
                        {permission && <Form layout="vertical">
                            <FormItem label="Name">
                                {getFieldDecorator('name', {
                                    initialValue: permission.name,
                                    rules: [{ required: true, message: 'Please input the permission name!' }]
                                })(
                                    <Input name="name" />
                                )}
                            </FormItem>
                        </Form>}
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Form.create()(ManagePermission);