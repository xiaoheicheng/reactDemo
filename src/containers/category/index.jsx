import React, { Component } from 'react'
import { Table, Card, Button, message, Modal, Form,Input } from 'antd';
import {connect} from 'react-redux'

import { reqCategoryList, reqAddCategory, reqModifyCategory } from '../../api'
import {PAGESIZE} from '../../config'
import {saveCateListAction} from '../../redux/actions/category'
@connect(
  state=>({}),
  {
    saveCategoryList:saveCateListAction
  }
)
@Form.create()
class Category extends Component {
  state = {
    categoryList: [],
    visible: false,
    type:"",
    categoryId:"",
    categoryName:"",
    isLoading:true
  }
  componentDidMount() {
    this.reqCategory()
  }
  reqCategory = async () => {
    let res = await reqCategoryList()
    this.setState({isLoading:false})
    if (res.status === 0) {
      this.setState({ categoryList: res.data.reverse()})
      this.props.saveCategoryList(res.data)
    } else {
      message.error("请求出了点问题", 1)
    }
  }
  showModal = (type, item) => {
    console.log(11111);
    this.setState({
      type,
      visible: true,
      categoryId:item._id,
      categoryName:item.name||""
    });
  };
  //添加分类  
  toAdd = async(categoryName)=>{
    let category = {parentId:0, categoryName}
    let res = await reqAddCategory(category)
    if(res.status == 0) message.success("添加商品分类成功", 1)
    this.reqCategory()
  }
  //修改分类
  toModify = async(category)=>{
    let res = await reqModifyCategory(category)
    if(res.status == 0) message.success("更新商品分类成功", 1)
    this.reqCategory()
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {//表单输入有误
        message.warn("输入有误请检查", 1)
        return
      }
      //提交表单数据
      if(this.state.type == '添加分类'){
          this.toAdd(values.categoryName)
      }else{//修改分类
          const category = {categoryId:this.state.categoryId, categoryName:values.categoryName}
          this.toModify(category)
      }
      this.setState({
        visible: false,
      });
      this.props.form.resetFields()
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields()
  };
  render() {
    const {getFieldDecorator} = this.props.form
    const columns = [
      {
        title: '商品分类',
        dataIndex: 'name',
        key: 'name',
        width: "75%"
      },
      {
        title: '操作',
        // dataIndex: 'address',
        key: 'modify',
        align: "center",
        render: (item) => {return <Button type='link' onClick={()=>{this.showModal("修改分类", item)}}>修改</Button> }
      },
    ];
    return (
      <div>
        <Card title="" extra={<Button type='primary' onClick={()=>{this.showModal("添加分类", "")}}>添加分类</Button>}>
          <Table dataSource={this.state.categoryList}
            columns={columns} bordered rowKey="_id" 
            pagination={{pageSize:PAGESIZE, showQuickJumper:true}}  loading={this.state.isLoading} />
        </Card>
        <Modal
          title={this.state.type}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('categoryName', {
                initialValue:this.state.categoryName,
                rules: [{ required: true, message: '输入不能为空！' },
                ],
              })(
                <Input
                  placeholder="请输入分类名称"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Category