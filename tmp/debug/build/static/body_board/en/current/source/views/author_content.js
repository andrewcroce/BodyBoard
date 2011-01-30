// ==========================================================================
// Project:   BodyBoard - authorContentView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */


BodyBoard.authorContentView = SC.SplitView.design({
	
		
		layout : { top: 0, bottom: 0, left: 0, right:0 },
		backgroundColor : 'white',
		layoutDirection : SC.LAYOUT_VERTICAL,
		autoresizeBehavior : SC.RESIZE_TOP_LEFT,
		
		childViews : 'topLeftView bottomRightView'.w(),
		
		
		
		topLeftView : SC.ScrollView.design({
			
			layout : { left: 0, right: 0, top: 0  },
			hasHorizontalScroller : NO,
			
			contentView : SC.View.design({
				
				layout : { left: 0, right: 0, top: 0, bottom: 0 },
				contentBinding : 'BodyBoard.authorController.content',
				childViews : 'articlesHeadingView articlesListView'.w(),

				articlesHeadingView : SC.ToolbarView.design({
					layout : { left: 0, right: 0, top: 0, height: 30 },

					childViews : 'labelView'.w(),

					labelView : SC.LabelView.design({
						layout : { left: 10 , top: 5 },
						contentBinding : 'BodyBoard.authorController.content',
						contentValueKey : 'fullName',
						//contentDidChange: function() {console.log('content changed [%@]'.fmt(this.get('content')))}.observes('content')
					})

				}),
				
				articlesListView : SC.ListView.design({
					layout : { top: 40, bottom: 0, left: 10, right: 0 },
					contentBinding : 'BodyBoard.authorArticlesController.arrangedObjects',
					selectionBinding : 'BodyBoard.articlesController.selection',
					//selectOnMouseDown : YES,
					rowHeight: 100,
					//contentValueKey : 'title',
					exampleView: BodyBoard.authorArticleListitemView,
					recordType: BodyBoard.Article
				})
				
			})
			
		}),
		
		
		
		
		
		bottomRightView : SC.ScrollView.design({
			
			layout : { left: 0, right: 0, bottom: 0 },
			hasHorizontalScroller : NO,
			
			contentView : SC.View.design({
				
			})
			
		})
		
		
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');