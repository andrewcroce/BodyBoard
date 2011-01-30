// ==========================================================================
// Project:   BodyBoard - bodyView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.bodyView = SC.View.design({
	
	layout: { top: 0, bottom: 0, right: 0 },
	childViews : 'bodyMenuView bodyBoardView'.w(),
	
	bodyMenuView : SC.ScrollView.design({
		layout : { top: 0, bottom: 0, left: 0, width: 150 },
		hasHorizontalScroller : NO,
		
		contentView : SC.ListView.design({
			rowHeight: 20,
			contentBinding : 'BodyBoard.systemsController.arrangedObjects',
			selectionBinding : 'BodyBoard.systemsController.selection',
			contentValueKey : 'name',
			canEditContent : NO,
			canDeleteContent: NO,
		})
	}),
	
	bodyBoardView : BodyBoard.bodyBoardView.design({
		
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');