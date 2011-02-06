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
	
	SC.CollectionViewDelegate,
	SC.SelectionSupport, 
/** @scope BodyBoard.authorsController.prototype */ {
	
	//orderBy : 'rating',
	//allowsMultipleSelection : NO,
	
	addAuthor : function() {
		
		var author;
		
		author = BodyBoard.store.createRecord(BodyBoard.Author, {
			'account' : 0,
			'firstName' : '',
			'lastName' : '',
			'title' : '',
			'education' : '',
			'position' : '',
			'specialty' : '',
			'votes' : 0,
			'labels' : [],
			'comments' : [],
			'images' : []

		});
		
		this.selectObject(author);
		console.log('Author:',this.get('selection'));
		return YES;
		
	},
	
	
	saveAuthor : function() {
		
		var authorRecord = this.get('selection');
		console.log('AUTHOR RECORD:',authorRecord);
		if( authorRecord && authorRecord.isRecord ){
			authorRecord.commitRecord();
		} else {
			if( !authorRecord.isRecord ){
				alert('Author record is not a record');
			} else {
				alert('Problem saving author');
			}
		}
		
	}
	

});





BodyBoard.authorController = SC.ObjectController.create({
	
	contentBinding : 'BodyBoard.authorsController.selection',
	isSaveOk : NO,
	
	/*
	saveAuthor : function() {
		
		var authorRecord = this.get('content');
		console.log('AUTHOR RECORD:',authorRecord);
		if( authorRecord && authorRecord.isRecord ){
			authorRecord.commitRecord();
		} else {
			if( authorRecord.isRecord ){
				alert('Problem saving author');
			} else {
				alert('Author record is not a record');
			}
		}
		
		return YES;
	}*/	
});



BodyBoard.authorLabelsController = SC.ArrayController.create({
	
	contentBinding : 'BodyBoard.authorController.labels'
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');