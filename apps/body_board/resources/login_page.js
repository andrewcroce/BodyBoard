// ==========================================================================
// Project:   BodyBoard - loginPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

// This page describes the main user interface for your application.  
BodyBoard.loginPage = SC.Page.create({
	
	mainPane : SC.PanelPane.design({
		
		defaultResponder: 'BodyBoard.statechart',
		
		layout : { centerX: 0, centerY: 0, width: 500, height: 300 },
		
		contentView: SC.View.extend({
			
			layout : { top: 0, bottom: 0, left: 0, right: 0 },
			childViews : 'headerView errorMessageView emailLabelView emailInputView passwordlLabelView passwordInputView submitButtonView cancelButtonView'.w(),
			
			headerView : SC.ToolbarView.design({
				layout : { left: 0, right: 0, height: 30 },
				childViews : 'myLabelView'.w(),
				myLabelView : SC.LabelView.design({
					layout : { left: 10, centerY: 0, height: 20 },
					tagname : 'h2',
					value : 'Login to BodyBoard'
				})
			}),
			
			errorMessageView : SC.LabelView.design({
				layout : { left: 50, top: 50, width: 440 },
				valueBinding : 'BodyBoard.loginController.errorMessage'
			}),
			
			emailLabelView : SC.LabelView.design({
				layout : { left: 50, top: 110 },
				value : 'Email'
			}),
			
			emailInputView : SC.TextFieldView.design({
				layout : { left: 130, top: 105, height: 30, width: 300 },
				valueBinding : 'BodyBoard.loginController.emailInput',
			}),
			
			passwordlLabelView : SC.LabelView.design({
				layout : { left: 50, top: 155 },
				value : 'Password'
			}),
			
			passwordInputView : SC.TextFieldView.design({
				layout : { left: 130, top: 150, height: 30, width: 300 },
				valueBinding : 'BodyBoard.loginController.passwordInput',
			}),
			
			submitButtonView : SC.ButtonView.design({
				layout : { centerX: -65, top: 250, width: 120 },
				title : 'Submit',
				action : 'requestSubmitLogin'
			}),
			
			cancelButtonView : SC.ButtonView.design({
				layout : { centerX: 65, top: 250, width: 120 },
				title : 'Cancel',
				action : 'requestCancelLogin'
			})
			
		})
		
	})
	
});