// ==========================================================================
// Project:   BodyBoard.listController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.TreeController
*/



BodyBoard.treeNavController = SC.TreeController.create({
	
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
	}
	
});


BodyBoard.treeNodeController = SC.ObjectController.create({
	
	contentBinding : SC.Binding.single('BodyBoard.treeNavController.selection'),
	
	observeContent : function(){
		var record = this.get('content');		
		if(record.isSystem){
			BodyBoard.systemsController.selectObject(record);
		} else {
			BodyBoard.labelsController.selectObject(record);
		}
	}.observes('content')
	
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');