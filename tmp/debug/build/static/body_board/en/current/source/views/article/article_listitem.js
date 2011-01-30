// ==========================================================================
// Project:   BodyBoard - articleListitemView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.articleListitemView = SC.View.extend( SC.ContentDisplay, {
	
	classNames : ['article-li-view'],
	//contentDisplayProperties : 'fullName rating'.w(),
	
	displayProperties : 'isSelected'.w(),
	childViews : 'viewArticleButton'.w(),
	
	viewArticleButton : SC.ButtonView.design({
		layout : { right: 10, top: 10, height: 25, width: 100 },
		title : 'Read More',
		action : 'requestViewArticle'
	}),
	
	render : function( context, firstTime ) {
		
		var title = '';
		var author = '';
		var text = '';
		var content = this.get('content');
		
		if( content != null ) {
			
			title = content.get('title');
			author = content.getPath('author.fullName');
			text = content.get('introText');
			
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
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');