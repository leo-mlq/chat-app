import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Button, Modal, InputItem, TextareaItem} from 'antd-mobile'
import Cookies from 'js-cookie'

import '../../assets/index.less'
import {resetDispatcher, updateDispatcher} from '../../redux/actionDispatchers'

const Item = List.Item;
const Brief = Item.Brief;

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class Personal extends Component{

	state={
		visible:false,
		newEmail: this.props.user.email,
		newDisplayName: this.props.user.displayName,
		newFunFact: this.props.user.funFact
	}
	handleChange=(val, s)=>{
		this.setState({
			[s]:val
		})
	}

	handleLogout=()=>{
		Modal.alert('Logout','Confirm?',[
			{
				text:'No'
			},
			{
				text: 'Yes',
				onPress: ()=>{
					Cookies.remove('userid')
					//automatically redirect to login because of if(!userid) return <Redirect to='/login'/> in main
					// /personal is technically still within /
					this.props.resetDispatcher();
				}
			}
		])
	}
	handleOpen=()=>{
		this.setState({
			visible:true
		})
	}
	handleClose=()=>{
		this.setState({
			visible:false
		})
	}
	handleSubmit=()=>{
		this.setState({
			visible:false
		})
		this.props.updateDispatcher(this.state)
	}
	onWrapTouchStart = (e) => {
	    // fix touch to scroll background page on iOS
	    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
	      return;
	    }
	    const pNode = closest(e.target, '.am-modal-content');
	    if (!pNode) {
	      e.preventDefault();
	    }
	  }

	render(){
		const {username, email, displayName, funFact, profilePicture} = this.props.user;
		return(
			<div style={{marginTop: '50px'}}>
				<Result
					img={<img className="logo-personal" src={require(`../../assets/images/${profilePicture}`)} alt={profilePicture}/>}
					title={displayName}
				/>
				<List renderHeader={()=>'Personal information'}>
					<Item multipleLine>
						<Brief>username: {username}</Brief>
						<Brief>email: {email}</Brief>
						<Brief>fun fact: {funFact}</Brief>
					</Item>
				</List>
				<WhiteSpace size="lg" />
				<List>
					<Button type="primary" onClick={this.handleOpen}>Edit profile</Button>
			        <WhiteSpace />
			        <Modal
			          closable={true}
			          visible={this.state.visible}
          			  popup
          			  transparent
          			  animationType="slide-up"
                      maskClosable={false}
			          onClose={this.handleClose}
			          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
			          //afterClose={() => { alert('afterClose'); }}
			        >
			          <List renderHeader={() => <div>Enter new personal information</div>}>
			          	<InputItem  defaultValue={displayName} labelNumber={10} onChange={(val)=>this.handleChange(val,'newDisplayName')}>display name:</InputItem>
			          	<InputItem  defaultValue={email} labelNumber={10} onChange={(val)=>this.handleChange(val,'newEmail')}>email:</InputItem>
						<TextareaItem  title='Fun fact?' autoHeight placeholder='optional' onChange={(val)=>this.handleChange(val, 'newFunFact')}/>
			            <List.Item>
			              <Button type="primary" onClick={this.handleSubmit}>submit</Button>
			            </List.Item>
			          </List>
			        </Modal>
					<Button type='warning' onClick={this.handleLogout}>Logout</Button>
				</List>
			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer}),
	{resetDispatcher,updateDispatcher}
)(Personal)