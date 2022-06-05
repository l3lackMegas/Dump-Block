/* External Library  */
import { combineReducers, createStore } from 'redux'

/* Store */
import userInfo from './UserInfo'
import gameState from './GameState'

const rootReducer = combineReducers({
    gameState,
    userInfo
})

const store = createStore(rootReducer);
export default store;