"use strict"

var task = process.argv.slice(2)[0]; 
switch(task){
	case 'setup':
			var KaomojiService = require('./kaomojiservice')
			KaomojiService.setup()
		break;
}