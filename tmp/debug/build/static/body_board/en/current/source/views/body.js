// ==========================================================================
// Project:   BodyBoard - bodyView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

var menuWidth = 150;
sc_require('controllers/viewer')
sc_require('views/label/label');
sc_require('views/label/drag_target');

BodyBoard.bodyView = SC.View.design({
	
	layout: { top: 0, bottom: 0, right: 0 },
	childViews : 'bodyMenuView bodyBoardView editPanelView labelsToggleView dragTargetView'.w(),
	
	bodyMenuView : SC.ScrollView.design({
		layout : { top: 0, bottom: 0, left: 0, width: menuWidth },
		hasHorizontalScroller : NO,
		layerId : 'body-menu-container',
		
		contentView : SC.ListView.design({
			rowHeight: 20,
			contentBinding : 'BodyBoard.treeNavController.arrangedObjects',
			selectionBinding : 'BodyBoard.treeNavController.selection',
			contentValueKey : 'name',
			layerId : 'body-menu',
			canEditContent : YES,
			canDeleteContent: YES,
			click : function(){
				console.log("CLick!");
				if(BodyBoard.labelController.currentLabelView !== null){
					BodyBoard.labelController.currentLabelView.hideCaptions();
				}
			}
		})
	}),
	
	editPanelView : SC.SceneView.design({
		
		layout : { left: menuWidth+2, right: 0, bottom: 0, height: 70 },
		scenes : 'createLabelView editLabelView emptyView'.w(),
		nowShowing : 'emptyView',
		
	}),
	
	labelsToggleView : SC.ButtonView.design({
		layout : { right: 10, top: 10, width: 125 },
		title : 'Show My Labels',
		action : 'requestToggleLabels',
		layerId : 'labels-toggle-button',
		isVisibleBinding : 'BodyBoard.authorsController.hasSelection'
	}),
	
	bodyBoardView : SC.View.design({
		
		layout : { top: 0, bottom: 0, right: 0, left: menuWidth+2 },
		layerId : 'body-board-view',
		
		mouseMoved: function( event ) {
			if(BodyBoard.viewerController.get('isReady') == YES){
				BodyBoard.viewerController.setMousePosition( event );
			}
		},
		


	}),
	
	
	
	
	
	
	
	dragTargetView : BodyBoard.dragTargetView.design({ //Placeholder view, overwritten dynamically when creating label 

	}),
	

});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');