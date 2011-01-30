// ==========================================================================
// Project:   BodyBoard.systemsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/


sc_require('controllers/viewer');




BodyBoard.systemsController = SC.ArrayController.create( 
	
	SC.CollectionViewDelegate,
	SC.SelectionSupport,
/** @scope BodyBoard.systemsController.prototype */ {

  	orderBy : 'name',
	allowsMultipleSelection : NO,

}) ;





BodyBoard.systemController = SC.ObjectController.create(
	
/** @scope BodyBoard.systemController.prototype */ {

	contentBinding : SC.Binding.single('BodyBoard.systemsController.selection'),
	
	setSystem : function() {
				
		BodyBoard.viewerController.set('isReady', NO);
		BodyBoard.viewerController.get('viewer').addEventListener('open',function(){
			BodyBoard.viewerController.set('isReady', YES);
			BodyBoard.systemLabelsController.setLabels();
			
			console.log('Image opened in viewer');
		});
		BodyBoard.viewerController.get('viewer').openDzi(BodyBoard.systemController.get('url'));
		console.log('System set: ');

	}.observes('contentBinding'),

	
}) ;





BodyBoard.systemLabelsController = SC.ArrayController.create( 
	
		SC.CollectionViewDelegate,
		SC.SelectionSupport,
	/** @scope BodyBoard.systemsController.prototype */ {

		allowsMultipleSelection : NO,
		contentBinding : SC.Binding.single('BodyBoard.systemController.labels'),
		
		setLabels : function() {
			
		if( BodyBoard.viewerController.get('isReady') == YES ){
				console.log('Setting labels');
				this.set('content',BodyBoard.systemController.get('labels'))
			
				BodyBoard.systemController.get('labels').forEach(function(item, index, enumerable){
					console.log('set label: ', this);
					
					var label = BodyBoard.labelView.create({});
					
					label.set('content',item);
				
					BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(label).renderChildViews();
					
					console.log('label created: ', item);
					
					
				}, this);
			} else {
				console.log('viewer not ready');
			}
			
		}//.observes('BodyBoard.viewerController.isReady')
				
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');