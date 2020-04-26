import React, {Component} from 'react'
import {Switch, Route, Redirect, IndexRedirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import ProfileInit from '../profile/profileInit'
import Personal from '../personal/personal'
import Contacts from '../contacts/contacts'
import Message from '../message/message'
import NotFound from '../../components/not-found/not-found'
import {getRedirectTo} from '../../utils/utils'
import {getDispatcher, getChatMsgListDispatcher} from '../../redux/actionDispatchers'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'


class Main extends Component{
	navList=[
		{
			path: '/contacts',
			component: Contacts,
			title: 'contacts',
			icon: 'contacts',
			text: 'contacts'
		},
		{
			path: '/message',
			component: Message,
			title: 'messages',
			icon: 'message',
			text: 'message'
		},
		{
			path: '/personal',
			component: Personal,
			title: 'personal',
			icon: 'personal',
			text: 'personal'
		}	

	]
	componentDidMount(){
		const userid = Cookies.get('userid');
		const {_id}=this.props.user;

		if(userid && !_id){
			this.props.getDispatcher();
		}

	}
	// componentDidMount(){
	// 	const {_id}=this.props.user;
	// 	console.log(_id)
	// 	if(!this.props.chat.users || !this.props.chat.users[_id]) this.props.getChatMsgListDispatcher(_id);
	// }
	render(){
		/*auto login procedures*/
		/*1, check if userid in cookie 
			 yes: login before (check cookie) but have not re-login(no _id in redux), 
			 		send ajax request (async action, performed in componentDidMount), no display of components
			 no: redirect to login
		  2, already re-login, redirect according to path
		*/

		//read userid from cookie

		const userid = Cookies.get('userid')
		//if not found, redirect login
		if(!userid) return <Redirect to='/login'/>
		//if found, read user from redux 
		const {user}=this.props
		//debugger 
		//if no _id in user, return null(no display)
		if(!user._id) return null;
		//if found, redirect to corresponding container
		if(!this.props.chat.users || !this.props.chat.users[user._id]) {
			this.props.getChatMsgListDispatcher(user._id);
		}
		const path = this.props.location.pathname;

		if(path === '/'){
			//check if profile setup is done 
			if(!user.profilePicture){
				return <Redirect to = 'profileInit'/>
			}
			else return <Redirect to='/message'/>
		}

		const {navList}=this;
		//currentNav could be empty, s.a. '/profileInit'
		const currentNav = navList.find(nav=>nav.path===path)

		return(
			<div>
				{currentNav? <NavBar className='nav_bottom--sticky'>{currentNav.title}</NavBar>:null}
					<Switch>

						{
							navList.map(nav=>{
								return <Route key={nav.path} path={nav.path} component={nav.component}/>
							})
						}
						
						<Route path='/profileInit' component={ProfileInit}/>
						<Route path='/chat/:userid' component={Chat}/>
						<Route component={NotFound}/>
					</Switch>
				{currentNav? <div><NavFooter navList={navList} unreadCount={this.props.chat.unreadCount}/></div>:null}
			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer, chat:state.chatReducer}),
	{getDispatcher, getChatMsgListDispatcher}
)(Main)