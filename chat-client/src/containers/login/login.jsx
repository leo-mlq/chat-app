import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavBar,
		WingBlank, 
		List, 
		InputItem,
		WhiteSpace,
		Button,
		Modal
		} from 'antd-mobile'

import Logo from '../../components/logo/logo'
import {loginDispatcher, resetDispatcher, retrieveLoginDispatcher} from '../../redux/actionDispatchers.js'
import '../../assets/index.less'

const prompt = Modal.prompt;

class Login extends Component{
	state = {
		username: "",
		password: "",
	}
	handleChange = (s, val)=>{
		this.setState({
			[s]: val
		})
	}
	handleLogin=()=>{
		this.props.resetDispatcher();
		this.props.loginDispatcher(this.state)
	}
	handleRoute=(addr)=>{
		this.props.resetDispatcher();
		var address = '/'+addr;
		this.props.history.replace(address)
	}

	render(){
		const {message, redirectTo} = this.props.user;
		if(redirectTo){
			return <Redirect to={redirectTo}/>
		}
		return(
			<div>
				<NavBar mode="dark">Chat</NavBar>
				<WhiteSpace size="lg"/>
				<Logo/>
				<WhiteSpace size="lg"/>
				<WingBlank>
					<form>
						<List>
							<InputItem  onChange={val=>{this.handleChange('username',val)}}>username:</InputItem>
							<WhiteSpace/>
							<InputItem  type="password" onChange={val=>{this.handleChange('password',val)}}>password:</InputItem>
						</List>
					</form>
					{message? <div className='error-msg'>{message}</div>:null}
					<WhiteSpace/>
					<Button type="primary" onClick={this.handleLogin}>login</Button>
					<WhiteSpace/>
					<Button onClick={()=>{this.handleRoute('register')}}>register</Button>
					<WhiteSpace/>
					<Button onClick={()=>{
						prompt('Retrieve login info', 'You will recieve an Email', 
						[{ text: 'Cancel' },
						{ text: 'Submit', onPress: value => this.props.retrieveLoginDispatcher(value) },],
						'default', null, ['input your username'])}
					}>
					forget password?
					</Button>

				</WingBlank>

			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer}),
	{loginDispatcher,resetDispatcher,retrieveLoginDispatcher}
)(Login)