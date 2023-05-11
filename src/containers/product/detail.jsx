import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button, Card, Icon, List, message} from 'antd'

import './detail.css'
import { reqCategoryList } from '../../api'
import { BASE_URL } from '../../config'
const {Item} = List
@connect(
    state=>({
        productList:state.productList,
        categoryList:state.categoryList
    }),
    {}
)
class Detail extends Component {
    state = {
        categoryName:"",
        desc:"",
        detail:"",
        name:"",
        imgs:[],
        price:0,
        isLoading:true
    }

    componentDidMount(){
        // console.log(this);
        const id = this.props.match.params.id
        const prodList = this.props.productList
        if(prodList.length){
            const prod = prodList.find((item)=>{
                return item._id === id
            })
            this.setState({...prod, isLoading:false})
            this.categoryId = prod.categoryId
        }else{//后台没有api:根据商品id获取商品详情
            message.error("详情页面禁止刷新页面", 2)
        }
        const cateList = this.props.categoryList
        if(cateList.length){//如果redux中有分类列表就直接读取
            console.log(777);
            const item = cateList.find((item)=>{
                return item._id === this.categoryId
            })
            if(item) this.setState({categoryName:item.name, isLoading:false})
        }else{//请求后台分类列表:
            console.log(999);
            this.getCateList()
        }
    }
    getCateList = async()=>{
       let res = await reqCategoryList()
        const {status, data, msg} = res
        if(status === 0){
            console.log("!!!@@#", data);
            const item = data.find((item)=>{
                return item._id === this.state.categoryId
            })
            console.log("###$$$", item);
            if(item) this.setState({categoryName:item.name, isLoading:false})
        }else{
        }
    }
  render() {
    return (
        <Card title={
            <div>
                <Button type='link' onClick={()=>{this.props.history.goBack()}}><Icon type="arrow-left" style={{fontSize:"21px"}} /></Button>
                <span>商品详情</span>
            </div>
        } extra={<a href="#">More</a>}>
        <List className='list' loading={this.state.isLoading}>
            <Item className='item'>
                <span className="prod_title">商品名称：</span>
                <span>{this.state.name}</span>
            </Item>
            <Item className='item'> 
                <span className="prod_title">商品描述：</span>
                <span>{this.state.desc}</span>
            </Item>
            <Item className='item'>
                <span className="prod_title">商品价格：</span>
                <span>{this.state.price}</span>
            </Item>
            <Item  className='item'>
                <span className="prod_title">所属分类：</span>
                <span>{this.state.categoryName}</span>
            </Item>
            <Item  className='item'>
                <span className="prod_title">商品图片：</span>
                {this.state.imgs.map((item, index)=>{
                    return <img key={index} src={`${BASE_URL}/upload/${item}`} style={{width:"360px"}}/>
                })}
            </Item>
            <Item  className='item'>
                <span className="prod_title">商品详情：</span>
                <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
            </Item>
        </List>
      </Card>
    )
  }
}
export default Detail