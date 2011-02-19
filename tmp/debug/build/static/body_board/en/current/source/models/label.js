// ==========================================================================
// Project:   BodyBoard.Label
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Label = SC.Record.extend(
	SC.TreeItemContent,
/** @scope BodyBoard.Label.prototype */ {

	primaryKey : '_id',
	
	name : SC.Record.attr(String, { isRequired: YES }),
	x : SC.Record.attr(Number),
	y : SC.Record.attr(Number),
	
	author_id : SC.Record.attr(Number),
	system_id : SC.Record.attr(Number),
	
	author : function(){
		return BodyBoard.store.find(BodyBoard.Author, this.get('author_id'));
	}.property().cacheable(),
	
	system : function(){
		return BodyBoard.store.find(BodyBoard.System, this.get('system_id'));
	}.property().cacheable(),
	
	captions : function(){
		var query = SC.Query.local(BodyBoard.Caption,'label = {label}',{ label : this }); 
		return BodyBoard.store.find(query);
	}.property().cacheable(),
	
	
	isTreeItemContent : YES,
	treeItemChildren : null,
	treeItemIsExpanded : NO,
	
	isLabel : function(){
		return YES;
	}
	

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');