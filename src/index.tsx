import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { store } from './app/redux/store'
import Routes from './app/routes/Routes'

declare const module:any

const history = createBrowserHistory()

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate

renderMethod(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root')
)
