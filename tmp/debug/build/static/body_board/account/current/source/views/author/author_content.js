// ==========================================================================
// Project:   BodyBoard - authorContentView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('views/label/author_label_listitem');


//BodyBoard.authorContentView = SC.SplitView.design({
BodyBoard.authorContentView = SC.SplitView.design({
	
		
		layout : { top: 0, bottom: 0, left: 0, right:0 },
		backgroundColor : 'white',
		layoutDirection : SC.LAYOUT_VERTICAL,
		autoresizeBehavior : SC.RESIZE_TOP_LEFT,
		
		childViews : 'topLeftView bottomRightView'.w(),
		//childViews : 'scrollView'.w(),
		
		/*
		topLeftView : SC.ScrollView.design({
			
			layout : { left: 0, right: 0, top: 0  },
			hasHorizontalScroller : NO,
			backgroundColor : 'red',
			
			contentView : SC.View.design({
				
				layout : { left: 0, right: 0, top: 0, bottom: 0 },
				contentBinding : 'BodyBoard.authorController.content',
				childViews : 'authorHeadingView createArticleButtonView articlesHeadingView articlesListView'.w(),

				authorHeadingView : SC.ToolbarView.design({
					layout : { left: 0, right: 0, top: 0, height: 30 },

					childViews : 'labelView'.w(),

					labelView : SC.LabelView.design({
						layout : { left: 10 , top: 5 },
						contentBinding : 'BodyBoard.authorController.content',
						contentValueKey : 'fullName',
						//contentDidChange: function() {console.log('content changed [%@]'.fmt(this.get('content')))}.observes('content')
					})

				}),
				
				articlesHeadingView : SC.LabelView.design({
					layout : { top: 40, left: 10 },
					value : "My Articles"
				}),
				
				createArticleButtonView : SC.ButtonView.design({
					layout : { top: 40, right: 10, width: 150, height: 25 },
					title : 'Create New Article'
				}),
				
				articlesListView : SC.ListView.design({
					layout : { top: 70, bottom: 0, left: 10, right: 10 },
					contentBinding : 'BodyBoard.authorArticlesController.arrangedObjects',
					selectionBinding : 'BodyBoard.articlesController.selection',
					selectOnMouseDown : YES,
					rowHeight: 100,
					exampleView: BodyBoard.authorArticleListitemView,
					recordType: BodyBoard.Article
				})
				
			})
			
		}),
		*/
		
		topLeftView : SC.ScrollView.design({
			
			layout : { left: 0, right: 0, top: 0 },
			hasHorizontalScroller : NO,
			backgroundColor : 'red',
			
			
			contentView : SC.View.design({
				
				layout : { left: 0, right: 0, top: 0, bottom: 0 },
				contentBinding : 'BodyBoard.authorController.content',
				childViews : 'authorHeadingView labelsHeadingView createLabelButtonView labelsListView'.w(),
				
				authorHeadingView : SC.ToolbarView.design({
					layout : { left: 0, right: 0, top: 0, height: 30 },

					childViews : 'labelView'.w(),

					labelView : SC.LabelView.design({
						layout : { left: 10 , top: 5 },
						contentBinding : 'BodyBoard.authorController.content',
						contentValueKey : 'fullName',
					})

				}),
				
				labelsHeadingView : SC.LabelView.design({
					layout : { top: 40, left: 10 },
					value : "My Labels"
				}),
				
				createLabelButtonView : SC.ButtonView.design({
					layout : { top: 40, right: 10, width: 130, height: 25 },
					title : 'Create New Label',
					action : 'requestCreateLabel'
				}),
				
				labelsListView : SC.ListView.design({
					layout : { top: 70, bottom: 0, left: 10, right: 10 },
					contentBinding : 'BodyBoard.authorLabelsController.arrangedObjects',
					selectionBinding : 'BodyBoard.labelsController.selection',
					selectOnMouseDown : YES,
					rowHeight: 100,
					exampleView: BodyBoard.authorLabelListitemView,
					recordType: BodyBoard.Label
				})
				
			})
			
		}),
		
		
		bottomRightView : SC.ScrollView.design({
			
			layout : { left: 0, right: 0, bottom: 0 },
			hasHorizontalScroller : NO,
			backgroundColor : 'red',
			
			contentView : SC.View.design({
				
				layout : { left: 0, right: 0, top: 0, bottom: 0 },
				contentBinding : 'BodyBoard.authorController.content',
				childViews : 'captionsHeadingView createCaptionButtonView captionsListView'.w(),
				
				captionsHeadingView : SC.LabelView.design({
					layout : { top: 10, left: 10 },
					value : "My Captions"
				}),
				
				createCaptionButtonView : SC.ButtonView.design({
					layout : { top: 10, right: 10, width: 150, height: 25 },
					title : 'Create New Caption'
				}),
				
				captionsListView : SC.ListView.design({
					layout : { top: 40, bottom: 0, left: 10, right: 10 },
					/*
					contentBinding : 'BodyBoard.authorCaptionsController.arrangedObjects',
					selectionBinding : 'BodyBoard.captionsController.selection',
					selectOnMouseDown : YES,
					rowHeight: 100,
					exampleView: BodyBoard.authorCaptionListitemView,
					recordType: BodyBoard.Caption
					*/
				})
				
			})
			
		})
		
		
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');