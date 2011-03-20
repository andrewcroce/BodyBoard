// ==========================================================================
// Project:   BodyBoard - accountNavView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.accountNavView = SC.View.design({
	
	layout: { bottom: 0, right: 0 },
	childViews : 'authorNameView manageAccountButtonView logoutButtonView'.w(),
	
	authorNameView : SC.LabelView.design({
		layout : { top: 7, right: 7 },
		textAlign : SC.ALIGN_RIGHT,
		classNames : 'header-label'.w(),
		valueBinding : 'BodyBoard.authorController.fullName'
	}),
	
	manageAccountButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 50, width: 110 },
		title : 'Manage Account',
		action : 'requestManageAccount',
		layerId : 'manage-account-button'
	}),
	
	logoutButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 0, width: 50 },
		title : 'Logout',
		action : 'requestLogout',
		layerId : 'logout-button'
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');