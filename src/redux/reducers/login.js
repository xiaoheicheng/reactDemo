import {SAVE_USERINFO, REMOVE_USERINFO} from '../action-types'
//当页面刷新时，reducer从localStorage中取数据，避免页面刷新后用户数据丢失
const initState = {
    user:JSON.parse(localStorage.getItem("user")),
    isLogin:localStorage.getItem("isLogin") || false
}
export default function(preState=initState, action){
    const {type, data} = action
    switch(type){
        case SAVE_USERINFO:
            return {user:data, isLogin:true}
        case REMOVE_USERINFO:
            return {user:{}, isLogin:false}
        default:
            return preState
    }
}