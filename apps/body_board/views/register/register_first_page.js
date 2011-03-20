// ==========================================================================
// Project:   BodyBoard - registerFirstPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */


BodyBoard.registerFirstPage = SC.View.design({
	
	layout : { top: 0, bottom: 0, left: 0, right: 0 },
	childViews : 'headerView firstNameLabelView firstNameFieldView lastNameLabelView lastNameFieldView emailLabelView emailFieldView confirmEmailFieldView emailCheckView passwordlLabelView passwordFieldView confirmPasswordFieldView passwordCheckView nextButtonView cancelButtonView'.w(),
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
	
	firstNameLabelView : SC.LabelView.design({
		layout : { top: 90, left: 30 },
		value : 'First Name'
	}),
	
	firstNameFieldView : SC.TextFieldView.design({
		layout : { top: 85, left: 120, width: 330, height: 25 },
		hint: 'Enter your first name',
		valueBinding : 'BodyBoard.bufferedAuthorController.firstName'
	}),
	
	
	lastNameLabelView : SC.LabelView.design({
		layout : { top: 120, left: 30 },
		value : 'Last Name'
	}),
	
	lastNameFieldView : SC.TextFieldView.design({
		layout : { top: 115, left: 120, width: 330, height: 25 },
		valueBinding : 'BodyBoard.bufferedAuthorController.lastName',
		hint: 'Enter your last name'
	}),
	
	
	
	
	emailLabelView : SC.LabelView.design({
		layout : { top: 180, left: 30 },
		value : 'Email'
	}),
	
	emailFieldView : SC.TextFieldView.design({
		layout : { top: 175, left: 120, width: 330, height: 25 },
		valueBinding : 'BodyBoard.userController.name',
		hint: 'Enter a valid email address'
	}),
	
	confirmEmailLabelView : SC.LabelView.design({
		layout : { top: 210, left: 30 },
		value : 'Confirm Email'
	}),
	
	confirmEmailFieldView : SC.TextFieldView.design({
		layout : { top: 205, left: 120, width: 330, height: 25 },
		valueBinding : 'BodyBoard.registerController.confirmEmail',
		hint: 'Enter your email address again'
	}),
	
	emailCheckView : SC.View.design({
		layout : { top: 190, right: 13, width: 25, height: 25 },
		classNames : ['check-view'],
		layerId : 'email-check'
	}),
	
	
	passwordlLabelView : SC.LabelView.design({
		layout : { top: 270, left: 30 },
		value : 'Password'
	}),
	
	passwordFieldView : SC.TextFieldView.design({
		layout : { top: 265, left: 120, width: 330, height: 25 },
		valueBinding : 'BodyBoard.userController.password',
		hint: 'Choose a password at least 8 characters long'
	}),
	
	confirmPasswordlLabelView : SC.LabelView.design({
		layout : { top: 300, left: 30 },
		value : 'Confirm Password',
		isPassword : YES
	}),
	
	confirmPasswordFieldView : SC.TextFieldView.design({
		layout : { top: 295, left: 120, width: 330, height: 25 },
		valueBinding : 'BodyBoard.registerController.confirmPassword',
		isPassword : YES,
		hint: 'Enter your password again'
	}),
	
	passwordCheckView : SC.View.design({
		layout : { top: 280, right: 13, width: 25, height: 25 },
		classNames : ['check-view'],
		layerId : 'password-check'
	}),
	
	
	
	
	cancelButtonView : SC.ButtonView.design({
		layout : { centerX: -65, top: 460, width: 120 },
		title : 'Cancel',
		action : 'requestCancelRegister'
	}),
	
	nextButtonView : SC.ButtonView.design({
		layout : { centerX: 65, top: 460, width: 120 },
		title : 'Next',
		isEnabledBinding : 'BodyBoard.registerController.isNextOk',
		action : 'requestNext'
	}),
	
})