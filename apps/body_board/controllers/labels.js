// ==========================================================================
// Project:   BodyBoard.labelsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/


BodyBoard.labelsController = SC.ArrayController.create( 
/** @scope BodyBoard.labelsController.prototype */ {

  	orderBy : 'system_id',
	allowsMultipleSelection : NO,
	isEditing : YES,
	isSaveOk : NO,
	isDeleteOk : NO,
	buffer : null,
	
	
	addLabel : function(){
		console.log('Adding a label');
		//this.setPath('BodyBoard.labelController.allowSystemSet',NO);
		//this.setPath('BodyBoard.systemsController.allowsSelection',NO);
		var label;
		this.set('buffer', BodyBoard.store.chain());
		
		label = BodyBoard.store.createRecord(BodyBoard.Label, {
		//label = this.get('buffer').createRecord(BodyBoard.Label, {
			'name' : 'New Label',
			//'x' : BodyBoard.viewerController.get('center').x,
			//'y' : BodyBoard.viewerController.get('center').y,
			'x' : 0.5,
			'y' : 0.5,
			'author_id' : BodyBoard.authorController.get('id'),
			'system_id' : BodyBoard.systemController.get('id')
		});

		this.invokeLast(function() { 
			this.selectObject(label);
			this.set('isSaveOk',YES);
			this.set('isDeleteOk',YES);
			this.editLabel();
		});
		return YES;
		
	},
	
	editLabel : function() {
		if(BodyBoard.labelController.get('isEditable') == YES){
			var label;
			label = this.get('selection');
			console.log('Editing label: ',label.get('name'));
		}
	},
	
	saveLabel : function() {
		if(this.get('isSaveOk') == YES) {
			this.get('buffer').commitChanges();
			this.set('buffer',null);
		}
	},
	
	deleteLabel : function() {
		if(this.get('isDeleteOk') == YES) {
			var label = this.get('selection');	
			console.log('deleting label');
			BodyBoard.labelController.set('allowSystemSet',NO);
			label.destroy();
			this.set('isDeleteOk',NO);
			BodyBoard.labelController.set('allowSystemSet',YES);
		}
	},
	
	
	collectionViewDeleteContent: function(view, content, indexes) {

	    // destroy the records
	    var records = indexes.map(function(idx) {
	      return this.objectAt(idx);
	    }, this);
	    records.invoke('destroy');

	    var selIndex = indexes.get('min')-1;
	    if (selIndex<0) selIndex = 0;
	    this.selectObject(this.objectAt(selIndex));
	  }
	
});






BodyBoard.labelController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.labelsController.selection'),
	allowSystemSet : YES,
	isHovering : NO,
	showingCaptions : NO,
	view : {},
	
	setSystemOnSelection : function(){
	
		if(this.get('allowSystemSet') == YES){
			var currentSystem = BodyBoard.systemController.get('content');
			console.log(currentSystem.get('name'));
			if( currentSystem.get('id') != this.get('system') ){
				console.log('Selected label, changing system');
				BodyBoard.systemsController.selectObject(this.get('system'));
			}
			this.set('isHovering',NO);
		} else {
			console.log('System setting blocked');
		}
		
	}.observes('content'),
	
	
	
	focusOnLabel : function(){
		var x,y;
		SC.RunLoop.begin();
		x = this.get('x');
		y = this.get('y');
		console.log('Focusing on label ',x,',',y);
		BodyBoard.viewerController.get('viewer').viewport.panTo(new Seadragon.Point(x, y));
		SC.RunLoop.end();
	},
	
	
	over : function(view){
		
		if(this.get('showingCaptions') == NO){
			var element,button;
			Seadragon.Config.zoomPerClick = 1;
			this.set('view',view);
			element = view.$()[0];
			button = view.get('moreButtonView');
			$(element).animate(
				{ height : 32 },
				10
			);
			console.log('over');
			$(element).animate(
				{ width : 250 },
				200,
				function(){
					button.set('isVisible',YES)
				}
			);
		}
	},
	
	
	out : function(view){
		if(this.get('showingCaptions') == NO){
			Seadragon.Config.zoomPerClick = 2;
			var element,button;
			this.set('view',null);
			element = view.$()[0];
			button = view.get('moreButtonView');
			button.set('isVisible',NO);
			$(element).animate(
				{ width : 12 },
				300
			);
			console.log('out');
			$(element).animate(
				{ height : 12 },
				300
			);
		}
	},
	
	showCaptions : function(){
		var view,element,moreButton,closeButton,nextButton,prevButton;
		view = this.get('view');
		element = view.$()[0];
		moreButton = view.get('moreButtonView');
		closeButton = view.get('closeButtonView');
		nextButton = view.get('nextButtonView');
		prevButton = view.get('prevButtonView');
		moreButton.set('isVisible',NO);
		closeButton.set('isVisible',YES);
		nextButton.set('isVisible',YES);
		prevButton.set('isVisible',YES);
		console.log('show captions');
		$(element).animate(
			{ width : 400 },
			300
		);
		console.log('out');
		$(element).animate(
			{ height : 500 },
			300,
			function(){
				BodyBoard.viewerController.get('viewer').viewport.ensureVisible();
			}
		);
	},
	
	hideCaptions : function(){
		var view,element,moreButton,closeButton,nextButton,prevButton;
		view = this.get('view');
		element = view.$()[0];
		moreButton = view.get('moreButtonView');
		closeButton = view.get('closeButtonView');
		nextButton = view.get('nextButtonView');
		prevButton = view.get('prevButtonView');
		closeButton.set('isVisible',NO);
		moreButton.set('isVisible',NO);
		nextButton.set('isVisible',NO);
		prevButton.set('isVisible',NO);
		console.log('hide captions');
		$(element).animate(
			{ width : 12, height : 12 },
			200,
			function(){
				Seadragon.Config.zoomPerClick = 2;
			}
		);
	},
	
	newLabelStartDrag : function( event, layout, view ) {
		
		console.log('Started drag');
		view._mouseDownInfo = {
			pageX : event.pageX,
			pageY : event.pageY,
			left : layout.left,
			bottom : -layout.bottom
		};
		return YES;
	},
	
	
	
	newLabelDragged : function( event, view ) {
		var info, loc;
		console.log('Dragging...')
		info =  view._mouseDownInfo;		
		loc = info.left + ( event.pageX - info.pageX );
		view.adjust('left', loc);
		//this.set('x', BodyBoard.viewerController.get('mousePosition').x);
		
		loc = info.bottom + ( event.pageY - info.pageY );
		view.adjust('bottom', -loc);
		//this.set('y', BodyBoard.viewerController.get('mousePosition').y);
		
		this.invokeLater(function(){
			//console.log(this.get('x'));
			//console.log(this.get('y'));
			
		});
		
		return YES;
	},
	
	
	newLabelRelease : function( event ) {
		var target;
		this.set('x', BodyBoard.viewerController.get('mousePosition').x);
		this.set('y', BodyBoard.viewerController.get('mousePosition').y);
		target = BodyBoard.labelView.create({});
		target.set('content',this);
		console.log(target.get('x'),',',target.get('y'))
		BodyBoard.getPath('mainPage.bodyView.bodyBoardView').appendChild(target);
		console.log('Target released');
		
		return YES;
	},
	
	

	
});
