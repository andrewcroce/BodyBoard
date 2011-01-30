// ==========================================================================
// Project:   BodyBoard - homeView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.homeView = SC.SplitView.design({
	
	layout : { left: 0, right: 0, top: 0, bottom: 0 },
	layoutDirection : SC.LAYOUT_VERTICAL,
	childViews : 'topLeftView bottomRightView'.w(),
	
	topLeftView : SC.ScrollView.design({
		
		layout : { left: 0, right: 0, top: 0, bottom: 0 },
		hasHorizontalScroller : NO,
		
		contentView : SC.View.design({
			
			layout : { left: 0, right: 0, top: 0, bottom: 0 },
			childViews : 'articlesHeadingView articlesListView'.w(),
			
			articlesHeadingView : SC.ToolbarView.design({
				layout : { left: 0, right: 0, top: 0, height: 30 },
				
				childViews : 'labelView'.w(),
				
				labelView : SC.LabelView.design({
					layout : { left: 10 , top: 5},
					value : 'Featured Articles',
				})
				
			}),
			
			articlesListView : SC.ListView.design({
				layout : { top: 40, bottom: 0, left: 10, right: 0 },
				contentBinding : 'BodyBoard.articlesController.content',
				selectionBinding : 'BodyBoard.articlesController.selection',
				selectOnMouseDown : YES,
				rowHeight: 100,
				exampleView: BodyBoard.articleListitemView,
				recordType: BodyBoard.Article
			})
			
		})
		
	}),
	
	
	bottomRightView : SC.ScrollView.design({
		
		layout : { left: 0, right: 0, top: 0, bottom: 0 },
		hasHorizontalScroller : NO,
		
		contentView : SC.View.design({
			
			layout : { left: 0, right: 0, top: 0, bottom: 0 },
			
			childViews : 'labelsHeadingView'.w(),
			
			labelsHeadingView : SC.ToolbarView.design({
				layout : { left: 0, right: 0, top: 0, height: 30 },
				childViews : 'labelView'.w(),
				
				labelView : SC.LabelView.design({
					layout : { left: 20, top: 5 },
					value : 'Featured Labels',
				}),
			}),
			/*
			labelsListView : SC.ListView.design({
				layout : { top: 40, bottom: 0, left: 10, right: 0 },
				contentBinding : 'BodyBoard.labelsController.content',
				selectionBinding : 'BodyBoard.labelsController.selection',
				selectOnMouseDown : YES,
				rowHeight: 100,
				exampleView: BodyBoard.labelListitemView,
				recordType: BodyBoard.Label
			})
		*/
		})
	
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');