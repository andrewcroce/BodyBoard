// ==========================================================================
// Project:   BodyBoard - authorContentView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('views/label/author_label_listitem');
sc_require('views/caption/caption_listitem');


//BodyBoard.authorContentView = SC.SplitView.design({
BodyBoard.authorContentView = SC.SplitView.design({
	
		
		layout : { top: 0, bottom: 0, left: 0, right:0 },
		backgroundColor : 'white',
		layoutDirection : SC.LAYOUT_VERTICAL,
		autoresizeBehavior : SC.RESIZE_TOP_LEFT,
		layerId : 'author-content-view',
				
		childViews : 'topLeftView bottomRightView'.w(),
		
		
		topLeftView : SC.ContainerView.design({
			
			layout : { left: 0, right: 0, top: 0 },
			layerId : 'author-content-top',
			
			contentView : SC.View.design({
				
				layout : { left: 0, right: 0, top: 0, bottom: 0 },
				childViews : 'labelsHeadingView editLabelButtonView createLabelButtonView labelsListView'.w(),
				classNames : 'green-bg'.w(),
				
				
				
				labelsHeadingView : SC.LabelView.design({
					layout : { top: 10, left: 10, height: 29 },
					value : "My Labels",
					classNames : 'section-heading'.w()
				}),
				
				createLabelButtonView : SC.ButtonView.design({
					layout : { top: 8, right: 59, width: 35, height: 25 },
					escapeHTML : NO,
					title : '<strong>+</strong>',
					action : 'requestCreateLabel'
				}),
				
				editLabelButtonView : SC.ButtonView.design({
					layout : { top: 8, right: 7, width: 45, height: 25 },
					title : 'Edit',
					action : 'requestEditLabel',
					isEnabledBinding : 'BodyBoard.labelsController.hasSelection'
				}),
				
				labelsListView : SC.ScrollView.design({
					layout : { top: 40, bottom: 0, left: 10, right: 0 },
					layerId : 'author-labels-list',
					contentView : SC.ListView.design({
						layout : { top: 0, bottom: 0, left: 0, right: 0 },
						contentBinding : 'BodyBoard.authorLabelsController.arrangedObjects',
						selectionBinding : 'BodyBoard.labelsController.selection',
						selectOnMouseDown : YES,
						rowHeight: 50,
						exampleView: BodyBoard.authorLabelListitemView,
						recordType: BodyBoard.Label
					})
				})

			})
			
		}),
		
		
		bottomRightView : SC.ContainerView.design({
			
			layout : { left: 0, right: 0, bottom: 0 },
			hasHorizontalScroller : NO,
			hasVerticalScroller : YES,
			layerId : 'author-content-bottom',
			
			contentView : SC.View.design({
				
				layout : { left: 0, right: 0, top: 0, bottom: 0 },
				contentBinding : 'BodyBoard.authorController.content',
				childViews : 'captionsHeadingView editCaptionButtonView createCaptionButtonView captionsListView'.w(),
				classNames : 'green-bg'.w(),
				
				captionsHeadingView : SC.LabelView.design({
					layout : { top: 10, left: 10, height: 29 },
					value : "My Captions",
					classNames : 'section-heading'.w()
				}),
				
				editCaptionButtonView : SC.ButtonView.design({
					layout : { top: 8, right: 7, width: 45, height: 25 },
					title : 'edit',
					action : 'requestEditCaption',
					isEnabledBinding : 'BodyBoard.captionsController.hasSelection'
				}),
				
				createCaptionButtonView : SC.ButtonView.design({
					layout : { top: 8, right: 59, width: 35, height: 25 },
					escapeHTML : NO,
					title : '<strong>+</strong>',
					action : 'requestCreateCaption',
					isEnabledBinding : 'BodyBoard.labelsController.hasSelection'
				}),
				
				
				captionsListView : SC.ListView.design({
					layout : { top: 40, bottom: 0, left: 10, right: 10 },
					contentBinding : 'BodyBoard.authorCaptionsController.arrangedObjects',
					selectionBinding : 'BodyBoard.captionsController.selection',
					selectOnMouseDown : YES,
					layerId : 'author-captions-list',
					rowHeight: 50,
					//contentValueKey : 'text',
					exampleView : BodyBoard.captionListitemView,
					recordType : BodyBoard.Caption
					
				})
				
			})
			
		})
		
		
	
});