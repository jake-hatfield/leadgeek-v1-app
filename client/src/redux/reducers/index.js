import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import leads from './leads';

export default combineReducers({
	alert,
	auth,
	leads,
});
