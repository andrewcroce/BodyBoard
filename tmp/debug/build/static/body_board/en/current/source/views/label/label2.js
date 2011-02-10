// ==========================================================================
// Project:   BodyBoard - label2View
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/viewer');
sc_require('controllers/systems');

BodyBoard.label2View = SC.View.extend(SC.ContentDisplay,{

	contentDisplayProperties : 'name'.w(),
	
	displayProperties: 'isSelected'.w(),
	
	div : document.createElement('div'),
	
	render : function( context, firstTime ) {
		
		var name,x,y,captions,content,div;
		content = this.get('content');
		
		if( content != null ) {
			
			name = content.get('name');
			x = content.get('x');
			y = content.get('y');
			
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		} 
		
		//RENDER HTML
		context = context.begin('h3').addClass('name').push(name).end();
		
		point = new Seadragon.Point(x,y);
		placement = Seadragon.OverlayPlacement.TOP_LEFT;
		//div = document.createElement('div');
		
		arguments.callee.base.apply(this,arguments);
		//BodyBoard.viewerController.get('viewer').drawer.addOverlay(div, point, placement);
		
	}

});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');