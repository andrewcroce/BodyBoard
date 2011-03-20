

sc_require('data_sources/jquery.couch');
sc_require('data_sources/sha1');



BodyBoard.userController = SC.ObjectController.create({
	
	contentIsChanged: NO,
	buffer : null,
	emptyContent: SC.Object.create(),
	content: this.emptyContent,
	savingCallbackTarget: null,
	savingCallbackMethod: null,
	savingRecord: null,
	originalProperties: null,
	name : '',
	password : '',
	id : '',
	isSaveOk : NO,
	
	observeRecordState : function() {
		var userRecord = this.get("content");
		var authorRecord = BodyBoard.bufferedAuthorController.get('content');
		if(  authorRecord.get("status") === SC.Record.READY_DIRTY || authorRecord.get("status") === SC.Record.READY_NEW ) {
			this.set("isSaveOk", YES);
		} else {
			this.set("isSaveOk", NO);        
		}
		/*
		if( userRecord.get("status") === SC.Record.READY_DIRTY || userRecord.get("status") === SC.Record.READY_NEW  || authorRecord.get("status") === SC.Record.READY_DIRTY || authorRecord.get("status") === SC.Record.READY_NEW ) {
			this.set("isSaveOk", YES);
		} else {
			this.set("isSaveOk", NO);           
		}	
		*/
	}.observes('*content.status','BodyBoard.bufferedAuthorController.content.status'),
	
	
	createNewUser : function(){
		var bufferedStore = BodyBoard.store.chain();
		var newUser = bufferedStore.createRecord(BodyBoard.User,{
			name : '',
			roles : '[]',
			type : 'user'
		});
		console.log('creating new user: ', newUser);
		this.resetContent(bufferedStore,newUser,null);
	},
	
	editUser : function(){
		
		var bufferedStore = BodyBoard.store.chain();
		var userId = BodyBoard.userController.get('id');
		var bufferedUser = bufferedStore.find(BodyBoard.User,userId);
		console.log('editing user:',bufferedUser);
		var backup = bufferedUser.backup();
		console.log('backup:',backup);
		BodyBoard.bufferedUserController.resetContent(bufferedStore, bufferedUser, backup);
		bufferedUser.beginEditing();
	},
	
	resetContent : function(bufferedStore, bufferedRecord, originalProperties){
	
		console.log('Resetting buffered user controller');	
		this.set('savingRecord', null);
		this.set('savingCallbackTarget', null);
		this.set('savingCallbackMethod', null);
		this.set('buffer', bufferedStore);
		/*
		if(bufferedRecord.isRecord == YES){
			console.log('Its a record');
			this.set('content', bufferedRecord);
		}
		*/
		this.set('originalProperties', originalProperties);
	
	},
	
	saveNew : function(callbackTarget, callbackMethod){
		var bufferedRecord,bufferedStore,userRecord,user;
		bufferedRecord = this.get('content');
		bufferedStore = this.get('buffer');
		bufferedStore.commitChanges();
		bufferedStore.destroy();
		console.log('Committed record');
		/*
		userRecord = BodyBoard.store.find(bufferedRecord);
		if(userRecord != null) {
			this.set('savingRecord', userRecord);
		}
		if(callbackTarget != null){
			this.set('savingCallbackTarget', callbackTarget);
		}
		if(callbackMethod != null){
			this.set('savingCallbackMethod', callbackMethod);
		}
		console.log('Callback set');
		*/
		
		var doc = {
			name : this.get('name'),
			roles : this.get('roles'),
			type : this.get('type')
		};
		
		console.log('User doc created');
		
		$.couch.signup(
			doc,
			this.get('password'),
			{
				success : function(response){
					console.log('Signup successful: ', response);
					BodyBoard.bufferedAuthorController.set('user_id',response.id);
					//BodyBoard.userController.set('id',response.id);
					BodyBoard.bufferedAuthorController.save(BodyBoard.get('registerPage'), BodyBoard.registerController.finish());
				},
				error : function(status,error,reason){
					console.log('Signup error: ', status,error,reason);
				}
			}
		);
		
	},
	
	savingUserRecordStatusDidChange: function() {
		var userRecord = this.get('savingRecord');
		if (userRecord != null) {
			var callbackTarget = this.get('savingCallbackTarget');
			var callbackMethod = this.get('savingCallbackMethod');
			var status = userRecord.get("status");
			if (status === SC.Record.READY_CLEAN) {
				// Saved OK - select object in UI
				BodyBoard.usersController.selectObject(userRecord);
				if(callbackMethod != null){
					callbackMethod.call(callbackTarget, null);
				}
				this.resetContent(null, this.emptyContent, null);	
			} else {
				if (userRecord.get('isError')) {
					callbackMethod.call(callbackTarget, userRecord.get('errorObject'));
					this.fixSaveError(userRecord);
				}
			}
		}
	}.observes('*savingRecord.status'),
	
	fixSaveError: function(userRecord) {
		var store = userRecord.get('store');
		var isCreating = SC.none(userRecord.get('id'));
		var bufferedRecord;
		var bufferedStore = BodyBoard.store.chain();
		if (isCreating) {
			var backup = userRecord.backup();
			userRecord.destroy();
			bufferedRecord = bufferedStore.createRecord(BodyBoard.User, {});
			bufferedRecord.restore(backup);		
		} else {
			bufferedRecord = bufferedStore.materializeRecord(userRecord.get('storeKey'));
			store.writeStatus(userRecord.get('storeKey'), SC.Record.READY_DIRTY);
			userRecord.propertyDidChange('status');
			
		}
		this.resetContent(bufferedStore, bufferedRecord, this.get('originalProperties'));
		
	},
	
	
	discard : function(){
		console.log('discarding new user');
		BodyBoard.statechart.sendEvent('userCreationComplete'); 
		var bufferedStore = this.get('buffer');
		bufferedStore.discardChanges();
		bufferedStore.destroy();
		var bufferedRecord = this.get('content');
		if (!SC.none(bufferedRecord.get('id'))) {
			var userRecord = BodyBoard.store.find(bufferedRecord);
			var store = userRecord.get('store');
			var status = userRecord.get('status');
	      if (status === SC.Record.READY_DIRTY) {
				userRecord.restore(this.get('originalProperties'));
				store.writeStatus(userRecord.get('storeKey'), SC.Record.READY_CLEAN);
				userRecord.propertyDidChange('status');
			}
		}
		this.resetContent(null, this.emptyContent, null);
	},
	
	
	contentStatusDidChange : function(){
		var userRecord = this.get('content');
		if (userRecord == null) {
			this.set('contentIsChanged', NO);
		} else {
			var status = userRecord.get("status");
			if (status === SC.Record.READY_DIRTY || status === SC.Record.READY_NEW) {
				this.set('contentIsChanged', YES);
			} else {
				this.set('contentIsChanged', NO);
			}
		}
	}.observes('*content.status'),
	
	
	
	validate : function(){
		var bufferedRecord = this.get('content');
		var name = bufferedRecord.get('name');
		
	}
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');