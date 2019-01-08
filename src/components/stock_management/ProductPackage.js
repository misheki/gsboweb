import React, { Component } from 'react';
import { Layout,  Table, Modal, Button, Form, Input, Select, Switch } from 'antd';
import { listPackage, createPackage, deletePackage, editPackage } from '../../helpers/PackageController';
import { listSku, createSku, deleteSku, editSku } from '../../helpers/SkuController';
import { checkAccess } from '../../helpers/PermissionController';
import { Helmet } from 'react-helmet';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class ProductPackage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visible_sku: false,
            packages: [],
            skus: [],
            count:0,
            require_activation: true,
            loading: false,
            clickView: false,
            required: ['viewSku', 'newSKU', 'editSku', 'deleteSku', 'viewPackage', 'newPackage', 'editPackage', 'deletePackage'],
            allowed: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.showPackageList();
        this.showSkuList();
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

    showPackageList() {
        var access_token = sessionStorage.getItem('access_token');
        listPackage(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ packages: result.data });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    showSkuList() {
        var access_token = sessionStorage.getItem('access_token');
        listSku(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ skus: result.data });
                }
            })
            .catch(error => {
                Modal.error({
                    title: 'Error',
                    content: error
                })
            })
    }

    showAddPackagesModal = () => {
        if(this._isMounted) this.setState({ visible: true });
    }

    showAddSkuModal = () => {
        if(this._isMounted) this.setState({ visible_sku: true });
    }

    showEditPackagesModal = () => {
        if(this._isMounted) this.setState({ visible: true, clickView: true });
    }

    showEditSkuModal = () => {
        if(this._isMounted) this.setState({ visible_sku: true, clickView: true });
    }
    
    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visible: false, visible_sku: false, clickView: false  });
    }

    onChangeSwitch = (value) => {
        this.setState({ require_activation: value });
    }

    handleSubmit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if(this._isMounted) this.setState({ loading: true });
            createPackage(values.sku_id, values.code, values.name, values.description, values.cost_price, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({ loading: false });
                        this.handleCancel();
                        this.showPackageList();
                    }
                })
                .catch(error => {
                    if(this._isMounted) this.setState({ loading: false });
                    Modal.error({
                        title: 'Error',
                        content: error
                    })
                })
        });
    }

    handleSubmitEditPackage = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if(this._isMounted) this.setState({ loading: true });
            editPackage(this.state.package_id, values.description, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({ loading: false });
                        this.handleCancel();
                        this.showPackageList();
                    }
                })
                .catch(error => {
                    if(this._isMounted) this.setState({ loading: false });
                    Modal.error({
                        title: 'Error',
                        content: error
                    })
                })
        });
    }

    submitSku = () => {
        var access_token = sessionStorage.getItem('access_token');
        const { require_activation } = this.state;
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            createSku(values.sku, require_activation, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({ loading: false });
                        this.handleCancel();
                        this.showSkuList();
                    }
                })
                .catch(error => {
                    if(this._isMounted) this.setState({ loading: false });
                    Modal.error({
                        title: 'Error',
                        content: error
                    })
                })
        });
    }

    submitEditSku = () => {
        var access_token = sessionStorage.getItem('access_token');
        const { require_activation } = this.state;
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            editSku(this.state.sku_id, values.sku, require_activation, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if(this._isMounted) this.setState({ loading: false });
                        this.handleCancel();
                        this.showSkuList();
                    }
                })
                .catch(error => {
                    if(this._isMounted) this.setState({ loading: false });
                    Modal.error({
                        title: 'Error',
                        content: error
                    })
                })
        });
    }

    handleDeleteSku() {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this SKU?',
            onOk: () => {
                deleteSku(this.state.sku_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            Modal.success({
                                title:'Success',
                                content:'You have successfully deleted this SKU.',
                                onOk: () => {
                                    this.showSkuList();
                                }
                            });
                        }
                    })
                    .catch(error => {
                        Modal.error({
                            title: 'Error',
                            content: error,
                            onOk: () => {
                                this.showSkuList();
                            }
                        })
                    })
            }
        })
    }

    handleDeletePackage() {
        var access_token = sessionStorage.getItem('access_token');

        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this package?',
            onOk: () => {
                deletePackage(this.state.package_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            Modal.success({
                                title:'Success',
                                content:'You have successfully deleted this package.',
                                onOk: () => {
                                    this.showPackageList();
                                }
                            });
                        }
                    })
                    .catch(error => {
                        Modal.error({
                            title: 'Error',
                            content: error,
                            onOk: () => {
                                this.showPackageList();
                            }
                        })
                    })
            }
        })
    }

    onClickSkuModal = () => {
        if(this._isMounted) this.setState({
            sku: {
                sku: '',
                require_activation: '',
            }
        }, () => this.showAddSkuModal());
    }
    
    onClickPackageModal = () => {
        if(this._isMounted) this.setState({
            newpackage: {
                sku_id: '',
                code: '',
                name:'',
                cost_price:'',
                description:''
            }
        }, () => this.showAddPackagesModal());
    }

    render() {

        const { packages, newpackage, skus, sku, loading, clickView, allowed } = this.state;
        const { getFieldDecorator } = this.props.form;
        
         return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Global Sim - Product Package</title>
                </Helmet>

                <Header style={{ color: 'white', fontSize: '30px' }}>
                    <span>Product Package</span>
                </Header>

                <div style={{ padding: '30px' }}>
                    {allowed.includes('newSKU') ? <Button
                        onClick={this.onClickSkuModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        Add SKU
                    </Button> : null}

                    {allowed.includes('viewSku') ? <Table
                        dataSource={skus}
                        rowKey={skus => skus.id}>
                        <Column title="SKU" dataIndex="sku" key="sku" />
                        <Column title="Required Activation" dataIndex="activation_status" key="activation_status" />
                        <Column
                            title='Action'
                            key="action"
                            render={(record) => (
                                <div>
                                    {allowed.includes('editSku') ? <Button
                                        style={{ margin:'10px' }}
                                        type="primary"
                                        onClick={() => this.setState({ sku: Object.assign({}, record), sku_id: record.id }, () => this.showEditSkuModal())}>
                                        Edit
                                    </Button> : null}

                                    {allowed.includes('deleteSku') === true ? <Button
                                        style={{ margin:'10px' }}
                                        type="primary" 
                                        onClick={() => this.setState({ sku: Object.assign({}, record), sku_id: record.id }, () => this.handleDeleteSku())}>
                                        Delete
                                    </Button> : null}
                                </div>
                            )} />
                    </Table> : null}

                    <Modal
                        visible={this.state.visible_sku}
                        onCancel={this.handleCancel}
                        title={clickView ? 'Edit SKU' : 'Add SKU'  }
                        footer={<Button type="primary" loading={loading} onClick={clickView ? this.submitEditSku : this.submitSku }>Save</Button>}>
                        {sku && <Form layout="vertical">
                            <FormItem label="SKU">
                                {getFieldDecorator('sku', {
                                    initialValue: sku.sku,
                                    rules: [{ required: true, message: 'Please input the product SKU!' }]
                                })(
                                    <Input name = 'sku'/>
                                )}
                            </FormItem>
                            <FormItem label="Required Activation">
                                {getFieldDecorator('require_activation', {
                                    initialValue: sku.require_activation,

                                })(
                                    <Switch onChange={this.onChangeSwitch} checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
                                )}
                            </FormItem>
                        </Form>}
                    </Modal>

                    {allowed.includes('newPackage') ? <Button
                        onClick={this.onClickPackageModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        New Package
                    </Button> : null}

                    {allowed.includes('viewPackage') ? <Table
                        dataSource={packages}
                        rowKey={packages => packages.id }>
                        <Column title="SKU" dataIndex="sku_name" key="sku_name" />
                        <Column title="Code" dataIndex="code" key="code" />
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Cost Price" dataIndex="cost_price" key="cost_price" />
                        <Column title="Req Activation" dataIndex="require_activation" key="require_activation" />
                        <Column
                            title='Action'
                            key="action"
                            render={(record) => (
                                <div>
                                    {allowed.includes('editPackage') ? <Button
                                        style={{ margin:'10px' }}
                                        type="primary"
                                        onClick={() => this.setState({ newpackage: Object.assign({}, record), package_id: record.id }, () => this.showEditPackagesModal())}>
                                        Edit
                                    </Button> : null}

                                    {allowed.includes('deletePackage') ? <Button
                                        style={{ margin:'10px' }}
                                        type="primary"  
                                        onClick={() => this.setState({ newpackage: Object.assign({}, record), package_id: record.id }, () => this.handleDeletePackage())}>
                                        Delete
                                    </Button> : null}
                                </div>
                            )} />
                    </Table> : null}

                    <Modal
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        title={clickView ? 'Edit Package' : 'Add new package' }
                        footer={<Button type="primary" loading={loading} onClick={clickView ? this.handleSubmitEditPackage : this.handleSubmit }>Save</Button>}>
                        { newpackage && <Form layout="vertical">
                            <FormItem label="SKU">
                                {getFieldDecorator('sku_id', {
                                    initialValue: newpackage.sku_id,
                                    rules: [{ required: true, message: 'Please select the product SKU!' }]
                                })(
                                    <Select disabled={clickView ? true : false}  placeholder="Please select the product SKU">
                                        {skus.map((sku) =>
                                            <Option key={sku.id} value={sku.id}>{sku.sku}</Option>
                                        )}
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem label="Code">
                                {getFieldDecorator('code', {
                                    initialValue: newpackage.code,
                                    rules: [{ required: true, message: 'Please input the product code!' }]
                                })(
                                    <Input disabled={clickView ? true : false}  name = 'code'/>
                                )}
                            </FormItem> 

                            <FormItem label="Package Name">
                                {getFieldDecorator('name', {
                                    initialValue: newpackage.name,
                                    rules: [{ required: true, message: 'Please input the product name!' }]
                                })(
                                    <Input disabled={clickView ? true : false}  name = 'name'/>
                                )}
                            </FormItem>

                            <FormItem label="Cost Price (RM)">
                                {getFieldDecorator('cost_price', {
                                    initialValue: newpackage.cost_price,
                                    rules: [{ required: true, message: 'Please input the product cost price!' }]
                                })(
                                    <Input disabled={clickView ? true : false}   name = 'cost_price'/>
                                )}
                            </FormItem>

                            <FormItem label="Description">
                                {getFieldDecorator('description', {
                                    initialValue: newpackage.description,
                                    rules: [{ required: false, message: 'Please input the product description!' }]
                                })(
                                    <Input  name = 'description' />
                                )}
                            </FormItem>

                        </Form>}
                    </Modal>
                </div>
            </div>
        );   
    }
}

export default Form.create()(ProductPackage);