/* >>>>>>>>>> BEGIN source/theme.js */
// Main Ace Theme
SC.AceTheme = SC.BaseTheme.create({
  name: "ace",
  description: "A SproutCore built-in theme by Alex Iskander and contributors. Only supports browsers that implement CSS3."
});

SC.Theme.addTheme(SC.AceTheme);

// Dark Variant
SC.AceTheme.Dark = SC.AceTheme.subtheme("dark");

// for backwards-compatibility with apps that do not set their
// own default theme:
SC.defaultTheme = 'ace';

/* >>>>>>>>>> BEGIN source/resources/button/button.js */

// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


require("theme");

SC.AceTheme.PointLeft = SC.AceTheme.subtheme("point-left", "point-left");
SC.AceTheme.PointRight = SC.AceTheme.subtheme("point-right", "point-right");
SC.AceTheme.Capsule = SC.AceTheme.subtheme("capsule", "capsule");

/**
  Renders and updates the HTML representation of SC.ButtonView.
*/
SC.AceTheme.buttonRenderDelegate = SC.RenderDelegate.create({
  name: 'button',
  
  /**
    Called when we need to create the HTML that represents the button.

    @param {SC.Object} dataSource the object containing the information on how to render the button
    @param {SC.RenderContext} context the render context instance
  */
  render: function(dataSource, context) {
    var labelContent;
    
    context.setClass('icon', !!dataSource.get('icon') || NO);
    context.setClass('def', dataSource.get('isDefault') || NO);
    context.setClass('cancel', dataSource.get('isCancel') || NO);
    
    this.includeSlices(dataSource, context, SC.THREE_SLICE);

    // Create the inner label element that contains the text and, optionally,
    // an icon.
    context = context.begin('label').addClass('sc-button-label');
    dataSource.get('theme').labelRenderDelegate.render(dataSource, context);
    context = context.end();

    if (dataSource.get('supportFocusRing')) {
      context.push('<div class="focus-ring">',
                    '<div class="focus-left"></div>',
                    '<div class="focus-middle"></div>',
                    '<div class="focus-right"></div></div>');
    }
  },

  /**
    Called when one or more display properties have changed and we need to
    update the HTML representation with the new values.

    @param {SC.Object} dataSource the object containing the information on how to render the button
    @param {SC.RenderContext} jquery the jQuery object representing the HTML representation of the button
  */
  update: function(dataSource, jquery) {
    if (dataSource.get('isActive')) {
      jquery.addClass('active');
    }
    
    jquery.setClass('icon', !!dataSource.get('icon') || NO);
    jquery.setClass('def', dataSource.get('isDefault') || NO);
    jquery.setClass('cancel', dataSource.get('isCancel') || NO);

    dataSource.get('theme').labelRenderDelegate.update(dataSource, jquery.find('label'));
  }
});

/* >>>>>>>>>> BEGIN source/resources/button/dark/button.js */
SC.AceTheme.Dark.PointLeft = SC.AceTheme.Dark.subtheme("point-left", "point-left");
SC.AceTheme.Dark.PointRight = SC.AceTheme.Dark.subtheme("point-right", "point-right");
SC.AceTheme.Dark.PointRight = SC.AceTheme.Dark.subtheme("capsule", "capsule");
/* >>>>>>>>>> BEGIN source/resources/collection/source-list/source-list.js */
SC.AceTheme.SourceList = SC.AceTheme.subtheme('source-list');

// later we may define/override some constants here
/* >>>>>>>>>> BEGIN source/resources/panel/panel.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.AceTheme.panelRenderDelegate = SC.RenderDelegate.create({
  name: 'panel',
  
  render: function(dataSource, context) {
    context = context.begin('div').addClass('panel-background');
    this.includeSlices(dataSource, context, SC.NINE_SLICE);
    context = context.end();
  },
  
  update: function() {
    // doesn't get updated
  }
});

/* >>>>>>>>>> BEGIN source/resources/picker/ace/picker.js */

/* >>>>>>>>>> BEGIN source/resources/picker/popover/popover.js */
sc_require("theme");

// it is derived from dark, but will be available both under Ace and not.
SC.AceTheme.Popover = SC.AceTheme.Dark.subtheme("popover");
SC.AceTheme.addTheme(SC.AceTheme.Popover);

// there is a solid variety
SC.AceTheme.SolidPopover = SC.AceTheme.Popover.subtheme('solid');

// and a shortcut to the solid variety.
SC.AceTheme.addTheme(SC.AceTheme.SolidPopover.create({ name: 'solid-popover' }));


