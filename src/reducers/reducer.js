import * as forms from '../actions/types'

const initialState = {
    payload: {}
}

export default function(state = initialState, action) {
    switch(action.type){
        case forms.form1:
            return {
                ...state,
                payload: action
            }
        case forms.form2:
            return {
                ...state,
                payload:action
            }
        case forms.form3:
            return {
                ...state,
                payload:action
            }
        case forms.form4:
            return{
                ...state,
                payload:action
            }
        case forms.form5:
            return{
                ...state,
                payload:action
            }
        default:
            return state

    }
}