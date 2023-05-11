import { Button, Icon, Card, Table, message, Modal, Form, Input, Select  } from 'antd'
import { Component } from 'react'
import dayjs from 'dayjs'

import { reqUserList, reqAddUser } from '../../api'
import { PAGESIZE } from '../../config'
@Form.create()
class User extends Component {
  state = {
    userList: [],
    roleList: [],
    modalVisible: false
  }
  componentDidMount() {
    this.getUserList()
  }
  getUserList = async () => {
    const res = await reqUserList()
    const { status, data, msg } = res
    if (status === 0) {
      message.success("获取用户列表成功", 1)
      this.setState({ userList: data.users.reverse(), roleList: data.roles })
    } else {
      message.error(msg, 1)
    }

  }
  getRoleName = (role_id) => {
    const { roleList } = this.state
    const item = roleList.find((item) => {
      return item._id === role_id
    })
    if (item) return item.name
  }
  showAdd = () => {
    this.setState({ modalVisible: true })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  handleOk = ()=>{

    this.props.form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const res = await reqAddUser(values)
        const {status, data, msg} = res
        if(status === 0){
          message.success("添加用户成功",1)
          this.setState({ modalVisible: false })
          this.getUserList()
          
        }else{
          message.error("添加失败", 2)
        }
      }
    }); 
    
  }

  handleCancel = ()=>{
    this.setState({ modalVisible: false })
  }

  render() {
    const dataSource = this.state.userList
    const { getFieldDecorator } = this.props.form;
    const { Item } = Form
    const { Option } = Select;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => { return dayjs(time).format('YYYY年MM月DD日 HH:mm:ss') }
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        align: "center",
        key: 'role_id',
        render: (role_id) => { return this.getRoleName(role_id) }
      },
      {
        title: '操作',
        // dataIndex: 'address',
        align: "center",
        width: "15%",
        key: 'address',
        render: () => {
          return <div>
            <Button type='link'>操作</Button>
            <Button type='link'>删除</Button>
          </div>
        }
      },
    ];

    return (
      <div>
        <Card title={
          <Button type='primary' onClick={this.showAdd}><Icon type="plus"></Icon>创建用户</Button>
        }>

          <Table dataSource={dataSource} columns={columns} bordered rowKey="_id" pagination={{ pageSize: PAGESIZE }} />;

        </Card>
        <Modal
          title="添加用户"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form labelCol={{span:4}} wrapperCol={{span:18}}>
            <Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input placeholder="Username"
                />,
              )}
            </Item>
            <Item label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your password!' }],
              })(
                <Input

                  placeholder="password"
                />,
              )}
            </Item>
            <Item label="电话">
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: 'Please input your phone!' }],
              })(
                <Input

                  placeholder="phone"
                />,
              )}
            </Item>
            <Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input

                  placeholder="email"
                />,
              )}
            </Item>
            <Item label="角色">
              {getFieldDecorator('role_id', {
                rules: [{ required: true, message: 'Please input your role!' }],
              })(
                <Select placeholder="请选择角色">
                  {
                    this.state.roleList.map((item)=>{
                      return  <Option value={item._id} key={item._id}>{item.name}</Option>

                    })
                  }
                 
                </Select>
              )}
            </Item>

          </Form>
        </Modal>

      </div>
    )
  }
}

export default User