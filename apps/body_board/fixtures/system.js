// ==========================================================================
// Project:   BodyBoard.System Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

sc_require('models/system');

BodyBoard.System.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

	{
		guid: 1,
		name: 'Cardivascular',
		src: 'static/body_board/en/current/resources/dzi/circulatory/dzc_output.xml',
	},
	
	{
		guid: 2,
		name: 'Respiratory',
		src: 'static/body_board/en/current/resources/dzi/respiratory/dzc_output.xml',
	},
	
	{
		guid: 3,
		name: 'Skeletal',
		src: 'static/body_board/en/current/resources/dzi/skeletal/dzc_output.xml',
	}

];
