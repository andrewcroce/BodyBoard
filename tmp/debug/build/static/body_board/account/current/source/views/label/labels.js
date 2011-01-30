// ==========================================================================
// Project:   BodyBoard - labelsView
// Copyright: ©2010-2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

BodyBoard.labelsView = SC.CollectionView.extend({
	
	layout : { left: 0, right: 0, top: 0, bottom: 0 },
	/*
	contentBinding : 'BodyBoard.labelsController.arrangedObjects',
	selectionBinding : 'BodyBoard.labelsController.selection',
	backgroundColor : 'transparent',
	selectOnMouseDown : YES,
	recordType: BodyBoard.Label,
	exampleView: SC.View.design( SC.ContentDisplay, {
		
		classNames : ['label-view'],
		
		render : function( context, firstTime ) {

			var name = '';
			var point = '';
			var placement = Seadragon.OverlayPlacement.BOTTOM;
			var content = this.get('content');
			var viewer = BodyBoard.viewerController.get('viewer');

			if( content != null ) {
				name = content.get('name');
				point = new Seadragon.Point( content.get('xPosition') , content.get('yPosition') );
			}

			if (this.get('isSelected')) {
				context.setClass('selected', this.get('isSelected'));
			}

			console.log('rendering label');
			context = context.begin('h3').addClass('label-name').push(name).end();

			this.invokeLater(function(){
				//viewer.drawer.addOverlay(context, point, placement);
			});

			arguments.callee.base.apply(this,arguments);

		}
		
	})
	*/
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');