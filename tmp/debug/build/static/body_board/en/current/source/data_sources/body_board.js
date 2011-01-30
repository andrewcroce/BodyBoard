// ==========================================================================
// Project:   BodyBoard.BodyBoardDataSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/


sc_require('models/author');
sc_require('models/system');
sc_require('models/label');


BodyBoard.AUTHORS_QUERY = SC.Query.local(BodyBoard.Author, {
  orderBy: 'title,lastName'
});

BodyBoard.SYSTEMS_QUERY = SC.Query.local(BodyBoard.System, {
  orderBy: 'name'
});

BodyBoard.LABELS_QUERY = SC.Query.local(BodyBoard.Label, {
  orderBy: 'name'
});


BodyBoard.BodyBoardDataSource = SC.DataSource.extend(
/** @scope BodyBoard.BodyBoardDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  // 

	fetch: function(store, query) {

    // TODO: Add handlers to fetch data for specific queries.  
    // call store.dataSourceDidFetchQuery(query) when done.

		if( query === BodyBoard.SYSTEMS_QUERY ) {
			SC.Request.getUrl('/server/system').header({'Accept': 'application/json'}).json()
			.notify(this, 'didFetchSystems', store, query)
			.send();
			return YES;
		} else {
			if( query === BodyBoard.LABELS_QUERY ) {
				SC.Request.getUrl('/server/label').header({'Accept': 'application/json'}).json()
				.notify(this, 'didFetchLabels', store, query)
				.send();
				return YES;
			} else {
				if( query === BodyBoard.AUTHORS_QUERY ) {
					SC.Request.getUrl('/server/author').header({'Accept': 'application/json'}).json()
					.notify(this, 'didFetchAuthors', store, query)
					.send();
					return YES;
				} else {
					
					return NO;
					
				}
			}
		}
		
	},

	didFetchAuthors : function(response, store, query){
		if (SC.ok(response)) {
		    store.loadRecords(BodyBoard.Author, response.get('body').content);
		    store.dataSourceDidFetchQuery(query);
			console.log('Author records fetched');
		} else store.dataSourceDidErrorQuery(query, response);
	},
	didFetchSystems : function(response, store, query){
		if (SC.ok(response)) {
		    store.loadRecords(BodyBoard.System, response.get('body').content);
		    store.dataSourceDidFetchQuery(query);
			console.log('System records fetched');
		} else store.dataSourceDidErrorQuery(query, response);
	},
	didFetchLabels : function(response, store, query){
		if (SC.ok(response)) {
		    store.loadRecords(BodyBoard.Label, response.get('body').content);
		    store.dataSourceDidFetchQuery(query);
			console.log('Label records fetched');
		} else store.dataSourceDidErrorQuery(query, response);
	},








  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    
    if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.System)) {

	    var url = store.idFor(storeKey);
	    SC.Request.getUrl(url).header({
	                'Accept': 'application/json'
	            }).json()
	      .notify(this, 'didRetrieveSystem', store, storeKey)
	      .send();
	    return YES;

	  } else {
		if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Label)){
			var url = store.idFor(storeKey);
		    SC.Request.getUrl(url).header({
		                'Accept': 'application/json'
		            }).json()
		      .notify(this, 'didRetrieveLabel', store, storeKey)
		      .send();
		    return YES;
		} else {
			if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Author)) {
				var url = store.idFor(storeKey);
			    SC.Request.getUrl(url).header({
			                'Accept': 'application/json'
			            }).json()
			      .notify(this, 'didRetrieveAuthor', store, storeKey)
			      .send();
			    return YES;
			} else {
				if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Account)){
					var url = store.idFor(storeKey);
				    SC.Request.getUrl(url).header({
				                'Accept': 'application/json'
				            }).json()
				      .notify(this, 'didRetrieveAccount', store, storeKey)
				      .send();
				    return YES;
				} else {
					return NO;
				}
			}
		}
	}
  },
	didRetrieveSystem: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    var dataHash = response.get('body').content;
	    store.dataSourceDidComplete(storeKey, dataHash);

	  } else store.dataSourceDidError(storeKey, response);
	},
	didRetrieveLabel: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    var dataHash = response.get('body').content;
	    store.dataSourceDidComplete(storeKey, dataHash);

	  } else store.dataSourceDidError(storeKey, response);
	},
	didRetrieveAuthor: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    var dataHash = response.get('body').content;
	    store.dataSourceDidComplete(storeKey, dataHash);

	  } else store.dataSourceDidError(storeKey, response);
	},
	didRetrieveAccount: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    var dataHash = response.get('body').content;
	    store.dataSourceDidComplete(storeKey, dataHash);

	  } else store.dataSourceDidError(storeKey, response);
	},
	
	
	
	
	
	
	
  
  createRecord: function(store, storeKey) {
    
    	if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Label)) {

	    SC.Request.postUrl('server/label').header({
	                'Accept': 'application/json'
	            }).json()
	      .notify(this, this.didCreateLabel, store, storeKey)
	      .send(store.readDataHash(storeKey));
	    	return YES;
		} else {
			if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Author)){
				SC.Request.postUrl('server/author').header({
			                'Accept': 'application/json'
			            }).json()
			      .notify(this, this.didCreateAuthor, store, storeKey)
			      .send(store.readDataHash(storeKey));
			    	return YES;
			} else {
				if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Account)){
					SC.Request.postUrl('server/account').header({
				                'Accept': 'application/json'
				            }).json()
				      .notify(this, this.didCreateAccount, store, storeKey)
				      .send(store.readDataHash(storeKey));
				    	return YES;
				}
			}
		} 
	
  },
	didCreateLabel: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    // Adapted from parseUri 1.2.2
	    // (c) Steven Levithan <stevenlevithan.com>
	    // MIT License
	    var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	    var url = parser.exec(response.header('Location'))[8];
	    store.dataSourceDidComplete(storeKey, null, url); // update url

	  } else store.dataSourceDidError(storeKey, response);
	},
	didCreateAuthor: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    // Adapted from parseUri 1.2.2
	    // (c) Steven Levithan <stevenlevithan.com>
	    // MIT License
	    var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	    var url = parser.exec(response.header('Location'))[8];
	    store.dataSourceDidComplete(storeKey, null, url); // update url

	  } else store.dataSourceDidError(storeKey, response);
	},
	didCreateAccount: function(response, store, storeKey) {
	  if (SC.ok(response)) {
	    // Adapted from parseUri 1.2.2
	    // (c) Steven Levithan <stevenlevithan.com>
	    // MIT License
	    var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	    var url = parser.exec(response.header('Location'))[8];
	    store.dataSourceDidComplete(storeKey, null, url); // update url

	  } else store.dataSourceDidError(storeKey, response);
	},







  updateRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },
  
  destroyRecord: function(store, storeKey) {
    
    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');