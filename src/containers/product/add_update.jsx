import React, { Component } from 'react'
import { Button, Card, Icon, Form, Input, Select, message  } from 'antd';
import {connect} from 'react-redux'

import {reqCategoryList, reqAddProduct, reqUpdateProd} from '../../api'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
const { Item } = Form
const { Option } = Select;
@connect(
  state=>({
    categoryList:state.categoryList,
    productList:state.productList
  })
)
@Form.create()
class Add_update extends Component {
  state = {
    categoryList:[],
    optType:'add'
  }
  componentDidMount(){
    //1、区分修改还是添加商品，以便后续操作
    const prod_id = this.props.match.params.id
    if(prod_id){//如果有prod_id,就是修改商品
      const item = this.props.productList.find((item)=>{
        return item._id === prod_id
      })
      if(item){//回显商品数据
        this.setState({...item, optType:"update"}) //回显部分数据
        this.refs.pic.setFileList(item.imgs)//回显图片
        this.refs.richTxt.setRichText(item.detail)//回显富文本内容
      } 
    }else{//添加商品

    }
    //2、获取分类列表，以便展示下拉框
    const {categoryList} = this.props
    if(categoryList.length){//redux中有
      this.setState({categoryList})
    }else{//redux中没有就请求后台
      this.getCateList()
    }
  }

  getCateList = async()=>{
    const res = await reqCategoryList()
    this.setState({categoryList:res.data})
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        const imgs = this.refs.pic.getImgArr()
        const richText = this.refs.richTxt.getRichtext()
        // console.log("$$$$", imgArr);
        console.log("222", richText);
        const _id = this.props.match.params.id
        let res
        if(_id){//修改
          res = await reqUpdateProd({...values, imgs, detail:richText, pCategoryId:0, _id})
          console.log("666", res);
          if(res.status ===0)message.success("商品修改成功", 1)
        }
        else {//添加
          res = await reqAddProduct({...values, imgs, detail:richText, pCategoryId:0})
          if(res.status ===0)message.success("商品添加成功", 1)
        }
      }else{
        message.error("输入有误，请检查", 1)
        return
      }
    });
  };
  backProdList = ()=>{
    this.props.history.goBack()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Card title={
        <div>
          <Button type='link' onClick={this.backProdList}><Icon type="arrow-left" />返回</Button>
          <span>{this.state.optType === 'add' ? "商品添加" : "商品修改"}</span>
        </div>
      }>
        <Form onSubmit={this.handleSubmit} className="login-form" labelCol={{ md: 2 }} wrapperCol={{ md: 6 }}>
          <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue:this.state.name || '',
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                placeholder="商品名称"
              />,
            )}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue:this.state.desc || '',
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                placeholder="商品描述"
              />,
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue:this.state.price || '',
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix="￥"
                addonAfter="元"
                type="number"
                placeholder="商品价格"
              />,
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue:this.state.categoryId || '',
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Select placeholder="请选择分类">
                {
                  this.state.categoryList.map((item)=>{//value={item._id}收集的是分类id
                    return <Option value={item._id} key={item._id}>{item.name}</Option>
                  })
                }
              </Select>,
            )}
          </Item>
          <Item label="商品图片" wrapperCol={{ md: 9 }}>
                <PicturesWall ref="pic"/>
          </Item>
          <Item label="商品详情" wrapperCol={{md:18}}>
            <RichTextEditor ref="richTxt"/>
          </Item>

          <Item>
         
          <Button type="primary" htmlType="submit" className="login-form-button">
            提交
          </Button>
         
        </Item>


        </Form>
      </Card>
    )
  }
}

export default Add_update