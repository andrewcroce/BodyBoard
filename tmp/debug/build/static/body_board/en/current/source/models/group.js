// ==========================================================================
// Project:   BodyBoard.Group
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Group = SC.Record.extend(
/** @scope BodyBoard.Group.prototype */ {

	name : SC.Record.attr(String, { isRequired: YES }),
	accounts : SC.Record.toMany('BodyBoard.Account', { inverse : 'group' })

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');