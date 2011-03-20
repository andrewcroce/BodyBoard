// ==========================================================================
// Project:   BodyBoard.loginController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/

sc_require('data_sources/jquery.couch');
sc_require('data_sources/sha1');

BodyBoard.loginController = SC.ObjectController.create(
/** @scope BodyBoard.loginController.prototype */ {

	isLoggingIn : NO,
	email : '',
	password : '',
	
	beginLogin : function(){
	
		this.set('isLoggingIn', YES);
	},
	
	enterLogin : function() {
				
		try {
			
			var email = BodyBoard.userController.get('name');
			if( email == null || email == '' ) {
				throw SC.Error.desc('Please enter your email address');
			} else {
				this.set('email', email);
			}
			
			var password = BodyBoard.userController.get('password');
			if( password == null || password == '' ) {
				throw SC.Error.desc('Please enter your password');
			} else {
				this.set('password',password);
			}
			
			this.login(this.get('email'), this.get('password'));
			
		}
		
		catch( error ) {
			this.set('errorMessage', error.message);
			this.set('isLoggingIn', NO);
			return NO;
		}
		
	},
	
	login : function(email, pass){
		console.log('Loggin in with:',email,pass);
		$.couch.login({ 
			name : email, 
			password : pass, 
			success : function(response){ 
				//console.log('Login is successful: ', response); 
				BodyBoard.loginController.loginSuccess(response);
				$.couch.session({
					success : function(session){
						console.log('Session info: ',session);
					},
					error : function(status,error,reason){
						console.log('Session error: ',status,error,reason);
					}
				});
			},
			error : function(status,error,reason){ 
				BodyBoard.loginController.loginError(status,error,reason);
				//console.log('Login error:',status,error,reason); 
			}
		});
	},
	
	loginSuccess : function(response){

		var response_id = 'org.couchdb.user:' + response.name;
		console.log('Login Success: ',response_id);
		var query = SC.Query.local(BodyBoard.Author,"user_id = {id}",{ id : response_id }); 
		var author = BodyBoard.store.find(query).objectAt(0);
		this.invokeLast(function(){
			BodyBoard.authorsController.selectObject(author);
			//console.log('id: ',BodyBoard.userController.get('id'));
			//console.log(BodyBoard.authorController.get('firstName'));
			BodyBoard.statechart.sendEvent('loginSuccess');
		});
	},
	
	loginError : function(status,error,reason){
		console.log('Login error:',status,error,reason);
	},
	
	/*
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
				_id : 2,
				author : 2
			};
			//BodyBoard.accountController.set('content', BodyBoard.store.find('BodyBoard.Account', account._id ) );
		
			
			
			this.invokeLast(function(){
				console.log('Logged in as: ', BodyBoard.accountController.get('author'));
				//BodyBoard.authorsController.selectObject(BodyBoard.accountController.get('author'));
				this.set('errorMessage', '');
				BodyBoard.statechart.sendEvent('loginSuccess'); 
			});		
			
			
		}
		catch (error) {
			this.set('errorMessage', error.message);
			SC.Logger.info('Error in completeLogin: ' + error.message);
			BodyBoard.statechart.sendEvent('loginError'); 
		}
		
	},
	*/
	
	
	logout : function(){
		$.couch.logout({
			success : function(response){
				console.log('Logged out successfully: ', response);
				BodyBoard.authorController.set('content', null);
			},
			error : function(status,error,reason){
				console.log('Logout error: ',status,error,reason);
			}
		});
		
	},
	



}) ;
