// ==========================================================================
// Project:   BodyBoard - statechart
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.statechart = Ki.Statechart.create({
	
	rootState : Ki.State.design({
		//initialSubstate : 'STARTING',
		initialSubstate : 'homeState',
		
		// INITIALIZE THE BODYBOARD VIEWER
		enterState : function() {
			BodyBoard.viewerController.initViewer();
		},
		
		
		/*
		STARTING : Ki.State.design({
			
			enterState: function(){
				BodyBoard.authorsController.initializeForLoading();
				BodyBoard.systemsController.initializeForLoading();
				BodyBoard.labelsController.initializeForLoading();
			
				if(BodyBoard.get('storeType') === 'Thoth'){
					this.gotoState('LOADING_AUTHORS');
				} else {
					this.gotoState('LOADING_APP');
				}
			}
			
		}),
		
		
		LOADING_AUTHORS : Ki.State.design({
			
			enterState : function(){
				return this.performAsync('loadAuthors');
			},
			
			loadAuthors : function(){
				
			},
			
			generateCheckAuthorsFunction : function(){
				var me = this;
				return function(val) {
					if(val & SC.Record.READY_CLEAN){
						return YES;
					} else {
						return NO;
					}
				}
			}
			
		}),
		
		AUTHORS_LOADED : Ki.State.design({
			
		}),
		
		
		LOADING_APP : Ki.State.design({
			
		}),
		*/
		
		
		/*
		*	LOGIN STATE
		*
		* The initial state is, which automatically checks if the user is logged in
		*/
		

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
					BodyBoard.loginController.beginLogin();
				},
				
				requestSubmitLogin : function() {
					console.log('Requested login');
					BodyBoard.loginController.enterLogin();
				},
				
				loginError : function() {
					this.gotoState('loginErrorState');
				},
				
				loginSuccess : function() {
					this.gotoState('loggedInState');
				},
				
				requestCancelLogin : function() {
					console.log('Cancelled login');
					this.gotoState('publicState');
					BodyBoard.getPath('loginPage.mainPane').remove();
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
			
			requestShowCaptions : function(){
				BodyBoard.labelController.set('showingCaptions',YES);
				BodyBoard.labelController.showCaptions();
			},
			
			requestHideCaptions : function(){
				BodyBoard.labelController.set('showingCaptions',NO);
				BodyBoard.labelController.hideCaptions();
			},
			
			requestAboutPage : function(){
				BodyBoard.getPath('aboutPage.mainPane').append();
			},
			requestCloseAboutPage : function(){
				BodyBoard.getPath('aboutPage.mainPane').remove();
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
					BodyBoard.setPath('mainPage.bodyView.bodyMenuView.contentView.canEditContent',YES);
					BodyBoard.setPath('mainPage.bodyView.bodyMenuView.contentView.canDeleteContent',YES);
					BodyBoard.getPath('mainPage.mainPane.middleView')._updateTopLeftThickness(325);
					
					//Moved to loginController.completeLogin
					//BodyBoard.accountController.set('content', BodyBoard.store.find('BodyBoard.Account', 1) );
					//BodyBoard.authorsController.selectObject(BodyBoard.accountController.get('author'));
					//BodyBoard.authorsController.selectObject(BodyBoard.store.find(BodyBoard.Author,2));
					BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','authorContentView');
					//BodyBoard.setPath('mainPage.mainPane.middleView.scrollView.contentView.nowShowing','authorContentView');
				},
				
				exitState : function(){
					BodyBoard.setPath('mainPage.bodyView.bodyMenuView.contentView.canEditContent',NO);
					BodyBoard.setPath('mainPage.bodyView.bodyMenuView.contentView.canDeleteContent',NO);
				},
				
				requestLogout : function() {
					BodyBoard.loginController.logout()
					BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','homeView');
					this.gotoState('publicState');
					BodyBoard.getPath('mainPage.mainPane.middleView')._updateTopLeftThickness(0);
					
				},
				
				requestManageAccount : function() {
					this.gotoState('manageAccountState');
				},
				
				systemChanged : function(){
					BodyBoard.setPath('mainPage.bodyView.labelsToggleView.title', 'Show My Labels');
				},
				
				requestToggleLabels : function(){
					if(BodyBoard.systemLabelsController.get('showAuthorLabels') == NO) {
						console.log('Show Author labels only');
						BodyBoard.systemLabelsController.set('showAuthorLabels', YES);
						BodyBoard.setPath('mainPage.bodyView.labelsToggleView.title', 'Show All Labels');
						
						this.invokeLast(function(){									
							
							BodyBoard.labelCollectionView.get('childViews').forEach(function(item,index,enumerable){
								item.updateLayer();
							});
							
						});
						
					} else {
						
						console.log('Show All labels');
						BodyBoard.setPath('mainPage.bodyView.labelsToggleView.title', 'Show My Labels');
						BodyBoard.systemLabelsController.set('showAuthorLabels', NO);
						
						BodyBoard.labelCollectionView.get('childViews').forEach(function(item,index,enumerable){
							item.updateLayer();
						});
						
					}
				},
				
				loggedInDefaultState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered default logged-in state');
					},
					
					
					requestCreateLabel : function() {
						this.gotoState('createLabelState');
					},
					
					requestEditLabel : function() {
						this.gotoState('editLabelState');
					},
					
					requestCreateCaption : function() {
						this.gotoState('createCaptionState');
					},
					
					requestEditCaption : function() {
						this.gotoState('editCaptionState');
					},
					
					requestEditAuthor : function() {
						this.gotoState('editAuthorState');
					}
					
				}),
				
				manageAccountState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered manage account state');
						BodyBoard.setPath('mainPage.mainPane.middleView.bottomRightView.contentView.nowShowing','editAuthorView');
						BodyBoard.bufferedAuthorController.editAuthor();
					},
					
					requestSaveAccount : function() {
						console.log('Requested save account info');
						BodyBoard.bufferedAuthorController.save();
					},
					
					requestCancelEditAccount : function() {
						console.log('Cancel edit account info');
						BodyBoard.setPath('mainPage.mainPane.middleView.bottomRightView.contentView.nowShowing','bodyView');
						BodyBoard.bufferedAuthorController.discard();
						this.gotoState('loggedInDefaultState');
						
						//BodyBoard.accountController.undoChanges();  //TO DO
						
					}
					
				}),
				
				
				createLabelState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered create label state');
						BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing','createLabelView');
						BodyBoard.setPath('mainPage.bodyView.dragTargetView.isVisible', YES);
						BodyBoard.labelController.set('isEditable',YES);
					},
					
					requestSaveLabel : function(){
						console.log('Requested save new label');
						//BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing',null);
						//BodyBoard.setPath('mainPage.bodyView.dragTargetView.isVisible', NO);
						//this.gotoState('loggedInDefaultState')
						try {
							//BodyBoard.setPath('createLabelView.saveButtonView.isEnabled',NO);
							BodyBoard.bufferedLabelController.save(BodyBoard.get('createLabelView'),this.labelCreationComplete, YES);
						} catch(error) {
							BodyBoard.get('mainPage').showError(error);
							
						}
					}, 
					
					requestCancelCreateLabel : function(){
						console.log('Requested cancel create label');
						BodyBoard.bufferedLabelController.discard();
						//this.gotoState('loggedInDefaultState');
						
					},
					
					labelCreationComplete : function() {
						console.log('Label creation finished');
						BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing',null);
						BodyBoard.setPath('mainPage.bodyView.dragTargetView.isVisible', NO);
						BodyBoard.getPath('mainPage.bodyView.dragTargetView').adjust({ bottom: 45, left: 142 });
						//BodyBoard.systemsController.set('allowsSelection',YES);
						BodyBoard.statechart.gotoState('loggedInDefaultState');
					}
					
				}),
				
				editLabelState : Ki.State.design({
					
					enterState : function(){
						console.log('Entered edit label state');
						BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing','editLabelView');
						BodyBoard.bufferedLabelController.set('isEditable',YES);
						BodyBoard.bufferedLabelController.editLabel();
					},
					requestSaveLabel : function(){
						console.log('Requested save new label');
						try {
							BodyBoard.bufferedLabelController.save(BodyBoard.get('editLabelView'),this.labelEditingComplete, NO);
						} catch(error) {
							BodyBoard.get('mainPage').showError(error);
							
						}
					},
					requestCancelEditLabel : function(){
						console.log('Requested cancel create label');
						BodyBoard.bufferedLabelController.discard();						
					},
					
					labelEditingComplete : function() {
						console.log('Label creation finished');
						BodyBoard.setPath('mainPage.bodyView.editPanelView.nowShowing',null);
						BodyBoard.statechart.gotoState('loggedInDefaultState');
					}
					
				}),
				
				
				
				
				createCaptionState : Ki.State.design({
					
					enterState : function() {
						console.log('Entered create caption state');
						BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','createCaptionView');
						BodyBoard.bufferedCaptionController.createNewCaption();
					},
					
					requestSaveCaption : function(){
						console.log('Requested save new caption');
						try {
							BodyBoard.bufferedCaptionController.save(BodyBoard.get('createCaptionView'),this.captionCreationComplete);
						} catch(error) {
							BodyBoard.get('mainPage').showError(error);
						}
					},
					
					requestCancelCreateCaption : function(){
						console.log('Requested cancel create caption');
						BodyBoard.bufferedCaptionController.discard();	
					
					},
					
					captionCreationComplete : function() {
						console.log('Caption creation finished');
						BodyBoard.setPath('mainPage.mainPane.middleView.topLeftView.contentView.nowShowing','authorContentView');	
						BodyBoard.statechart.gotoState('loggedInDefaultState');
					}
					
				}),
				
				editCaptionState : Ki.State.design({
					
					enterState : function(){
						console.log('Entered edit caption state');
					}
					
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
						BodyBoard.registerController.saveUser();
					},
					
					registrationComplete : function(){
						this.gotoState('registerConfirmState');
						BodyBoard.loginController.login(BodyBoard.userController.get('name'),BodyBoard.userController.get('password'));
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
					console.log('Cancelling');
					BodyBoard.getPath('registerPage.mainPane').remove();
					this.gotoState('publicState');
				},
				
				
			}),
			
			
			
			//	REGISTER ERROR STATE
			
			registerErrorState : Ki.State.design({
				
			})
			
			
		}),
		
		
		
		
		
		
		
	})
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');