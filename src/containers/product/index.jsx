import React, { Component } from 'react'
import { Button, Card, Icon, Input, message, Select, Table } from 'antd';
import {connect} from 'react-redux'


import { reqProductList, ChangeProdStatus, searchProduct } from '../../api';
import { PAGESIZE } from '../../config';
import {saveProdListAction} from '../../redux/actions/product'

const { Option } = Select;

@connect(
  state=>({}),
  {
    saveProdList : saveProdListAction
  }
)
class Product extends Component {
  state = {
    productList: [],
    total: 0,
    searchType:"productName",
    keyWord:'', 
    // current:1
  }
  componentDidMount() {
    this.getProductList()
  }
  getProductList = async(pageNum = 1) => {//初始化产品列表/搜索产品
    let res
    const {searchType, keyWord} = this.state
    if(this.isSearch) res = await searchProduct(pageNum, PAGESIZE, searchType, keyWord)
    else res = await reqProductList(pageNum, PAGESIZE)
    if (res.status === 0) {
      this.setState({
        productList: res.data.list,
        total: res.data.total,
        current:pageNum
      })
      this.props.saveProdList(res.data.list)//将产品列表保存到redux中
    } else {
      message.error("请求商品列表出错！", 1)
    }
  }
  search = async()=>{
    this.isSearch = true
    this.getProductList()
  }
  changeStatus = async ({_id, status}) => {
    const newStatus = status == 1 ? 2 : 1
    let res = await ChangeProdStatus(_id, newStatus)
    if (res.status === 0) {
      message.success("商品上架/下架成功", 3)
      let productList = [...this.state.productList]
      productList.map((item) => {
        if (item._id == _id) item.status = newStatus
        return item
      })
      this.setState({productList})
    } else {
      message.error("商品上架/下架失败", 2)
    }

  }
  
  render() {
    const dataSource = this.state.productList
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'prodName',
        width: "24%"
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'prodDesc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        align: "center",
        width: "12%",
        render: (price) => { return "￥" + price }
      },
      {
        title: '状态',
        // dataIndex: 'status',
        key: 'status',
        align: "center",
        width: "12%",
        render: (item) => {
          return <div>
            <Button type={item.status == 1 ? "danger" : "primary"} onClick={() => { this.changeStatus(item) }}>{item.status == 1 ? "下架" : "上架"}</Button><br />
            <span>{item.status == 1 ? "在售" : "已停售"}</span>
          </div>


        }
      },
      {
        title: '操作',
        // dataIndex: 'opteration',
        key: 'opteration',
        align: "center",
        width: "9%",
        render: (item) => {
          return <div>
            <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br />
            <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
          </div>
        }

      },
    ];

    return (
      <Card title={
        <div>
          <Select defaultValue="productName"  onChange={(value)=>{this.setState({searchType:value})}}>
            <Option value="productName">按名称搜索</Option>
            <Option value="productDesc">按描述搜索</Option>

          </Select>
          <Input style={{ width: "21%", margin: "0 10px" }} onChange={(e)=>{this.setState({keyWord:e.target.value})}}></Input>
          <Button type='primary' onClick={this.search}><Icon type="search" />搜索</Button>
        </div>

      } extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}><Icon type="plus" />添加商品</Button>}>

        <Table dataSource={dataSource} columns={columns} bordered rowKey="_id"
          pagination={{
            pageSize: PAGESIZE, 
            total: this.state.total,
            onChange: this.getProductList,//页码改变调用函数， 自动传入的参数是改变后的页码
            current:this.state.current//当前在第几页
          }} />
      </Card>
    )
  }
}


export default Product