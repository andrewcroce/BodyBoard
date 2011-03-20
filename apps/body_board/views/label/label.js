// ==========================================================================
// Project:   BodyBoard - labelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/viewer');
sc_require('controllers/systems');
sc_require('views/caption/caption');

BodyBoard.labelView = SC.View.extend(
SC.ContentDisplay,
{
	
	layout : { left: -12, top: -12, width: 12, height: 12 },
	classNames : 'body-label-view'.w(),
	
	hasCaptions : NO,
	isHovering : NO,
	isShowingCaptions : NO,
	currentCaption : 0,
	currentCaptionReadable : function(){
		return this.get('currentCaption') + 1;
	}.property('currentCaption').cacheable(),
	hoverTimer : '',
	nextAllowed : YES,
	previousAllowed : YES,
	isVisible : YES,
		
	childViews : 'markerView titleBarView captionsView'.w(),

	markerView : SC.View.design({
		layout: { left: -6, top: -6, width: 12, height: 12 },
		classNames : 'marker'.w(),
		
	}),
	
	titleBarView : SC.View.design({
		layout : { left: 0, right: 0, top: -10, height: 29 },
		classNames : 'title-bar'.w(),
		contentPath : '.parentView.content',
		childViews : 'nameView moreButtonView closeButtonView'.w(),
		nameView : SC.LabelView.design({
			layout : { left : 15, top: 0, height: 29 },
			valueBinding : '.parentView.parentView.content.name',
			classNames : 'label-name-view'.w(),
		}),
		moreButtonView : SC.ButtonView.design({
			layout : { top: 3, right: 3, width: 60 },
			title : 'MORE',
			target : 'parentView.parentView',
			action : 'showCaptions',
			classNames : 'more-button'.w(),
			isVisibleBinding : '.parentView.parentView.isHovering',
			isEnabledBinding : '.parentView.parentView.hasCaptions',
			
		}),
		closeButtonView : SC.ButtonView.design({
			layout : { top: 3, right: 3, width: 60 },
			title : 'CLOSE',
			target : 'parentView.parentView',
			action : 'hideCaptions',
			classNames : 'close-button'.w(),
			isVisibleBinding : '.parentView.parentView.isShowingCaptions',
		}),
	}),
	
	
	
	
	captionsView : SC.View.design( SC.Border, {
		layout: { top: 19, left: 15, width: 383 },
		childViews : 'captionsListView nextButtonView prevButtonView captionCountView'.w(),
		backgroundColor: 'white',
		borderStyle : SC.BORDER_NONE,
		classNames : 'captions-container'.w(),
		
		captionsListView : SC.CollectionView.extend( 
		SC.StaticLayout, 
		{
			layout : { top: 10, left:10 },
			useStaticLayout : YES,
			contentBinding : 'BodyBoard.labelCaptionsController.arrangedObjects',
			//contentBinding : 'BodyBoard.labelController.captions',
			selectionBinding : 'BodyBoard.captionsController.selection',
			selectOnMouseDown : YES,
			canDeleteContent : NO,
			classNames : 'captions-list'.w(),
			tagName : 'ul',
			rowHeight : 250,
			exampleView : BodyBoard.captionView,
			recordType: BodyBoard.Caption,
			
		}),
		
		nextButtonView : SC.View.design({
			layout : { bottom: 3, right: 3, width: 20, height: 20 },
			classNames : 'next-button'.w(),
			//backgroundColor: 'green',
			target : 'parentView.parentView',
			action : 'showNextCaption',
			isVisibleBinding : '.parentView.parentView.isShowingCaptions',
			isEnabledBinding : '.parentView.parentVIew.nextAllowed',
			click : function(){
				this.parentView.parentView.showNextCaption();
			}
		}),

		prevButtonView : SC.View.design({
			layout : { bottom: 3, left: 3, width: 20, height: 20 },
			classNames : 'prev-button'.w(),
			//backgroundColor: 'green',
			target : 'parentView.parentView',
			action : 'showPreviousCaption',
			isVisibleBinding : '.parentView.parentView.isShowingCaptions',
			isEnabledBinding : '.parentView.parentVIew.previousAllowed',
			click : function(){
				this.parentView.parentView.showPreviousCaption();
			}
		}),
		
		captionCountView : SC.View.design({
			
			layout : { bottom : 3, centerX : 0, height: 20, width: 100},
			childViews : 'currentCount divider totalCount'.w(),
			currentCount : SC.LabelView.design({
				layout : { bottom: 0, right: 60, width: 40, height: 20 },
				textAlign : SC.ALIGN_RIGHT,
				valueBinding : '.parentView.parentView.parentView.currentCaptionReadable',
			}),
			divider : SC.LabelView.design({
				layout: { bottom: 0, centerX: 0, width: 15, height: 20 },
				value : 'of',
				textAlign : SC.ALIGN_CENTER,
			}),
			totalCount : SC.LabelView.design({
				layout: { bottom: 0, left: 60, width: 40, height: 20 },
				valueBinding : 'BodyBoard.labelCaptionsController.length',
			}),
			
		})
		
	}),

	
	resize : function(){
		console.log('resizing');
		sc_super();
		var view = this.getPath('captionsView.captionsListView').itemViewForContentIndex(this.get('currentCaption'));
		var hgt = view.get('textHeight');
		$(this.get('layer')).animate(
			{ height : hgt },
			200
		);
	}.observes('currentCaption'),
	
	
	mouseEntered : function(event){
		var timer = this.get('hoverTimer');
		if( timer != '' ){
			timer.invalidate();
		}
		this.over();
	},
	
	
	mouseExited : function(event){
		this.set('hoverTimer', SC.Timer.schedule({
			target : this,
			action : 'out',
			interval : 750,
			repeats : NO
		}));
	},
	
	over : function(){
		if(this.get('isShowingCaptions') == NO){
		
			SC.RunLoop.begin();
			var view,layer;
			view = this;
			layer = view.get('layer');
			console.log('over');
			Seadragon.Config.zoomPerClick = 1;
			$(layer).animate(
				{ height : 16 },
				10
			);
			$(layer).animate(
				{ width : 250 },
				200
			);
			SC.RunLoop.end();
			this.invokeLast(function(){
				view.set('isHovering',YES);
			});
			return YES;
		} else {
			return NO;
		}
	},
	
	out : function(){
		if(this.get('isShowingCaptions') == NO){
			var view, layer;
			view = this;
			layer = view.get('layer');
		
			SC.RunLoop.begin();
			view.set('isHovering',NO);
			console.log('out');
			$(layer).animate(
				{ width : 14 },
				200
			);
			$(layer).animate(
				{ height : 14 },
				10
			);		
			SC.RunLoop.end();
			return YES;
		} else {
			return NO;
		}
	},
	
	flashLabel : function(){
	
		this.over();
		
	},
	
	showCaptions : function() {
		var view, caption, layer, hgt;
		view = this;
		caption = this.getPath('captionsView.captionsListView').itemViewForContentIndex(this.get('currentCaption'));
		console.log('Current Caption: ',caption);
		layer = view.get('layer');
		
		//console.log('Currently showing captions: ', this.get('isShowingCaptions'));
		if(BodyBoard.labelController.get('currentLabelView') != null){
			console.log('caption opened, hiding it');
			BodyBoard.labelController.currentLabelView.hideCaptions();
		}
		BodyBoard.labelsController.selectObject(this.get('content'));
		BodyBoard.labelController.set('currentLabelView',this);
		BodyBoard.labelController.set('isShowingCaptions',YES);
		
		//console.log('show captions');
		$(layer).animate(
			{ width : 400 },
			300, 
			function(){
				SC.RunLoop.begin();
				view.setPath('captionsView.borderStyle','#317484');
				SC.RunLoop.end();
			}
		);
		$(layer).animate(
			{ height : 13 },
			10, function(){
				hgt = caption.get('textHeight');
				view.resize();
			}
		);
		
		this.invokeLast(function(){
			
			this.set('isHovering',NO);
			this.set('isShowingCaptions',YES);
			Seadragon.Config.zoomPerClick = 1;
			/*
			if(view.get('currentCaption') == 0){
				console.log('Current caption 0');
				$(view.getPath('captionsView.prevButtonView').get('layer')).addClass('prev-button-disabled').removeClass('prev-button');
			}
			if(BodyBoard.labelCaptionsController.get('length') == 1){
				$(view.getPath('captionsView.nextButtonView').get('layer')).addClass('next-button-disabled').removeClass('next-button');
			} 
			*/
		});
	},
	
	
	hideCaptions : function() {
		console.log('Showing Captions:',this.get('isShowingCaptions'));
		console.log('hide captions');
		var view, layer, hgt;
		view = this;
		layer = view.get('layer');
		view.set('isShowingCaptions',NO);
		view.set('isHovering',NO);
		BodyBoard.labelController.set('currentLabelView',this);
		BodyBoard.labelController.set('isShowingCaptions',NO);
		console.log('hide captions');
		$(layer).animate(
			{ width : 12, height : 12 },
			200
		);
		this.invokeLast(function(){
			view.setPath('captionsView.borderStyle',SC.BORDER_NONE);
			Seadragon.Config.zoomPerClick = 2;
		});

	},
	
	
	
	
	showPreviousCaption : function() {
		if(this.get('currentCaption') != 0){
			/*
			if(this.get('currentCaption') == 1){
				console.log('next allowed')
				$(this.getPath('captionsView.nextButtonView').get('layer')).addClass('next-button-disabled').removeClass('next-button');
			} else {
				console.log('next allowed');
				$(this.getPath('captionsView.nextButtonView').get('layer')).addClass('next-button').removeClass('next-button-disabled');
			}
			*/
			console.log('previous');
			var listView,layer,layout,position;
			listView = this.getPath('captionsView.captionsListView');
			layer = listView.get('layer');
			position = listView.get('layout').left + 373;
			this.set('currentCaption', this.get('currentCaption') - 1);
			$(layer).animate(
				{ left : position },
				300,
				function(){
					listView.adjust('left',position);
				}
			);
		}
	},
	
	
	showNextCaption : function() {
		
		console.log(this.get('currentCaption'),BodyBoard.labelCaptionsController.get('length')-1);
		
		if(this.get('currentCaption') !=  BodyBoard.labelCaptionsController.get('length')-1){
			/*
			if(this.get('currentCaption') ==  BodyBoard.labelCaptionsController.get('length')-2){
				console.log('next allowed')
				$(this.getPath('captionsView.nextButtonView').get('layer')).addClass('next-button-disabled').removeClass('next-button');
			} else {
				console.log('next allowed');
				$(this.getPath('captionsView.nextButtonView').get('layer')).addClass('next-button').removeClass('next-button-disabled');
			}
			*/
			console.log('next');
			var listView,layer,position;
			listView = this.getPath('captionsView.captionsListView');
			layer = listView.get('layer');	
			position = listView.get('layout').left - 373;
			this.set('currentCaption', this.get('currentCaption') + 1);		
			
			$(layer).animate(
				{ left : position },
				300,
				function(){
					listView.adjust('left',position);
				}
			);
		}
	},
	
	
	didCreateLayer : function() {
		
		SC.RunLoop.begin();
		console.log('Adding overlay');
		
		var view,x,y,content,captions,element,point,placement;
		view = this;
		content = this.get('content');
		captions = content.get('captions');
		if(captions.get('length') > 0) {
			view.set('hasCaptions',YES);
		}
		x = content.get('x');
		y = content.get('y');
		element = this.$()[0];
		point = new Seadragon.Point(x,y);
		placement = Seadragon.OverlayPlacement.TOP_LEFT;
		BodyBoard.viewerController.get('viewer').drawer.addOverlay(element,point,placement);
		SC.RunLoop.end();
	},
	
	
	updateLayer : function() {
	
		var layer = this.get('layer');
		var content = this.get('content')
		console.log('updating');
		
		if( BodyBoard.systemLabelsController.get('showAuthorLabels') == YES ){
			if( BodyBoard.authorController.get('id') != content.get('author').get('id') ){
				console.log('Current Author id: ', BodyBoard.authorController.get('id'));
				console.log('This item id: ',content.get('id'));
				$(layer).addClass('hidden');
			} else {
				$(layer).removeClass('hidden');
			}
		} else {
			$(layer).removeClass('hidden');
		}
		
		
		if (this.get('isSelected')) {
			$(layer).addClass('selected');
		} else {
			$(layer).removeClass('selected');
		}
		if (this.get('isHovering')) {
			$(layer).addClass('hovering');
		} else {
			$(layer).removeClass('hovering');
		}
	
	},
	
	hideLayer : function() {
		var content = this.get('content');
		console.log('Hiding ', content.get('name') );
		this.set('isVisible', NO);
		var layer = this.get('layer');
		$(layer).addClass('hidden');
	}
	
	
});