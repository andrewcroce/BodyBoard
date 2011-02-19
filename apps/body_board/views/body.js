// ==========================================================================
// Project:   BodyBoard - bodyView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

var menuWidth = 130;
sc_require('views/label/label');
sc_require('views/label/drag_target');

BodyBoard.bodyView = SC.View.design({
	
	layout: { top: 0, bottom: 0, right: 0 },
	childViews : 'bodyMenuView bodyBoardView editPanelView dragTargetView'.w(),
	
	bodyMenuView : SC.ScrollView.design({
		layout : { top: 0, bottom: 0, left: 0, width: menuWidth },
		hasHorizontalScroller : NO,
		
		contentView : SC.ListView.design({
			rowHeight: 20,
			contentBinding : 'BodyBoard.treeNavController.arrangedObjects',
			selectionBinding : 'BodyBoard.treeNavController.selection',
			contentValueKey : 'name',
			layerId : 'body-menu',
			canEditContent : YES,
			canDeleteContent: YES,
		})
	}),
	
	bodyBoardView : SC.View.design({
		
		layout : { top: 0, bottom: 0, right: 0, left: menuWidth+2 },
		layerId : 'body-board-view',
		
		mouseMoved: function( event ) {
			BodyBoard.viewerController.setMousePosition( event );
		},

	}),
	
	
	editPanelView : SC.SceneView.design({
		
		layout : { left: menuWidth+2, right: 0, bottom: 0, height: 70 },
		scenes : 'createLabelView emptyView'.w(),
		nowShowing : 'emptyView',
		
	}),
	
	
	
	
	dragTargetView : BodyBoard.dragTargetView.design({ //Placeholder view, overwritten dynamically when creating label 

	}),
	

});