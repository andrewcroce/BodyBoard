// ==========================================================================
// Project:   BodyBoard.captionsController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BodyBoard */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
BodyBoard.captionsController = SC.ArrayController.create(
/** @scope BodyBoard.captionsController.prototype */ {

  // TODO: Add your own code here.

}) ;


BodyBoard.labelCaptionsController = SC.ArrayController.create(
/** @scope BodyBoard.captionsController.prototype */ {

  contentBinding : 'BodyBoard.labelController.captions'

}) ;


BodyBoard.captionController = SC.ObjectController.create(
/** @scope BodyBoard.captionsController.prototype */ {

  contentBinding : SC.Binding.single('BodyBoard.labelsController.selection')

}) ;
