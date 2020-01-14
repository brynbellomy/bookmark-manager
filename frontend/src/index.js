import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import './index.css'
import App from './App'
import store from './redux/store'
import * as serviceWorker from './serviceWorker'

import { getEntries } from './redux/libActions'

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/*" exact={false}>
                    <App />
                </Route>
                <Route>
                    <App />
                </Route>
            </Switch>
        </Router>
    </Provider>
, document.getElementById('root'))

store.dispatch(getEntries())

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
