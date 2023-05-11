import { Component } from "react";
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";

import logo from '../../../static/imgs/logo.png'
import './css/index.css'
import menu_config from "../../../config/menu_config";
import { menuTitleAction } from '../../../redux/actions/menu'
const { SubMenu } = Menu;
@connect(
    state => ({
        authMenus: state.userInfo.user.role.menus,
        userName: state.userInfo.user.username
    }),
    {
        saveMenuTitle: menuTitleAction,
    }
)
@withRouter
class LeftNav extends Component {
    hasAuth = (item) => {
        const { authMenus, userName } = this.props
        if (userName === 'admin') return true
        else if (!item.children) {
            // return authMenus.find((item2)=>{return item2 === item.key})
            return authMenus.indexOf(item.key) !== -1
        }
        else {
            return item.children.some((item2) => { return authMenus.indexOf(item2.key) !== -1 })
        }
    }
    createMenu = (menuArr) => {
        const { authMenus } = this.props
        return menuArr.map((item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key} onClick={() => { this.props.saveMenuTitle(item.title); console.log(item.title) }}>
                            <Link to={item.path}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.createMenu(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }

    render() {
        let title
        if (this.props.history.location.pathname.indexOf("product") !== -1) title = "product"
        else title = this.props.history.location.pathname.split('/').reverse()[0]
        const titleArr = this.props.history.location.pathname.split('/')
        return (
            <div>
                <header>
                    <img src={logo} alt="logo" />
                    <h1>商品管理系统</h1>
                </header>
                <Menu
                    selectedKeys={title}
                    defaultOpenKeys={titleArr}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.createMenu(menu_config)
                    }
                </Menu>
            </div>
        )
    }
}
export default LeftNav