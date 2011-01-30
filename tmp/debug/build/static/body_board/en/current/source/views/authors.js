// ==========================================================================
// Project:   BodyBoard - authorsView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.authorsView = SC.ListView.design({
	
	contentBinding : 'BodyBoard.authorsController.arrangedObjects',
	selectionBinding : 'BodyBoard.authorsController.selection',
	selectOnMouseDown : YES,
	rowHeight: 40,
	exampleView: BodyBoard.AuthorListitemView,
	recordType: BodyBoard.Author
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');