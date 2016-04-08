
require('dotenv').config({silent:true});

var koa            = require('koa');
var koaBody        = require('koa-body');
var router         = require('koa-router')();
var KaomojiService = require('./kaomojiservice');
var Slack          = require('@slack/client').WebClient;
var _              = require('lodash');
var app            = koa();

/*
var slack = new Slack('get-a-token-here',{logLevel: 'debug'});

slack.chat.postMessage("#channel","text",{
	as_user: true,
}).then(function(res){
	console.log(res)
});
*/ 

router.post('/', function *(){
	var searchStr = this.query.text || this.request.body.text;
	var kaomoji = yield KaomojiService.getEmoji(searchStr);
	this.body = {
		"response_type":"in_channel",
		"text": kaomoji
	};
});

router.get('/tags', function *(){
	var tags = yield KaomojiService.getAvailableTags();
	this.body = {
		"response_type": "ephemeral",
		"text":_.map(tags.aggregations.tags.buckets,'key').join(', ')
	};
});

app.use(koaBody());
app.use(router.routes())
   .use(router.allowedMethods());

app.on('error',function(err){
	console.log(err);
});

app.listen(process.env.PORT);