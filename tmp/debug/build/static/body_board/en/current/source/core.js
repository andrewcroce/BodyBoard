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

	
	//store: SC.Store.create().from(SC.Record.fixtures), 
  	
	//store: SC.Store.create().from('BodyBoard.DataSource'),
  	//storeType: 'Thoth',

	store: SC.Store.create({
		commitRecordsAutomatically: YES
	}).from("BodyBoard.CouchDataSource")
	
	//store: SC.Store.create({ 
	  //commitRecordsAutomatically: YES
	//}).from('BodyBoard.BodyBoardDataSource'),

	
}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');