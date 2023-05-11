import {combineReducers} from 'redux'
import loginReducer from './login'
import menuReducer from './menu'
import productReducer from './product'
import cateListReducer from  './category'

export default combineReducers({
    userInfo:loginReducer,
    menuTitle:menuReducer,
    productList:productReducer,
    categoryList:cateListReducer
})