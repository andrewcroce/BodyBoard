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

	primaryKey : '_id',
	
	text : SC.Record.attr(String, { isRequired: YES }),
	votes : SC.Record.attr(Number, { defaultValue: 0 }),
	
	label_id : SC.Record.attr(Number),
	label : function(){
		return BodyBoard.store.find(BodyBoard.Label,this.get('label_id'));	
	}.property().cacheable(),
	//image : SC.Record.toOne('BodyBoard.Image', { inverse: 'caption' })

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');