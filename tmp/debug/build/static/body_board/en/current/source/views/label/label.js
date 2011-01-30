// ==========================================================================
// Project:   BodyBoard - labelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/viewer');
sc_require('controllers/systems');

BodyBoard.labelView = SC.View.design({
	
	layout : { height: 1, width: 1 },
	contentDisplayProperties : 'name'.w(),
	
	
	render : function( context, firstTime ) {
		
		var name = '';
		var point = '';
		var x = 0;
		var y = 0;
		var placement = Seadragon.OverlayPlacement.TOP_LEFT;
		var content = this.get('content');
		
		if( content != null ) {
			console.log('Label content available');
			name = content.get('name');
			x = content.get('x');
			y = content.get('y');
			point = new Seadragon.Point( x, y );
		} else {
			console.log('no content available for label');
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		}
		
		console.log('rendering label: ',name);
		var div = document.createElement('div');
		div.style.backgroundColor = '#ff0000';
		div.style.width = '120px';
		div.style.height = '25px';
		div.innerHTML = name;
		//context = context.begin('h3').addClass('label-name').push(name).end();
		
		BodyBoard.viewerController.get('viewer').drawer.addOverlay(div, point, placement);
		
		arguments.callee.base.apply(this,arguments);
		
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');