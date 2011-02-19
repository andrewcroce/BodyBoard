// ==========================================================================
// Project:   BodyBoard.treeNavController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.TreeController
*/



BodyBoard.treeNavController = SC.TreeController.create(
SC.TreeItemContent,{
	
	/*
	*	
	*/
	
	populate : function(){
		var rootNode = SC.Object.create({
			treeItemIsExpanded: YES,
			name: "root",
			treeItemChildren: function(){
				var system = BodyBoard.store.find(SC.Query.local(BodyBoard.System,
					{ orderBy: "name ASC" }
				));
				return system;
			}.property()
		});
		this.set('content', rootNode);
	},
	
	/*
	observeSystemContent : function(){
		console.log('System changed, selecting tree node');
		this.selectObject(BodyBoard.systemController.get('content'));
	}.observes('BodyBoard.systemController.content'),
	*/
	
	observeLabelContent : function(){
		console.log('Label changed, selecting tree node');
		this.selectObject(BodyBoard.labelController.get('content'));
	}.observes('BodyBoard.labelController.content'),
	
	
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


BodyBoard.treeNodeController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.treeNavController.selection'),
	
	/*
	*	Manage the selection of the tree nav menu. Check if its a System or a Label,
	*	and make the appropriate selection on its ArrayController
	*/
	
	observeContent : function(){
		var record = this.get('content');	
		
		if(record.isSystem){
			BodyBoard.systemsController.selectObject(record);
		} else {
			if(record.isLabel){
				BodyBoard.labelsController.selectObject(record);
				BodyBoard.labelController.focusOnLabel();
			}
		}
	}.observes('content')
	
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');