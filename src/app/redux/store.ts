
import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import RootReducer from './reducers'

export const middlewares = [ReduxThunk]

export type Store = {

}

const enhancer = compose(applyMiddleware(...middlewares));

export const store = createStore(RootReducer, enhancer);
