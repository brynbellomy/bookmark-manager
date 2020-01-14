import { combineReducers } from 'redux'

import libReducer from './libReducer'

const appReducer = combineReducers({
    lib: libReducer,
})

const rootReducer = (state, action) => {
    return appReducer(state, action)
}

export default rootReducer