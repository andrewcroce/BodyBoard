// ==========================================================================
// Project:   BodyBoard.loginController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/


BodyBoard.loginController = SC.ObjectController.create(
/** @scope BodyBoard.loginController.prototype */ {


	isLoggingIn : NO,
	emailInput : '',
	passwordInput : '',
	accountID : '',
	
	attemptLogin : function() {
		
		console.log('Attempting login');
		
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
	
		console.log('Completing login');
		
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
			
			//Simulated response account object
			var account = {
				id : 1,
				author : 1
			};
			BodyBoard.accountController.set('content', BodyBoard.store.find('BodyBoard.Account', account.id ) );
			BodyBoard.authorsController.selectObject(BodyBoard.accountController.get('author'));
		
			this.set('errorMessage', '');
			
			BodyBoard.statechart.sendEvent('loginSuccess'); 
			
		}
		catch (error) {
			this.set('errorMessage', error.message);
			SC.Logger.info('Error in completeLogin: ' + error.message);
			BodyBoard.statechart.sendEvent('loginError'); 
		}
		
	}



}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');