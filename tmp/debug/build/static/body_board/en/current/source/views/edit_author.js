// ==========================================================================
// Project:   BodyBoard - editAuthorView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.editAuthorView = SC.View.extend( SC.Control, {
	
	contentBinding : 'BodyBoard.authorController.content',
	childViews : 'completionLabel completionField ratingLabel ratingField titleLabel titleField firstNameLabel firstNameField lastNameLabel lastNameField emailLabel emailField educationLabel educationField positionLabel positionField specialtyLabel specialtyField'.w(),
	
	
	//COMPLETION
	completionLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Profile Completion:'
	}),
	completionField : SC.LabelView.extend({
		layout : {},
		valueBinding : '.parentView*content.completion'
	}),
	
	//RATING
	ratingLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Rating:'
	}),
	ratingField : SC.LabelView.extend({
		layout : {},
		valueBinding : '.parentView*content.rating'
	}),
	
	//TITLE
	titleLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Title:'
	}),
	titleField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.title'
	}),
	
	//FIRST NAME
	firstNameLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'First Name:'
	}),
	firstNameField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.firstName'
	}),
	
	//LAST NAME
	lastNameLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Last Name:'
	}),
	lastNameField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.lastName'
	}),
	
	//EMAIL
	emailLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Email:'
	}),
	emailField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.email'
	}),
	
	//EDUCATION
	educationLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Education:'
	}),
	educationField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.education'
	}),
	
	//POSITION
	positionLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Position:'
	}),
	positionField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.position'
	}),
	
	//SPECIALTY
	specialtyLabel : SC.LabelView.extend({
		layout : {  },
		textAlign : SC.ALIGN_RIGHT,
		value : 'Specialty:'
	}),
	specialtyField : SC.TextFieldView.extend({
		layout : {},
		valueBinding : '.parentView*content.specialty'
	})
	
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');