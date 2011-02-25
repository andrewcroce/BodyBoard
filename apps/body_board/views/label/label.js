// ==========================================================================
// Project:   BodyBoard - labelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/viewer');
sc_require('controllers/systems');

BodyBoard.labelView = SC.View.extend(
SC.ContentDisplay,
{
	
	layout : { left: 0, top: 0, width: 12, height: 12 },
	contentDisplayProperties : 'name captions'.w(),
	transitions : {
		width : { duration: 0.25 },
		height : { duration: 0.25 }
	},
	useStaticLayout: YES,
	classNames : 'body-label-view'.w(),
	
	
	childViews : 'moreButtonView closeButtonView nextButtonView prevButtonView'.w(),
	
	moreButtonView : SC.ButtonView.design({
		layout : { top: 3, right: 3, width: 60 },
		title : 'MORE',
		action : 'requestShowCaptions',
		classNames : 'more-button'.w(),
		isVisible : NO,
	}),
	
	closeButtonView : SC.ButtonView.design({
		layout : { top: 3, right: 3, width: 60 },
		title : 'CLOSE',
		action : 'requestHideCaptions',
		classNames : 'close-button'.w(),
		isVisible : NO,
	}),
	
	nextButtonView : SC.View.design({
		layout : { bottom: 3, right: 3, width: 1, height: 1 },
		classNames : 'next-button'.w(),
		//isVisible : NO,
	}),
	
	prevButtonView : SC.View.design({
		layout : { bottom: 3, left: 3, width: 20, height: 20 },
		classNames : 'prev-button'.w(),
		//isVisible : NO,
	}),
	
	render : function( context, firstTime ) {
		
		var content,name,x,y,point,placement,captions,div,h1,ul;
		content = this.get('content');
		
		if( content != null ) {

			name = content.get('name');
			button = this.get('moreButtonView');
			x = content.get('x');
			y = content.get('y');
			captions = content.get('captions');
			//this.setPath('captionsView.content',captions);
			console.log(captions);
			point = new Seadragon.Point( x, y );
		} else {
			console.log('no content available for label');
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		}

		
		console.log('rendering label: ',name);
		
		context = context.begin('div').addClass('marker').end();
		context = context.begin('div').addClass('container');
			context = context.begin('h1').push(name).end();
			//this.renderChildViews(context,true)
			//context = context.begin('div').push(button).end();
			//context = context.begin('div').push(this.get('moreButtonView')).end();
			context = context.begin('ul');
			if(typeof captions != 'undefined'){
				captions.forEach(function(item,index,enumerable){
					text = item.get('text');
					console.log(text);
					context = context.begin('li').push(text).end();
				});	
			}
			context = context.end();
		context = context.end();
		
		sc_super();
		
	},
	
	didCreateLayer : function() {
		console.log('Adding overlay');
		var view,x,y,content,element,point,placement;
		view = this;
		content = this.get('content');
		x = content.get('x');
		y = content.get('y');
		element = this.$()[0];
		point = new Seadragon.Point(content.get('x'),content.get('y'));
		placement = Seadragon.OverlayPlacement.TOP_LEFT;
		BodyBoard.viewerController.get('viewer').drawer.addOverlay(element,point,placement);
		
		$(element).hover(
			function(){
				BodyBoard.labelController.over(view);
				//view.get('moreButtonView').set('isVisible',YES);
				BodyBoard.labelController.set('isHovering',YES);
			},
			function(){
				BodyBoard.labelController.out(view);
				//view.get('moreButtonView').set('isVisible',NO);
				BodyBoard.labelController.set('isHovering',NO);
			}
		);
	},
	
	updateLayer : function() {
		console.log('updating')
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		}
		
	}
	
	
});