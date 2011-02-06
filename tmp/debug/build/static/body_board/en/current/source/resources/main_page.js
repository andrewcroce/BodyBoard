// ==========================================================================
// Project:   BodyBoard - mainPage
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */




// This page describes the main user interface for your application.  
BodyBoard.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
	mainPane : SC.MainPane.design({
	
		defaultResponder : 'BodyBoard.statechart', 
		
		childViews : 'topView middleView'.w(),
	
	
		topView : SC.ToolbarView.design({
		
			layout : { left: 0, right: 0, height: 57 },
			childViews : 'logoView loginNavView'.w(),
			layerId : 'main-header',
			
			logoView : SC.LabelView.design({
				layout : { left: 10, centerY: 0, height: 20 },
				tagname : 'h1',
				value : 'BodyBoard'
			}),
			
			loginNavView : SC.ContainerView.design ({
				layout : { bottom: 10, right: 10 },
				contentView : SC.SceneView.design({
					scenes : 'defaultLoginNavView'.w(),
					nowShowing : 'defaultLoginNavView'
				})
			})
			
		}),
		
		
		middleView : SC.SplitView.design({
		
			layout : { top: 57, bottom: 0, left: 0, right:0 },
			backgroundColor : 'white',
			layoutDirection : SC.LAYOUT_HORIZONTAL,			
			//childViews : 'topLeftView dividerView bottomRightView'.w(),
			
			autoresizeBehavior: SC.RESIZE_TOP_LEFT,
			defaultThickness : 0.6,
			
			
			
			/*
			*
			*	LEFT VIEW CONTAINER
			*/
			
			topLeftView : SC.ContainerView.design({
			
				isContainer : YES,
				layout : { top: 0, bottom: 0, left: 0 },
				
				contentView : SC.SceneView.design({ 
					scenes : 'homeView authorContentView'.w(),
					nowShowing : 'homeView'
				}),
				
				
			}),
			
			topLeftMinThickness : 300,
			topLeftMaxThickness : 500,
			
			
			dividerView : SC.SplitDividerView.design({
				layout : {}
			}),
			
			
			
			
			//RIGHT VIEW CONTAINER
			bottomRightView : SC.ContainerView.design({
				
				isContainer : YES,
				layout : { top: 0, bottom: 0, left: 0, right: 0 },
				//childViews : 'contentView'.w(),
				
				contentView : SC.SceneView.design({ 
					scenes : 'bodyView editAuthorView'.w(),
					nowShowing : 'bodyView'
				}),
				
			}),
			
			
		}),
		
	
	}),
	
	//LOGIN NAVIGATION LAYOUTS
	
	//Default (now logged in)
	defaultLoginNavView : BodyBoard.defaultLoginNavView.design({}),
	//Logged In
	accountNavView : BodyBoard.accountNavView.design({}),
	
	//HOMEPAGE VIEWS
	homeView : BodyBoard.homeView.design({}),
	bodyView : BodyBoard.bodyView.design({}),
	
	//LOGGED IN VIEWS
	authorContentView : BodyBoard.authorContentView.design({}),
	editAuthorView : BodyBoard.editAuthorView.design({}),
	createLabelView : BodyBoard.createLabelView.design({}),

	emptyView : SC.View.design({}), //Need this for SceneViews that currently have no scene... this cant be right
	
	/*
	****TO BE CREATED
	articleView : BodyBoard.articleView.design({}),
	createArticleView : BodyBoard.createArticleView.design({}),
	
	*/

});
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');