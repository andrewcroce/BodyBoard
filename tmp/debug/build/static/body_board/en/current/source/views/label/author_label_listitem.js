// ==========================================================================
// Project:   BodyBoard - authorLabelListitemView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */



BodyBoard.authorLabelListitemView = SC.View.extend( SC.ContentDisplay, {
	
	classNames : ['author-label-li-view'],
	contentDisplayProperties : 'name system'.w(),
	
	displayProperties: 'name system'.w(),
	
	render : function( context, firstTime ) {
		
		var name = 'name';
		var system = 'system';
		var content = this.get('content');
		
		if( content != null ) {
			
			name = content.get('name');
			system = content.getPath('system.name');
			
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		} 
		
		//RENDER HTML
		context = context.begin('h3').addClass('name').push(name).end();
		context = context.begin('div').addClass('system').push(system).end();
		
		arguments.callee.base.apply(this,arguments);
		
	}
	
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');