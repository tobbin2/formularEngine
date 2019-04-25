import { combineReducers } from 'redux';
import reducer from './reducer'

const result = combineReducers({
    formPayload:reducer
})

export default result
