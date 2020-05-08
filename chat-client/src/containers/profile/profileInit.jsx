import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavBar, InputItem, Button, WingBlank, WhiteSpace} from 'antd-mobile'

import ProfilePicture from '../../components/pictures/proPicture'
import {initDispatcher, resetDispatcher} from '../../redux/actionDispatchers.js'

class ProfileInit extends Component{
	state={
		profilePicture: '',
		displayName: '',
		funFact: ''
	}
	handleChange=(val, s)=>{
		this.setState({
			[s]:val
		})
	}
	handleSave=()=>{
		this.props.initDispatcher(this.state)
	}
	setProfilePicture=(pic)=>{
		this.setState({
			profilePicture:pic
		})
	}
	render(){
		const {message, profilePicture} = this.props.user;
		if(profilePicture) return <Redirect to='/'/>

		return(
			<div>
				
				<NavBar mode="dark">Profile Setup</NavBar>
				<WingBlank>
					<ProfilePicture setProfilePicture={this.setProfilePicture}/>
					<WhiteSpace/>
					<InputItem labelNumber={10} onChange={(val)=>this.handleChange(val,'displayName')}>Display name:</InputItem>
					<InputItem placeholder='optional' onChange={(val)=>this.handleChange(val, 'funFact')}>Fun fact?</InputItem>
					{message? <div className='error-msg'>{message}</div>:null}
					<WhiteSpace/>
					<Button type='primary' onClick={this.handleSave}>Save</Button>
					
				</WingBlank>
			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer}),
	{initDispatcher, resetDispatcher}
)(ProfileInit)