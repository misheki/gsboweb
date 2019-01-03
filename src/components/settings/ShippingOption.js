import React, { Component } from 'react';
import { Layout, Table, Button,  Modal, Input, Form  } from 'antd';

const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const data = [{
    key: '1',
    name: 'Gdex',
   
  }, {
    key: '2',
    name: 'PosLaju',
  
  }, {
    key: '3',
    name: 'AirPax',
  
  }];

class ShippingOption extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

 
    showModal = () => {
        this.setState({ visible: true , clickView: true});
    }

    showEditModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        this.setState({ visible: false, clickView: false  });
    }

    handleDelete() {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this shipping provider?',
            onOk: () => {
                
            }
        })
    }


    onClickModal = () => {
        this.setState({
            shipping: {
               name:'',
            }
        }, () => this.showModal());
    }

    render() {
        const { shipping, clickView } = this.state;
        const { getFieldDecorator } = this.props.form;

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Shipping Option</span>
            </Header>
                <div style={{ padding: '30px', width:'80%'}}>
                    <Button
                        onClick={this.onClickModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        New Shipping
                    </Button>
                    <Table
                        dataSource={data}
                        bordered
                    >
                    <Column width={'50%'} title="Shipping Provider" dataIndex="name" key="name" />
                    <Column
                        title='Action'
                        key="action"
                        render={(record) => (
                            <div>
                                <Button style={{ margin:'10px' }} type="primary"
                                onClick={()=> this.showEditModal()}>Edit</Button>
                                <Button style={{ margin:'10px' }} type="primary"
                                onClick={()=> this.handleDelete()}>Delete</Button>
                            </div>
                        )} />
                    </Table>
                </div>
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    title={clickView ? 'Add Shipping Provider' : 'Edit Shipping Provider' }
                    footer={<Button type="primary">Save</Button>}>
                    { shipping && <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                  initialValue: shipping.name,
                                rules: [{ required: true, message: 'Please input the shipping provider' }]
                            })(
                                <Input  name = 'Name'/>
                            )}
                        </FormItem>
                     

                    </Form>}
                </Modal>
            </div>
            );   
        }      
}

export default  Form.create()(ShippingOption);