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
	
	addLabel : function(){
		console.log('Adding a label');
		var label;
		label = BodyBoard.store.createRecord(BodyBoard.Label, {
			'name' : 'New Label',
			'x' : 0.5,
			'y' : 0.5,
			'author_guid' : BodyBoard.authorController.get('id'),
			'system_guid' : BodyBoard.systemController.get('id')
		});

		this.invokeLast(function() { 
			this.selectObject(label);
			//this.get('selection').set('system',BodyBoard.systemsController.get('selection'));
		});
		return YES;
		
	}

});







BodyBoard.labelController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.labelsController.selection'),

	setSystemOnSelection : function(){
	
		var currentSystem = BodyBoard.systemController.get('content');
		if( currentSystem != this.get('system') ){
			console.log('Selected label, changing system');
			BodyBoard.systemsController.selectObject(this.get('system'));
		}
		
	}.observes('content'),
	
	
	
	focusOnLabel : function( event ){
		
		var x = this.get('x');
		var y = this.get('y');
		//viewer.viewport.panTo(new Seadragon.Point(x, y));
		
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
		
		console.log('Dragging...')
		var info =  view._mouseDownInfo;
		var loc;
		
		loc = info.left + ( event.pageX - info.pageX );
		view.adjust('left', loc);
		this.set('x', BodyBoard.viewerController.get('position').x);
		
		loc = info.bottom + ( event.pageY - info.pageY );
		view.adjust('bottom', -loc);
		this.set('y', BodyBoard.viewerController.get('position').y);
		
		this.invokeLater(function(){
			console.log(this.get('x'));
			console.log(this.get('y'));
			
		});
		
		return YES;
	},
	
	
	newLabelRelease : function( event ) {
		console.log('Target released');
		return YES;
	},
	
	
	beginCreatingLabel : function() {
		console.log('Beginning Label Creation');
		//BodyBoard.labelsController.addLabel();
	},
	
	finishCreatingLabel : function() {
		
	},
	
	cancelLabelCreation : function() {
		console.log('Cancelled label creation');
		BodyBoard.setPath('mainPage.bodyView.dragTargetView.layout', {
			width: 15, height: 15, bottom: 45, left: 142
		});
	},
	
	
	saveLabel : function() {
		var labelRecord = this.get('content');
		if( labelRecord && labelRecord.isRecord ) {
			labelRecord.commitRecord();
			console.log('Label Saved');
		} else {
			if(!labelRecord.isRecord){
				alert('Label isnt a record');
			} else {
				alert('Problem saving label');
			}
		}
		return YES;
	}
	
});
