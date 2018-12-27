import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon, Button } from 'antd';
import logo from './logo.svg';
import './App.css';
import { showSideBarMenu } from './helpers/AdminControl';

import ManageUser from './components/user_management/ManageUser';
import ManageMenu from './components/menu_management/ManageMenu';
import ManageRole from './components/user_management/ManageRole';

import Login from './components/Login';
import ManagePermission from './components/user_management/ManagePermission';

const { Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            sidebar: [],
            isLoggedIn: false
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
                collapsed={this.state.collapsed}
                onCollapse={(this.onCollapse)}>
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <Menu theme="dark" mode="inline">
                    {sidebar_menus}
                </Menu>
                <div className="logo">
                    <Button onClick={() => this.logout()}>Logout</Button>
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
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Global Sim ©2018
                </Footer>
            </Layout>
        );
    }

    render() {
        const { isLoggedIn } = this.state;

        if (isLoggedIn) {
            return (
                <Router>
                    <Layout style={{ minHeight: '100vh' }}>
                        {this.sidebar()}
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
