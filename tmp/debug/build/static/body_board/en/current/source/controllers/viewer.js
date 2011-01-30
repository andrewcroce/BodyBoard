// ==========================================================================
// Project:   BodyBoard.viewerController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/

sc_require('controllers/systems');

BodyBoard.viewerController = SC.ObjectController.create(
/** @scope BodyBoard.viewerController.prototype */ {

	isReady : NO,
	systemSet : NO,
	labelsSet : NO,
	position : 'Position',
	
	viewer : '',
	
	initViewer : function() {
		
		console.log('Initializing Viewer');
		this.set('viewer', new Seadragon.Viewer('body-board-view'));
		//BodyBoard.systemsController.selectObject(BodyBoard.store.find('BodyBoard.System', 1));
		this.get('viewer').addEventListener('open',function(){
			console.log('open');
			BodyBoard.viewerController.set('isReady',YES);
			//BodyBoard.systemController.setSystem();
		});
		BodyBoard.systemController.open(1);
		/*
		this.invokeLater(function(){
			BodyBoard.systemsController.selectObject(BodyBoard.store.find('BodyBoard.System', 1));
			
		});*/
	},
	
	
	setMousePosition : function(event) {
		//console.log('mouse position set');
	 	var pixel = Seadragon.Utils.getMousePosition(event).minus(Seadragon.Utils.getElementPosition(this.get('viewer').elmt));
		//var pixel = Seadragon.Utils.getMousePosition(event);
		var point = this.get('viewer').viewport.pointFromPixel(pixel);
		this.set('position', point);
		this.invokeLater(function(){
			//console.log(this.get('position'));
			
		});
	},
	
/*
	appendOverlay : function( context, point ) {
		console.log('Attempting to append overlay');
		this.invokeLater(function(){
			//if( this.get('isInitialized') == YES ) {
				this.get('viewer').drawer.addOverlay(context, point, Seadragon.OverlayPlacement.BOTTOM);
				console.log('Overlay appended');
			//}
		});
	},

	placeOverlay : function(event) {
		
	 	var pixel = Seadragon.Utils.getMousePosition(event).minus(Seadragon.Utils.getElementPosition(this.get('viewer').elmt));
		var point = this.get('viewer').viewport.pointFromPixel(pixel);
		var div = document.createElement("img");
				div.src = 'static/body_board/en/current/resources/images/temp_label.png';
				div.style.width = '30px';
				div.style.height = '30px'; 
		var coordinate = new Seadragon.Point(point.x, point.y);
		//var point = new Seadragon.Point(1, 1);
		var placement = Seadragon.OverlayPlacement.BOTTOM;
		this.get('viewer').drawer.addOverlay(div, coordinate, placement);
		this.invokeLater(function(){
			console.log('Mouse Down');
			console.log(this.get('position'));
			
		});
		
	}
*/

	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');