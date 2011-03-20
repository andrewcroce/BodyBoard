// ==========================================================================
// Project:   BodyBoard.labelsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/




//========================================================================
//========================================================================

//	Labels Controller

//========================================================================
//========================================================================

BodyBoard.labelsController = SC.ArrayController.create( 
/** @scope BodyBoard.labelsController.prototype */ {

  	orderBy : 'system_id',
	allowsMultipleSelection : NO,
	isEditing : YES,
	isSaveOk : NO,
	isDeleteOk : NO,
	
});



//========================================================================
//========================================================================

//	Buffered Label Controller (for creating new labels and updating existing labels)

//========================================================================
//========================================================================


BodyBoard.bufferedLabelController = SC.ObjectController.create({
	
	contentIsChanged: NO,
	buffer : null,
	emptyContent: SC.Object.create(),
	content: this.emptyContent,
	savingCallbackTarget: null,
	savingCallbackMethod: null,
	savingRecord: null,
	originalProperties: null,
	
	createNewLabel : function(){
		var bufferedStore = BodyBoard.store.chain();
		var newLabel = bufferedStore.createRecord(BodyBoard.Label,{
			name : 'New Label',
			x : BodyBoard.viewerController.get('targetX'),
			y : BodyBoard.viewerController.get('targetY'),
			author_id : BodyBoard.authorController.get('id'),
			system_id : BodyBoard.systemController.get('id')
		});
		console.log('creating new label: ', newLabel);
		this.resetContent(bufferedStore,newLabel,null);
	},
	
	editLabel : function(){
		
		var bufferedStore = BodyBoard.store.chain();
		var labelId = BodyBoard.labelController.get('id');
		var bufferedLabel = bufferedStore.find(BodyBoard.Label,labelId);
		console.log('editing label:',bufferedLabel);
		var backup = bufferedLabel.backup();
		console.log('backup:',backup);
		BodyBoard.bufferedLabelController.resetContent(bufferedStore, bufferedLabel, backup);
		//bufferedLabel.beginEditing();
	},
	
	resetContent : function(bufferedStore, bufferedRecord, originalProperties){
		
		this.set('savingRecord', null);
		this.set('savingCallbackTarget', null);
		this.set('savingCallbackMethod', null);
		this.set('buffer', bufferedStore);
		this.set('content', bufferedRecord);
		this.set('originalProperties', originalProperties);
		console.log('Resetting buffered label controller');
	},
	
	save : function(callbackTarget, callbackMethod, isNew){
		var bufferedRecord,bufferedStore,labelRecord,label;
		bufferedRecord = this.get('content');
		bufferedStore = this.get('buffer');
		bufferedStore.commitChanges();
		bufferedStore.destroy();
		
		labelRecord = BodyBoard.store.find(bufferedRecord);
		this.set('savingRecord', labelRecord);
		this.set('savingCallbackTarget', callbackTarget);
		this.set('savingCallbackMethod', callbackMethod);
		labelRecord.commitRecord();
		
		this.invokeLast(function(){
			if(isNew == YES){
				label = BodyBoard.labelView.create({});
				label.set('content',labelRecord);
				BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(label);
				BodyBoard.labelsController.selectObject(labelRecord);
			}
		});
		
		console.log('Label Saved');
		BodyBoard.statechart.sendEvent('labelCreationComplete'); 
	},
	
	savingUserRecordStatusDidChange: function() {
		var labelRecord = this.get('savingRecord');
		if (labelRecord != null) {
			var callbackTarget = this.get('savingCallbackTarget');
			var callbackMethod = this.get('savingCallbackMethod');
			var status = labelRecord.get("status");
			if (status === SC.Record.READY_CLEAN) {
				// Saved OK - select object in UI
				BodyBoard.labelsController.selectObject(labelRecord);
				callbackMethod.call(callbackTarget, null);
				this.resetContent(null, this.emptyContent, null);	
			} else {
				if (labelRecord.get('isError')) {
					callbackMethod.call(callbackTarget, labelRecord.get('errorObject'));
					this.fixSaveError(labelRecord);
				}
			}
		}
	}.observes('*savingRecord.status'),
	
	
	fixSaveError: function(labelRecord) {
		var store = labelRecord.get('store');
		var isCreating = SC.none(labelRecord.get('id'));
		var bufferedRecord;
		var bufferedStore = BodyBoard.store.chain();
		if (isCreating) {
			var backup = labelRecord.backup();
			labelRecord.destroy();
			bufferedRecord = bufferedStore.createRecord(BodyBoard.Label, {});
			bufferedRecord.restore(backup);		
		} else {
			bufferedRecord = bufferedStore.materializeRecord(labelRecord.get('storeKey'));
			store.writeStatus(labelRecord.get('storeKey'), SC.Record.READY_DIRTY);
			labelRecord.propertyDidChange('status');
			
		}
		this.resetContent(bufferedStore, bufferedRecord, this.get('originalProperties'));
		
	},
	
	
	discard : function(){
		console.log('discarding new label');
		BodyBoard.statechart.sendEvent('labelCreationComplete'); 
		var bufferedStore = this.get('buffer');
		bufferedStore.discardChanges();
		bufferedStore.destroy();
		var bufferedRecord = this.get('content');
		if (!SC.none(bufferedRecord.get('id'))) {
			var labelRecord = BodyBoard.store.find(bufferedRecord);
			var store = labelRecord.get('store');
			var status = labelRecord.get('status');
	      if (status === SC.Record.READY_DIRTY) {
				labelRecord.restore(this.get('originalProperties'));
				store.writeStatus(labelRecord.get('storeKey'), SC.Record.READY_CLEAN);
				labelRecord.propertyDidChange('status');
			}
		}
		this.resetContent(null, this.emptyContent, null);
	},
	
	
	contentStatusDidChange : function(){
		var labelRecord = this.get('content');
		if (labelRecord == null) {
			this.set('contentIsChanged', NO);
		} else {
			var status = labelRecord.get("status");
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
		if(SC.empty(name)) {
			throw SC.Error.desc('Label name is required', 'name');
		}
		var x = bufferedRecord.get('x');
		if(SC.empty(x)){
			throw SC.Error.desc('X position not set', 'x');
		}
		var y = bufferedRecord.get('y');
		if(SC.empty(y)){
			throw SC.Error.desc('Y position not set', 'y');
		}
		var author_id = bufferedRecord.get('author_id');
		if(SC.empty(author_id)){
			throw SC.Error.desc('author_id not set', 'author_id');
		}
		var system_id = bufferedRecord.get('system_id');
		if(SC.empty(system_id)){
			throw SC.Error.desc('system_id not set', 'system_id');
		}
	}
	
	
});




//========================================================================
//========================================================================

//	Label Controller (primarily for manipulating the view layer)

//========================================================================
//========================================================================


BodyBoard.labelController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.labelsController.selection'),
	allowSystemSet : YES,
	isHovering : NO,
	isShowingMoreButton : NO,
	isShowingCaptions : NO,
	currentLabelView : null,
	view : {},
	
	setSystemOnSelection : function(){
	
		if(this.get('allowSystemSet') == YES){
			var currentSystem = BodyBoard.systemController.get('content');
			//console.log(currentSystem.get('name'));
			if( currentSystem.get('id') != this.get('system') ){
				//console.log('Selected label, changing system');
				BodyBoard.systemsController.selectObject(this.get('system'));
				var that = this;
				BodyBoard.labelCollectionView.get('childViews').forEach(function(item,index,enumerable){
					console.log('Label ID: ',item.get('content').get('id'));
					if(item.get('content').get('id') == that.get('id')){
						that.set('currentLabelView',item);
						that.invokeLast(function(){
							that.get('currentLabelView').flashLabel();
							return;
						});
					}
				});
			}
			this.set('isHovering',NO);
		} else {
			//console.log('System setting blocked');
		}
		
	}.observes('content'),
	
	
	setCurrentLabelView : function(){
		
		var that = this;
		if(this.get('content') != null){
			BodyBoard.labelCollectionView.get('childViews').forEach(function(item,index,enumerable){
				console.log('Label ID: ',item.get('content').get('id'));
				if(item.get('content').get('id') == that.get('id')){
					that.set('currentLabelView',item);
					that.invokeLast(function(){
						that.get('currentLabelView').flashLabel();
						return;
					});
				}
			});
		}
		
	}.observes('content'),
	
	
	focusOnLabel : function(){
		var x,y;
		SC.RunLoop.begin();
		x = this.get('x');
		y = this.get('y');
		//console.log('Focusing on label ',x,',',y);
		if(this.get('isShowingCaptions') == NO) {
			BodyBoard.viewerController.get('viewer').viewport.panTo(new Seadragon.Point(x, y));
		} else {
			//BodyBoard.viewerController.get('viewer').viewport.panTo(new Seadragon.Point(x, y));
		}
		SC.RunLoop.end();
	},

	newLabelStartDrag : function( event, layout, view ) {
		
		//console.log('Started drag');
		view._mouseDownInfo = {
			pageX : event.pageX,
			pageY : event.pageY,
			left : layout.left,
			bottom : -layout.bottom,
			width : layout.width,
			height : layout.height
		};
		return YES;
	},
	
	
	
	newLabelDragged : function( event, view ) {
		var info, loc;
		console.log('Dragging...')
		info =  view._mouseDownInfo;	
			
		//loc = info.left + ( event.pageX - info.pageX );
		loc = info.left + ( event.pageX - info.pageX );
		view.adjust('left', loc);
		
		loc = info.bottom + ( event.pageY - info.pageY );
		//loc = info.bottom - event.pageY;
		view.adjust('bottom', -loc);
		
		BodyBoard.viewerController.setMousePosition();
		BodyBoard.viewerController.setTargetPosition(view);
		
		this.invokeLater(function(){
			//console.log(this.get('x'));
			//console.log(this.get('y'));
			
		});
		
		return YES;
	},
	
	
	newLabelRelease : function( event ) {

		BodyBoard.bufferedLabelController.createNewLabel();		
		return YES;
	},
	
	

	
});
