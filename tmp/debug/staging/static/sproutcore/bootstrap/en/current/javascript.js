/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/* >>>>>>>>>> BEGIN source/system/browser.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var SC = SC || { MODULE_INFO: {}, LAZY_INSTANTIATION: {} };

SC._detectBrowser = function(rawUserAgent, language) {
  if (rawUserAgent === undefined) rawUserAgent = navigator.userAgent;
  if (language === undefined) language = navigator.language || navigator.browserLanguage;

  var userAgent = rawUserAgent.toLowerCase(),
      // Gibberish at the end is to determine when the browser version is done
      version = (userAgent.match( /.*(?:rv|chrome|webkit|opera|ie)[\/: ](.+?)([ \);]|$)/ ) || [])[1],
      webkitVersion = (userAgent.match( /webkit\/(.+?) / ) || [])[1];

  var browser = {
    version:      version,
    safari:       /webkit/.test(userAgent) ? webkitVersion : 0,
    opera:        /opera/.test(userAgent) ? version : 0,
    msie:         /msie/.test(userAgent) && !/opera/.test(userAgent) ? version : 0,
    mozilla:      /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test(userAgent) ? version : 0,
    mobileSafari: /apple.*mobile.*safari/.test(userAgent) ? version : 0,
    chrome:       /chrome/.test( userAgent ) ? version : 0,
    windows:      !!/windows/.test(userAgent),
    mac:          !!/macintosh/.test(userAgent) || (/mac os x/.test(userAgent) && !/like mac os x/.test(userAgent)),
    language:     language.split('-', 1)[0]
  };

  browser.current = browser.msie ? 'msie' : browser.mozilla ? 'mozilla' : browser.chrome ? 'chrome' : browser.safari ? 'safari' : browser.opera ? 'opera' : 'unknown' ;
  return browser ;
};

SC.browser = SC._detectBrowser();

/* >>>>>>>>>> BEGIN source/system/bench.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global SC_benchmarkPreloadEvents*/
// sc_require("system/browser")
if (typeof SC_benchmarkPreloadEvents !== "undefined") {
  SC.benchmarkPreloadEvents = SC_benchmarkPreloadEvents;
  SC_benchmarkPreloadEvents = undefined;
} else {
  SC.benchmarkPreloadEvents = { headStart: new Date().getTime() };
}
/* >>>>>>>>>> BEGIN source/system/loader.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// sc_require("system/browser");

SC.setupBodyClassNames = function() {
  var el = document.body ;
  if (!el) return ;
  var browser, platform, shadows, borderRad, classNames, style;
  browser = SC.browser.current ;
  platform = SC.browser.windows ? 'windows' : SC.browser.mac ? 'mac' : 'other-platform' ;
  style = document.documentElement.style;
  shadows = (style.MozBoxShadow !== undefined) || 
                (style.webkitBoxShadow !== undefined) ||
                (style.oBoxShadow !== undefined) ||
                (style.boxShadow !== undefined);
  
  borderRad = (style.MozBorderRadius !== undefined) || 
              (style.webkitBorderRadius !== undefined) ||
              (style.oBorderRadius !== undefined) ||
              (style.borderRadius !== undefined);
  
  classNames = el.className ? el.className.split(' ') : [] ;
  if(shadows) classNames.push('box-shadow');
  if(borderRad) classNames.push('border-rad');
  classNames.push(browser) ;
  if (browser === 'chrome') classNames.push('safari');
  classNames.push(platform) ;
  if (parseInt(SC.browser.msie,0)==7) classNames.push('ie7') ;
  if (SC.browser.mobileSafari) classNames.push('mobile-safari') ;
  if ('createTouch' in document) classNames.push('touch');
  el.className = classNames.join(' ') ;
} ;

