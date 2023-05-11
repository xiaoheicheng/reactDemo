import React, { Component } from 'react'
import { Card, Button, Modal, Table, Form, Input, message, Tree } from 'antd'
import dayjs from 'dayjs';
import {connect} from 'react-redux'

import { reqRoleList, reqAddRole, reqUpdateRole } from '../../api'
import { PAGESIZE } from '../../config';
import menu from '../../config/menu_config'
const { Item } = Form
const { TreeNode } = Tree;

@connect(
  state=>({userName:state.userInfo.user.username}),
  {}
)
@Form.create()
class Role extends Component {
  state = {
    visibleAuth: false,
    visibleAdd: false,
    roleList: [],
    checkedKeys: [],
    roleId:""
  };

  componentDidMount() {
    this.getRoleList()
  }
  //请求角色列表
  getRoleList = async () => {
    let res = await reqRoleList()
    this.setState({ roleList: res.data.reverse() })
  }

  //添加角色
  handleOk = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const res = await reqAddRole(values)
        this.getRoleList()
        this.setState({
          visibleAdd: false,
        });
      } else {
        message.error("输入有误，请检查", 2)
      }
    });

  };
  //取消添加角色
  handleCancel = e => {
    console.log(e);
    this.setState({
      visibleAdd: false,
    });
  };
  //设置权限
  handleAuthOk = async() => {
console.log({_id:this.state.roleId, menus:this.state.checkedKeys, auth_time:Date.now(), auth_name:this.props.userName});
    const res = await reqUpdateRole({_id:this.state.roleId, menus:this.state.checkedKeys, auth_time:Date.now(), auth_name:this.props.userName})
    const {status, data, msg} = res
    if(status === 0){
      message.success("设置角色权限成功", 1)
      this.getRoleList()
      this.setState({
        visibleAuth: false,
      });
    }else{
      message.error(msg, 2)
    }
    
  }
  //取消设置权限
  handleAuthCancel = () => {
    this.setState({
      visibleAuth: false,
    });

  }
  showAdd = () => {
    this.setState({ visibleAdd: true })
  }
  showAuth = (item) => {
    this.setState({ visibleAuth: true, roleId:item._id,  checkedKeys:item.menus})
  }
  //-------------------------------------------------------------------


  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  //------------------------------------------------------------------

  render() {
    const dataSource = this.state.roleList
    const treeData = menu
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (time) => { return dayjs(time).format('YYYY年MM月DD日 HH:mm:ss') }
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render: (time) => { return dayjs(time).format('YYYY年MM月DD日 HH:mm:ss') }
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        align:"center",
        key: 'auth_name',
      },
      {
        title: '操作',
        // dataIndex: 'address',
        align:"center",
        key: 'opt',
        render: (item) => { return <Button type='link' onClick={()=>{this.showAuth(item)}}>设置权限</Button> }
      },
    ];
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Card title={
          <Button type="primary" onClick={this.showAdd}>添加角色</Button>
        }>
          <Table dataSource={dataSource} columns={columns} rowKey="_id" pagination={{ pageSize: PAGESIZE }} bordered/>;
        </Card>

        <Modal
          title="添加角色"
          visible={this.state.visibleAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <Item>
              {getFieldDecorator('roleName', {
                rules: [{ required: true, message: '请输入角色名' }],
              })(
                <Input
                  placeholder="请输入角色名"
                />,
              )}
            </Item>


          </Form>

        </Modal>
        <Modal
          title="设置权限"
          visible={this.state.visibleAuth}
          onOk={this.handleAuthOk}
          onCancel={this.handleAuthCancel}
        >
          <Tree
            checkable//树的节点是否可以选择
            onCheck={this.onCheck}//选择某个菜单的回调
            checkedKeys={this.state.checkedKeys}//默认选择哪一个
            defaultExpandAll={true}//默认打开所有的节点
          >
            {this.renderTreeNodes(treeData)}
          </Tree>

        </Modal>

      </div>
    )
  }
}
export default Role