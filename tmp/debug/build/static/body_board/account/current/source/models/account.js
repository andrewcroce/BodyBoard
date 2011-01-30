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

	verified : SC.Record.attr(Boolean, { defaultValue: NO } ),
	email : SC.Record.attr(String, { isRequired: YES }),
	password : SC.Record.attr(String, { isRequired: YES, isPassword: YES }),
	created : SC.Record.attr(Date),
	
	author : SC.Record.toOne('BodyBoard.Author', { inverse: 'account' }),
	group : SC.Record.toOne('BodyBoard.Group', { inverse: 'accounts' } )

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');