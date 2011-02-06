// ==========================================================================
// Project:   BodyBoard.Group Fixtures
// Copyright: ©2010 - 2011 Andrew Croce
// ==========================================================================
/*globals BodyBoard */

sc_require('models/group');

BodyBoard.Group.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

	{ 
		guid: 1,
		name: "Admin",
		//accounts: [1]
	},
	
	{ 
		guid: 2,
		name: "Author",
		//accounts: [2]
	},
	
	{ 
		guid: 3,
		name: "Public",
		//accounts: []
	}
  

];
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');