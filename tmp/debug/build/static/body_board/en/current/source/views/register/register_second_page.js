// ==========================================================================
// Project:   BodyBoard - registerSecondPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */


BodyBoard.registerSecondPage = SC.View.design({
	
	layout : { top: 0, bottom: 0, left: 0, right: 0 },
	childViews : 'headerView titleLabelView titleSelectView educationLabelView educationFieldView positionLabelView positionFieldView specialtyLabelView specialtyFieldView requiredMessageLabel backButtonView cancelButtonView submitButtonView'.w(),
	classNames : 'green-bg'.w(),
	
	headerView : SC.ToolbarView.design({
		layout : { left: 0, right: 0, height: 30 },
		childViews : 'myLabelView'.w(),
		layerId : 'register-header',
		myLabelView : SC.LabelView.design({
			layout : { left: 10, centerY: 0, height: 20 },
			tagname : 'h2',
			value : 'Register for BodyBoard'
		})
	}),
	
	titleLabelView : SC.LabelView.design({
		layout : { top: 90, left: 30 },
		value : 'Title'
	}),
	
	titleSelectView : SC.SelectFieldView.design({
		layout : { top: 90, left: 120, width: 330 },
		emptyName : 'Choose an appropriate title',
		objects : ['M.D.','D.O.','Ph.D.','Professor','Teacher','Student','Other Medical Professional','None of the above'],
		valueBinding : 'BodyBoard.bufferedAuthorController.title'
	}),
	
	educationLabelView : SC.LabelView.design({
		layout : { top: 130, left: 30 },
		value : 'Education *'
	}),
	
	educationFieldView : SC.TextFieldView.design({
		layout : { top: 125, left: 120, width: 330, height: 75 },
		valueBinding : 'BodyBoard.bufferedAuthorController.education',
		isTextArea : YES,
		hint : 'If applicable, describe where you received your education, or what school you are currently attending.'
	}),
	
	positionLabelView : SC.LabelView.design({
		layout : { top: 210, left: 30 },
		value : 'Position *'
	}),
	
	positionFieldView : SC.TextFieldView.design({
		layout : { top: 205, left: 120, width: 330, height: 75 },
		valueBinding : 'BodyBoard.bufferedAuthorController.position',
		isTextArea : YES,
		hint : 'If applicable, describe your past or present professional positions.'
	}),
	
	specialtyLabelView : SC.LabelView.design({
		layout : { top: 290, left: 30 },
		value : 'Specialty *'
	}),
	
	specialtyFieldView : SC.TextFieldView.design({
		layout : { top: 285, left: 120, width: 330, height: 75 },
		valueBinding : 'BodyBoard.bufferedAuthorController.specialty',
		isTextArea : YES,
		hint : 'If applicable, describe your professional specialty or expertise'
	}),
	
	requiredMessageLabel : SC.LabelView.design({
		layout : { top: 370, left: 120, width: 330 },
		value : '* These fields are not required for registration'
	}),
	
	
	backButtonView : SC.ButtonView.design({
		layout : { centerX: -125, top: 460, width: 120 },
		title : 'Back',
		action : 'requestBack'
	}),
	
	cancelButtonView : SC.ButtonView.design({
		layout : { centerX: 0, top: 460, width: 120 },
		title : 'Cancel',
		action : 'requestCancelRegister'
	}),
	
	submitButtonView : SC.ButtonView.design({
		layout : { centerX: 125, top: 460, width: 120 },
		title : 'Submit',
		isEnabledBinding : 'BodyBoard.registerController.isSubmitOk',
		action : 'requestSubmit'
	}),
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');