
require('dotenv').config({silent:true});

var koa = require('koa');
var koaBody = require('koa-body');
var KaomojiService = require('./kaomojiservice')

var app = koa()

app.use(koaBody());
app.use(function *(){
	var searchStr = this.query.text || this.request.body.text;
	var results = yield KaomojiService.getEmoji(searchStr);
	this.body = results;
});

app.on('error',function(err){
	console.log(err);
});

app.listen(process.env.PORT);