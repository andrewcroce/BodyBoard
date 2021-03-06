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
		guid: 1,
		verified : YES,
		email : 'andrew.croce@gmail.com',
		password : '1234',
		group : 1,
		created : "2010-01-01T10:20:30Z",
		author : 1
	},
	
	{ 
		guid: 2,
		verified : YES,
		email : 'juliabark@gmail.com',
		password : '4321',
		group : 2,
		created : "2010-01-01T10:20:30Z",
		author : 2
	}
];
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');