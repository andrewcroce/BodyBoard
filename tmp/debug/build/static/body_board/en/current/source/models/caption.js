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
	
	label_id : SC.Record.attr(String),
	label : function(){
		return BodyBoard.store.find(BodyBoard.Label,this.get('label_id'));	
	}.property().cacheable(),
	
	author_id : SC.Record.attr(String),
	author : function(){
		return BodyBoard.store.find(BodyBoard.Author,this.get('author_id'));
	}.property().cacheable(),
	//image : SC.Record.toOne('BodyBoard.Image', { inverse: 'caption' })
	
	backup : function(){
		var backup = SC.Object.create();
		for (var i = 0; i < this.properties.length; i++) {
			var p = this.properties[i];
			backup.set(p, this.get(p));
		}
		return backup;
	},
	
	restore : function(backup) {
		for (var i = 0; i < this.properties.length; i++) {
			var p = this.properties[i];
			this.set(p, backup.get(p));
		}
		return;
	}

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');