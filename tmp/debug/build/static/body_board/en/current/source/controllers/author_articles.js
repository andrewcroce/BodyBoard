// ==========================================================================
// Project:   BodyBoard.authorContentController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
BodyBoard.authorArticlesController = SC.ArrayController.create(
	
	SC.CollectionViewDelegate,
	
/** @scope BodyBoard.authorArticlesController.prototype */ {

	
	
/*
	authorIdBinding : 'BodyBoard.authorController.id',
	updateSelection :  function() {
		
	}.observes('authorIdBinding')
*/
}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');