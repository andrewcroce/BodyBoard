// ==========================================================================
// Project:   BodyBoard.accountsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
BodyBoard.accountsController = SC.ArrayController.create(
	SC.SelectionSupport,
/** @scope BodyBoard.accountsController.prototype */ {

	isLoggingIn : NO,
	emailInput : '',
	passwordInput : '',
	
	attemptLogin : function() {
		
		try {
			
			var email = this.get('emailInput');
			if( email == null || email == '' ) {
				throw SC.Error.desc('Please enter your email address');
			}
			
			var password = this.get('passwordInput');
			if( password == null || password == '' ) {
				throw SC.Error.desc('Please enter your password');
			}
			
			// Simulate a HTTP call to check our data.
			// If the credentials dont match the sample, then get a bad url so we get 404 error
			var url = '/body_board/index.html';
			if (email != 'test@test.com' || password != '1234') {
				url = '/body_board/bad_url.js';
			}
			
			SC.Request.getUrl(url).notify(this, 'completeLogin').send();
			return YES;
			
		}
		
		catch( error ) {
			this.set('errorMessage', error.message);
			this.set('isLoggingIn', NO);
			return NO;
		}
		
	},
	
	
	completeLogin : function( response ) {
	
		try{
			
			this.set('isLoggingIn', NO);
			SC.Logger.info('HTTP status code: ' + response.status);
			if( !SC.ok(response) ) {
				throw SC.Error.desc('Invalid username or password');
			}
			
			var authCookie = SC.Cookie.create();
			authCookie.name = 'BodyBoardAuthCookie';
			authCookie.value = 'logged in';
			length = new Date();
			length.setTime(length.getTime() + 3600000);
			authCookie.expires = length;
			authCookie.write();
			
			var query = SC.Query.local( BodyBoard.Account, {
				conditions : 'email = {email}',
				email : this.get('emailInput')
			});
			
			var currentAccount = BodyBoard.store.find(query);
			this.set('selection', currentAccount);
			this.set('errorMessage', '');
			
			//console.log('selection');
			console.log('hello');
			
			BodyBoard.statechart.sendEvent('loginSuccess'); 
			
		}
		catch (error) {
			this.set('errorMessage', error.message);
			SC.Logger.info('Error in completeLogin: ' + error.message);
			BodyBoard.statechart.sendEvent('loginError'); 
		}
		
	}
	
}) ;





/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
BodyBoard.accountController = SC.ObjectController.create(
/** @scope BodyBoard.accountController.prototype */ {

	contentBinding : 'BodyBoard.accountsController.selection',
	contentBindingDefault : SC.Binding.single()

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');