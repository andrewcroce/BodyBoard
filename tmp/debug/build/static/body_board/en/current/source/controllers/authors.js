// ==========================================================================
// Project:   BodyBoard.authorsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/



BodyBoard.authorsController = SC.ArrayController.create( 

/** @scope BodyBoard.authorsController.prototype */ {
	allowsMultipleSelection : NO,

});


BodyBoard.bufferedAuthorController = SC.ObjectController.create({
	
	contentIsChanged: NO,
	buffer : null,
	emptyContent: SC.Object.create(),
	content: this.emptyContent,
	savingCallbackTarget: null,
	savingCallbackMethod: null,
	savingRecord: null,
	originalProperties: null,
	
	createNewAuthor : function(){
		var bufferedStore = BodyBoard.store.chain();
		var newAuthor = bufferedStore.createRecord(BodyBoard.Author,{
			firstName : '',
			lastName : '',
			title : '',
			position : '',
			education : '',
			specialty : '',
			user_id : ''
		});
		console.log('creating new author: ', newAuthor);
		this.resetContent(bufferedStore,newAuthor,null);
	},
	
	editAuthor : function(){
		
		var bufferedStore = BodyBoard.store.chain();
		var authorId = BodyBoard.authorController.get('id');
		var bufferedAuthor = bufferedStore.find(BodyBoard.Author,authorId);
		console.log('editing author:',bufferedAuthor);
		var backup = bufferedAuthor.backup();
		console.log('backup:',backup);
		BodyBoard.bufferedAuthorController.resetContent(bufferedStore, bufferedAuthor, backup);
		//bufferedLabel.beginEditing();
	},
	
	resetContent : function(bufferedStore, bufferedRecord, originalProperties){
		
		this.set('savingRecord', null);
		this.set('savingCallbackTarget', null);
		this.set('savingCallbackMethod', null);
		this.set('buffer', bufferedStore);
		this.set('content', bufferedRecord);
		this.set('originalProperties', originalProperties);
		console.log('Resetting buffered author controller');
	},
	
	save : function(callbackTarget, callbackMethod){
		var bufferedRecord,bufferedStore,authorRecord,author;
		bufferedRecord = this.get('content');
		bufferedStore = this.get('buffer');
		bufferedStore.commitChanges();
		bufferedStore.destroy();
		
		authorRecord = BodyBoard.store.find(bufferedRecord);
		this.set('savingRecord', authorRecord);
		this.set('savingCallbackTarget', callbackTarget);
		this.set('savingCallbackMethod', callbackMethod);
		authorRecord.commitRecord();
		
		this.invokeLast(function(){
		
		});
		
		console.log('Author Saved');
		BodyBoard.statechart.sendEvent('authorCreationComplete'); 
	},
	
	savingAuthorRecordStatusDidChange: function() {
		var authorRecord = this.get('savingRecord');
		if (authorRecord != null) {
			var callbackTarget = this.get('savingCallbackTarget');
			var callbackMethod = this.get('savingCallbackMethod');
			var status = authorRecord.get("status");
			if (status === SC.Record.READY_CLEAN) {
				// Saved OK - select object in UI
				BodyBoard.authorsController.selectObject(authorRecord);
				if(callbackMethod != null){
					callbackMethod.call(callbackTarget, null);
				}
				this.resetContent(null, this.emptyContent, null);	
			} else {
				if (authorRecord.get('isError')) {
					callbackMethod.call(callbackTarget, authorRecord.get('errorObject'));
					this.fixSaveError(authorRecord);
				}
			}
		}
	}.observes('*savingRecord.status'),
	
	fixSaveError: function(authorRecord) {
		var store = authorRecord.get('store');
		var isCreating = SC.none(authorRecord.get('id'));
		var bufferedRecord;
		var bufferedStore = BodyBoard.store.chain();
		if (isCreating) {
			var backup = authorRecord.backup();
			authorRecord.destroy();
			bufferedRecord = bufferedStore.createRecord(BodyBoard.Author, {});
			bufferedRecord.restore(backup);		
		} else {
			bufferedRecord = bufferedStore.materializeRecord(authorRecord.get('storeKey'));
			store.writeStatus(authorRecord.get('storeKey'), SC.Record.READY_DIRTY);
			authorRecord.propertyDidChange('status');
			
		}
		this.resetContent(bufferedStore, bufferedRecord, this.get('originalProperties'));
		
	},
	
	discard : function(){
		console.log('discarding new author');
		BodyBoard.statechart.sendEvent('authorCreationComplete'); 
		var bufferedStore = this.get('buffer');
		bufferedStore.discardChanges();
		bufferedStore.destroy();
		var bufferedRecord = this.get('content');
		if (!SC.none(bufferedRecord.get('id'))) {
			var authorRecord = BodyBoard.store.find(bufferedRecord);
			var store = authorRecord.get('store');
			var status = authorRecord.get('status');
	      if (status === SC.Record.READY_DIRTY) {
				authorRecord.restore(this.get('originalProperties'));
				store.writeStatus(authorRecord.get('storeKey'), SC.Record.READY_CLEAN);
				authorRecord.propertyDidChange('status');
			}
		}
		this.resetContent(null, this.emptyContent, null);
	},
	
	contentStatusDidChange : function(){
		var authorRecord = this.get('content');
		if (authorRecord == null) {
			this.set('contentIsChanged', NO);
		} else {
			var status = authorRecord.get("status");
			if (status === SC.Record.READY_DIRTY || status === SC.Record.READY_NEW) {
				this.set('contentIsChanged', YES);
			} else {
				this.set('contentIsChanged', NO);
			}
		}
	}.observes('*content.status'),
	
	validate : function(){
		var bufferedRecord = this.get('content');
		var firstName = bufferedRecord.get('firstName');
		if(SC.empty(firstName)) {
			throw SC.Error.desc('First Name is required', 'firstName');
		}
		var lastName = bufferedRecord.get('lastName');
		if(SC.empty(lastName)) {
			throw SC.Error.desc('Last Name is required', 'lastName');
		}
		
	}
	
});


BodyBoard.authorController = SC.ObjectController.create({
	
	contentBinding : 'BodyBoard.authorsController.selection',
	
});



BodyBoard.authorLabelsController = SC.ArrayController.create({
	
	contentBinding : 'BodyBoard.authorController.labels'
	
});

BodyBoard.authorSystemAuthorsController = SC.ArrayController.create({
	
	content : null
});

BodyBoard.authorCaptionsController = SC.ArrayController.create({
	
	contentBinding : 'BodyBoard.authorController.captions'
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');