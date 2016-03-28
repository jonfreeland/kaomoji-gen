
require('dotenv').config({silent:true});

var koa = require('koa');
var app = koa()
var EmojiService = require('./emojiservice')


EmojiService.setup()
app.use(function *(){
	this.body = `hello ${this.query.hello}`;
});

app.on('error',function(err){
	console.log('err');
});

app.listen(3000);