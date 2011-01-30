// ==========================================================================
// Project:   BodyBoard - authorsView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.authorsView = SC.ListView.design({
	
	layout : { left: 10, right: 10, top: 10, bottom: 10 },
	contentBinding : 'BodyBoard.authorsController.arrangedObjects',
	selectionBinding : 'BodyBoard.authorsController.selection',
	selectOnMouseDown : YES,
	rowHeight: 60,
	exampleView: BodyBoard.authorListitemView,
	recordType: BodyBoard.Author
	
});