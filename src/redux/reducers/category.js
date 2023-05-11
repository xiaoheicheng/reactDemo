import {SAVE_CATELIST} from '../action-types'
const initState = []
export default function(preState=initState, action){
    const {type, data} = action
    let newState
    switch(type){
        case SAVE_CATELIST:
            newState = [...data]
            return newState
        default:
            return preState
    }
}