// ==========================================================================
// Project:   BodyBoard.authorsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/

sc_require('fixtures/author');


BodyBoard.authorsController = SC.ArrayController.create( 
	
	SC.CollectionViewDelegate,
	SC.SelectionSupport, 
/** @scope BodyBoard.authorsController.prototype */ {
	
	//orderBy : 'rating',
	//allowsMultipleSelection : NO,
	
	isLoadedArray : [],
	loadedCount : 0,
	
	initializeForLoading : function(){
		var arr = this.get('isLoadedArray');
		for(var i = 0, len = BodyBoard.Author.FIXTURES.get('length'); i < len; i++){
			arr.pushObject(NO);
		}
	},
	
	recordWasLoaded : function(key){
		this.get('isLoadedArray').replace(key - 1, 1, [YES]);
		var count = this.get('loadedCount');
		this.set('loadedCount', count + 1);
	},
	
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
	
});