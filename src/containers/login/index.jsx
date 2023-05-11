import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import logo from '../../static/imgs/logo.png'
import './css/index.css'
import { saveUserInfoAction } from '../../redux/actions/login'
import { reqLogin } from '../../api'
@connect(
    state => ({ isLogin: state.userInfo.isLogin }),
    {
        saveUserInfo: saveUserInfoAction
    }
)
@Form.create()
class Login extends Component {
    pwdValidator = (rule, value, callback) => {
        if (!value) {
            callback("密码必须输入")
        } else if (value.length > 12) {
            callback("密码长度必须小于等于12位")
        } else if (value.length < 4) {
            callback("密码长度必须大于等于4位")
        } else if (!(/^\w+$/).test(value)) {
            callback("密码必须是字母、数字、下划线")
        } else {
            callback()
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { username, password } = values
                const res = await reqLogin(username, password)
                if (res.status === 0) {//登录成功
                    this.props.saveUserInfo(res.data)
                    this.props.history.replace("/admin")
                } else {//登录失败
                    message.error(res.msg, 2)
                }
            } else {
                message.error("表单输入有误，请检查！")
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        if (this.props.isLogin) {//如果登录了就重定向到admin页面
            return <Redirect to="/admin" />
        }
        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="" />
                    <h2>商品管理系统</h2>
                </header>
                <div className='login_input'>
                    用户登录
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' },
                                { min: 4, message: "长度最少4位" },
                                { max: 14, message: "长度最多14位" }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ validator: this.pwdValidator }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>


                </div>
            </div>
        )
    }
}
export default Login


