// ==========================================================================
// Project:   BodyBoard - aboutPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

// This page describes the main user interface for your application.  
BodyBoard.aboutPage = SC.Page.create({
	
	mainPane : SC.PanelPane.design({
		
		defaultResponder: 'BodyBoard.statechart',
		
		layout : { centerX: 0, centerY: 0, width: 500, height: 600 },
		
		contentView: SC.View.extend({
			
			layout : { top: 0, bottom: 0, left: 0, right: 0 },
			childViews : 'headerView textView closeButtonView'.w(),
			classNames : 'green-bg'.w(),
			layerId : 'login-panel',
			
			headerView : SC.ToolbarView.design({
				layout : { left: 0, right: 0, height: 30 },
				childViews : 'myLabelView'.w(),
				layerId : 'about-header',
				myLabelView : SC.LabelView.design({
					layout : { left: 10, centerY: 0, height: 20 },
					tagname : 'h2',
					value : 'About the BodyBoard'
				})
			}),
			
			textView : SC.LabelView.design({
				layout : { left: 20, right: 20, top: 50, bottom: 20 },
				escapeHTML : NO,
				value : '<p>BodyBoard is a human anatomy browser and label sharing tool. Users can browse and explore labels and captions created by others, or they can sign up and create their own.</p><p>It was conceived and created by Andrew Croce for his master\'s thesis in Interactive Design at Philadelphia University\'s School of <a href="http://www.philau.edu/designandmedia/index.html" target="_blank">Design + Engineering</a>.</p><p>The application was built using <a href="http://www.sproutcore.com/" target="_blank">Sproutcore</a>, a client-side javascript web application framework, and <a href="http://gallery.expression.microsoft.com/SeadragonAjax" target="_blank">Seadragon-Ajax</a>, a deep-zoom image viewer library.</p> You can view the project source code at the <a href="https://github.com/andrewcroce/BodyBoard" target="_blank">BodyBoard Github repository</a>.'
			}),

			
			closeButtonView : SC.ButtonView.design({
				layout : { centerX: 0, top: 550, width: 120 },
				title : 'Close',
				action : 'requestCloseAboutPage'
			})
			
		})
		
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');