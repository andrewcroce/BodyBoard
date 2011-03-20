// ==========================================================================
// Project:   BodyBoard.captionsController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
BodyBoard.captionsController = SC.ArrayController.create(
/** @scope BodyBoard.captionsController.prototype */ {

  // TODO: Add your own code here.

}) ;


BodyBoard.labelCaptionsController = SC.ArrayController.create(
/** @scope BodyBoard.labelCaptionsController.prototype */ {

	contentBinding : 'BodyBoard.labelController.captions'

}) ;


BodyBoard.bufferedCaptionController = SC.ObjectController.create({
	contentIsChanged: NO,
	buffer : null,
	emptyContent: SC.Object.create(),
	content: this.emptyContent,
	savingCallbackTarget: null,
	savingCallbackMethod: null,
	savingRecord: null,
	originalProperties: null,
	
	createNewCaption : function(){
		var bufferedStore = BodyBoard.store.chain();
		var newCaption = bufferedStore.createRecord(BodyBoard.Caption,{
			text : 'New Caption',
			author_id : BodyBoard.authorController.get('id'),
			label_id : BodyBoard.labelController.get('id')
		});
		console.log('creating new caption: ', newCaption);
		this.reset(bufferedStore,newCaption,null);
	},
	
	editLabel : function(){
		var bufferedStore = BodyBoard.store.chain();
		var captionId = BodyBoard.captionController.get('id');
		var bufferedCaption = bufferedStore.find(BodyBoard.Caption,captionId);
		this.reset(bufferedStore, bufferedCaption, bufferedCaption.backup());
	},
	
	reset : function(bufferedStore, bufferedRecord, originalProperties){
		console.log('Resetting buffered caption controller');
		this.set('savingRecord', null);
		this.set('savingCallbackTarget', null);
		this.set('savingCallbackMethod', null);
		this.set('buffer', bufferedStore);
		this.set('content', bufferedRecord);
		this.set('originalProperties', originalProperties);
	},
	
	save : function(callbackTarget, callbackMethod){
		var bufferedRecord,bufferedStore,captionRecord,caption;
		bufferedRecord = this.get('content');
		bufferedStore = this.get('buffer');
		bufferedStore.commitChanges();
		bufferedStore.destroy();
		
		captionRecord = BodyBoard.store.find(bufferedRecord);
		this.set('savingRecord', captionRecord);
		this.set('savingCallbackTarget', callbackTarget);
		this.set('savingCallbackMethod', callbackMethod);
		captionRecord.commitRecord();
		caption = BodyBoard.captionView.create({});
		caption.set('content',captionRecord);
		//BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(caption);
		
		console.log('Caption Saved');
		BodyBoard.statechart.sendEvent('captionCreationComplete'); 
	},
	
	savingUserRecordStatusDidChange: function() {
		var captionRecord = this.get('savingRecord');
		if (captionRecord != null) {
			var callbackTarget = this.get('savingCallbackTarget');
			var callbackMethod = this.get('savingCallbackMethod');
			var status = captionRecord.get("status");
			if (status === SC.Record.READY_CLEAN) {
				// Saved OK - select object in UI
				BodyBoard.captionsController.selectObject(captionRecord);
				callbackMethod.call(callbackTarget, null);
				this.reset(null, this.emptyContent, null);	
			} else {
				if (captionRecord.get('isError')) {
					callbackMethod.call(callbackTarget, captionRecord.get('errorObject'));
					this.fixSaveError(captionRecord);
				}
			}
		}
	}.observes('*savingRecord.status'),
	
	fixSaveError: function(captionRecord) {
		var store = captionRecord.get('store');
		var isCreating = SC.none(captionRecord.get('id'));
		var bufferedRecord;
		var bufferedStore = BodyBoard.store.chain();
		if (isCreating) {
			var backup = captionRecord.backup();
			captionRecord.destroy();
			bufferedRecord = bufferedStore.createRecord(BodyBoard.Label, {});
			bufferedRecord.restore(backup);		
		} else {
			bufferedRecord = bufferedStore.materializeRecord(captionRecord.get('storeKey'));
			store.writeStatus(captionRecord.get('storeKey'), SC.Record.READY_DIRTY);
			captionRecord.propertyDidChange('status');
			
		}
		this.reset(bufferedStore, bufferedRecord, this.get('originalProperties'));
		
	},
	
	discard : function(){
		console.log('discarding new caption');
		BodyBoard.statechart.sendEvent('captionCreationComplete'); 
		var bufferedStore = this.get('buffer');
		bufferedStore.discardChanges();
		bufferedStore.destroy();
		var bufferedRecord = this.get('content');
		if (!SC.none(bufferedRecord.get('id'))) {
			var captionRecord = BodyBoard.store.find(bufferedRecord);
			var store = captionRecord.get('store');
			var status = captionRecord.get('status');
	      if (status === SC.Record.READY_DIRTY) {
				captionRecord.restore(this.get('originalProperties'));
				store.writeStatus(captionRecord.get('storeKey'), SC.Record.READY_CLEAN);
				captionRecord.propertyDidChange('status');
			}
		}
		this.reset(null, this.emptyContent, null);
	},
	
	contentStatusDidChange : function(){
		var captionRecord = this.get('content');
		if (captionRecord == null) {
			this.set('contentIsChanged', NO);
		} else {
			var status = captionRecord.get("status");
			if (status === SC.Record.READY_DIRTY || status === SC.Record.READY_NEW) {
				this.set('contentIsChanged', YES);
			} else {
				this.set('contentIsChanged', NO);
			}
		}
	}.observes('*content.status'),
	
	validate : function(){
		var bufferedRecord = this.get('content');
		var text = bufferedRecord.get('text');
		if(SC.empty(text)) {
			throw SC.Error.desc('Caption text is required', 'text');
		}
		var author_id = bufferedRecord.get('author_id');
		if(SC.empty(author_id)){
			throw SC.Error.desc('author_id not set', 'author_id');
		}
		var label_id = bufferedRecord.get('label_id');
		if(SC.empty(label_id)){
			throw SC.Error.desc('label_id not set', 'label_id');
		}
	}
}),


BodyBoard.captionController = SC.ObjectController.create(
/** @scope BodyBoard.captionController.prototype */ {

  contentBinding : SC.Binding.single('BodyBoard.captionsController.selection')

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');