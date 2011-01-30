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
	
	author_guid : SC.Record.attr(Number),
	system_guid : SC.Record.attr(Number),
	
	author : function(){
		return BodyBoard.store.find(BodyBoard.Author, this.get('author_guid'));
	}.property().cacheable(),
	
	system : function(){
		return BodyBoard.store.find(BodyBoard.System, this.get('system_guid'));
	}.property().cacheable(),
	
	isTreeItemContent : YES,
	treeItemChildren : null,
	treeItemIsExpanded : NO,
	
	isLabel : function(){
		return YES;
	}
	

}) ;
