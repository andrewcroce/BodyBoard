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

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
	
	BodyBoard.getPath('mainPage.mainPane').append() ;
	
  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

	
	//var articles = BodyBoard.store.find(SC.Query.local(BodyBoard.Article));
	//BodyBoard.articlesController.set('content', articles);
	
	//BodyBoard.viewerController.initViewer();
	
	
	//var authors = BodyBoard.store.find(SC.Query.local(BodyBoard.Author));
	var authors = BodyBoard.store.find(BodyBoard.AUTHORS_QUERY);
	BodyBoard.authorsController.set('content', authors);
	
	//var systems = BodyBoard.store.find(SC.Query.local(BodyBoard.System));
	var systems = BodyBoard.store.find(BodyBoard.SYSTEMS_QUERY);
	BodyBoard.systemsController.set('content', systems);
	
	//var labels = BodyBoard.store.find(SC.Query.local(BodyBoard.Label));
	var labels = BodyBoard.store.find(BodyBoard.LABELS_QUERY);
	BodyBoard.labelsController.set('content', labels);
	
	BodyBoard.treeNavController.populate();

	// Initialize the first responder
	BodyBoard.statechart.initStatechart(); 

} ;

function main() { BodyBoard.main(); }
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');