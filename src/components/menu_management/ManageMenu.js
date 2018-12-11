import React, { Component } from 'react';
import { createMenu, listRole, createSubMenu, listMenu, listSubMenu, updateMenu, deleteMenu, deleteSubMenu, updateSubMenu } from '../../helpers/AdminControl';
import { Layout, Table, Button, Modal, Form, Input, Checkbox, Select } from 'antd';

const { Column } = Table;
const { Header } = Layout;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const Option = Select.Option;

class ManageMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            menus: [],
            submenus: [],
            visibleMenu: false,
            visibleSubMenu: false,
            clickAdd: false
        }
    }

    componentDidMount() {
        this.showListRole();
        this.showListMenu();
        this.showListSubMenu();
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

    showListMenu() {
        var access_token = sessionStorage.getItem('access_token');

        listMenu(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ menus: result.data });
                }
            })
    }

    showListSubMenu() {
        var access_token = sessionStorage.getItem('access_token');

        listSubMenu(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ submenus: result.data });
                }
            })
    }

    showAddMenuModal = () => {
        this.setState({ visibleMenu: true, clickAdd: true });
    }

    showEditMenuModal = () => {
        this.setState({ visibleMenu: true });
    }

    handleMenuCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visibleMenu: false }, () => this.setState({ clickAdd: false }));
    }

    handleMenuCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            createMenu(values.name, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.setState({ visibleMenu: false, clickAdd: false });
                        window.location.reload();
                    }
                })
        });
    }

    handleMenuEdit = (menu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            updateMenu(menu_id, values.name, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.setState({ visibleMenu: false, clickAdd: false });
                        window.location.reload();
                    }
                })
        });
    }

    handleMenuDelete = (menu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Menu',
            content: 'Are you sure you want to delete this menu?',
            onOk: () => {
                deleteMenu(menu_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.handleMenuCancel();
                            window.location.reload();
                        }
                    })
            }
        })
    }

    onChangeNewMenu = () => {
        this.setState({
            menu: {
                name: '',
                order: ''
            }
        }, () => this.showAddMenuModal());
    }

    showAddSubMenuModal = () => {
        this.setState({ visibleSubMenu: true, clickAdd: true });
    }

    showEditSubMenuModal = () => {
        this.setState({ visibleSubMenu: true });
    }

    handleSubMenuCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visibleSubMenu: false }, () => this.setState({ clickAdd: false }));
    }

    handleSubMenuCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            createSubMenu(values.select_menu, values.name, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.setState({ visibleSubMenu: false, clickAdd: false });
                        window.location.reload();
                    }
                })
        });
    }

    handleSubMenuEdit = (submenu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            updateSubMenu(submenu_id, values.select_menu, values.name, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.setState({ visibleSubMenu: false, clickAdd: false });
                        window.location.reload();
                    }
                })
        });
    }

    handleSubMenuDelete = (submenu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Sub Menu',
            content: 'Are you sure you want to delete this sub menu?',
            onOk: () => {
                deleteSubMenu(submenu_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.handleSubMenuCancel();
                            window.location.reload();
                        }
                    })
            }
        })
    }

    onChangeNewSubMenu = () => {
        this.setState({
            submenu: {
                menu_id: '',
                name: '',
                order: ''
            }
        }, () => this.showAddSubMenuModal());
    }

    render() {
        const { visibleMenu, visibleSubMenu, clickAdd, roles, menus, menu, submenus, submenu, menu_id, submenu_id, footer_role_id } = this.state;
        const { getFieldDecorator } = this.props.form;

        let addMenuModalFooter =
            <div>
                <Button type="primary" onClick={this.handleMenuCreate}>Create</Button>
            </div>

        let editMenuModalFooter =
            <div>
                <Button onClick={() => this.handleMenuDelete(menu_id)}>Delete</Button>
                <Button type="primary" onClick={() => this.handleMenuEdit(menu_id)}>Save</Button>
            </div>

        let addSubMenuModalFooter =
            <div>
                <Button type="primary" onClick={this.handleSubMenuCreate}>Create</Button>
            </div>

        let editSubMenuModalFooter =
            <div>
                <Button onClick={() => this.handleSubMenuDelete(submenu_id)}>Delete</Button>
                <Button type="primary" onClick={() => this.handleSubMenuEdit(submenu_id)}>Save</Button>
            </div>

        return (
            <div>
                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>Menu Management</span>
                </Header>

                <div style={{ padding: '30px' }}>
                    <Button
                        onClick={this.onChangeNewMenu}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="user"
                        size={'large'}>
                        New Menu
                    </Button>

                    <Table
                        dataSource={menus}
                        rowKey={menus => menus.id}
                        onRow={(record) => {
                            return {
                                onClick: () => {this.setState({ menu: Object.assign({}, record), menu_id: record.id, footer_role_id: record.roles_id }, this.showEditMenuModal)}
                            };
                        }}>
                        <Column title="Order" dataIndex="order" key="order" />
                        <Column title="Menu" dataIndex="name" key="name" />
                        <Column title="Role" dataIndex="roles_name" key="roles_name" />
                    </Table>

                    <Modal
                        visible={visibleMenu}
                        title={clickAdd ? "Create New Menu" : "Edit Menu"}
                        onCancel={this.handleMenuCancel}
                        footer={clickAdd ? addMenuModalFooter : footer_role_id === 1 ? null : editMenuModalFooter}>
                        {menu && <Form layout="vertical">
                            <FormItem label="Name">
                                {getFieldDecorator('name', {
                                    initialValue: menu.name,
                                    rules: [{ required: true, message: 'Please input the menu name!' }]
                                })(
                                    <Input name="name" />
                                )}
                            </FormItem>

                            <FormItem label="Order">
                                {getFieldDecorator('order', {
                                    initialValue: menu.order,
                                    rules: [{ required: true, message: 'Please input the order number!' }]
                                })(
                                    <Input name="order" />
                                )}
                            </FormItem>

                            <FormItem label="Role">
                                {getFieldDecorator('role', {
                                    initialValue: menu.roles_id,
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

                <div style={{ padding: '30px' }}>
                    <Button
                        onClick={this.onChangeNewSubMenu}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="user"
                        size={'large'}>
                        New Sub Menu
                    </Button>

                    <Table
                        dataSource={submenus}
                        rowKey={submenus => submenus.id}
                        onRow={(record) => {
                            return {
                                onClick: () => {this.setState({ submenu: Object.assign({}, record), submenu_id: record.id, footer_role_id: record.roles_id }, this.showEditSubMenuModal)}
                            };
                        }}>
                        <Column title="Order" dataIndex="order" key="order" />
                        <Column title="Sub Menu" dataIndex="name" key="name" />
                        <Column title="Menu" dataIndex="menu" key="menu" />
                        <Column title="Role" dataIndex="roles_name" key="roles_name" />
                    </Table>

                    <Modal
                        visible={visibleSubMenu}
                        title={clickAdd ? "Create New Sub Menu" : "Edit Sub Menu"}
                        onCancel={this.handleSubMenuCancel}
                        footer={clickAdd ? addSubMenuModalFooter : footer_role_id === 1 ? null : editSubMenuModalFooter}>
                        {submenu && <Form layout="vertical">
                            <FormItem label="Select Menu">
                                {getFieldDecorator('select_menu', {
                                    initialValue: submenu.menu_id,
                                    rules: [{ required: true, message: 'Please select the menu!' }]
                                })(
                                    <Select>
                                        {menus.map((menu) =>
                                            <Option key={menu.id} value={menu.id}>{menu.name}</Option>
                                        )}
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem label="Name">
                                {getFieldDecorator('name', {
                                    initialValue: submenu.name,
                                    rules: [{ required: true, message: 'Please input the menu name!' }]
                                })(
                                    <Input name="name" />
                                )}
                            </FormItem>

                            <FormItem label="Order">
                                {getFieldDecorator('order', {
                                    initialValue: submenu.order,
                                    rules: [{ required: true, message: 'Please input the order number!' }]
                                })(
                                    <Input name="order" />
                                )}
                            </FormItem>

                            <FormItem label="Role">
                                {getFieldDecorator('role', {
                                    initialValue: submenu.roles_id,
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

export default Form.create()(ManageMenu);