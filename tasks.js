"use strict"

var KaomojiService = require('./kaomojiservice')

var task = process.argv.slice(2)[0]; 
switch(task){
	case 'setup':
			KaomojiService.setup()
		break;
}