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

	name : SC.Record.attr(String, { isRequired: YES }),
	x : SC.Record.attr(Number),
	y : SC.Record.attr(Number),
	
	author : SC.Record.toOne('BodyBoard.Author', { inverse: 'labels' }),
	system : SC.Record.toOne('BodyBoard.System', { inverse: 'labels' }),
	
	isTreeItemContent : YES,
	treeItemChildren : null,
	treeItemIsExpanded : NO,
	

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');