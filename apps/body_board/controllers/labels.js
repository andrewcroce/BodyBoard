// ==========================================================================
// Project:   BodyBoard.labelsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/


BodyBoard.labelsController = SC.ArrayController.create( 
/** @scope BodyBoard.labelsController.prototype */ {

  	orderBy : 'name',
	allowsMultipleSelection : NO,
	isEditing : YES,
	isSaveOk : NO,
	isDeleteOk : NO,
	buffer : null,
	
	/*
	isLoadedArray : [],
	loadedCount : 0,
	
	initializeForLoading : function(){
		var arr = this.get('isLoadedArray');
		for(var i = 0, len = BodyBoard.Label.FIXTURES.get('length'); i < len; i++){
			arr.pushObject(NO);
		}
	},
	
	recordWasLoaded : function(key){
		this.get('isLoadedArray').replace(key - 1, 1, [YES]);
		var count = this.get('loadedCount');
		this.set('loadedCount', count + 1);
	},
	*/
	
	addLabel : function(){
		console.log('Adding a label');
		//this.setPath('BodyBoard.labelController.allowSystemSet',NO);
		//this.setPath('BodyBoard.systemsController.allowsSelection',NO);
		var label;
		this.set('buffer', BodyBoard.store.chain());
		
		label = BodyBoard.store.createRecord(BodyBoard.Label, {
		//label = this.get('buffer').createRecord(BodyBoard.Label, {
			'name' : 'New Label',
			//'x' : BodyBoard.viewerController.get('center').x,
			//'y' : BodyBoard.viewerController.get('center').y,
			'x' : 0.5,
			'y' : 0.5,
			'author_id' : BodyBoard.authorController.get('id'),
			'system_id' : BodyBoard.systemController.get('id')
		});

		this.invokeLast(function() { 
			this.selectObject(label);
			this.set('isSaveOk',YES);
			this.set('isDeleteOk',YES);
			BodyBoard.labelController.set('BodyBoard.labelController.isEditable',YES);
			this.editLabel();
		});
		return YES;
		
	},
	
	editLabel : function() {
		if(BodyBoard.labelController.get('isEditable') == YES){
			var label;
			label = this.get('selection');
			console.log('Editing label: ',label.get('name'));
		}
	},
	
	saveLabel : function() {
		if(this.get('isSaveOk') == YES) {
			this.get('buffer').commitChanges();
			this.set('buffer',null);
			//BodyBoard.labelController.set('BodyBoard.labelController.isEditable',NO);
		}
	},
	
	deleteLabel : function() {
		if(this.get('isDeleteOk') == YES) {
			var label = this.get('selection');	
			console.log('deleting label');
			BodyBoard.labelController.set('allowSystemSet',NO);
			label.destroy();
			this.set('isDeleteOk',NO);
			BodyBoard.labelController.set('allowSystemSet',YES);
		}
	},
	
	
	collectionViewDeleteContent: function(view, content, indexes) {

	    // destroy the records
	    var records = indexes.map(function(idx) {
	      return this.objectAt(idx);
	    }, this);
	    records.invoke('destroy');

	    var selIndex = indexes.get('min')-1;
	    if (selIndex<0) selIndex = 0;
	    this.selectObject(this.objectAt(selIndex));
	  }
	
});






BodyBoard.labelController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.labelsController.selection'),
	allowSystemSet : YES,
	isEditable : NO,
	
	setSystemOnSelection : function(){
	
		if(this.get('allowSystemSet') == YES){
			var currentSystem = BodyBoard.systemController.get('content');
			if( currentSystem != this.get('system') ){
				console.log('Selected label, changing system');
				BodyBoard.systemsController.selectObject(this.get('system'));
			}
			this.focusOnLabel();
		} else {
			console.log('System setting blocked');
		}
		
	}.observes('content'),
	
	
	
	focusOnLabel : function(){
		var x,y;
		x = this.get('x');
		y = this.get('y');
		console.log(x,y);
		BodyBoard.viewerController.get('viewer').viewport.panTo(new Seadragon.Point(x, y));
	},
	
	
	
	newLabelStartDrag : function( event, layout, view ) {
		
		console.log('Started drag');
		view._mouseDownInfo = {
			pageX : event.pageX,
			pageY : event.pageY,
			left : layout.left,
			bottom : -layout.bottom
		};
		return YES;
	},
	
	
	
	newLabelDragged : function( event, view ) {
		var info, loc;
		console.log('Dragging...')
		info =  view._mouseDownInfo;		
		loc = info.left + ( event.pageX - info.pageX );
		view.adjust('left', loc);
		this.set('x', BodyBoard.viewerController.get('mousePosition').x);
		
		loc = info.bottom + ( event.pageY - info.pageY );
		view.adjust('bottom', -loc);
		this.set('y', BodyBoard.viewerController.get('mousePosition').y);
		
		this.invokeLater(function(){
			console.log(this.get('x'));
			console.log(this.get('y'));
			
		});
		
		return YES;
	},
	
	
	newLabelRelease : function( event ) {
		var target,point,placement;
		//target = document.getElementById('drag-target-view');
		target = BodyBoard.labelView.create({});
		target.set('content',this);
		BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(target);
		//BodyBoard.getPath('mainPage.bodyView.bodyBoardView').removeChild(target);
		//point = new Seadragon.Point(this.get('x'),this.get('y'));
		//placement = Seadragon.OverlayPlacement.TOP_LEFT;
		//BodyBoard.viewerController.get('viewer').drawer.addOverlay(target, point, placement);
		console.log('Target released');
		
		return YES;
	},
	
	

	
});
