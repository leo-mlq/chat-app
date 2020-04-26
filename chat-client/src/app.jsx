import React from 'react';
import {Provider} from 'react-redux'
import {HashRouter, Route, Switch} from 'react-router-dom'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'
import store from './redux/store'

const App = () => (
	<Provider store={store}>
		<HashRouter>
			<Switch>
				<Route path='/register' component={Register}/>
				<Route path='/login' component={Login}/>
				<Route path='/' component={Main}/>
			</Switch>
		</HashRouter>
	</Provider>
);

export default App;