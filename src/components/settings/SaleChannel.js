import React, { Component } from 'react';
import { Layout, Table, Button, Modal, Input, Form } from 'antd';


const { Header } = Layout;
const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const data = [{
    key: '1',
    name: 'Lazada',
   
  }, {
    key: '2',
    name: '11Streets',
  
  }, {
    key: '3',
    name: 'Shoppee',
  
  }];

class SaleChannel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            clickView:false
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
            content: 'Are you sure you want to delete this Sale Channel?',
            onOk: () => {
              
            }
        })
    }


    onClickModal = () => {
        this.setState({
            channel: {
               name:'',
            }
        }, () => this.showModal());
    }

    render() {
        const { channel, clickView } = this.state;
        const { getFieldDecorator } = this.props.form;

         return (
            <div>
            <Header style={{ color: 'white', fontSize: '30px' }}>
                <span>Sale Channel</span>
            </Header>
                <div style={{ padding: '30px', width:'80%'}}>
                    <Button
                        onClick={this.onClickModal}
                        style={{ marginBottom: '30px' }}
                        type="primary"
                        icon="plus-circle"
                        size={'large'}>
                        New Channel
                    </Button>
                    <Table
                        dataSource={data}
                        rowKey={data => data.id }
                        bordered
                    >
                    <Column width={'50%'} title="Channel Name" dataIndex="name" key="name" />
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
                    title={clickView ? 'Add Channel' : 'Edit' }
                    footer={<Button type="primary">Save</Button>}>
                    { channel && <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                  initialValue: channel.name,
                                rules: [{ required: true, message: 'Please input sale channel' }]
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

export default Form.create()(SaleChannel);