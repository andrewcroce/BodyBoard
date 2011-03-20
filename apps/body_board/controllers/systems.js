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
	allowsSelection : YES,
	allowsMultipleSelection : NO,
	
}) ;




BodyBoard.systemController = SC.ObjectController.create(
/** @scope BodyBoard.systemController.prototype */ {

	contentBinding : SC.Binding.single('BodyBoard.systemsController.selection'),
	newZoom : 1,
	newCenter : {},
	
	
	/*
	*	Observe the currently selected system. When it changes, set the new zoom level and center point
	*	based on the previous level, and open that System's DZI.
	*/
	selectionDidChange : function() {
		//this.set('newZoom',BodyBoard.viewerController.get('zoom'));
		//this.set('newCenter',BodyBoard.viewerController.get('center'));
		if(this.get('content') != null){
			this.open();
			BodyBoard.statechart.sendEvent('systemChanged');
		}
	}.observes('content'),
	
	
	/*
	*	Open a DZI.
	*	If an index is not supplied as a parameter, open the current Systems's DZI,
	*	otherwise select the System at the index, then open its DZI.
	*/
	open: function(index) {
	
		this.set('newZoom',BodyBoard.viewerController.get('zoom'));
		this.set('newCenter',BodyBoard.viewerController.get('center'));
		
		if(typeof index != "undefined") {
			BodyBoard.systemsController.selectObject(BodyBoard.store.find('BodyBoard.System', index));
		}
		
		this.invokeLast(function(){
			BodyBoard.viewerController.get('viewer').openDzi(this.get('src'));
		});
		
	},
	
	
	/*
	*	Loop through the current System's Labels,
	*	add a LabelView for each of them
	*/
	setSystem : function() {
		
		var labels, labelView, point, placement;
		if(BodyBoard.viewerController.get('isInitialized') == YES){
			BodyBoard.viewerController.get('viewer').viewport.zoomTo(this.get('newZoom'),this.get('newCenter'), true);
		} else {
			BodyBoard.viewerController.set('isInitialized',YES);
		}
		
		labels = this.get('labels');
		
		BodyBoard.labelCollectionView = SC.CollectionView.create({
			layout : { top: 0, left: 0, width: 0, height: 0 },
			contentBinding : 'BodyBoard.systemLabelsController.arrangedObjects',
			selectionBinding : 'BodyBoard.labelsController.selection',
			selectOnMouseDown : YES,
			canDeleteContent : NO,
			layerId : 'label-collection',
			exampleView : BodyBoard.labelView,
			recordType: BodyBoard.Label,
		});
		
		SC.RunLoop.begin();
		BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(BodyBoard.labelCollectionView);
		SC.RunLoop.end();
		
		this.invokeLast(function(){
			
			if(BodyBoard.labelsController.get('hasSelection') == YES){
				if(BodyBoard.labelController.get('system_id') == this.get('id')){
					//console.log(BodyBoard.labelController.get('system_id'), this.get('id'));
					BodyBoard.labelController.focusOnLabel();
					SC.RunLoop.end();
				}
			}
			
		});
	
	}

	
	
}) ;




BodyBoard.systemLabelsController = SC.ArrayController.create({
	contentBinding : 'BodyBoard.systemController.labels',
	showAuthorLabels : NO,
});

