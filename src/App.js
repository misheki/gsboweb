import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon, Button } from 'antd';
import logo from './logo.png';
import './App.css';
import { showSideBarMenu } from './helpers/AdminControl';

import ManageUser from './components/user_management/ManageUser';
import ManageMenu from './components/menu_management/ManageMenu';
import ManageRole from './components/user_management/ManageRole';
import NewOrder from './components/order_management/NewOrder';
import PendingOrder from './components/order_management/PendingOrder';
import ReadyToShip from './components/order_management/ReadyToShip';
import Completed from './components/order_management/Completed';
import ProductPackage from './components/stock_management/ProductPackage';
import ImportStock from './components/stock_management/ImportStock';
import ViewStock from './components/stock_management/ViewStock';

import Login from './components/Login';
import ManagePermission from './components/user_management/ManagePermission';
import SaleChannel from './components/settings/SaleChannel';
import ShippingOption from './components/settings/ShippingOption';
import ChangePassword from './components/ChangePassword';

import PrintProvider, { Print, NoPrint } from 'react-easy-print';

const { Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            sidebar: [],
            isLoggedIn: false,
            show_side_bar: true
        };
    }

    componentDidMount() {
        var access_token = sessionStorage.getItem('access_token');

        if (access_token) {
            this.setState({ isLoggedIn: true });
            this.fetchSideBarMenu();
        }
    }

    fetchSideBarMenu() {
        var access_token = sessionStorage.getItem('access_token');

        showSideBarMenu(access_token)
            .then(result => {
                this.setState({ sidebar: result.data });
            })
    }

    doLogin = (val) => {
        this.setState({ isLoggedIn: val });
        this.fetchSideBarMenu();
    }

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    logout() {
        sessionStorage.removeItem('access_token'); 
        this.setState({ isLoggedIn : false });
    }

    showSideBar(value) {
        this.setState({ show_side_bar: value });
    }

    sidebar() {
        const { sidebar } = this.state;
        const sidebar_menus = sidebar.map((item) => {
            let url = "/" + item.url;

            if (item.sub_menus) {
                return (
                    <SubMenu
                        title=
                            {<span>
                                <Icon type="shop" />
                                <span>
                                    {item.parent_menu}
                                </span>
                            </span>}
                        key={item.key}>

                        {item.sub_menus.map((sub_menu) => {
                            let url = "/" + sub_menu.url;

                            return (
                                <Menu.Item key={"sub_menu" + sub_menu.key}>
                                    <Link to={url}>
                                        <Icon type="shop" />
                                        <span>
                                            {sub_menu.name}
                                        </span>
                                    </Link>
                                </Menu.Item>
                            );
                        })}
                    </SubMenu>
                );
            }
            else {
                return (
                    <Menu.Item key={"menu" + item.key}>
                        <Link to={url}>
                            <Icon type="shop" />
                            <span>
                                {item.parent_menu}
                            </span>
                        </Link>
                    </Menu.Item>
                );
            }
        })

        return (
            <Sider
                collapsible
                width={220}
                collapsed={this.state.collapsed}
                onCollapse={(this.onCollapse)}>
                <div className="logo">
                    <img src={logo} alt="logo" style={{width:'80%', padding:'10px'}} />
                </div>
                <Menu theme="dark" mode="inline">
                    {sidebar_menus}
                </Menu>
                <div style={{ paddingTop: '40px', textAlign: 'center' }}>
                    <Link to="/">
                        <Button type="primary" onClick={() => this.logout()}>Logout</Button>
                    </Link>
                </div>
            </Sider>
        );
    }

    layout() {
        return (
            <Layout>
                <Content>
                    <Route path="/users"
                        render={(props) => <ManageUser {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/roles"
                        render={(props) => <ManageRole {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/permissions"
                        render={(props) => <ManagePermission {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/menu-management"
                        render={(props) => <ManageMenu {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/product-packages"
                        render={(props) => <ProductPackage {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/import-stocks"
                        render={(props) => <ImportStock {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/view-stocks"
                        render={(props) => <ViewStock {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/new-order"
                        render={(props) => <NewOrder {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/pending-orders"
                        render={(props) => <PendingOrder {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} showSideBar={this.showSideBar.bind(this)} />}/>
                    <Route path="/ready-to-ship-orders"
                        render={(props) => <ReadyToShip {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/completed-orders"
                        render={(props) => <Completed {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} showSideBar={this.showSideBar.bind(this)} />}/>
                    <Route path="/sale-channel"
                        render={(props) => <SaleChannel {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/shipping-option"
                        render={(props) => <ShippingOption {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                    <Route path="/change-password"
                        render={(props) => <ChangePassword {...props} reloadMenu={this.fetchSideBarMenu.bind(this)} />}/>
                </Content>

                <PrintProvider>
                    <NoPrint>
                        <Footer style={{ textAlign: 'center' }}>
                            Global Sim ©2018
                        </Footer>
                    </NoPrint>
                </PrintProvider>
            </Layout>
        );
    }

    render() {
        const { isLoggedIn, show_side_bar } = this.state;

        if (isLoggedIn) {
            return (
                <Router>
                    <Layout style={{ minHeight: '100vh' }}>
                        {show_side_bar ? this.sidebar() : null}
                        {this.layout()}
                    </Layout>
                </Router>
            );   
        }
        else {
            return (
                <Login doLogin={this.doLogin} />
            );
        }
    }
}

export default App;
