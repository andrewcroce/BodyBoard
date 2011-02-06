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
	
	label_guid : SC.Record.attr(Number),
	label : function(){
		return BodyBoard.store.find(BodyBoard.Label,this.get('label_guid'));	
	}.property().cacheable(),
	wimage : SC.Record.toOne('BodyBoard.Image', { inverse: 'caption' })

}) ;
