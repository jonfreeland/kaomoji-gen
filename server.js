
require('dotenv').config({silent:true});

var koa = require('koa');
var koaBody = require('koa-body');
var router = require('koa-router')();
var KaomojiService = require('./kaomojiservice');
var app = koa();

app.use(koaBody());

router.post('/', function *(){
	var searchStr = this.query.text || this.request.body.text;
	var kaomoji = yield KaomojiService.getEmoji(searchStr);
	this.body = {
		"response_type":"in_channel",
		"text": kaomoji
	};
});

router.get('/', function *(){
	var tags = yield KaomojiService.getAvailableTags();
	this.body = tags.aggregations.tags.buckets;
});

app.use(router.routes())
	.use(router.allowedMethods());

app.on('error',function(err){
	console.log(err);
});

app.listen(process.env.PORT);