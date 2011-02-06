// ==========================================================================
// Project:   BodyBoard - labelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/viewer');
sc_require('controllers/systems');

BodyBoard.labelView = SC.View.design({
	
	layout : { height: 1, width: 1 },
	contentDisplayProperties : 'name labels'.w(),
	
	
	render : function( context, firstTime ) {
		
		var content,name,x,y,point,placement,captions,div,h1,ul;
		content = this.get('content');
		captions = BodyBoard.labelController.get('captions');
		
		if( content != null ) {
			console.log('Label content available');
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
		

		/*
		*	Currently this does not use the View's actual context, but just creates a new div to use for the overlay
		*	TODO: Make the overlay div become the View's context or vice versa
		*/
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
		
		//div.innerHTML = name;
				
		placement = Seadragon.OverlayPlacement.TOP_LEFT;
		BodyBoard.viewerController.get('viewer').drawer.addOverlay(div, point, placement);
		
		sc_super();
		
	}
	
});