/* >>>>>>>>>> BEGIN source/resources/picker/popover/picker.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
sc_require("resources/picker/popover/popover");

SC.AceTheme.Popover.pickerRenderDelegate = SC.RenderDelegate.create({
  name: 'picker',
  
  render: function(dataSource, context) {
    var preferType = dataSource.get('preferType');
    var pointerPosition = dataSource.get('pointerPos');
    var pointerPositionY = dataSource.get('pointerPosY');

    if (preferType == SC.PICKER_POINTER || preferType == SC.PICKER_MENU_POINTER) {
      context.addClass(pointerPosition);
    }
  },
  
  update: function(dataSource, $) {
    var preferType = dataSource.get('preferType');
    var pointerPosition = dataSource.get('pointerPos');
    var pointerPositionY = dataSource.get('pointerPosY');
    
    if (preferType == SC.PICKER_POINTER || preferType == SC.PICKER_MENU_POINTER) {
      $.addClass(pointerPosition);
    }
    
  }
});
/* >>>>>>>>>> BEGIN source/resources/picker/popover/workspace.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.AceTheme.Popover.workspaceRenderDelegate = SC.RenderDelegate.create({
  name: 'workspace',
  render: function(dataSource, context) {
    context.setClass({
      'top-toolbar': dataSource.get('hasTopToolbar'),
      'bottom-toolbar': dataSource.get('hasBottomToolbar')
    });
    
    context = context.begin('div').addClass('popover-background');
    this.includeSlices(dataSource, context, SC.NINE_SLICE);
    context.push("<div class = 'sc-pointer'></div>");
    context = context.end();
  },

  update: function(dataSource, jquery) {
    jquery.setClass({
      'top-toolbar': dataSource.get('hasTopToolbar'),
      'bottom-toolbar': dataSource.get('hasBottomToolbar')
    });
  }
});
/* >>>>>>>>>> BEGIN source/resources/progress/progress.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require("theme");

/**
  Renders and updates DOM representations of progress bars.
  
  Parameters
  --------------------------
  Expects these properties on the data source:
  
  - isIndeterminate
  - isRunning
  - isEnabled
  - value
  
  Theme Constants
  -------------------------------------
  Ace's progressRenderDelegate's rendering process is not affected by 
  any theme constants.
*/
SC.AceTheme.progressRenderDelegate = SC.RenderDelegate.create({
  name: 'progress',
  
  render: function(dataSource, context) {
    var theme = dataSource.get('theme');
    
    var value;
    if (dataSource.get('isIndeterminate')) {
      value = 120;
    } else {
      value = dataSource.get('value');
    }  
    
    context.setClass({
      indeterminate: dataSource.get('isIndeterminate'),
      running: dataSource.get('isRunning'),
      disabled: !dataSource.get('isEnabled'),
      'sc-empty': (value <= 0),
      'sc-complete': (value >= 100)
    });
    
    context = context.begin('div').addClass('track');
    this.includeSlices(dataSource, context, SC.THREE_SLICE);
    context = context.end();
    
    context = context.begin('div').addClass('content');
    context.css('width', (value * 100) + "%");
    this.includeSlices(dataSource, context, SC.THREE_SLICE);
    context = context.end();
  },
  
  update: function(dataSource, $) {
    var theme = dataSource.get('theme');
    
    var value;
    if (dataSource.get('isIndeterminate')) {
      value = 120;
    } else {
      value = dataSource.get('value');
    }
    
    $.setClass({
      indeterminate: dataSource.get('isIndeterminate'),
      running: dataSource.get('isRunning'),
      disabled: !dataSource.get('isEnabled'),
      'sc-empty': (value <= 0),
      'sc-complete': (value >= 100)
    });
    
    $.find('.content').css('width', (value * 100) + "%");
  }
});

/* >>>>>>>>>> BEGIN source/resources/slider/ace/slider.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  Renders and updates the DOM representation of a slider.
  
  Parameters
  -------------------------
  Requires the following parameters:
  
  - value: a value from 0 to 1.
  - frame: containing the frame in which the slider is being drawn.
*/

SC.AceTheme.sliderRenderDelegate = SC.RenderDelegate.create({
  
  name: 'slider',
  
  render: function(dataSource, context) {
    var blankImage = SC.BLANK_IMAGE_URL;
    
    context = context.begin('span').addClass('track');
    this.includeSlices(dataSource, context, SC.THREE_SLICE);
    context = context.end();
    
    context.push(
      '<img src="', blankImage, 
      '" class="sc-handle" style="left: ', dataSource.get('value'), '%" />',
      '</span>'
    );
    
    dataSource.get('renderState')._cachedHandle = null;
  },
  
  update: function(dataSource, jquery) {
    if (dataSource.didChangeFor('sliderRenderDelegate', 'value')) {
      var handle = dataSource.get('renderState')._cachedHandle;
      if (!handle) handle = dataSource.get('renderState')._cachedHandle = jquery.find('.sc-handle');
      
      handle.css('left', dataSource.get('value') + "%");
    }
  }
  
});

/* >>>>>>>>>> BEGIN source/resources/well/well.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.AceTheme.Well = SC.AceTheme.subtheme('well');

SC.AceTheme.Well.containerRenderDelegate = SC.RenderDelegate.create({
  name: 'container',
  render: function(dataSource, context) {
    
  },
  
  update: function() {

  }
});

