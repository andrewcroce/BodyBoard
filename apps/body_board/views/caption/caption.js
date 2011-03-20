// ==========================================================================
// Project:   BodyBoard - captionView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('controllers/labels');


//SC.teardownStringMeasurement = function() {};


BodyBoard.captionView = SC.View.extend( 
SC.ContentDisplay,
SC.StaticLayout, 
{
	layout : { width: 373 },
	classNames : ['caption-view'],
	useStaticLayout: YES,
	contentDisplayProperties : 'text'.w(),
	tagName : 'li',
	text : '',
	index : '',
	textHeight : '',
	/*
	childViews : 'textView authorView'.w(),
	
	textView : SC.LabelView.extend({
		layout : { top: 0, bottom: 60, left: 0, width: 365 },
		valueBinding : '.parentView*content.text',
		escapeHTML : NO,
		classNames : 'caption-text'.w()
	}),
	
	authorView : SC.LabelView.extend({
		layout : { bottom: 30, left: 0 },
		valueBinding : '.parentView.content*author.fullName',
		classNames : 'caption-author'.w()
	}),
	*/
	
	render : function( context, firstTime ) {
		
		//console.log('rendering caption');
		var metrics;
		var text = '';
		var author = '';
		var content = this.get('content');
		var index = BodyBoard.labelCaptionsController.indexOf(this.get('content'));
		
		if(content != null) {
			text = content.get('text');
			author = content.getPath('author.fullName');
			this.set('text', text+author);
			
		} else {
			this.set('text','');
			//console.log('no caption content');
		}
		context = context.begin('div').addClass('text').push(text).end();
		context = context.begin('small').addClass('author').push(author).end();
		
		sc_super();
	},
	
	
	didCreateLayer : function() {
		sc_super();
		var metrics,layer;
		layer = this.get('layer');
		
		metrics = SC.metricsForString(this.getPath('content.text'), layer, 'measuring-div',NO);
		//console.log('Metrics: ',metrics);
		this.set('textHeight',metrics.height + 100);
	},
	

	
});