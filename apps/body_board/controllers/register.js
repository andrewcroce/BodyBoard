// ==========================================================================
// Project:   BodyBoard.registerController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
BodyBoard.registerController = SC.ObjectController.create(
/** @scope BodyBoard.registerController.prototype */ 

function() {

var REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
var account;
var author;

return {

	isRegistering : NO,
	confirmEmail : '',
	emailsDoMatch : NO,
	emailValid : NO,
	
	confirmPassword : '',
	passwordsDoMatch : NO,
	passwordValid : NO,
	
	title : '',
	education : '',
	position : '',
	specialty : '',
	
	isNextOk : NO,
	isSubmitOk : NO,
	
	
	
	beginRegistration : function() {

		//BodyBoard.accountController.addAccount();
		//BodyBoard.authorsController.addAuthor();
		BodyBoard.userController.createNewUser();
		BodyBoard.bufferedAuthorController.createNewAuthor();
		this.set('isRegistering',YES);
		console.log('Author and Account objects created');
		return YES;
		
	},
	
	
	
	compareEmails : function(){
		if(this.get('isRegistering') == YES){
			var email = BodyBoard.userController.get('name');
			var confirmEmail = this.get('confirmEmail');
			console.log('Comparing emails');
		
			if((email == confirmEmail) && (email.match(REGEX_EMAIL))) {
				console.log('Emails match')
				this.set('emailsDoMatch',YES);
				if(email.match(REGEX_EMAIL)) {
					this.set('emailValid',YES);
					console.log('Email validates');
					$('#email-check').addClass('checked');
				}
			} else {
				this.set('emailsDoMatch',NO);
				$('#email-check').removeClass('checked');
			}
		}
	}.observes('BodyBoard.userController.name','confirmEmail'),
	
	
	
	comparePasswords : function() {
		if(this.get('isRegistering') == YES){
			var password = BodyBoard.userController.get('password');
			var confirmPassword = this.get('confirmPassword');
			console.log('Comparing Passwords');
			if(password == confirmPassword) {
				this.set('passwordsDoMatch',YES);
				console.log('Passwords match');
				if(password.length > 3) {
					this.set('passwordValid',YES);
					console.log('Password validates');
					$('#password-check').addClass('checked');
				}
			} else {
				$('#password-check').removeClass('checked');
			}
		}
	}.observes('BodyBoard.userController.password','confirmPassword'),
	
	
	
	checkNextReady : function() {
		if(this.get('isRegistering') == YES){
			console.log('Checking if ready');
			if(this.get('passwordValid') ==  YES){
				if(this.get('emailValid') == YES){
					if((BodyBoard.bufferedAuthorController.get('lastName') != '') && (BodyBoard.bufferedAuthorController.get('lastName') != null)){
						if((BodyBoard.bufferedAuthorController.get('firstName') != '') && (BodyBoard.bufferedAuthorController.get('firstName') != null)){
							this.set('isNextOk',YES);
							console.log('Form validates, OK to move on');
						}
					}
				}
			}
		}
		
	}.observes('BodyBoard.bufferedAuthorController.firstName','BodyBoard.bufferedAuthorController.firstNamelastName','BodyBoard.userController.name','confirmEmail','BodyBoard.userController.password','confirmPassword'),
	
	
	
	submitNext : function(){
		console.log('Next submitted');
	},
	
	
	
	checkTitleField : function(){
		if(this.get('isRegistering') == YES){
			var value = BodyBoard.getPath('registerPage.registerSecondPage.titleSelectView.value');
			console.log('Checking title');
			if((value != null) && (value != '')){
				console.log('Title OK');
				this.set('title', value);
				this.set('isSubmitOk',YES);
			} else {
				this.set('isSubmitOk',NO);
			}
		}
	}.observes('BodyBoard.registerPage.registerSecondPage.titleSelectView.value'),
	
	
	
	saveUser : function() {
		console.log('Saving User account');
		//BodyBoard.userController.saveNew(BodyBoard.get('registerPage'), this.saveAuthor());
		BodyBoard.userController.saveNew(BodyBoard.get('registerPage'));
		//BodyBoard.statechart.sendEvent('userSavedOk');
		
	},
	/*
	saveAuthor : function() {
		console.log('Saving Author');
		//BodyBoard.bufferedAuthorController.set('user_id',BodyBoard.userController.get('id'));
		//BodyBoard.bufferedAuthorController.save(BodyBoard.get('registerPage'), this.finish());
		BodyBoard.bufferedAuthorController.save(BodyBoard.get('registerPage'));
		
	},
	*/
	
	finish : function(){
		BodyBoard.statechart.sendEvent('registrationComplete');
	},
	
	cancelRegistration : function() {
		//account = {},
		//author = {},
		this.set('isRegistering',NO);
		this.set('emailsDoMatch', NO);
		this.set('emailValid', NO);
		this.set('passwordsDoMatch',NO);
		this.set('passwordValid',NO);
		this.set('isNextOk',NO);
		this.set('isSubmitOk',NO);
		BodyBoard.userController.resetContent();
		BodyBoard.bufferedAuthorController.resetContent();
		console.log('Registration cancelled, information deleted');
		
	},
	
	
	
	
	
	thanksMessage : function(){
		var firstName = this.get('firstName');
		var ret;
		ret = 'Thanks %@! You have successfully registered an author account with BodyBoard.'.fmt(firstName);
		return ret;
	}.property('firstName'),
	
	
	
	

}}() ) ;
