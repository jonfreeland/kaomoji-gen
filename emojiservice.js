"use strict"

var elastic = require('elasticsearch');
var client = new elastic.Client({
	host: process.env.ELASTICSEARCH_URL,
	log: 'trace'
});

class EmojiService {
	constructor(){
		console.log('hello');
	}

	static setup(){
		console.log('running setup');
		client.indices.delete({
			index: 'kaomoji'
		}).then(function(){
			return client.indices.create({
				index: 'kaomoji',
				body:{
					mappings:{
						parts:{
							properties:{
								type: {type:"string"},
								tags: {type:"string"},
								content: {type:"nested",index:"no"}
							}
						}
					}
				}
			})
			
		}).then(function(res){
			console.log(res);
		}).catch(function(err){
			console.log(err);
		});

	}
}

module.exports = EmojiService;

