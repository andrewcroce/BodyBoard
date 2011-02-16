// ==========================================================================
// Project:   BodyBoard - labelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/viewer');
sc_require('controllers/systems');

BodyBoard.labelView = SC.View.extend(SC.ContentDisplay,{
	
	layout : { left: 0, right: 0, height: 20, width: 100 },
	contentDisplayProperties : 'name captions'.w(),
	//content : '',
	//backgroundColor: 'red',
	
	childViews : ''.w(),
	
	/*
	spotView : SC.View.design({
		layout : { top: -8, left: -8, width: 16, height: 16 },
		backgroundColor: 'blue'
	}),
	
	titleView : SC.LabelView.design({
		layout : { top: -8, left: 20, width: 100, height: 20 },
		//valueBinding : 'parentView*content.name'
		value : 'Title Here'
	}),
	
	moreButtonView : SC.ButtonView.design({
		
	}),
	
	captionsView : SC.ListView.design({
		
	}),
	*/
	
	
	render : function( context, firstTime ) {
		
		var content,name,x,y,point,placement,captions,div,h1,ul;
		content = this.get('content');
		captions = BodyBoard.labelController.get('captions');
		
		if( content != null ) {
			//console.log('FirstTime: ',firstTime);
			//console.log('Label content available');
			name = content.get('name');
			x = content.get('x');
			y = content.get('y');
			captions = content.get('captions');
			point = new Seadragon.Point( x, y );
		} else {
			console.log('no content available for label');
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		}
		
		console.log('rendering label: ',name);
		
		
		context = context.begin('h1').push(name).end();
		context = context.begin('ul');
		captions.forEach(function(item,index,enumerable){
			caption = item.get('text');
			context = context.begin('li').push(caption).end();
		});
		context = context.end();
		

		/*
		*	Currently this does not use the View's actual context, but just creates a new div to use for the overlay
		*	TODO: Make the overlay div become the View's context or vice versa
		*/
		
		/*
		div = document.createElement('div');
		div.style.backgroundColor = '#ff0000';
		div.style.color = '#0000ff';
		div.style.width = '200px';
		div.style.minHeight = '25px';
		
		h1 = document.createElement('h1');
		h1.innerHTML = name;
		div.appendChild(h1);
		
		if(typeof captions != 'undefined'){
			var ul;
			ul = document.createElement('ul');
			captions.forEach(function(item,index,enumerable){
				
				console.log('Caption ',index);
				console.log(item.get('text'));
				var caption,image;
				caption = document.createElement('li');
				caption.innerHTML = item.get('text');
				ul.appendChild(caption);

			});
			div.appendChild(ul);
			
		} else {
			console.log('No captions available');
		}
		*/
		
		
		
		//placement = Seadragon.OverlayPlacement.TOP_LEFT;
		//BodyBoard.viewerController.get('viewer').drawer.addOverlay(div, point, placement);
		//BodyBoard.viewerController.get('viewer').drawer.addOverlay(context, point, placement);
		
		arguments.callee.base.apply(this,arguments);
		
	},
	
	didAppendToDocument : function() {
		var element,point,placement;
		console.log('Adding overlay');
		element = this.$();
		point = new Seadragon.Point(this.get('x'),this.get('y'));
		placement = Seadragon.OverlayPlacement.TOP_LEFT;
		BodyBoard.viewerController.get('viewer').drawer.addOverlay(element,point,placement);
		console.log(this.$());
	},
	
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');