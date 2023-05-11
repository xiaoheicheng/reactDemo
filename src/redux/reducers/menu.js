import {CHANGE_MENUTITLE} from '../action-types'

const initState = ''
export default function(preState=initState, action){
    const {type, data} = action
    switch(type){
        case CHANGE_MENUTITLE:
            return data
        default:
            return preState
    }
}