BodyBoard.captionListitemView = SC.View.extend( SC.ContentDisplay, {
	
	contentDisplayProperties : 'label text'.w(),
	classNames : 'caption-li-view green-bg'.w(),
	
	displayProperties: 'isSelected'.w(),
	
	render : function( context, firstTime ) {
		
		var label = 'label';
		var text = 'text';
		var content = this.get('content');
		
		if( content != null ) {
			
			label = content.getPath('label.name');
			text = content.get('text');
			
		}
		
		if (this.get('isSelected') == YES) {
			context.addClass('selected');
		} else {
			context.removeClass('selected');
		}
		
		//RENDER HTML
		context = context.begin('h3').addClass('label').push(label).end();
		context = context.begin('div').addClass('text').push(text).end();
		
		arguments.callee.base.apply(this,arguments);
		
	}
	
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');