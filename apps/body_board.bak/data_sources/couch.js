// ==========================================================================
// Project:   BodyBoard.CouchDataSource
// Copyright: ©2011 My Company, Inc.
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

BodyBoard.CAPTIONS_QUERY = SC.Query.local(BodyBoard.Caption, {
});




BodyBoard.CouchDataSource = SC.DataSource.extend(
/** @scope BodyBoard.CouchDataSource.prototype */ {

	/*
	*	These functions query the CouchDB databases. Rather than have a single database, we have a different
	*	database for each record type. Hence, they take a record "type" as a paramater to specify which
	*	database to query... ie "getServerView('authors','fetchAll')"
	*/
	
	getServerPath : function(type,resource){
		var path = '/' + type + '//' + resource;
		return path;
	},
	getServerView : function(type,name){
		var path = '/' + type + '/_design/apps/_view/' + name;
		return path;
	},



//====================================================================
//
//		FETCH ALL RECORDS
//
//====================================================================

  fetch: function(store, query) {

		if( query === BodyBoard.SYSTEMS_QUERY ) {
			console.log('Fetching systems');
			SC.Request.getUrl(this.getServerView('systems','fetchAll')).json()
				.header('Accept', 'application/json')
				.notify(this, 'didFetchSystems', store, query)
				.send();
			return YES;
			
		} else {
			if( query === BodyBoard.LABELS_QUERY ) {
				console.log('Fetching labels');
				SC.Request.getUrl(this.getServerView('labels','fetchAll')).json()
					.header('Accept', 'application/json')
					.notify(this, 'didFetchLabels', store, query)
					.send();
				return YES;
				
			} else {
				if( query === BodyBoard.AUTHORS_QUERY ) {
					console.log('Fetching authors');
					SC.Request.getUrl(this.getServerView('authors','fetchAll')).json()
						.header('Accept', 'application/json')
						.notify(this, 'didFetchAuthors', store, query)
						.send();
					return YES;
					
				} else {
					if( query === BodyBoard.CAPTIONS_QUERY ) {
						console.log('Fetching captions');
						SC.Request.getUrl(this.getServerView('captions','fetchAll')).json()
							.header('Accept', 'application/json')
							.notify(this, 'didFetchCaptions', store, query)
							.send();
						return YES;
						
					}
				}
			}
		}
  },

	didFetchSystems : function(response, store, query){
		if(SC.ok(response)) {
		    var body = response.get('encodedBody');
		    var couchResponse = SC.json.decode(body);
		    var records = couchResponse.rows.getEach('value');
		    store.loadRecords(BodyBoard.System, records);
		    store.dataSourceDidFetchQuery(query);
		 } else {
		    store.dataSourceDidErrorQuery(query, response);
		 }
	},
	didFetchLabels : function(response, store, query){
		if(SC.ok(response)) {
		    var body = response.get('encodedBody');
		    var couchResponse = SC.json.decode(body);
		    var records = couchResponse.rows.getEach('value');
		    store.loadRecords(BodyBoard.Label, records);
		    store.dataSourceDidFetchQuery(query);
		 } else {
		    store.dataSourceDidErrorQuery(query, response);
		 }
	},
	didFetchAuthors : function(response, store, query){
		if(SC.ok(response)) {
		    var body = response.get('encodedBody');
		    var couchResponse = SC.json.decode(body);
		    var records = couchResponse.rows.getEach('value');
		    store.loadRecords(BodyBoard.Author, records);
		    store.dataSourceDidFetchQuery(query);
		 } else {
		    store.dataSourceDidErrorQuery(query, response);
		 }
	},
	didFetchCaptions : function(response, store, query){
		if(SC.ok(response)) {
		    var body = response.get('encodedBody');
		    var couchResponse = SC.json.decode(body);
		    var records = couchResponse.rows.getEach('value');
		    store.loadRecords(BodyBoard.Caption, records);
		    store.dataSourceDidFetchQuery(query);
		 } else {
		    store.dataSourceDidErrorQuery(query, response);
		 }
	},
	




	//====================================================================
	//
	//		RETRIEVE AN INDIVIDUAL RECORD
	//
	//====================================================================
  
  retrieveRecord: function(store, storeKey) {
    
		if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.System)) {
			var id = store.idFor(storeKey);
			SC.Request.getUrl(this.getServerPath(id))
				.header('Accept', 'application/json').json()
				.notify(this, 'didRetrieveSystem', store, storeKey)
				.send();
			return YES;
		} else {
			if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Label)){
				var id = store.idFor(storeKey);
				SC.Request.getUrl(this.getServerPath(id))
					.header('Accept', 'application/json').json()
					.notify(this, 'didRetrieveLabel', store, storeKey)
					.send();
				return YES;
			} else {
				if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Caption)) {
					var id = store.idFor(storeKey);
					SC.Request.getUrl(this.getServerPath(id))
						.header('Accept', 'application/json').json()
						.notify(this, 'didRetrieveCaption', store, storeKey)
						.send();
					return YES;
				} else {
					if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Author)){
						var id = store.idFor(storeKey);
						SC.Request.getUrl(this.getServerPath(id))
							.header('Accept', 'application/json').json()
							.notify(this, 'didRetrieveAuthor', store, storeKey)
							.send();
						return YES;
					} else {
						if(SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Account)){
							var id = store.idFor(storeKey);
							SC.Request.getUrl(this.getServerPath(id))
								.header('Accept', 'application/json').json()
								.notify(this, 'didRetrieveAccount', store, storeKey)
								.send();
							return YES;
						} else {
							return NO;
						}
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
	didRetrieveCaption: function(response, store, storeKey) {
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
	




	processResponse: function(response) {
		if (SC.ok(response)) {
			var body,couchResponse,ok,id,rev;
			body = response.get('encodedBody'); 
			couchResponse = SC.json.decode(body);
			ok = couchResponse.ok;
			if (ok != YES) {
				return {"error":true, "response":couchResponse};
			}
			id = couchResponse.id;
			rev = couchResponse.rev;
			return {"ok":true, "id": id, "rev": rev};
		} else {
			return {"error":true, "response":response};
		}
	},

	getDocRev: function(doc) {
		return doc._rev;
	},


	//====================================================================
	//
	//		CREATE A NEW RECORD
	//
	//====================================================================

  createRecord: function(store, storeKey) {
    
		if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Label)) {
			
			SC.Request.postUrl(this.getServerPath('labels','/')).json()
				.header('Accept', 'application/json')
				.notify(this, this.didCreateLabel, store, storeKey)
				.send(store.readDataHash(storeKey));
			return YES;
			
		} else {
			if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Caption)) {
				
				SC.Request.postUrl(this.getServerPath('captions','/')).json()
					.header('Accept', 'application/json')
					.notify(this, this.didCreateCaption, store, storeKey)
					.send(store.readDataHash(storeKey));
				return YES;
				
			} else {
				if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Author)) {
					
					SC.Request.postUrl(this.getServerPath('authors','/')).json()
						.header('Accept', 'application/json')
						.notify(this, this.didCreateAuthor, store, storeKey)
						.send(store.readDataHash(storeKey));
					return YES;
					
				} else {
					if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Account)) {
						
						SC.Request.postUrl(this.getServerPath('accounts','/')).json()
							.header('Accept', 'application/json')
							.notify(this, this.didCreateAccount, store, storeKey)
							.send(store.readDataHash(storeKey));
						return YES;
						
					} else {
						return NO;
					}
				}
			}
		}
  },
	
	didCreateLabel: function(response, store, storeKey) {
		var couchRes = this.processResponse(response);
		if (couchRes.ok) {
			// Add _id and _rev to the local document for further server interaction.
			var localDoc = store.readDataHash(storeKey);
			localDoc._id = couchRes.id;
			localDoc._rev = couchRes.rev;
			store.dataSourceDidComplete(storeKey, localDoc, couchRes.id);
		} else {
			store.dataSourceDidError(storeKey, response);
		}
	},
	didCreateCaption: function(response, store, storeKey) {
		var couchRes = this.processResponse(response);
		if (couchRes.ok) {
			// Add _id and _rev to the local document for further server interaction.
			var localDoc = store.readDataHash(storeKey);
			localDoc._id = couchRes.id;
			localDoc._rev = couchRes.rev;
			store.dataSourceDidComplete(storeKey, localDoc, couchRes.id);
		} else {
			store.dataSourceDidError(storeKey, response);
		}
	},
	didCreateAuthor: function(response, store, storeKey) {
		var couchRes = this.processResponse(response);
		if (couchRes.ok) {
			// Add _id and _rev to the local document for further server interaction.
			var localDoc = store.readDataHash(storeKey);
			localDoc._id = couchRes.id;
			localDoc._rev = couchRes.rev;
			store.dataSourceDidComplete(storeKey, localDoc, couchRes.id);
		} else {
			store.dataSourceDidError(storeKey, response);
		}
	},
	didCreateAccount: function(response, store, storeKey) {
		var couchRes = this.processResponse(response);
		if (couchRes.ok) {
			// Add _id and _rev to the local document for further server interaction.
			var localDoc = store.readDataHash(storeKey);
			localDoc._id = couchRes.id;
			localDoc._rev = couchRes.rev;
			store.dataSourceDidComplete(storeKey, localDoc, couchRes.id);
		} else {
			store.dataSourceDidError(storeKey, response);
		}
	},
  




	//====================================================================
	//
	//		UPDATE A RECORD
	//
	//====================================================================

  updateRecord: function(store, storeKey) {

		if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Author)) {
			
			var id = store.idFor(storeKey);
			var dataHash = store.readDataHash(storeKey);
			SC.Request.putUrl(this.getServerPath(id)).json()
				.header('Accept', 'application/json')
				.notify(this, this.didUpdateAuthor, store, storeKey)
				.send(dataHash);
			return YES;
			
		} else {
			if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Account)) {
				
				var id = store.idFor(storeKey);
				var dataHash = store.readDataHash(storeKey);
				SC.Request.putUrl(this.getServerPath(id)).json()
					.header('Accept', 'application/json')
					.notify(this, this.didUpdateAccount, store, storeKey)
					.send(dataHash);
				return YES;
				
			} else {
				if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Label)) {
					
					var id = store.idFor(storeKey);
					var dataHash = store.readDataHash(storeKey);
					SC.Request.putUrl(this.getServerPath(id)).json()
						.header('Accept', 'application/json')
						.notify(this, this.didUpdateLabel, store, storeKey)
						.send(dataHash);
					return YES;
					
				} else {
					if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Caption)) {
						
						var id = store.idFor(storeKey);
						var dataHash = store.readDataHash(storeKey);
						SC.Request.putUrl(this.getServerPath(id)).json()
							.header('Accept', 'application/json')
							.notify(this, this.didUpdateCaption, store, storeKey)
							.send(dataHash);
						return YES;
						
					} else {
						return NO;
					}
				}
			}
		}

    return NO ; // return YES if you handled the storeKey
  },


	didUpdateAuthor: function(response, store, storeKey) {
	   var couchRes = this.processResponse(response);
	   if (couchRes.ok) {
	     // Update the local _rev of this document.
	     var localDoc = store.readDataHash(storeKey);
	     localDoc._rev = couchRes.rev;
	     store.dataSourceDidComplete(storeKey, localDoc) ;
	   } else {
	     store.dataSourceDidError(storeKey);
	   }
	},
	didUpdateAccount: function(response, store, storeKey) {
	   var couchRes = this.processResponse(response);
	   if (couchRes.ok) {
	     // Update the local _rev of this document.
	     var localDoc = store.readDataHash(storeKey);
	     localDoc._rev = couchRes.rev;
	     store.dataSourceDidComplete(storeKey, localDoc) ;
	   } else {
	     store.dataSourceDidError(storeKey);
	   }
	},
	didUpdateLabel: function(response, store, storeKey) {
	   var couchRes = this.processResponse(response);
	   if (couchRes.ok) {
	     // Update the local _rev of this document.
	     var localDoc = store.readDataHash(storeKey);
	     localDoc._rev = couchRes.rev;
	     store.dataSourceDidComplete(storeKey, localDoc) ;
	   } else {
	     store.dataSourceDidError(storeKey);
	   }
	},
	didUpdateCaption: function(response, store, storeKey) {
	   var couchRes = this.processResponse(response);
	   if (couchRes.ok) {
	     // Update the local _rev of this document.
	     var localDoc = store.readDataHash(storeKey);
	     localDoc._rev = couchRes.rev;
	     store.dataSourceDidComplete(storeKey, localDoc) ;
	   } else {
	     store.dataSourceDidError(storeKey);
	   }
	},
  



	//====================================================================
	//
	//		DELETE A RECORD
	//
	//====================================================================

  destroyRecord: function(store, storeKey) {
    
		if (SC.kindOf(store.recordTypeFor(storeKey), BodyBoard.Caption)) {
			
			var id = store.idFor(storeKey);
			//var rev = this._docsRev[id];
			var dataHash = store.readDataHash(storeKey);
			var rev = this.getDocRev(dataHash);
			SC.Request.deleteUrl(this.getServerPath(id + "?rev=" + rev)).json()
				.header('Accept', 'application/json')
				.notify(this, this.didDeleteCaption, store, storeKey)
				.send();
			return YES;
			
		} else {
			return NO;
		}
    
    return NO ; // return YES if you handled the storeKey
  },

	didDeleteCaption: function(response, store, storeKey) {
		var couchRes = this.processResponse(response);
		if (couchRes.ok) {
			store.dataSourceDidDestroy(storeKey);
		} else {
			store.dataSourceDidError(response);
		}
	}
  
}) ;
