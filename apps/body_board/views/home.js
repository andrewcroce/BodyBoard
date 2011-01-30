// ==========================================================================
// Project:   BodyBoard - homeView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('views/label/label_listitem');


BodyBoard.homeView = SC.View.design({
//BodyBoard.homeView = SC.SplitView.design({
	
	layout : { left: 0, right: 0, top: 0, bottom: 0 },
	//layoutDirection : SC.LAYOUT_VERTICAL,
	childViews : 'scrollView'.w(),  //'topLeftView bottomRightView'.w(),
	
	/*
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
				contentBinding : 'BodyBoard.articlesController.arrangedObjects',
				selectionBinding : 'BodyBoard.articlesController.selection',
				selectOnMouseDown : YES,
				rowHeight: 100,
				//contentValueKey : 'title',
				exampleView: BodyBoard.articleListitemView,
				recordType: BodyBoard.Article
			})
			
		})
		
	}),
	*/
	
	
	scrollView : SC.ScrollView.design({
	//bottomRightView : SC.ScrollView.design({
		
		layout : { left: 0, right: 0, top: 0, bottom: 0 },
		hasHorizontalScroller : NO,
		
		contentView : SC.View.design({
			
			layout : { left: 0, right: 0, top: 0, bottom: 0 },
			
			childViews : 'labelsHeadingView labelsListView'.w(),
			
			labelsHeadingView : SC.ToolbarView.design({
				layout : { left: 0, right: 0, top: 0, height: 60 },
				classNames : 'section-heading'.w(),
				childViews : 'labelView'.w(),
				
				labelView : SC.LabelView.design({
					layout : { left: 10, top: 20 },
					value : 'Featured Labels'
				})
			}),
			
			labelsListView : SC.ListView.design({
				layout : { top: 50, bottom: 0, left: 10, right: 0 },
				contentBinding : 'BodyBoard.labelsController.arrangedObjects',
				selectionBinding : 'BodyBoard.labelsController.selection',
				selectOnMouseDown : YES,
				rowHeight: 50,
				//contentValueKey : 'name',
				
				exampleView: BodyBoard.labelListitemView,
				recordType: BodyBoard.Label
			})
			
		})
	
	})
	
	
	
});