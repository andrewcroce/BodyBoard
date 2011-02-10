// ==========================================================================
// Project:   BodyBoard.DataSource
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Data Source Here)

  	@extends ThothSC.WebSocketDataSource
	or
	@extends ThothSC.XHRPollingDataSource
*/

sc_require('WebSocketDataSource');

BodyBoard.DataSource = ThothSC.WebSocketDataSource.extend({
  authSuccessCallback: function(){
    //ThothApp.statechart.sendEvent('authSuccess');
  },

  authFailureCallback: function(){
    //ThothApp.statechart.sendEvent('authFailure');
  },

  ThothHost: '02.dev',
  ThothPort: '8080',
  ThothURLPrefix: '/thoth'
});

//sc_require('XHRPollingDataSource');
//
//ThothApp.DataSource = ThothSC.XHRPollingDataSource.extend({
//  authSuccessCallback: function(){
//    ThothApp.statechart.sendEvent('authSuccess');
//  },
//
//  authFailureCallback: function(){
//    ThothApp.statechart.sendEvent('authFailure');
//  },
//
//  ThothURLPrefix: '/thoth'
//});
