// ==========================================================================
// Project:   BodyBoard - registerPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

// This page describes the main user interface for your application.  
BodyBoard.registerPage = SC.Page.create({
	
	mainPane : SC.PanelPane.design({
		
		defaultResponder: 'BodyBoard.statechart',
		
		layout : { centerX: 0, centerY: 0, width: 500, height: 500 },
		
		contentView: SC.SceneView.extend({
			
			layout : { top: 0, bottom: 0, left: 0, right: 0 },
			scenes : 'registerFirstPage registerSecondPage registerConfirmPage'.w(),
			nowShowing : 'registerFirstPage',
			
		})
		
	}),
	
	registerFirstPage : BodyBoard.registerFirstPage.design({}),
	registerSecondPage : BodyBoard.registerSecondPage.design({}),
	registerConfirmPage : BodyBoard.registerConfirmPage.design({})
	
});