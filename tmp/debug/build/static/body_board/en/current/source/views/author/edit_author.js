// ==========================================================================
// Project:   BodyBoard - editAuthorView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.editAuthorView = SC.View.design( SC.Control, {
	
	//contentBinding : 'BodyBoard.authorsController.selection',
	childViews : 'completionLabel completionField titleLabel titleField firstNameLabel firstNameField lastNameLabel lastNameField emailLabel emailField passwordLabel passwordField confirmPasswordLabel confirmPasswordField educationLabel educationField positionLabel positionField specialtyLabel specialtyField saveButtonView cancelButtonView'.w(),
	classNames : 'green-bg'.w(),
	
	//COMPLETION
	completionLabel : SC.LabelView.extend({
		layout : { left: 20, top: 40 },
		textAlign : SC.ALIGN_LEFT,
		value : 'PROFILE COMPLETION:'
	}),
	completionField : SC.LabelView.extend({
		layout : { top: 40, left: 160 },
		valueBinding : 'BodyBoard.bufferedAuthorController.completion'
	}),
	
	//RATING
	/*
	ratingLabel : SC.LabelView.extend({
		layout : { left: 300, top: 40 },
		textAlign : SC.ALIGN_LEFT,
		value : 'REPUTATION'
	}),
	ratingField : SC.LabelView.extend({
		layout : { left: 350, top: 40 },
		valueBinding : '.parentView*content.rating'
	}),
	*/
	
	//TITLE
	titleLabel : SC.LabelView.extend({
		layout : { left: 20, top: 80 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Title'
	}),
	titleField : SC.TextFieldView.extend({
		layout : { left: 60, top: 75, width: 75, height: 25 },
		valueBinding : 'BodyBoard.bufferedAuthorController.title'
	}),
	
	
	
	//FIRST NAME
	firstNameLabel : SC.LabelView.extend({
		layout : { left: 190, top: 80 },
		textAlign : SC.ALIGN_LEFT,
		value : 'First Name'
	}),
	firstNameField : SC.TextFieldView.extend({
		layout : { left: 265, top: 75, width: 220, height: 25 },
		valueBinding : 'BodyBoard.bufferedAuthorController.firstName'
	}),
	
	
	
	//LAST NAME
	lastNameLabel : SC.LabelView.extend({
		layout : { left: 190, top: 115 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Last Name'
	}),
	lastNameField : SC.TextFieldView.extend({
		layout : { left: 265, top: 110, width: 220, height: 25 },
		valueBinding : 'BodyBoard.bufferedAuthorController.lastName'
	}),
	
	
	
	
	//EMAIL
	emailLabel : SC.LabelView.extend({
		layout : { left: 20, top: 160 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Email Address'
	}),
	emailField : SC.TextFieldView.extend({
		layout : { left: 135, top: 155, width: 350, height: 25 },
		valueBinding : '.parentView*content.account.email'
	}),
	
	
	
	
	//NEW PASSWORD
	passwordLabel : SC.LabelView.extend({
		layout : { left: 20, top: 220 },
		textAlign : SC.ALIGN_LEFT,
		value : 'New Password'
	}),
	passwordField : SC.TextFieldView.extend({
		layout : { left: 135, top: 215, width: 350, height: 25 },
		//valueBinding : '.parentView*content.education'
	}),
	
	//CONFIRM NEW PASSWORD
	confirmPasswordLabel : SC.LabelView.extend({
		layout : { left: 20, top: 255 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Confirm Password'
	}),
	confirmPasswordField : SC.TextFieldView.extend({
		layout : { left: 135, top: 250, width: 350, height: 25 },
		//valueBinding : '.parentView*content.education'
	}),
	
	
	
	
	//EDUCATION
	educationLabel : SC.LabelView.extend({
		layout : { left: 20, top: 290 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Education'
	}),
	educationField : SC.TextFieldView.extend({
		layout : { left: 135, top: 285, width: 350, height: 60 },
		isTextArea : YES,
		valueBinding : 'BodyBoard.bufferedAuthorController.education',
	}),
	
	
	
	
	//POSITION
	positionLabel : SC.LabelView.extend({
		layout : { left: 20, top: 360 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Position'
	}),
	positionField : SC.TextFieldView.extend({
		layout : { left: 135, top: 355, width: 350, height: 60 },
		isTextArea : YES,
		valueBinding : 'BodyBoard.bufferedAuthorController.position'
	}),
	
	
	
	
	//SPECIALTY
	specialtyLabel : SC.LabelView.extend({
		layout : { left: 20, top: 430 },
		textAlign : SC.ALIGN_LEFT,
		value : 'Specialty'
	}),
	specialtyField : SC.TextFieldView.extend({
		layout : { left: 135, top: 425, width: 350, height: 60 },
		isTextArea : YES,
		valueBinding : 'BodyBoard.bufferedAuthorController.specialty'
	}),
	
	saveButtonView : SC.ButtonView.extend({
		layout : { left: 275, top: 510, width: 100, height: 25 },
		title : 'SAVE',
		isEnabledBinding : 'BodyBoard.userController.isSaveOk',
		action : 'requestSaveAccount'
	}),
	cancelButtonView : SC.ButtonView.extend({
		layout : { left: 385, top: 510, width: 100, height: 25 },
		title : 'CANCEL',
		action : 'requestCancelEditAccount'
	})
	

});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');