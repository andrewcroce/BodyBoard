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
	url : SC.Record.attr(String),

	labels : SC.Record.toMany('BodyBoard.Label', { inverse: 'system' }),
	
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
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');