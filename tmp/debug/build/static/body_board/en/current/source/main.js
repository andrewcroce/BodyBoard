// ==========================================================================
// Project:   BodyBoard
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
BodyBoard.main = function main() {


	// Create the data source if it doesn't exist already. (FORCE)
	//var initDS = BodyBoard.store._getDataSource();
	
	//BodyBoard.getPath('mainPage.mainPane').append() ;
		
	
	//var authors = BodyBoard.store.find(SC.Query.local(BodyBoard.Author));
	var authors = BodyBoard.store.find(BodyBoard.AUTHORS_QUERY);
	BodyBoard.authorsController.set('content', authors);
	
	//var systems = BodyBoard.store.find(SC.Query.local(BodyBoard.System));
	var systems = BodyBoard.store.find(BodyBoard.SYSTEMS_QUERY);
	BodyBoard.systemsController.set('content', systems);
	
	//var labels = BodyBoard.store.find(SC.Query.local(BodyBoard.Label));
	var labels = BodyBoard.store.find(BodyBoard.LABELS_QUERY);
	BodyBoard.labelsController.set('content', labels);
	
	//var captions = BodyBoard.store.find(SC.Query.local(BodyBoard.Caption));
	var captions = BodyBoard.store.find(BodyBoard.CAPTIONS_QUERY);
	BodyBoard.captionsController.set('content', captions);
	
	BodyBoard.treeNavController.populate();
	
	BodyBoard.getPath('mainPage.mainPane').append() ;
	
	// Initialize the first responder
	BodyBoard.statechart.initStatechart(); 

} ;

function main() { BodyBoard.main(); }
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');