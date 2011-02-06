// ==========================================================================
// Project:   BodyBoard - createLabelView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.createLabelView = SC.View.design( 
	//SC.Control, 
{
	
	layout : { left: 0, right: 0, bottom: 0, height: 100 },
	childViews : 'dragLabelView nameLabelView nameFieldView saveButtonView cancelButtonView'.w(),
	backgroundColor: 'red',
	layerId : 'create-label-view',
	
	dragLabelView : SC.LabelView.design({
		classNames : ['form-label'],
		layout : { left: 35, top: 10 },
		value : 'Drag the target to a position on the Body Board'
		
	}),

	
	
	nameLabelView : SC.LabelView.design({
		classNames : ['form-label'],
		layout : { left: 10, top: 40 },
		value : 'Label Name: '
	}),
	
	nameFieldView : SC.TextFieldView.design({
		layout : { left: 90, top: 35, width: 190, height: 25 },
		valueBinding : 'BodyBoard.labelController.name'
	}),
	
	saveButtonView : SC.ButtonView.design({
		layout : { bottom: 10, right: 120, height: 35, width: 100 },
		title : 'SAVE',
		action : 'requestSaveLabel'
	}),
	
	cancelButtonView : SC.ButtonView.design({
		layout : { bottom: 10, right: 10, height: 35, width: 100 },
		title : 'CANCEL',
		action : 'requestCancelCreateLabel'
		
	})
}); if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');