
require('dotenv').config({silent:true});

var koa = require('koa');
var app = koa()
var KaomojiService = require('./kaomojiservice')

app.use(function *(){
	var results = yield KaomojiService.getEmoji(this.query.tags)
	this.body = results;
});

app.on('error',function(err){
	console.log(err);
});

app.listen(process.env.PORT);