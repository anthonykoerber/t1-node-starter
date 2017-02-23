import { T1Connection, EntityList, Entity } from 'terminalone'
import { user, password, api_key } from './credentials.js'

var config = {
	apiBaseUrl: 'http://localhost:8080',
	user: user,
	password: password,
	api_key: api_key 
}
var connection = new T1Connection(config);
var app = document.querySelector('#app');

app.innerText = 'hello there: ' + connection.t1config.user;