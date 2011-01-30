// ==========================================================================
// Project:   BodyBoard - statechart
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.statechart = Ki.Statechart.create({
	
	rootState : Ki.State.design({
		
		
		
		// INITIALIZE THE BODYBOARD VIEWER
		
		enterState : function() {
			BodyBoard.viewerController.initViewer();
		},
		
		
		
		
		
		/*
		*	LOGIN STATE
		*
		* The initial state is, which automatically checks if the user is logged in
		*/
		
		initialSubstate : 'homeState',
		loginState : Ki.State.design({
			
			
			
			//AUTOMATIC LOGIN
			
			initialSubstate : 'autoLoginState',
			autoLoginState : Ki.State.design({
				
				enterState : function() {
					console.log('Entered auto login state');
					//activeAccount = BodyBoard.accountController.get('content');
					//console.log(activeAccount);
					//if( activeAccount ) {
					//	this.gotoState('loggedInState');
					//} else {
						
						this.gotoState('loggedInState');
					//}
				},
				
				//If it succeeds, go to the Logged In Home
				autoLoginSuccess : function( response ) {
					this.gotoState('loggedInState');
				},
				
				//If it fails, go to the Public Home
				autoLoginFailure : function() {
					this.gotoState('homeState');
				}
				
			}),
			
			
			
			//	LOGIN DEFAULT, manual request for login
			
			loginDefaultState : Ki.State.design({
				
				enterState : function() {
					console.log('Entered login state');
					BodyBoard.getPath('loginPage.mainPane').append();
				},
				
				requestSubmitLogin : function() {
					console.log('Requested login');
					BodyBoard.loginController.attemptLogin();
				},
				
				loginError : function() {
					this.gotoState('loginErrorState');
				},
				
				loginSuccess : function() {
					this.gotoState('loggedInState');
				},
				
				requestCancelLogin : function() {
					console.log('Cancelled login');
					BodyBoard.getPath('loginPage.mainPane').remove();
					this.gotoState('publicState');
				}
				
				
			}),
			
			
			
			//	LOGIN ERROR
			
			loginErrorState : Ki.State.design({
				
				requestPassword : function() {
					
				}
				
			})
		
		}),
		
		
		
		
		
		/*
		*	HOME STATE
		*
		*	Base state for exploring the BodyBoard
		*/
		
		homeState : Ki.State.design({
			
			enterState : function() {
				console.log('Entered home state');
			},
			
			requestViewArticle : function() {
				this.gotoState('viewArticleState');
			},
			
			//	PUBLIC STATE
			
			initialSubstate : 'publicState',
			publicState : Ki.State.design({
				
				enterState : function() {
					console.log('Entered public state');
					BodyBoard.setPath('mainPage.mainPane.topView.loginNavView.nowShowing','defaultLoginNavView');
					//BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','homeView');					
				},
				
				//User manually requests Login
				requestLogin : function(){	
					this.gotoState('loginDefaultState');
					
				},

				requestRegister : function() {
					this.gotoState('registerState');
				}
			}),
			
			
			
			//LOGGED IN STATE
			
			loggedInState : Ki.State.design({
				
				initialSubstate : 'loggedInDefaultState',
				enterState : function() {
					console.log('Entered logged-in state');
					BodyBoard.getPath('loginPage.mainPane').remove();
					BodyBoard.setPath('mainPage.mainPane.topView.loginNavView.nowShowing','accountNavView');
					//Moved to loginController.completeLogin
					//BodyBoard.accountController.set('content', BodyBoard.store.find('BodyBoard.Account', 1) );
					//BodyBoard.authorsController.selectObject(BodyBoard.accountController.get('author'));
					BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','authorContentView');
					//BodyBoard.setPath('mainPage.mainPane.middleView.scrollView.contentView.nowShowing','authorContentView');
				},
				
				requestLogout : function() {
					BodyBoard.accountController.set('content', '');
					BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','homeView');
					this.gotoState('publicState');
				},
				
				requestManageAccount : function() {
					this.gotoState('manageAccountState');
				},
				
				loggedInDefaultState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered default logged-in state');
					},
					
					requestCreateArticle : function(){
						this.gotoState('createArticleState');
					},
					
					requestCreateLabel : function() {
						this.gotoState('createLabelState');
					},
					
					requestEditAuthor : function() {
						this.gotoState('editAuthorState');
					}
					
				}),
				
				manageAccountState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered manage account state');
						BodyBoard.setPath('mainPage.mainPane.middleView.bottomRightView.contentView.nowShowing','editAuthorView');
					},
					
					requestSaveAccount : function() {
						console.log('Requested save account info');
						BodyBoard.accountController.saveAccount();
					},
					
					requestCancelEditAccount : function() {
						console.log('Cancel edit account info');
						BodyBoard.setPath('mainPage.mainPane.middleView.bottomRightView.contentView.nowShowing','bodyView');
						this.gotoState('loggedInDefaultState');
						
						//BodyBoard.accountController.undoChanges();  //TO DO
						
					}
					
				}),
				
				createArticleState : Ki.State.design({
					
					requestCreateCaption : function() {
						this.gotoState('createCaptionState');
					},
					
					
				}),
				
				createLabelState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered create label state');
						BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing','createLabelView');
						BodyBoard.setPath('mainPage.bodyView.dragTargetView.isVisible', YES);
						BodyBoard.labelsController.addLabel();
					},
					
					requestSaveLabel : function(){
						console.log('Requested save new label');
						BodyBoard.labelController.saveLabel();
					}, 
					
					requestCancelCreateLabel : function(){
						console.log('Requested cancel create label');
						BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing','emptyView');
						BodyBoard.setPath('mainPage.bodyView.dragTargetView.isVisible', NO);
						this.gotoState('loggedInDefaultState');
						BodyBoard.labelController.cancelLabelCreation();
						
					}
					
				}),
				
				createCaptionState : Ki.State.design({
					
				}),
				
				editAuthorState : Ki.State.design({
					
				})
				
			}),
			
			
			//View an article, public action
			viewArticleState : Ki.State.design({
				
				enterState : function() {
					BodyBoard.articleController.viewArticle();
				},
				
				
			}),
			
			//View an Author's profile, public action
			viewAuthor : function() {
				
			}
			
			
		}),
		
		
		
		
		/*
		*	REGISTER STATE
		*
		*	Register an Author account
		*/
		registerState : Ki.State.design({
			
			enterState : function(){
				console.log('Entered register state');
				BodyBoard.registerController.beginRegistration();
				BodyBoard.getPath('registerPage.mainPane').append();
			},
			
			//	REGISTER DEFAULT STATE
			
			initialSubstate : 'registerDefaultState',
			registerDefaultState : Ki.State.design({
				
				initialSubstate : 'registerFirstState',
				enterState : function() {
				
				},
				
				registerFirstState : Ki.State.design({
					enterState : function(){
						console.log('Entered first registration state');
					},
					requestNext : function(){
						BodyBoard.registerController.submitNext();
						this.gotoState('registerSecondState');
						BodyBoard.setPath('registerPage.mainPane.contentView.nowShowing','registerSecondPage');
					}
				}),
				
				registerSecondState : Ki.State.design({
					enterState : function(){
						console.log('Entered second registration state');
					},
					requestBack : function(){
						this.gotoState('registerFirstState');
						BodyBoard.setPath('registerPage.mainPane.contentView.nowShowing','registerFirstPage');
					},
					requestSubmit : function(){
						BodyBoard.registerController.finishRegistration();
					},
					
					registrationComplete : function(){
						this.gotoState('registerConfirmState');
						BodyBoard.setPath('registerPage.mainPane.contentView.nowShowing','registerConfirmPage');
					}
					
				}),
				
				
				registerConfirmState : Ki.State.design({
					enterState : function(){
						console.log('Entered registration confirmation state');
					},
					
					requestDone : function(){
						//BodyBoard.registerController.finish();
						console.log('Registration finished');
						BodyBoard.getPath('registerPage.mainPane').remove();
						//this.gotoState('publicState');
						this.gotoState('loggedInDefaultState');
					}
				}),
				
				requestCancelRegister : function(){
					BodyBoard.registerController.cancelRegistration();
					BodyBoard.getPath('registerPage.mainPane').remove();
					this.gotoState('publicState');
				},
				
				
			}),
			
			
			
			//	REGISTER ERROR STATE
			
			registerErrorState : Ki.State.design({
				
			})
			
			
		}),
		
		
		
		
		
		
		
	})
	
});