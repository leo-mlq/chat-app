import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavBar,
		WingBlank, 
		List, 
		InputItem,
		WhiteSpace,
		Button
		} from 'antd-mobile'

import Logo from '../../components/logo/logo'
import {registerDispatcher, resetDispatcher} from '../../redux/actionDispatchers'


class Register extends Component{
	state = {
		username: "",
		password: "",
		email: "",
	}
	//unbinded function, will need to wrap in an arrow function (arrow function binds) if need to pass in parameters
	handleChange = (s, val)=>{
		this.setState({
			[s]: val
		})
	}
	handleRegister=()=>{
		this.props.registerDispatcher(this.state)
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
							<WhiteSpace/>
							<InputItem placeholder="to retrieve password" onChange={val=>{this.handleChange('email',val)}}>email:</InputItem>
						</List>
					</form>
					{message? <div className='error-msg'>{message}</div>:null}
					<WhiteSpace/>
					<Button type="primary" onClick={this.handleRegister}>register</Button>
					<WhiteSpace/>
					<Button onClick={()=>{this.handleRoute('login')}}>have an account?</Button>
				</WingBlank>

			</div>
		)
	}
}

//skip mapStateToprops and mapDispatchToProps to simplify
//state refers to redux store state, reducers are combined
export default connect(
	state=>({user: state.userReducer}),
	{registerDispatcher, resetDispatcher}
)(Register)