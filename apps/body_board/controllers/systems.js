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
/** @scope BodyBoard.systemsController.prototype */ {

  	orderBy : 'name',
	allowsMultipleSelection : NO,
	/*
	selectionDidChange : function(){
		BodyBoard.systemController.set('isSet',NO);
		console.log('selection changed');
	}.observes('selection')
	*/
}) ;




BodyBoard.systemController = SC.ObjectController.create(
/** @scope BodyBoard.systemController.prototype */ {

	contentBinding : SC.Binding.single('BodyBoard.systemsController.selection'),
	//isSet : YES,
	
	open: function(index) {
		var system;
		if(typeof index == "undefined") {
			BodyBoard.viewerController.get('viewer').openDzi(this.get('url'));
		} else {
			BodyBoard.systemsController.selectObject(BodyBoard.store.find('BodyBoard.System', index));
			this.invokeLast(function(){
				BodyBoard.viewerController.get('viewer').openDzi(this.get('url'));
			});
		}
	},
	
	setSystem : function() {
		
		if(BodyBoard.viewerController.get('isReady') == YES){
		
			//BodyBoard.viewerController.set('isReady',NO);
			var labels, labelView;
			labels = this.get('labels');
			BodyBoard.viewerController.get('viewer').addEventListener('open',function(){	
				console.log('Setting labels, Count: ', labels.get('length'));				
				labels.forEach(function(item,index,enumerable){
					console.log(index);
					labelView = BodyBoard.labelView.create({});
					labelView.set('content',item);
					BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(labelView);
				});
				//BodyBoard.viewerController.set('isSet',YES);
				console.log('Image opened, labels set');
			});
		
		BodyBoard.systemController.open();
		
		//BodyBoard.viewerController.get('viewer').openDzi(this.get('url'));
		} else {
			console.log('not set yet');
		}
		
	}.observes('content'),

	
	
}) ;





BodyBoard.systemLabelsController = SC.ArrayController.create( 
/** @scope BodyBoard.systemsController.prototype */ {

		allowsMultipleSelection : NO,
		
		setLabels : function() {
			
				if( BodyBoard.viewerController.get('labelsSet') == NO ){
					
					console.log('Setting labels');
					this.set('content',BodyBoard.systemController.get('labels'))
					
					BodyBoard.systemController.get('labels').forEach(function(item, index, enumerable){
						console.log('set label ', index);
						var label = BodyBoard.labelView.create({});
						label.set('content',item);
						BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(label).renderChildViews();
						BodyBoard.viewerController.set('labelsSet', YES);
						console.log('label created: ', item);
					}, this);
					
				} else {
					console.log('Labels already set');
				}
					
			
		}//.observes('BodyBoard.viewerController.systemSet')
				
});