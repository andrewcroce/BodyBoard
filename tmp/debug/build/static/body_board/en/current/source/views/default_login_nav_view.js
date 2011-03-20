// ==========================================================================
// Project:   BodyBoard - defaultLoginNavView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.defaultLoginNavView = SC.View.design({
	
	layout: { bottom: 0, right: 0 },
	childViews : 'registerButtonView loginButtonView'.w(),
	
	registerButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 40, width: 98 },
		title : 'Create Account',
		action : 'requestRegister',
		layerId : 'create-account-button'
	}),
	
	loginButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 0, width: 40 },
		title : 'Login',
		action : 'requestLogin',
		layerId : 'login-button'
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');