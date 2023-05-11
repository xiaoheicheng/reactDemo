import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout, Upload } from 'antd'

import { removeUserInfoAction } from '../../redux/actions/login'
import { reqUserList } from '../../api/index'
import './css/index.css' 
import Header from './header'
import LeftNav from './LeftNav'
import Home from '../../components/Home'
import Pie from '../pie'
import Line from '../line'
import Bar from '../bar'
import Role from '../role'
import User from '../user'
import Category  from '../category'
import Product from '../product'
import Detail from '../product/detail'
import Add_update from '../product/add_update'
const { Footer, Sider, Content } = Layout;
@connect(
  state => ({ userInfo: state.userInfo }),
  {
    removeUserInfo: removeUserInfoAction
  }
)
class Admin extends Component {
  getUserInfo = async () => {
    const res = await reqUserList()
    console.log("###", res);
  }
  render() {
    const {isLogin } = this.props.userInfo
    if (!isLogin) {//如果没有登录就重定向到登录页面
      return <Redirect to="/login" />
    }
    return (
      <Layout className='admin'>
        <Sider className='sider'>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content className='content'>
            <Switch>
              <Route path='/admin/home' component={Home}/>
              <Route path="/admin/charts/pie" component={Pie}/>
              <Route path='/admin/charts/line' component={Line}/>
              <Route path="/admin/charts/bar" component={Bar}/>
              <Route path='/admin/prod_about/category' component={Category}/>
              <Route path="/admin/prod_about/product" component={Product} exact/>
              <Route path="/admin/prod_about/product/detail/:id" component={Detail}/>
              <Route path="/admin/prod_about/product/add_update" component={Add_update} exact/>
              <Route path="/admin/prod_about/product/add_update/:id" component={Add_update}/>
              <Route path='/admin/role' component={Role}/>
              <Route path="/admin/user" component={User}/>
              <Redirect to="/admin/home"/>
            </Switch>
          </Content>
          <Footer className='footer'>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
export default Admin
