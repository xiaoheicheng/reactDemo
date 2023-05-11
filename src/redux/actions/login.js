import { SAVE_USERINFO, REMOVE_USERINFO } from '../action-types'
export const saveUserInfoAction = data => {
    localStorage.setItem("user", JSON.stringify(data))
    localStorage.setItem("isLogin", true)
    return { type: SAVE_USERINFO, data }
}

export const removeUserInfoAction = ()=>{
    localStorage.clear()
    return {type:REMOVE_USERINFO}
}