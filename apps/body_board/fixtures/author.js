// ==========================================================================
// Project:   BodyBoard.Author Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

sc_require('models/author');

BodyBoard.Author.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

	{ 
		guid : 1,
		account_guid : 1,
		firstName : 'Andrew',
		lastName : 'Croce',
		title : 'Student',
		education : 'BS Studio Art from New York University, MS Interactive Design from Philadelphia University',
		position : 'Designer at VQC Designs',
		specialty : 'Web application design and development',
		votes : 0,
		//labels : [1,2],

	},
	
	{ 
		guid : 2,
		account_guid : 2,
		firstName : 'Julia',
		lastName : 'Bark',
		title : 'Au.D',
		education : 'Doctorate in Audiology from Washington University School of Medicine',
		position : 'Audiologist at Advantage Therapy Centers',
		specialty : 'Hearing and balance disorders',
		votes : 0,

	}
  

];
