// ==========================================================================
// Project:   BodyBoard - authorLabelListitemView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */



BodyBoard.authorLabelListitemView = SC.View.extend( SC.ContentDisplay, {
	
	contentDisplayProperties : 'name system'.w(),
	classNames : 'author-label-li-view green-bg'.w(),
	
	displayProperties: 'isSelected'.w(),
	
	render : function( context, firstTime ) {
		
		var name = 'name';
		var system = 'system';
		var content = this.get('content');
		
		if( content != null ) {
			
			name = content.get('name');
			system = content.getPath('system.name');
			
		}
		
		if (this.get('isSelected') == YES) {
			context.addClass('selected');
		} else {
			context.removeClass('selected');
		}
		
		//RENDER HTML
		context = context.begin('h3').addClass('name').push(name).end();
		context = context.begin('div').addClass('system').push(system).end();
		
		arguments.callee.base.apply(this,arguments);
		
	}
	
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');