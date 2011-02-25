// ==========================================================================
// Project:   BodyBoard - homeView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('views/label/label_listitem');


BodyBoard.homeView = SC.View.design({
//BodyBoard.homeView = SC.SplitView.design({
	
	layout : { left: 0, right: 0, top: 0, bottom: 0 },
	childViews : 'labelsHeadingView scrollView'.w(), 
	
	
	labelsHeadingView : SC.ToolbarView.design({
		layout : { left: 0, right: 0, top: 0, height: 60 },
		classNames : 'section-heading'.w(),
		childViews : 'labelView'.w(),
		
		labelView : SC.LabelView.design({
			layout : { left: 10, top: 20 },
			value : 'Featured Labels'
		})
	}),
	
	
	scrollView : SC.ScrollView.design({
		
		layout : { left: 0, right: 0, top: 0, bottom: 0 },
		hasHorizontalScroller : NO,
		childViews : 'contentView'.w(),
		
		
		contentView : SC.ListView.design({
			
			layout : { top: 50, bottom: 0, left: 10, right: 0 },
			contentBinding : 'BodyBoard.labelsController.arrangedObjects',
			selectionBinding : 'BodyBoard.labelsController.selection',
			selectOnMouseDown : YES,
			canDeleteContent : YES,
			rowHeight: 50,
			//contentValueKey : 'name',
				
			exampleView: BodyBoard.labelListitemView,
			recordType: BodyBoard.Label,
			
		})
	
	})
	
	
	
});