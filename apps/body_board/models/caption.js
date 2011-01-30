// ==========================================================================
// Project:   BodyBoard.Caption
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Caption = SC.Record.extend(
/** @scope BodyBoard.Caption.prototype */ {

	text : SC.Record.attr(String, { isRequired: YES }),
	votes : SC.Record.attr(Number, { defaultValue: 0 }),
	
	//article : SC.Record.toOne('BodyBoard.Article', { inverse: 'captions' }),
	label : SC.Record.toOne('BodyBoard.Label', { inverse: 'captions' }),
	image : SC.Record.toOne('BodyBoard.Image', { inverse: 'caption' })

}) ;
