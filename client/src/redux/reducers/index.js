import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import leads from './leads';
import filters from './filters';
import users from './users';

export default combineReducers({
	alert,
	auth,
	leads,
	filters,
	users,
});
