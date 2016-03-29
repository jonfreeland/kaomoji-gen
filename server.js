
require('dotenv').config({silent:true});

var koa = require('koa');
var app = koa()
var EmojiService = require('./emojiservice')


//EmojiService.setup()

app.use(function *(){
	var results = yield EmojiService.getEmoji(this.query.tags)
	this.body = results;
});

app.on('error',function(err){
	console.log(err);
});

app.listen(3000);