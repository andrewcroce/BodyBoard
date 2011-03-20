// ==========================================================================
// Project:   BodyBoard - dragTargetView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */


sc_require('views/label/label');


BodyBoard.dragTargetView = SC.View.design({
	layout : { width: 15, height: 15, bottom: 45, left: 162 },
	layerId : 'drag-target-view',
	//backgroundColor : 'blue',
	
	isVisible : NO,
	mouseDown : function( event ) { 
		return BodyBoard.labelController.newLabelStartDrag( event, this.get('layout'), this );
	},
	
	mouseDragged : function( event ) {
		return BodyBoard.labelController.newLabelDragged( event, this );

	},
	
	mouseUp : function( event ) {
		return BodyBoard.labelController.newLabelRelease( event );
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');