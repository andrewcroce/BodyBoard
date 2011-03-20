// ==========================================================================
// Project:   BodyBoard.User
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.User = SC.Record.extend(
/** @scope BodyBoard.User.prototype */ {

	primaryKey : '_id',
	
	name : SC.Record.attr(String, { isRequired: YES }),
	password_sha : SC.Record.attr(String),
	salt : SC.Record.attr(String),
	type : SC.Record.attr(String,{ defaultValue: 'user' }),
	roles : [],
	author_id : SC.Record.attr(Number),
	author : function(){
		return BodyBoard.store.find(BodyBoard.Author,this.get('author_id'));
	}.property().cacheable(),
	
	
	backup : function(){
		console.log('Properties:',this.get('attributes'));
		var backup = SC.Object.create();
		for (var i = 0; i < this.attributes.length; i++) {
			var p = this.attributes[i];
			backup.set(p, this.get(p));
		}
		return backup;
	},
	
	restore : function(backup) {
		for (var i = 0; i < this.attributes.length; i++) {
			var p = this.attributes[i];
			this.set(p, backup.get(p));
		}
		return;
	}
	


}) ;