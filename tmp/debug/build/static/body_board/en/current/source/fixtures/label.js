// ==========================================================================
// Project:   BodyBoard.Label Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

sc_require('models/label');

BodyBoard.Label.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

	{
		guid : 1,
		name : 'Skull',
		x : 0,
		y : 0,
		author_guid : 1,
		system_guid : 11
	},
	
	{
		guid : 2,
		name : 'Heart',
		x : 0.5089341859346928,
		y : 0.6291716446918595,
		author_guid : 1,
		system_guid : 1
	},
	
	{
		guid : 3,
		name : 'Some Body Part',
		x : 0.3756930,
		y : 0.7492733,
		author_guid : 1,
		system_guid : 1
	}
	
];
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('body_board');