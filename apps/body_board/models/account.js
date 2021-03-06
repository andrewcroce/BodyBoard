// ==========================================================================
// Project:   BodyBoard.Account
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Account = SC.Record.extend(
/** @scope BodyBoard.Account.prototype */ {

	primaryKey : '_id',
	
	verified : SC.Record.attr(Boolean, { defaultValue: NO } ),
	email : SC.Record.attr(String, { isRequired: YES }),
	password : SC.Record.attr(String, { isRequired: YES, isPassword: YES }),
	created : SC.Record.attr(Date),
	
	author_id : SC.Record.attr(Number),
	author : function(){
		return BodyBoard.store.find(BodyBoard.Author,this.get('author_id'));
	}.property().cacheable(),
	
	group_id : SC.Record.attr(Number),
	group : function(){
		return BodyBoard.store.find(BodyBoard.Group,this.get('group_id'));
	}.property().cacheable()
	
	
	
	//author : SC.Record.toOne('BodyBoard.Author', { inverse: 'account' }),
	//group : SC.Record.toOne('BodyBoard.Group', { inverse: 'accounts' } )

}) ;
