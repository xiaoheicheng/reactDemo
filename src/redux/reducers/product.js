import {SAVE_PRODUCT} from '../action-types'

const initState = []
export default function(preState=initState, action){
    const {type, data} = action
    let newState
    switch(type){
        case SAVE_PRODUCT:
            newState = [...data]
            return newState
        default:
            return preState
    }
}