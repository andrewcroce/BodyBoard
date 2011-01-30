// ==========================================================================
// Project:   BodyBoard - authorArticleListitemView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.authorArticleListitemView = SC.View.extend( SC.ContentDisplay, {
	
	classNames : ['article-li-view'],
	//contentDisplayProperties : 'fullName rating'.w(),
	
	displayProperties: 'isSelected'.w(),
	
	render : function( context, firstTime ) {
		
		var title = '';
		var text = '';
		var content = this.get('content');
		
		if( content != null ) {
			
			title = 	content.get('title');
			text = 	content.get('introText');
			
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		} 
		
		//RENDER HTML
		context = context.begin('h3').addClass('title').push(title).end();
		context = context.begin('div').addClass('text').push(text).end();
		
		arguments.callee.base.apply(this,arguments);
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');