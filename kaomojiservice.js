"use strict"
var Kaomoji = require('./kaomoji');
var _ = require('lodash');
var bluebird = require('bluebird')
var elastic = require('elasticsearch');
var client = new elastic.Client({
	host: process.env.ELASTICSEARCH_URL,
	log: 'trace',
	defer: function(){
		return bluebird.defer()
	}
});

class KaomojiService {
	constructor(){}

	static getEmoji(search){
		search = search || '';

		var searchArray = search.split(' ');
		searchArray.push('all');
		
		var searchBase = {
			index: 'kaomoji',
			type: 'parts',
			body: {}
		}
		var partTypes = ['eyes','mouth','arms','decoration','cheeks'];

		var queries = _.reduce(partTypes,function(result,type){
			result.push({_index:'kaomoji',_type:'parts'})
			result.push({query:{
				bool: {
					must: [
						{ terms: { tags: searchArray }},
						{ term: { type: type}}
					]
				}
			}})
			return result;
		},[]);
		
		return client.msearch(_.merge({},searchBase,{
			body:queries
		})).then(function(response){
			var selectedParts = _.reduce(partTypes,function(result, type, i){
				result[type] = _.sample(response.responses[i].hits.hits)._source
				return result;
			},{});	
			return new Kaomoji(selectedParts).toString();
		})
	}

	static setup(){
		var promise = client.indices.delete({
			index: 'kaomoji'
		}).finally(function(){
			client.indices.create({
				index: 'kaomoji',
				body:{
					mappings:{
						parts:{
							properties:{
								type: {type:"string"},
								tags: {type:"string"},
								content: {type:"nested", index:"no"},
								meta: {type:"nested", index:"no"}
							}
						}
					}
				}
			}).then(KaomojiService.reindex)
			.then(function(){
				console.log('Indexing OK!');
			})
			.catch(function(err){
				console.log(err);
			});
		});
	}

	static reindex(){
		var eyes = require('./parts/eyes');
		var mouths = require('./parts/mouths');
		var arms = require('./parts/arms');
		var cheeks = require('./parts/cheeks');
		var decorations = require('./parts/decorations');

		eyes = _.map(eyes,function(item){
			let result = {
				type: 'eyes',
				content: {},
				tags: ['all']
			};
			if(item.equal){
				result.content.left = result.content.right = item.eye;
			}else{
				result.content.left = item.left;
				result.content.right = item.right;
			}
			if(item.tags && item.tags.length){
				result.tags = result.tags.concat(item.tags);
			}
			return result;
		});

		mouths = _.map(mouths,function(item){
			let result = {
				type: 'mouth',
				content: {
					value: item.value
				},
				tags: ['all']
			}
			if(item.tags && item.tags.length){
				result.tags = result.tags.concat(item.tags)
			}
			return result;
		});

		arms = _.map(arms,function(item){
			let result = {
				type: 'arms',
				content: {},
				meta:{},
				tags: ['all']
			}

			if(item.left){
				result.content.left = item.left.value;
				if(item.left.isInner){
					result.meta.isLeftInner = true;
				}

			}
			if(item.right){
				result.content.right = item.right.value;
				if(item.right.isInner){
					result.meta.isRightInner = true;
				}

			}

			if(item.tags && item.tags.length){
				result.tags = result.tags.concat(item.tags)
			}
			return result;
		});

		cheeks = _.map(cheeks,function(item){
			let result = {
				type: 'cheeks',
				content: {
					left: item.left,
					right: item.right
				},
				tags: ['all']
			}

			if(item.tags && item.tags.length){
				result.tags = result.tags.concat(item.tags)
			}
			return result;
		});

		decorations = _.map(decorations,function(item){
			let result = {
				type: 'decoration',
				content: {
					value: item.value
				},
				meta: {
					location: item.location
				},
				tags: ['all']
			}

			if(item.tags && item.tags.length){
				result.tags = result.tags.concat(item.tags)
			}

			return result;
		});

		return KaomojiService.bulkIndex(_.concat(eyes,arms,mouths,cheeks,decorations));
	}

	static bulkIndex(items){
		var tasks = _.reduce(items,function(result,item){
			result.push({
				index:{	
					_index: 'kaomoji',
					_type: 'parts'
				}
			});
			result.push(item);
			return result;
		},[]);

		return client.bulk({body:tasks})
	}
}

module.exports = KaomojiService;

