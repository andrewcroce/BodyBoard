// ==========================================================================
// Project:   BodyBoard.Author
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Author = SC.Record.extend(
/** @scope BodyBoard.Author.prototype */ {

	firstName : SC.Record.attr(String, { isRequired: YES } ),
	lastName : SC.Record.attr(String, { isRequired: YES } ),
	title : SC.Record.attr(String, { defaultValue: '' } ),
	education : SC.Record.attr(String, { defaultValue: '' } ),
	position : SC.Record.attr(String, { defaultValue: '' } ),
	specialty : SC.Record.attr(String, { defaultValue: '' } ),
	
	
	//account : SC.Record.toOne('BodyBoard.Account', { inverse: 'author' }),
	account_guid : SC.Record.attr(Number),
	account : function(){
		return BodyBoard.store.find(BodyBoard.Account,this.get('account_guid'));	
	}.property().cacheable(),
	
	
	//labels : SC.Record.toMany('BodyBoard.Label', { inverse: 'author'} ),
	labels : function(){
		var query = SC.Query.local(BodyBoard.Label,'author = {author}',{ author : this }); 
		return BodyBoard.store.find(query);
	}.property().cacheable(),
	
	
	//comments : SC.Record.toMany('BodyBoard.Comment', { inverse: 'author' }),
	comments : function(){
		var query = SC.Query.local(BodyBoard.Comment,'author = {author}',{ author : this }); 
		return BodyBoard.store.find(query);
	}.property().cacheable(),
	
	
	//images : SC.Record.toMany('BodyBoard.Image', { inverse: 'author' }),
	images : function(){
		var query = SC.Query.local(BodyBoard.Image,'author = {author}',{ author : this }); 
		return BodyBoard.store.find(query);
	}.property().cacheable(),
	
	
	//COMPUTED TITLE & FULL NAME PROPERTY
	fullName : function() {
		
		var title = this.get('title');
		var name = this.getEach('firstName', 'lastName').compact().join(' ');
		var prefix = '';
		var suffix = '';
		
		switch( title ) {
			
			case 'dr' :
				prefix = 'Dr. ';
				break;
			
			case 'phd':
				suffix = ', Ph.D.';
				break;
				
			default:
				suffix = ', ';
				suffix += title;
			
		}
		
		return prefix + name + suffix;
		
	}.property('firstName', 'lastName').cacheable(),
	
	
	//COMPUTED PROFILE COMPLETION PROPERTY
	completion : function() {
		
		var completion = 0;
		
		if( this.get('title') !== '' ) {
			completion += 25;
		}
		
		if( this.get('education') !== '' ) {
			completion += 25;
		}
		
		if( this.get('position') !== '' ) {
			completion += 25;
		}
		
		if( this.get('specialty') !== '' ) {
			completion += 25;
		}
		
		return completion + '%';
		
	}.property().cacheable(),
	
	
	//COMPUTED RATING PROPERTY
	rating : function() {
		
		//TO DO: Calculate a rating value based on votes for articles
	
	}.property('votes').cacheable()


}) ;
