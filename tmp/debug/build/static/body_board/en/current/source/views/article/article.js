// ==========================================================================
// Project:   BodyBoard - articleView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.articleView = SC.View.extend( SC.ContentDisplay, {
	
	classNames : ['article-view'],
	//contentDisplayProperties : 'fullName rating'.w(),
	
	displayProperties : 'isSelected'.w(),
	
	render : function( context, firstTime ) {
		
		var title = '';
		var author = '';
		var text = '';
		var rating = '';
		var content = this.get('content');
		
		if( content != null ) {
			
			title = content.get('title');
			author = content.getPath('author.fullName');
			text = content.get('text');
			rating = content.get('rating');
			
		}
		
		if (this.get('isSelected')) {
			context.setClass('selected', this.get('isSelected'));
		} 
		
		//RENDER HTML
		context = context.begin('h3').addClass('title').push(title).end();
		context = context.begin('div').addClass('author').push(author).end();
		context = context.begin('div').addClass('text').push(text).end();
		
		arguments.callee.base.apply(this,arguments);
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');