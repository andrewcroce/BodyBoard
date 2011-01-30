// ==========================================================================
// Project:   BodyBoard
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
BodyBoard = SC.Application.create(
  /** @scope BodyBoard.prototype */ {

  NAMESPACE: 'BodyBoard',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.


	store: SC.Store.create().from(SC.Record.fixtures),
  
	
	store: SC.Store.create({ 
	  commitRecordsAutomatically: YES
	}).from('BodyBoard.BodyBoardDataSource'),
	

  // TODO: Add global constants or singleton objects needed by your app here.
	
	/*
	SeaDragon : {},
	isInitialized : NO,
	
	viewer : function(){
		if( isInitialized == NO ){
			isInitialized = YES;
			BodyBoard.SeaDragon = new Seadragon.Viewer('body-board-view');
		}
		return BodyBoard.SeaDragon;
	}
	*/
	
	
}) ;
