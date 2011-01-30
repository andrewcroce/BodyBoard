// ==========================================================================
// Project:   BodyBoard.Comment
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Comment = SC.Record.extend(
/** @scope BodyBoard.Comment.prototype */ {

	text : SC.Record.attr(String, { isRequired: YES }),
	
	author : SC.Record.toOne('BodyBoard.Author', { inverse: 'comments' }),
	article : SC.Record.toOne('BodyBoard.Article', { inverse: 'comments' })

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');