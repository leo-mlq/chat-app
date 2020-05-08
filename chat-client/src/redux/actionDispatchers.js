import {reqRegister, reqLogin, reqInit, reqGet, reqUpdate, reqUserList, reqChatMsgList, reqChatMsgRead, reqRetrieve} from '../api/api-wrappers'
import {getRedirectTo} from '../utils/utils'
import io from 'socket.io-client'

//reset
const resetActionCreator = ()=>({type: "RESET"});
//auth success 
const authSuccessActionCreator = user=>({type: "AUTH_SUCCESS", item: user});
//error message 
const errMsgActionCreator = msg=>({type: "ERR_MSG", item: msg});
//receive user
const receivedUserActionCreator = user=>({type: "RECEIVE_USER", item: user})
//reset user
const resetUserActionCreator = msg=>({type: "RESET_USER", item: msg})
//get user list
const getUserListActionCreator = userList=>({type: "RECEIVE_USERLIST", item: userList})
//get chat msg list
const getChatMsgListActionCreator =({users, chatMsgs,userId})=>({type: "RECEIVE_CHATMSGLIST", item: ({users, chatMsgs,userId})})
//get chat msg
const getChatMsgActionCreator = ({chatMsg, userId})=>({type: "RECEIVE_CHATMSG", item: {chatMsg,userId}})
//mark msg as 'read'
const readChatMsgActionCreator = ({numMsgsRead,targetId, userId}) => ({type:"READ_MSG", item: {numMsgsRead,targetId, userId}})

export const registerDispatcher= user=>{
	const {username, password, email}=user;
	//sync action
	if(!username || !password || !email) return errMsgActionCreator("Please fill in required field");
	//asycn action
	return async (dispatch)=>{
		var response = await reqRegister(user)
		if(response.data.code===0){
			initIO(dispatch, response.data.data._id);
			io.socket.emit('userConnected', response.data.data._id);
			dispatch(authSuccessActionCreator({...response.data.data,redirectTo:getRedirectTo(response.data.data.profilePicture)}));
		}
		else{
			dispatch(errMsgActionCreator(response.data.msg))
		}
	}
}


export const loginDispatcher = user => {
	const {username, password}=user;
	if(!username || !password) return errMsgActionCreator("Please fill in required field");

	return async (dispatch)=>{
		var response = await reqLogin(user)
		if(response.data.code===0){
			initIO(dispatch, response.data.data._id);
			//tell server to add socket id to users
			io.socket.emit('userConnected', response.data.data._id);
			dispatch(authSuccessActionCreator({...response.data.data,redirectTo:getRedirectTo(response.data.data.profilePicture)}));
		}
		else{
			dispatch(errMsgActionCreator(response.data.msg))
		}
	}
};

export const resetDispatcher =()=>{
	if(io.socket){
		io.socket.disconnect();
		delete io.socket;
	}
	
	return resetActionCreator();
}

export const initDispatcher = (user)=>{
	const {profilePicture, displayName} = user;

	if(!profilePicture || !displayName) return errMsgActionCreator("Please select a picture and display name");

	return async (dispatch)=>{
		var response = await reqInit(user);
		if(response.data.code===0){
			
			dispatch(receivedUserActionCreator(response.data.data))
		}
		else{
			//reset user because cookie does not match
			dispatch(resetUserActionCreator(response.data.msg))
		}
	}
}

export const getDispatcher = ()=>{
	return async (dispatch)=>{
		const response = await reqGet();
		if(response.data.code===0){
			dispatch(receivedUserActionCreator(response.data.data))
		
		}
		else{
			dispatch(errMsgActionCreator(response.data.msg))
		}
	}
}

export const updateDispatcher = (user)=>{

	return async (dispatch)=>{
		var response = await reqUpdate(user);
		if(response.data.code===0){
			dispatch(receivedUserActionCreator(response.data.data))
		}
		else{
			//reset user because cookie does not match
			dispatch(resetUserActionCreator(response.data.msg))
		}
	}
}

export const getListDispatcher = ()=>{
	return async dispatch=>{
		var response = await reqUserList();
		if(response.data.code===0){
			dispatch(getUserListActionCreator(response.data.data))
		}
		else{
			//reset user because cookie does not match
			dispatch(resetUserActionCreator(response.data.msg))
		}
	}
}

function initIO(dispatch, userId){
	if(!io.socket){
		console.log('socket initialized')
		io.socket=io('wss://leomei.site:19593/');
		//io.socket=io('wss://leomei.site/chat/api/');
		io.socket.on("userConnected", function(user){
			console.log(user);
		})
		io.socket.on('sendClient', function(chatData){
			//receive a single message
			dispatch(getChatMsgActionCreator({chatMsg: chatData,userId}));
			//}
		})
		io.socket.on("disconnect", function(){
        	//console.log("client disconnected from server");
    	});
	}
}

export const sendDispatcher = ({from, to, content})=>{
	return async dispatch=>{
		//tell server to add socket id to users, in case refresh
		//io.socket.emit('userConnected', from);
		io.socket.emit('sendServer', {from, to, content});
	}
}

export const getChatMsgListDispatcher = (userId)=>{
	
	return async dispatch=>{
		initIO(dispatch, userId);
		//in case refresh, resent 
		io.socket.emit('userConnected', userId);
		var response = await reqChatMsgList();
		if(response.data.code===0){
			//get a list of message after login
			dispatch(getChatMsgListActionCreator({...response.data.data,userId}));
		}
	}
}

export const readMsgDispatcher = (targetId, userId)=>{
	return async dispatch=>{
		var response = await reqChatMsgRead({from:targetId});
		if(response.data.code===0){
			dispatch(readChatMsgActionCreator({numMsgsRead:response.data.data, targetId, userId}));
		}

	}
}

export const retrieveLoginDispatcher = (username)=>{
	return async dispatch=>{
		var response = await reqRetrieve(username)
		if(response.data.code===0){
			dispatch(resetActionCreator());
		}
		else{
			dispatch(errMsgActionCreator(response.data.msg));
		}
	}
}