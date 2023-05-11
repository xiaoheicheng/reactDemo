import myAxios from './myAxios.js'
import {BASE_URL, CITY, WEATHER_AK} from '../config'

export const reqLogin = (username, password)=>myAxios.post(`${BASE_URL}/login`, {username, password})
export const reqWeather = ()=>myAxios.get(`https://restapi.amap.com/v3/weather/weatherInfo?key=${WEATHER_AK}&city=${CITY}`)
// export const reqWeather = ()=>{
//     jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`,
//     (err, data)=>{
//         console.log("$$$", err, "###", data);
//     })
// }
//请求一级商品分类列表
export const reqCategoryList = ()=>myAxios.get(`${BASE_URL}/manage/category/list?parentId=0`)

//添加分类
export const reqAddCategory = ({parentId, categoryName})=>myAxios.post(`${BASE_URL}/manage/category/add`, {parentId, categoryName})

//修改分类
export const reqModifyCategory = ({categoryId, categoryName})=>{
  console.log("@@######", categoryId, categoryName);
  return myAxios.post(`${BASE_URL}/manage/category/update`, {categoryId, categoryName})

}

//获取商品分页列表
export const reqProductList = (pageNum, pageSize)=>myAxios.get(`${BASE_URL}/manage/product/list`, {params:{pageNum, pageSize}})

//上架、下架商品
export const ChangeProdStatus = (productId, status)=>myAxios.post(`${BASE_URL}/manage/product/updateStatus`, {productId, status})

//搜索商品
export const searchProduct = (pageNum, pageSize, type, keyWord)=>{
    console.log(pageNum, pageSize, type, keyWord);
  return   myAxios.get(`${BASE_URL}/manage/product/search`, {params:{pageNum, pageSize, [type]:keyWord}})}

//添加商品
export const reqAddProduct = ({categoryId, pCategoryId, name, desc, price, detail, imgs})=>myAxios.post(`${BASE_URL}/manage/product/add`, {categoryId, pCategoryId, name, desc, price, detail, imgs})

//删除图片
export const reqDelImg = (name)=>myAxios.post(`${BASE_URL}/manage/img/delete`, {name})

//修改商品
export const reqUpdateProd = (prodObj)=>myAxios.post(`${BASE_URL}/manage/product/update`, {...prodObj})

//请求角色列表
export const reqRoleList = ()=>myAxios.get(`${BASE_URL}/manage/role/list`)

//添加角色
export const reqAddRole = ({roleName})=>myAxios.post(`${BASE_URL}//manage/role/add`, {roleName})

//更新角色
export const reqUpdateRole = (roleObj)=>myAxios.post(`${BASE_URL}/manage/role/update`, {...roleObj})

//获取所有用户
export const reqUserList = ()=>myAxios.get(`${BASE_URL}/manage/user/list`)

//添加用户
export const reqAddUser = (usrObj)=>myAxios.post(`${BASE_URL}/manage/user/add`, {...usrObj})