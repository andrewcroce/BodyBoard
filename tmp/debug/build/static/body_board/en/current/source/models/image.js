// ==========================================================================
// Project:   BodyBoard.Image
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Image = SC.Record.extend(
/** @scope BodyBoard.Image.prototype */ {

	name : SC.Record.attr(String, { isRequired: YES }),
	width : SC.Record.attr(Number),
	height : SC.Record.attr(Number),
	source : SC.Record.attr(String),
	
	author : SC.Record.toOne('BodyBoard.Author', { inverse: 'images' }),
	caption : SC.Record.toOne('BodyBoard.Caption', { inverse: 'image' })

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');