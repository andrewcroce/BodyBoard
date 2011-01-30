// ==========================================================================
// Project:   BodyBoard - defaultLoginNavView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.defaultLoginNavView = SC.View.design({
	
	layout: { bottom: 0, right: 0 },
	childViews : 'registerButtonView loginButtonView'.w(),
	
	registerButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 140, width: 120 },
		title : 'Register',
		action : 'requestRegister'
	}),
	
	loginButtonView : SC.ButtonView.design({
		layout : { top: 25, right: 10, width: 120 },
		title : 'Login',
		action : 'requestLogin'
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');