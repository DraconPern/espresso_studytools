import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { authMiddleware, authReducer as auth} from 'redux-implicit-oauth2'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (initialState) => {

  const store = createStore(
    combineReducers({
      // other reducers
      auth,
    }),
    initialState,
    composeEnhancers(
    applyMiddleware(
      // other middleware
      authMiddleware,
    ))
  )

  return store;
}

export default configureStore
