
require('dotenv').config({silent:true});

var koa = require('koa');
var koaBody = require('koa-body');
var KaomojiService = require('./kaomojiservice')

var app = koa()

app.use(koaBody());
app.use(function *(){
	console.log(this.request.body);
	var results = yield KaomojiService.getEmoji(this.query.tags)
	this.body = results;
});

app.on('error',function(err){
	console.log(err);
});

app.listen(process.env.PORT);