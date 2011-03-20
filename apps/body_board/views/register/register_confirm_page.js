// ==========================================================================
// Project:   BodyBoard - registerConfirmPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */


BodyBoard.registerConfirmPage = SC.View.design({
	
	layout : { top: 0, bottom: 0, left: 0, right: 0 },
	childViews : 'headerView thanksView messageView okButtonView'.w(),
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
	
	thanksView : SC.LabelView.design({
		layout : { top: 90, left: 30, right: 30 },
		valueBinding : 'BodyBoard.registerController.thanksMessage'
	}),
	
	messageView : SC.LabelView.design({
		layout : { top: 140, left: 30, right: 30 },
		value : 'A confirmation email has been sent to the address you provided. To complete the process and begin creating content, please check your email and follow the link.'
	}),
	
	okButtonView : SC.ButtonView.design({
		layout : { centerX: 0, top: 460, width: 100 },
		title : 'OK',
		action : 'requestDone'
	})

});