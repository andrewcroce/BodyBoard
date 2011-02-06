// ==========================================================================
// Project:   BodyBoard.System
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.System = SC.Record.extend(
	SC.TreeItemContent,
/** @scope BodyBoard.System.prototype */ {

	name : SC.Record.attr(String),
	src : SC.Record.attr(String),

	labels : function(){
		var query = SC.Query.local(BodyBoard.Label,'system = {system}',{ system : this }); 
		return BodyBoard.store.find(query);
	}.property().cacheable(),
	
	isTreeItemContent : YES,
	treeItemIsExpanded : YES,
	//treeItemChildrenKey : 'labels',
	treeItemChildren : function(){
	
		return this.get('labels');
		
	}.property().cacheable(),
	
	isSystem : function(){
		return YES;
	}

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');