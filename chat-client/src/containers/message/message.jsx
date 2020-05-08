import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim';
import Moment from 'react-moment';

const Item = List.Item
const Brief = Item.Brief

//divide messages into different groups according to target id 
//return the latest messages as an array

function getLatestMsgs(chatMsgs, userid){
	var latestMsgsObj={};
	chatMsgs.forEach(msg=>{
		const chatId = msg.chat_id;
		var latestMsg=latestMsgsObj[chatId];
		var unread=(!msg.read && msg.to===userid)?1:0;
		if(!latestMsg){
			latestMsgsObj[chatId]=msg
			latestMsgsObj[chatId].unreadCount = unread;
		}
		else{
			var temp = latestMsgsObj[chatId].unreadCount+unread;
			if(msg.create_on>latestMsg.create_on){
				latestMsgsObj[chatId]=msg;

			}
			latestMsgsObj[chatId].unreadCount = temp;
		}
	})
	
	const latestMsgs = Object.values(latestMsgsObj);
	latestMsgs.sort((msg1, msg2)=>{
		return msg2.create_on-msg1.create_on
	})
	
	return latestMsgs;

}

class Message extends Component{

	render(){
		const {user} = this.props;
		const {users, chatMsgs} = this.props.chat;
		const latestMsgs = getLatestMsgs(chatMsgs,user._id);

		return(
			<List style={{margin:'50px 0'}}>
				<QueueAnim type="scale">
				{
					latestMsgs.map(msg=>{
						
						const tarGetUserId=msg.to===user._id?msg.from:msg.to;
						const targetUser=users[tarGetUserId];
						return( 
						<Item 
							key={msg._id}
							extra={<Badge text={msg.unreadCount}/>}
							thumb={require(`../../assets/images/${targetUser.profilePicture}`)}
							arrow='horizontal'
							onClick={()=>this.props.history.push(`/chat/${tarGetUserId}`)}
						>
							{targetUser.displayName}
							<Brief>{msg.content}, <Moment fromNow>{msg.create_on}</Moment></Brief>
						</Item>
						)
					})
				}
				</QueueAnim>
			</List>
		)
	}
	
}

export default connect(
	state=>({user: state.userReducer, chat: state.chatReducer}),
	{}
)(Message)