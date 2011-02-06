// ==========================================================================
// Project:   BodyBoard - accountNavView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.accountNavView = SC.View.design({
	
	layout: { bottom: 0, right: 0 },
	childViews : 'manageAccountButtonView logoutButtonView'.w(),
	
	manageAccountButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 140, width: 120 },
		title : 'Manage Account',
		action : 'requestManageAccount',
		layerId : 'manage-account-button'
	}),
	
	logoutButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 10, width: 120 },
		title : 'Logout',
		action : 'requestLogout',
		layerId : 'logout-button'
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');