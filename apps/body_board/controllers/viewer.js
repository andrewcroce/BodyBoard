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


	viewer : '',			//Property that will hold a reference to the DZI viewer
	isInitialized : NO,
	isAnimating : NO,		//Is the viewer currently being manipulated
	isReady : NO,
	mousePosition : '',	//Current mouse position over the DZI viewer
	zoom : 1,				//Current zoom level
	center : {},				//Current center point of DZI viewer
	
	
	/*
	*	Initialize the DZI Viewer.
	*	Register listeners for the viewer's "open","animation","animationstart", and "animationfinish" events.
	*/
	initViewer : function() {
		var controls;
		
		console.log('Initializing Viewer');
		this.set('viewer', new Seadragon.Viewer('body-board-view'));
		
		// Some javascript hackery allowing the viewer controls to be repositioned with css
		controls = this.get('viewer').getNavControl();
		controls.id = 'viewer-controls';
		controls.parentNode.parentNode.id = 'controls-inner-container'
		controls.parentNode.parentNode.parentNode.id = 'controls-container';
		
		this.get('viewer').addEventListener('open',function(){
			console.log('DZI Opened');
			BodyBoard.viewerController.setViewerPosition();
			BodyBoard.viewerController.set('isReady',YES);
			BodyBoard.systemController.setSystem();
		});
		
		this.get('viewer').addEventListener('animationstart',function(){
			console.log('animation started');
			BodyBoard.viewerController.set('isAnimating',YES);
		});
		
		this.get('viewer').addEventListener('animation',function(){
			BodyBoard.viewerController.setViewerPosition();
		});
		
		this.get('viewer').addEventListener('animationfinish',function(){
			console.log('animation finished');
			BodyBoard.viewerController.set('isAnimating',YES);
		});
		
		//Open System 1 on initialization
		//TODO: Randomize, or set to the user's last-opened System
		BodyBoard.systemController.open(1);

	},
	
	setViewerPosition : function(){
		this.set('zoom',this.get('viewer').viewport.getZoom());
		this.set('center',this.get('viewer').viewport.getCenter());
		/*
		this.invokeLast(function(){
			console.log('Center: ',this.get('center').x,',',this.get('center').y);
		});
		*/
	},
	
	setMousePosition : function(event) {
		//console.log('mouse position set');
	 	var pixel = Seadragon.Utils.getMousePosition(event).minus(Seadragon.Utils.getElementPosition(this.get('viewer').elmt));
		//var pixel = Seadragon.Utils.getMousePosition(event);
		var point = this.get('viewer').viewport.pointFromPixel(pixel);
		this.set('mousePosition', point);
		this.invokeLater(function(){
			//console.log(this.get('mousePosition'));
			
		});
	},
	

	
});