// ==========================================================================
// Project:   BodyBoard.articlesController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
BodyBoard.articlesController = SC.ArrayController.create(
	
	SC.CollectionViewDelegate,
	
/** @scope BodyBoard.articlesController.prototype */ {
	
	
}) ;


BodyBoard.articleController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.articlesController.selection'),
	
	viewArticle : function() {
		
		if( this.hasContent == NO ) {
			
		}
		
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');