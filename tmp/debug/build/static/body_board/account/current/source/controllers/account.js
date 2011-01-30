// ==========================================================================
// Project:   BodyBoard.accountController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/

sc_require('controllers/authors');

BodyBoard.accountController = SC.ObjectController.create(
/** @scope BodyBoard.accountController.prototype */ {

	isSaveOk : NO,
	
	
	
	addAccount : function() {
		var account;
		account = BodyBoard.store.createRecord(BodyBoard.Account, {
			'verified' : NO,
			'email' : '',
			'password' : '',
			'group' : 2,
			'created' : '',
			'author' : 0
		});
		this.set('content', account);	
		console.log('Account:',account);
		return YES;
	},
	
	
	
	saveAccount : function() {
		var accountRecord = this.get('content');
		if( accountRecord && accountRecord.isRecord ) {
			accountRecord.commitRecord();
		} else {
			alert('Problem saving account');
		}
		alert('Account saved');
		return YES;
	},
	
	
	
	observeRecordState : function() {
		var accountRecord = this.get("content");
		var authorRecord = BodyBoard.authorsController.get('selection');
		if( accountRecord.get("status") === SC.Record.READY_DIRTY || accountRecord.get("status") === SC.Record.READY_NEW  || authorRecord.get("status") === SC.Record.READY_DIRTY || authorRecord.get("status") === SC.Record.READY_NEW ) {
			this.set("isSaveOk", YES);
		} else {
			this.set("isSaveOk", NO);           
		}	
	}.observes('*content.status','BodyBoard.authorController.content.status')
	
	
	
}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');