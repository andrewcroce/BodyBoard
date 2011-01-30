// ==========================================================================
// Project:   BodyBoard - authorListitemView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.authorListitemView = SC.View.extend( SC.ContentDisplay, {
	
	classNames : ['author-li-view'],
	//contentDisplayProperties : 'fullName rating'.w(),
	
	displayProperties: 'isSelected'.w(),
	
	render : function( context, firstTime ) {
		
		var fullName = '';
		var rating = '';
		var content = this.get('content');
		if( content != null ) {
			
			fullName = content.get('fullName');
			rating = content.get('rating');
			
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		} else {
		//	context.removeClass('selected', this.get)
		}
		
		//RENDER HTML
		context = context.begin('h3').addClass('full-name').push(fullName).end();
		context = context.begin('span').addClass('rating').push('Rating: '+rating).end();
		
		arguments.callee.base.apply(this,arguments);
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');