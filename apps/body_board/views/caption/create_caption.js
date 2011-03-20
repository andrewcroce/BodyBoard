// ==========================================================================
// Project:   BodyBoard - createCaptionView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */


BodyBoard.createCaptionView = SC.View.design( 
{
	
	layout : { left: 0, right: 0, top: 0, bottom: 0 },
	childViews : 'headingView textView saveButtonView cancelButtonView'.w(),
	
	headingView : SC.ToolbarView.design({
		layout : { left: 0, right: 0, top: 0, height: 30 },
		childViews : 'labelView labelNameView'.w(),
		
		labelView : SC.LabelView.design({
			layout : { left: 10, top: 5 },
			value : 'Create a new caption for Label:'
		}),
		
		labelNameView : SC.LabelView.design({
			layout : { left: 200, top: 5 },
			valueBinding : 'BodyBoard.labelController.name',
		}),
	}),

	textView : SC.TextFieldView.design({
		layout : { left: 10, right: 10, top: 70, bottom: 50 },
		isTextArea : YES,
		isInlineEditorMultiline : YES,
		hint : "New Caption...",
		valueBinding : 'BodyBoard.bufferedCaptionController.text',
		layerId : 'caption-editor',
		
		
		didAppendToDocument : function(){
			//sc_super();
			
			//whizzywig();
			
			//nicEditors.allTextAreas();
			
			/*
			tinyMCE.init({
			        mode : "textareas",
			        theme : "simple"    //(n.b. no trailing comma, this will be critical as you experiment later)
			});
			*/
			/*
			this.$('textarea').wysiwyg({
				css : 'jquery.wysiwyg.css',
				debug : true,
				rmUnusedControls : true,
				controls : {
					bold : { visible : true },
					italic : { visible : true },
					h1 : { visible : true },
					h2 : { visible : true },
					h3 : { visible : true },
					paragraph : { visible : true },
					createLink : { visible : true },
					insertImage : { visible : true }
				}
			});
			*/
		},
		
		didCreateLayer : function(){
			sc_super();
			console.log('editor initializing');
		
      	/*
			tinyMCE.init({
			        mode : "textareas",
			        theme : "simple"    //(n.b. no trailing comma, this will be critical as you experiment later)
			});
			*/
			
			/*
			this.$('.field').wysiwyg({
				css : 'jquery.wysiwyg.css',
				//debug : true,
				rmUnusedControls : true,
				controls : {
					bold : { visible : true },
					italic : { visible : true },
					h1 : { visible : true },
					h2 : { visible : true },
					h3 : { visible : true },
					paragraph : { visible : true },
					createLink : { visible : true },
					insertImage : { visible : true }
				}
			});
			*/
		}
	
	}),
	
	saveButtonView : SC.ButtonView.design({
		layout : { bottom: 10, right: 10, width: 60, height: 35 },
		title : 'SAVE',
		action : 'requestSaveCaption'
	}),
	
	cancelButtonView : SC.ButtonView.design({
		layout : { bottom: 10, right: 80, width: 100, height: 35 },
		title : 'CANCEL',
		action : 'requestCancelCreateCaption'
	}),
	
	/*
	didCreateLayer : function(){
		console.log('editor initialized');
		//$('#caption-editor textarea').attr('id','wysiwyg');
		//$('#wysiwyg').wysiwyg();
		$('#caption-editor .field').wysiwyg();
		
	}
	*/
	
});