// ==========================================================================
// Project:   BodyBoard.Article
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
BodyBoard.Article = SC.Record.extend(
/** @scope BodyBoard.Article.prototype */ {

	title : SC.Record.attr(String, { isRequired: YES }),
	text : SC.Record.attr(String, { isRequired: YES }),
	created : SC.Record.attr(Date),
	votes : SC.Record.attr(Number, { defaultValue: 0 }),
	
	author : SC.Record.toOne('BodyBoard.Author', { inverse: 'articles', isMaster: NO }),
	labels : SC.Record.toMany('BodyBoard.Label', { inverse: 'articles' }),
	captions : SC.Record.toMany('BodyBoard.Caption', { inverse: 'article' }),
	comments : SC.Record.toMany('BodyBoard.Comment', { inverse: 'article' }),
	
	authorFullName : function() {
	
		var name = this.get('author.fullName');
		return name;
		
	}.property('author').cacheable(),
	
	introText : function() {
		
		var text = this.get('text');
		//truncate text to a certain number of characters to the nearest word
		return text;
		
	}.property('text').cacheable()
	

}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');