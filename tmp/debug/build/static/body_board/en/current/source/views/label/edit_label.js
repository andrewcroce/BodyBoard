// ==========================================================================
// Project:   BodyBoard - editLabelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.editLabelView = SC.View.design( 
	//SC.Control, 
{
	
	layout : { left: 0, right: 0, bottom: 0, height: 100 },
	childViews : 'nameLabelView nameFieldView saveButtonView cancelButtonView'.w(),
	//backgroundColor: 'red',
	layerId : 'edit-label-view',
	
	/*
	*	The actual draggable target view is in
	*/
	
	
	nameLabelView : SC.LabelView.design({
		classNames : ['form-label'],
		layout : { left: 10, top: 40 },
		value : 'Label Name: '
	}),
	
	nameFieldView : SC.TextFieldView.design({
		layout : { left: 90, top: 35, width: 190, height: 25 },
		valueBinding : 'BodyBoard.bufferedLabelController.name'
	}),
	
	saveButtonView : SC.ButtonView.design({
		layout : { bottom: 10, right: 120, height: 35, width: 100 },
		title : 'SAVE',
		action : 'requestSaveLabel'
	}),
	
	cancelButtonView : SC.ButtonView.design({
		layout : { bottom: 10, right: 10, height: 35, width: 100 },
		title : 'CANCEL',
		action : 'requestCancelEditLabel'
		
	}),

}); if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');