import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Icon, Modal } from 'antd'
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import { withRouter } from "react-router-dom";

import "./css/index.css"
import { reqWeather } from '../../../api/index'
import menu_config from "../../../config/menu_config";
import { removeUserInfoAction } from '../../../redux/actions/login'
import { menuTitleAction } from '../../../redux/actions/menu'
const { confirm } = Modal;
@connect(
  state => ({
    userName: state.userInfo.user.username,
    title: state.menuTitle
  }),
  {
    removeUserInfo: removeUserInfoAction,
    removeTitle: menuTitleAction
  }
)
@withRouter
class Header extends Component {

  //组件挂载一般只发生在页面刷新后，后续state更新不会触发组件挂载
  state = {
    isFull: false,
    time: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
    weatherInfo: {},
    title: ""
  }
  //读取title的两种方法：1、从redux中读取
  //2、从地址栏中读取,防止刷新页面redux被情况
  getTitle = () => {
    let urlTitle
    if (this.props.history.location.pathname.split("/").indexOf("product") !== -1)urlTitle = 'product'
    else urlTitle = this.props.history.location.pathname.split("/").reverse()[0]
    let title = ''
    menu_config.forEach((item) => {
      if (!item.children) {
        if (item.key == urlTitle) title = item.title
      } else {
        let temp = item.children.find((item) => {
          return item.key == urlTitle
        })
        if (temp) title = temp.title
      }
    })
    // console.log(item);
    this.setState({ title })
  }
  componentDidMount() {
    screenfull.on('change', () => {
      let isFull = !this.state.isFull
      this.setState({isFull})
    });
    setInterval(() => {
      this.setState({ time: dayjs().format('YYYY年MM月DD日 HH:mm:ss') })
    }, 1000)
    this.requestWeather()
    // console.log(this.props.history.location.pathname);
    this.getTitle()
  }

  logout = () => {
    confirm({
      title: '确定退出登录吗?',
      content: '退出后需要重新登录',
      onOk: () => {
        this.props.removeUserInfo()
        this.props.removeTitle('')
      },
      onCancel() {},
    });
  }
  fullScreen = () => {
    screenfull.toggle()
  }
  requestWeather = async () => {
    const res = await reqWeather()
    this.setState({ weatherInfo: res.lives[0] })
  }

  render() {
    const { weatherInfo } = this.state
    return (
      <div className='header'>
        <div className="header-top">
          <Button className='btn' size='small' onClick={this.fullScreen}><Icon type={this.state.isFull ? "fullscreen-exit" : "fullscreen"} style={{ fontSize: "20px" }} /></Button>
          <span>欢迎，{this.props.userName}</span>
          <Button className='btn2' type="link" onClick={this.logout}>退出</Button>
        </div>
        <div className="header-bottom">
          <div className='left'>{this.props.title ? this.props.title : this.state.title}</div>
          <div className="right">{this.state.time}
            <Icon type="smile" theme="twoTone" className="icon" />
            <span>{weatherInfo.weather}{weatherInfo.temperature}℃---{weatherInfo.winddirection}风{weatherInfo.windpower}级</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Header