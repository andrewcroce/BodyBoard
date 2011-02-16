// ==========================================================================
// Project:   BodyBoard.Account Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

sc_require('models/account');

BodyBoard.Account.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

	{ 
		_id: 1,
		verified : YES,
		email : 'andrew.croce@gmail.com',
		password : '1234',
		group_id : 1,
		created : "2010-01-01T10:20:30Z",
		author_id : 1
	},
	
	{ 
		_id: 2,
		verified : YES,
		email : 'juliabark@gmail.com',
		password : '4321',
		group_id : 2,
		created : "2010-01-01T10:20:30Z",
		author_id : 2
	}
];
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('body_board');