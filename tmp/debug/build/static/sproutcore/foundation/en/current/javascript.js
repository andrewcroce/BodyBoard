/* >>>>>>>>>> BEGIN source/lproj/strings.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.stringsFor('English', {
  '_SC.DateTime.dayNames': 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday',
  '_SC.DateTime.abbreviatedDayNames': 'Sun Mon Tue Wed Thu Fri Sat',
  '_SC.DateTime.monthNames': 'January February March April May June July August September October November December',
  '_SC.DateTime.abbreviatedMonthNames': 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'
}) ;

/* >>>>>>>>>> BEGIN source/core.js */

/* >>>>>>>>>> BEGIN source/mixins/tree_item_content.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace

  A tree item is a model object that acts as a node in a tree-like data 
  structure such as a hierarchy of folders or outline of items.  This mixin 
  can be applied to tree item model objects to customize the way the tree
  information is extracted from the object.

  h2. Basic Implementation
  
  If you add this mixin, you must implement the treeItemChildren property so
  that it returns the current array of child tree items for the receiver.  If
  you do not implement this property the tree item will not function.
  
  h2. Optimizing Branches
  
  The most common use of this mixin is to override the treeItemBranchIndexes
  property to return an index set of child items that are themselves branches
  in the tree.  Normally the TreeController will need to walk every item in
  your list to determine these branch items.  However by implementing this 
  method yourself, you can provide a result faster.
  
  If none of your child items are branches, override this property to return
  null or an empty index set.
  
  @since SproutCore 1.0
*/
SC.TreeItemContent = {

  /** 
    Walk like a duck. 
    
    @property {Boolean}
  */
  isTreeItemContent: YES,
  
  /**
    Property returns the children for this tree item.  The default simply 
    returns null.  If you implement this mixin, you MUST implement this 
    property to return the actual tree item children for the item.
   
    @property {SC.Array}
  */
  treeItemChildren: null,

  /**
    The default property used to determine if the tree item is expanded.  You
    can implement you model object to update this property or you can override
    treeItemDisclosureState() to compute the disclosure state however you 
    want.
    
    @property {Boolean}
  */
  treeItemIsExpanded: YES,
  
  /**
    Indicates whether the tree item should be rendered as a group or not. 
    This property is only useful on the root item in your tree.  Setting it to
    YES on any other item will be ignored.
    
    @property {Boolean}
  */
  treeItemIsGrouped: NO,
  
  /**
    Returns the disclosure state for the tree item, which appears at the 
    index of the parent's treeItemChildren array.  The response must be one of 
    SC.BRANCH_OPEN, SC.BRANCH_CLOSED or SC.LEAF_NODE.
     
    If the parent parameter is null, then this item is part of the root 
    children array.
    
    This method will only be called for tree items that have children.  Tree
    items with no children are assumed to be leaf nodes.

    The default implementation uses the treeItemIsExpanded property to 
    determine if the item should be open or closed.
    
    @param {Object} parent the parent item containing this item
    @param {Number} idx the index of the item in the parent
    @returns {Number} branch state
  */
  treeItemDisclosureState: function(parent, idx) {
    return this.get('treeItemIsExpanded') ? SC.BRANCH_OPEN : SC.BRANCH_CLOSED;
  },
  
  /**
    Collapse the tree item.  The default implementation will change the 
    treeItemIsExpanded property, but you can override this method to handle
    collapsing anyway you like.
    
    @param {Object} parent the parent item containing this item
    @param {Number} idx the index of the item in the parent
    @returns {void}
  */
  treeItemCollapse: function(parent, idx) {
    this.setIfChanged('treeItemIsExpanded', NO);    
  },

  /**
    Expand the tree item.  The default implementation will change the 
    treeItemIsExpanded property, but you can override this method to handle
    collapsing anyway you like.
    
    @param {Object} parent the parent item containing this item
    @param {Number} idx the index of the item in the parent
    @returns {void}
  */
  treeItemExpand: function(parent, idx) {
    this.setIfChanged('treeItemIsExpanded', YES);    
  },
  
  /**
    Returns an index set containing the child indexes of the item that are 
    themselves branches.  This will only be called on tree items with a branch
    disclosure state.

    If the passed parent and index are both null, then the receiver is the 
    root node in the tree.
    
    The default implementation iterates over the item's children to get the
    disclosure state of each one.  Child items with a branch disclosure state
    will have their index added to the return index set.  
    
    You may want to override this method to provide a more efficient 
    implementation if you are working with large data sets and can infer which
    children are branches without iterating over each one.

    If you know for sure that all of the child items for this item are leaf
    nodes and not branches, simply override this method to return null.
    
    @param {Object} parent the parent item containing this item
    @param {Number} index the index of the item in the parent
    @returns {SC.IndexSet} branch indexes
  */
  treeItemBranchIndexes: function(parent, index) {
    var children = this.get('treeItemChildren'),
        ret, lim, idx, item;
        
    if (!children) return null ; // nothing to do
    
    ret = SC.IndexSet.create();
    lim = children.get('length');
    for(idx=0;idx<lim;idx++) {
      if (!(item = children.objectAt(idx))) continue;
      if (!item.get('treeItemChildren')) continue;
      if (item.treeItemDisclosureState(this,idx)!==SC.LEAF_NODE) ret.add(idx);
    }

    return ret.get('length')>0 ? ret : null;
  }
  
};

/* >>>>>>>>>> BEGIN source/mixins/collection_content.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  Used for contentIndexDisclosureState().  Indicates open branch node.
  
  @property {Number}
*/
SC.BRANCH_OPEN = 0x0011;

/**
  Used for contentIndexDisclosureState().  Indicates closed branch node.
  
  @property {Number}
*/
SC.BRANCH_CLOSED = 0x0012;

/**
  Used for contentIndexDisclosureState().  Indicates leaf node.
  
  @property {Number}
*/
SC.LEAF_NODE = 0x0020;

/**
  @namespace

  This mixin provides standard methods used by a CollectionView to provide
  additional meta-data about content in a collection view such as selection
  or enabled state.
  
  You can apply this mixin to a class that you set as a delegate or to the
  object you set as content.
  
  @since SproutCore 1.0
*/
SC.CollectionContent = {

  /**
    Used to detect the mixin by SC.CollectionView

    @property {Boolean}
  */
  isCollectionContent: YES,
  
  /**
    Return YES if the content index should be selected.  Default behavior 
    looks at the selection property on the view.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {Boolean} YES, NO, or SC.MIXED_STATE
  */
  contentIndexIsSelected: function(view, content, idx) {
    var sel = view.get('selection');
    return sel ? sel.contains(content, idx) : NO ;
  },
  
  /**
    Returns YES if the content index should be enabled.  Default looks at the
    isEnabled state of the collection view.
    looks at the selection property on the view.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {Boolean} YES, NO, or SC.MIXED_STATE
  */
  contentIndexIsEnabled: function(view, content, idx) {
    return view.get('isEnabled');
  },
  
  // ..........................................................
  // GROUPING
  // 
  
  /**
    Optionally return an index set containing the indexes that may be group
    views.  For each group view, the delegate will actually be asked to 
    confirm the view is a group using the contentIndexIsGroup() method.
    
    If grouping is not enabled, return null.
    
    @param {SC.CollectionView} view the calling view
    @param {SC.Array} content the content object
    @return {SC.IndexSet} 
  */
  contentGroupIndexes: function(view, content) {
    return null;
  },
  
  /**
    Returns YES if the item at the specified content index should be rendered
    using the groupExampleView instead of the regular exampleView.  Note that
    a group view is different from a branch/leaf view.  Group views often 
    appear with different layout and a different look and feel.

    Default always returns NO.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {Boolean} YES, NO, or SC.MIXED_STATE
  */
  contentIndexIsGroup: function(view, content, idx) {
    return NO ;
  },
  
  // ..........................................................
  // OUTLINE VIEWS
  // 
  
  /**
    Returns the outline level for the item at the specified index.  Can be 
    used to display hierarchical lists.
    
    Default always returns -1 (no outline).
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {Boolean} YES, NO, or SC.MIXED_STATE
  */
  contentIndexOutlineLevel: function(view, content, idx) {
    return -1;
  },
  
  /**
    Returns a constant indicating the disclosure state of the item.  Must be
    one of SC.BRANCH_OPEN, SC.BRANCH_CLOSED, SC.LEAF_NODE.  If you return one
    of the BRANCH options then the item may be rendered with a disclosure 
    triangle open or closed.  If you return SC.LEAF_NODe then the item will 
    be rendered as a leaf node.  

    Default returns SC.LEAF_NODE.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {Boolean} YES, NO, or SC.MIXED_STATE
  */
  contentIndexDisclosureState: function(view, content, idx) {
    return SC.LEAF_NODE;    
  },
  
  /**
    Called to expand a content index item if it is currently in a closed 
    disclosure state.  The default implementation does nothing.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {void}
  */
  contentIndexExpand: function(view, content, idx) {
    console.log('contentIndexExpand(%@, %@, %@)'.fmt(view,content,idx));
  },
  
  /**
    Called to collapse a content index item if it is currently in an open 
    disclosure state.  The default implementation does nothing.  
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {void}
  */
  contentIndexCollapse: function(view, content, idx) {
    console.log('contentIndexCollapse(%@, %@, %@)'.fmt(view,content,idx));
  }
    
};

/* >>>>>>>>>> BEGIN source/private/tree_item_observer.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('mixins/tree_item_content');
sc_require('mixins/collection_content');

/** 
  @ignore
  @class
  
  A TreeNode is an internal class that will manage a single item in a tree
  when trying to display the item in a hierarchy. 
  
  When displaying a tree of objects, a tree item object will be nested to 
  cover every object that might have child views.
  
  TreeNode stores an array which contains either a number pointing to the 
  next place in the array there is a child item or it contains a child item.
  
  @extends SC.Object
  @extends SC.Array
  @extends SC.CollectionContent
  @since SproutCore 1.0
*/
SC.TreeItemObserver = SC.Object.extend(SC.Array, SC.CollectionContent, {

  /**
    The node in the tree this observer will manage.  Set when creating the
    object.  If you are creating an observer manually, you must set this to
    a non-null value.
  */
  item: null,

  /**
    The controller delegate.  If the item does not implement the 
    TreeItemContent method, delegate properties will be used to determine how
    to access the content.  Set automatically when a tree item is created.
    
    If you are creating an observer manually, you must set this to a non-null
    value.
  */
  delegate: null,
  
  // ..........................................................
  // FOR NESTED OBSERVERS
  // 
  
  /**
    The parent TreeItemObserver for this observer.  Must be set on create.
  */
  parentObserver: null,

  /**
    The parent item for the observer item.  Computed automatically from the 
    parent.  If the value of this is null, then this is the root of the tree.
  */
  parentItem: function() {
    var p = this.get('parentObserver');
    return p ? p.get('item') : null;
  }.property('parentObserver').cacheable(),
  
  /**
    Index location in parent's children array.  If this is the root item
    in the tree, should be null.
  */
  index: null,
  
  outlineLevel: 0, 
  
  // ..........................................................
  // EXTRACTED FROM ITEM
  // 
  
  /**
    Array of child tree items.  Extracted from the item automatically on init.
  */
  children: null,
  
  /**
    Disclosure state of this item.  Must be SC.BRANCH_OPEN or SC.BRANCH_CLOSED
    If this is the root of a item tree, the observer will have children but
    no parent or parent item.  IN this case the disclosure state is always
    SC.BRANCH_OPEN.
    
    @property
    @type Number
  */
  disclosureState: SC.BRANCH_OPEN,

  /**
    IndexSet of children with branches.  This will ask the delegate to name 
    these indexes.  The default implementation will iterate over the children
    of the item but a more optimized version could avoid touching each item.
    
    @property
    @type SC.IndexSet
  */
  branchIndexes: function() {
    var item = this.get('item'), 
        len, pitem, idx, children, ret;
    
    // no item - no branches
    if (!item) return SC.IndexSet.EMPTY;
    
    // if item is treeItemContent then ask it directly
    else if (item.isTreeItemContent) {
      pitem  = this.get('parentItem');
      idx    = this.get('index') ;
      return item.treeItemBranchIndexes(pitem, idx);
      
    // otherwise, loop over children and determine disclosure state for each
    } else {
      children = this.get('children');
      if (!children) return null; // no children - no branches
      ret = SC.IndexSet.create();
      len = children.get('length');
      pitem = item ; // save parent
      
      for(idx=0;idx<len;idx++) {
        if (!(item = children.objectAt(idx))) continue ;
        if (!this._computeChildren(item, pitem, idx)) continue; // no chil'en
        if (this._computeDisclosureState(item, pitem, idx) !== SC.LEAF_NODE) {
          ret.add(idx);
        }
      }

      return ret.get('length')>0 ? ret : null;
    }
  }.property('children').cacheable(),
  
  /**
    Returns YES if the item itself should be shown, NO if only its children
    should be shown.  Normally returns YES unless the parentObject is null.
  */
  isHeaderVisible: function() {
    return !!this.get('parentObserver');
  }.property('parentObserver').cacheable(),
  
  /**
    Get the current length of the tree item including any of its children.
  */
  length: 0,
  
  // ..........................................................
  // SC.ARRAY SUPPORT
  // 
  
  /**
    Get the object at the specified index.  This will talk the tree info
    to determine the proper place.  The offset should be relative to the 
    start of this tree item.  Calls recursively down the tree.
    
    This should only be called with an index you know is in the range of item
    or its children based on looking at the length.
    
    @param {Number} index
    @param {Boolean} omitMaterializing
    @returns {Object}
  */
  objectAt: function(index, omitMaterializing) {
    var len   = this.get('length'),
        item  = this.get('item'), 
        cache = this._objectAtCache,
        cur   = index,
        loc   = 0,
        indexes, children;
     
    if (index >= len) return undefined;
    if (this.get('isHeaderVisible')) {
      if (index === 0) return item;
      else cur--;
    }
    item = null; 

    if (!cache) cache = this._objectAtCache = [];
    if ((item = cache[index]) !== undefined) return item ;

    children = this.get('children');
    if (!children) return undefined; // no children - nothing to get
    
    // loop through branch indexes, reducing the offset until it matches 
    // something we might actually return.
    if (indexes = this.get('branchIndexes')) {
      indexes.forEach(function(i) {
        if (item || (i > cur)) return ; // past end - nothing to do

        var observer = this.branchObserverAt(i), len;
        if (!observer) return ; // nothing to do

        // if cur lands inside of this observer's length, use objectAt to get
        // otherwise, just remove len from cur.
        len = observer.get('length') ;
        if (i+len > cur) {
          item = observer.objectAt(cur-i, omitMaterializing);
          cur  = -1;
        } else cur -= len-1 ;
        
      },this);
    }
    
    if (cur>=0) item = children.objectAt(cur, omitMaterializing); // get internal if needed
    cache[index] = item ; // save in cache 
    
    return item ;
  },

  /**
    Implements SC.Array.replace() primitive.  For this method to succeed, the
    range you replace must lie entirely within the same parent item, otherwise
    this will raise an exception.
    
    h3. The Operation Parameter
    
    Note that this replace method accepts an additional parameter "operation"
    which is used when you try to insert an item on a boundary between 
    branches whether it should be inserted at the end of the previous group
    after the group.  If you don't pass operation, the default is 
    SC.DROP_BEFORE, which is the expected behavior.
    
    Even if the operation is SC.DROP_AFTER, you should still pass the actual
    index where you expect the item to be inserted.  For example, if you want
    to insert AFTER the last index of an 3-item array, you would still call:
    
    {{{
      observer.replace(3, 0, [object1 .. objectN], SC.DROP_AFTER)
    }}}
    
    The operation is simply used to disambiguate whether the insertion is
    intended to be AFTER the previous item or BEFORE the items you are
    replacing.
    
    @param {Number} start the starting index
    @param {Number} amt the number of items to replace
    @param {SC.Array} objects array of objects to insert
    @param {Number} operation either SC.DROP_BEFORE or SC.DROP_AFTER
    @returns {SC.TreeItemObserver} receiver
  */
  replace: function(start, amt, objects, operation) {

    var cur      = start,
        observer = null,
        indexes, len, max;
        
    if (operation === undefined) operation = SC.DROP_BEFORE;
    
    // adjust the start location based on branches, possibly passing on to an
    // observer.
    if (this.get('isHeaderVisible')) cur--; // exclude my own header item 
    if (cur < 0) throw "Tree Item cannot replace itself";

    // remove branch lengths.  If the adjusted start location lands inside of
    // another branch, then just let that observer handle it.
    if (indexes = this.get('branchIndexes')) {
      indexes.forEach(function(i) {
        if (observer || (i>=cur)) return ; // nothing to do
        if (!(observer = this.branchObserverAt(i))) return; // nothing to do
        len = observer.get('length');
        
        // if this branch range is before the start loc, just remove it and 
        // go on.  If cur is somewhere inside of the range, then save to pass
        // on.  Note use of operation to determine the abiguous end op.
        if ((i+len === cur) && operation === SC.DROP_AFTER) cur -= i;
        else if (i+len > cur) cur -= i; // put inside of nested range
        else {
          cur -= len-1; observer = null ;
        }
      }, this);      
    }
      
    // if an observer was saved, pass on call.
    if (observer) {
      observer.replace(cur, amt, objects, operation);
      return this;
    }
    
    // no observer was saved, which means cur points to an index inside of
    // our own range.  Now amt just needs to be adjusted to remove any
    // visible branches as well.
    max = cur + amt;
    if (amt>1 && indexes) { // if amt is 1 no need...
      indexes.forEachIn(cur, indexes.get('max')-cur, function(i) {
        if (i > max) return; // nothing to do
        if (!(observer = this.branchObserverAt(i))) return; // nothing to do
        len = observer.get('length');
        max -= len-1;
      }, this);
    }
    
    // get amt back out.  if amt is negative, it means that the range passed
    // was not cleanly inside of this range.  raise an exception.
    amt = max-cur; 
    
    // ok, now that we are adjusted, get the children and forward the replace
    // call on.  if there are no children, bad news...
    var children = this.get('children');
    if (!children) throw "cannot replace() tree item with no children";

    if ((amt < 0) || (max>children.get('length'))) {
      throw "replace() range must lie within a single tree item";
    }

    children.replace(cur, amt, objects, operation);
    
    // don't call enumerableContentDidChange() here because, as an observer,
    // we should be notified by the children array itself.
    
    return this;
  },
  
  /**
    Called whenever the content for the passed observer has changed.  Default
    version notifies the parent if it exists and updates the length.
    
    The start, amt and delta params should reflect changes to the children
    array, not to the expanded range for the wrapper.
  */
  observerContentDidChange: function(start, amt, delta) {
    
    // clear caches
    this.invalidateBranchObserversAt(start);
    this._objectAtCache = this._outlineLevelCache = null;
    this._disclosureStateCache = null;
    this._contentGroupIndexes = NO;
    this.notifyPropertyChange('branchIndexes');
    
    var oldlen = this.get('length'),
        newlen = this._computeLength(),
        parent = this.get('parentObserver'), set;
    
    // update length if needed
    if (oldlen !== newlen) this.set('length', newlen);
    
    // if we have a parent, notify that parent that we have changed.
    if (!this._notifyParent) return this; // nothing more to do
    
    if (parent) {
      set = SC.IndexSet.create(this.get('index'));
      parent._childrenRangeDidChange(parent.get('children'), null, '[]', set);
      
    // otherwise, note the enumerable content has changed.  note that we need
    // to convert the passed change to reflect the computed range
    } else {
      if (oldlen === newlen) {
        amt = this.expandChildIndex(start+amt);
        start = this.expandChildIndex(start);
        amt = amt - start ;
        delta = 0 ;
        
      } else {
        start = this.expandChildIndex(start);
        amt   = newlen - start;
        delta = newlen - oldlen ;
      }

      this.enumerableContentDidChange(start, amt, delta);
    }
  },

  /**
    Accepts a child index and expands it to reflect any nested groups.
  */
  expandChildIndex: function(index) {
    
    var ret = index;
    if (this.get('isHeaderVisible')) index++;

    // fast path
    var branches = this.get('branchIndexes');
    if (!branches || branches.get('length')===0) return ret;
    
    // we have branches, adjust for their length
    branches.forEachIn(0, index, function(idx) {
      ret += this.branchObserverAt(idx).get('length')-1;
    }, this);
    
    return ret; // add 1 for item header
  },
  
  // ..........................................................
  // SC.COLLECTION CONTENT SUPPORT
  // 

  _contentGroupIndexes: NO,
  
  /**
    Called by the collection view to return any group indexes.  The default 
    implementation will compute the indexes one time based on the delegate 
    treeItemIsGrouped
  */
  contentGroupIndexes: function(view, content) {
    if (content !== this) return null; // only care about receiver

    var ret = this._contentGroupIndexes;
    if (ret !== NO) return ret ;
    
    // if this is not the root item, never do grouping
    if (this.get('parentObserver')) return null;
    
    var item = this.get('item'), group, indexes, len, cur, loc, children;
    
    if (item && item.isTreeItemContent) group = item.get('treeItemIsGrouped');
    else group = !!this.delegate.get('treeItemIsGrouped');
    
    // if grouping is enabled, build an index set with all of our local 
    // groups.
    if (group) {
      ret      = SC.IndexSet.create();
      indexes  = this.get('branchIndexes');
      children = this.get('children');
      len      = children ? children.get('length') : 0;
      cur = loc = 0;
      
      if (indexes) {
        indexes.forEach(function(i) {
          ret.add(cur, (i+1)-loc); // add loc -> i to set
          cur += (i+1)-loc;
          loc = i+1 ;
          
          var observer = this.branchObserverAt(i);
          if (observer) cur += observer.get('length')-1;
        }, this);
      }

      if (loc<len) ret.add(cur, len-loc);
    } else ret = null;
    
    this._contentGroupIndexes = ret ;
    return ret;
  },
  
  contentIndexIsGroup: function(view, content, idx) {
    var indexes = this.contentGroupIndexes(view, content);
    return indexes ? indexes.contains(idx) : NO ;
  },
  
  /**
    Returns the outline level for the specified index.
  */
  contentIndexOutlineLevel: function(view, content, index) {
    if (content !== this) return -1; // only care about us
    
    var cache = this._outlineLevelCache;
    if (cache && (cache[index] !== undefined)) return cache[index];
    if (!cache) cache = this._outlineLevelCache = [];
    
    var len   = this.get('length'),
        cur   = index,
        loc   = 0,
        ret   = null,
        indexes, children, observer;
    
    if (index >= len) return -1;
     
    if (this.get('isHeaderVisible')) {
      if (index === 0) return cache[0] = this.get('outlineLevel')-1;
      else cur--;
    }

    // loop through branch indexes, reducing the offset until it matches 
    // something we might actually return.
    if (indexes = this.get('branchIndexes')) {
      indexes.forEach(function(i) {
        if ((ret!==null) || (i > cur)) return ; // past end - nothing to do

        var observer = this.branchObserverAt(i), len;
        if (!observer) return ; // nothing to do

        // if cur lands inside of this observer's length, use objectAt to get
        // otherwise, just remove len from cur.
        len = observer.get('length') ;
        if (i+len > cur) {
          ret  = observer.contentIndexOutlineLevel(view, observer, cur-i);
          cur  = -1;
        } else cur -= len-1 ;
        
      },this);
    }
    
    if (cur>=0) ret = this.get('outlineLevel'); // get internal if needed
    cache[index] = ret ; // save in cache 
    return ret ;
  },

  /**
    Returns the disclosure state for the specified index.
  */
  contentIndexDisclosureState: function(view, content, index) {
    if (content !== this) return -1; // only care about us
    
    var cache = this._disclosureStateCache;
    if (cache && (cache[index] !== undefined)) return cache[index];
    if (!cache) cache = this._disclosureStateCache = [];
    
    var len   = this.get('length'),
        cur   = index,
        loc   = 0,
        ret   = null,
        indexes, children, observer;
    
    if (index >= len) return SC.LEAF_NODE;
     
    if (this.get('isHeaderVisible')) {
      if (index === 0) return cache[0] = this.get('disclosureState');
      else cur--;
    }

    // loop through branch indexes, reducing the offset until it matches 
    // something we might actually return.
    if (indexes = this.get('branchIndexes')) {
      indexes.forEach(function(i) {
        if ((ret!==null) || (i > cur)) return ; // past end - nothing to do

        var observer = this.branchObserverAt(i), len;
        if (!observer) return ; // nothing to do

        // if cur lands inside of this observer's length, use objectAt to get
        // otherwise, just remove len from cur.
        len = observer.get('length') ;
        if (i+len > cur) {
          ret  = observer.contentIndexDisclosureState(view, observer, cur-i);
          cur  = -1;
        } else cur -= len-1 ;
        
      },this);
    }
    
    if (cur>=0) ret = SC.LEAF_NODE; // otherwise its a leaf node
    cache[index] = ret ; // save in cache 
    return ret ;
  },

  /**
    Expands the specified content index.  This will search down until it finds
    the branchObserver responsible for this item and then calls _collapse on
    it.
  */
  contentIndexExpand: function(view, content, idx) {

    var indexes, cur = idx, children, item;
    
    if (content !== this) return; // only care about us
    if (this.get('isHeaderVisible')) {
      if (idx===0) {
        this._expand(this.get('item'));
        return;
      } else cur--;
    } 
    
    if (indexes = this.get('branchIndexes')) {
      indexes.forEach(function(i) {
        if (i >= cur) return; // past end - nothing to do
        var observer = this.branchObserverAt(i), len;
        if (!observer) return ; 
        
        len = observer.get('length');
        if (i+len > cur) {
          observer.contentIndexExpand(view, observer, cur-i);
          cur = -1 ; //done
        } else cur -= len-1;
        
      }, this);  
    }
    
    // if we are still inside of the range then maybe pass on to a child item
    if (cur>=0) {
      children = this.get('children');  
      item     = children ? children.objectAt(cur) : null;
      if (item) this._expand(item, this.get('item'), cur);
    }
  },
  
  /**
    Called to collapse a content index item if it is currently in an open 
    disclosure state.  The default implementation does nothing.  
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Array} content the content object
    @param {Number} idx the content index
    @returns {void}
  */
  contentIndexCollapse: function(view, content, idx) {

    var indexes, children, item, cur = idx;
        
    if (content !== this) return; // only care about us
    if (this.get('isHeaderVisible')) {
      if (idx===0) {
        this._collapse(this.get('item'));
        return;
      } else cur--;
    } 
    
    
    if (indexes = this.get('branchIndexes')) {
      indexes.forEach(function(i) {
        if (i >= cur) return; // past end - nothing to do
        var observer = this.branchObserverAt(i), len;
        if (!observer) return ; 
        
        len = observer.get('length');
        if (i+len > cur) {
          observer.contentIndexCollapse(view, observer, cur-i);
          cur = -1 ; //done
        } else cur -= len-1;
        
      }, this);  
    }

    // if we are still inside of the range then maybe pass on to a child item
    if (cur>=0) {
      children = this.get('children');  
      item     = children ? children.objectAt(cur) : null;
      if (item) this._collapse(item, this.get('item'), cur);
    }
  },
  
  // ..........................................................
  // BRANCH NODES
  //   

  /**
    Returns the branch item for the specified index.  If none exists yet, it
    will be created.
  */
  branchObserverAt: function(index) {
    var byIndex = this._branchObserversByIndex,
        indexes = this._branchObserverIndexes,
        ret, parent, pitem, item, children, guid, del ;
        
    if (!byIndex) byIndex = this._branchObserversByIndex = [];
    if (!indexes) {
      indexes = this._branchObserverIndexes = SC.IndexSet.create();
    }

    if (ret = byIndex[index]) return ret ; // use cache

    // no observer for this content exists, create one
    children = this.get('children');
    item   = children ? children.objectAt(index) : null ;
    if (!item) return null ; // can't create an observer for a null item
    
    byIndex[index] = ret = SC.TreeItemObserver.create({
      item:     item,
      delegate: this.get('delegate'),
      parentObserver:   this,
      index:  index,
      outlineLevel: this.get('outlineLevel')+1
    });

    indexes.add(index); // save for later invalidation
    return ret ;
  },
  
  /**
    Invalidates any branch observers on or after the specified index range.
  */
  invalidateBranchObserversAt: function(index) {
    var byIndex = this._branchObserversByIndex,
        indexes = this._branchObserverIndexes;

    if (!byIndex || byIndex.length<=index) return this ; // nothing to do
    if (index < 0) index = 0 ;
    
    // destroy any observer on or after the range
    indexes.forEachIn(index, indexes.get('max')-index, function(i) {
      var observer = byIndex[i];
      if (observer) observer.destroy();
    }, this);
    
    byIndex.length = index; // truncate to dump extra indexes
    
    return this;
  },
  
  // ..........................................................
  // INTERNAL METHODS
  // 
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    
    // begin all properties on item if there is one.  This will allow us to
    // track important property changes.
    var item = this.get('item');
    if (!item) throw "SC.TreeItemObserver.item cannot be null";
    
    item.addObserver('*', this, this._itemPropertyDidChange);
    this._itemPropertyDidChange(item, '*');
    this._notifyParent = YES ; // avoid infinite loops
  },
  
  /**
    Called just before a branch observer is removed.  Should stop any 
    observering and invalidate any child observers.
  */
  destroy: function() {
    this.invalidateBranchObserversAt(0);
    this._objectAtCache = null ;
    
    // cleanup observing
    var item = this.get('item');
    if (item) item.removeObserver('*', this, this._itemPropertyDidChange);
    
    var children = this._children,
        ro = this._childrenRangeObserver;
    if (children && ro) children.removeRangeObserver(ro);
    
    arguments.callee.base.apply(this,arguments);
  },
  
  /**
    Called whenever a property changes on the item.  Determines if either the
    children array or the disclosure state has changed and then notifies as 
    necessary..
  */
  _itemPropertyDidChange: function(target, key) {
    var children = this.get('children'),
        state    = this.get('disclosureState'),
        item     = this.get('item'),
        next ;
        
    this.beginPropertyChanges();
    
    next = this._computeDisclosureState(item);
    if (state !== next) this.set('disclosureState', next);
    
    next = this._computeChildren(item);
    if (children !== next) this.set('children', next);
    
    this.endPropertyChanges();
  },
  
  /**
    Called whenever the children or disclosure state changes.  Begins or ends
    observing on the children array so that changes can propogate outward.
  */
  _childrenDidChange: function() {
    var state = this.get('disclosureState'),
        cur   = state === SC.BRANCH_OPEN ? this.get('children') : null,
        last  = this._children,
        ro    = this._childrenRangeObserver;
        
    if (last === cur) return this; //nothing to do
    if (ro) last.removeRangeObserver(ro);
    if (cur) {
      this._childrenRangeObserver = 
          cur.addRangeObserver(null, this, this._childrenRangeDidChange);
    } else this._childrenRangeObserver = null;
    
    this._children = cur ;
    this._childrenRangeDidChange(cur, null, '[]', null);
    
  }.observes("children", "disclosureState"),

  /**
    Called anytime the actual content of the children has changed.  If this 
    changes the length property, then notifies the parent that the content
    might have changed.
  */
  _childrenRangeDidChange: function(array, objects, key, indexes) {
    var children = this.get('children'),
        len = children ? children.get('length') : 0,
        min = indexes ? indexes.get('min') : 0,
        max = indexes ? indexes.get('max') : len,
        old = this._childrenLen || 0;
        
    this._childrenLen = len; // save for future calls
    this.observerContentDidChange(min, max-min, len-old);
  },
  
  /**
    Computes the current disclosure state of the item by asking the item or 
    the delegate.  If no pitem or index is passed, the parentItem and idex 
    will be used.
  */
  _computeDisclosureState: function(item, pitem, index) {
    var key, del;

    // no item - assume leaf node
    if (!item || !this._computeChildren(item)) return SC.LEAF_NODE;
    
    // item implement TreeItemContent - call directly
    else if (item.isTreeItemContent) {
      if (pitem === undefined) pitem = this.get('parentItem');
      if (index === undefined) index = this.get('index');
      return item.treeItemDisclosureState(pitem, index);
      
    // otherwise get treeItemDisclosureStateKey from delegate
    } else {
      key = this._treeItemIsExpandedKey ;
      if (!key) {
        del = this.get('delegate');
        key = del ? del.get('treeItemIsExpandedKey') : 'treeItemIsExpanded';
        this._treeItemIsExpandedKey = key ;
      }
      return item.get(key) ? SC.BRANCH_OPEN : SC.BRANCH_CLOSED;
    }
  },
  
  /**
    Collapse the item at the specified index.  This will either directly 
    modify the property on the item or call the treeItemCollapse() method.
  */
  _collapse: function(item, pitem, index) {
    var key, del;

    // no item - assume leaf node
    if (!item || !this._computeChildren(item)) return this;
    
    // item implement TreeItemContent - call directly
    else if (item.isTreeItemContent) {
      if (pitem === undefined) pitem = this.get('parentItem');
      if (index === undefined) index = this.get('index');
      item.treeItemCollapse(pitem, index);
      
    // otherwise get treeItemDisclosureStateKey from delegate
    } else {
      key = this._treeItemIsExpandedKey ;
      if (!key) {
        del = this.get('delegate');
        key = del ? del.get('treeItemIsExpandedKey') : 'treeItemIsExpanded';
        this._treeItemIsExpandedKey = key ;
      }
      item.setIfChanged(key, NO);
    }
    
    return this ;
  },

  /**
    Expand the item at the specified index.  This will either directly 
    modify the property on the item or call the treeItemExpand() method.
  */
  _expand: function(item, pitem, index) {
    var key, del;

    // no item - assume leaf node
    if (!item || !this._computeChildren(item)) return this;
    
    // item implement TreeItemContent - call directly
    else if (item.isTreeItemContent) {
      if (pitem === undefined) pitem = this.get('parentItem');
      if (index === undefined) index = this.get('index');
      item.treeItemExpand(pitem, index);
      
    // otherwise get treeItemDisclosureStateKey from delegate
    } else {
      key = this._treeItemIsExpandedKey ;
      if (!key) {
        del = this.get('delegate');
        key = del ? del.get('treeItemIsExpandedKey') : 'treeItemIsExpanded';
        this._treeItemIsExpandedKey = key ;
      }
      item.setIfChanged(key, YES);
    }
    
    return this ;
  },
  
  /**
    Computes the children for the passed item.
  */
  _computeChildren: function(item) {
    var del, key;
    
    // no item - no children
    if (!item) return null;
    
    // item implement TreeItemContent - call directly
    else if (item.isTreeItemContent) return item.get('treeItemChildren');
          
    // otherwise get treeItemChildrenKey from delegate
    else {
      key = this._treeItemChildrenKey ;
      if (!key) {
        del = this.get('delegate');
        key = del ? del.get('treeItemChildrenKey') : 'treeItemChildren';
        this._treeItemChildrenKey = key ;
      }
      return item.get(key);
    }
  },
  
  /**
    Computes the length of the array by looking at children.
  */
  _computeLength: function() {
    var ret = this.get('isHeaderVisible') ? 1 : 0,
        state = this.get('disclosureState'),
        children = this.get('children'),
        indexes ;

    // if disclosure is open, add children count + length of branch observers.
    if ((state === SC.BRANCH_OPEN) && children) {
      ret += children.get('length');
      if (indexes = this.get('branchIndexes')) {
        indexes.forEach(function(idx) {
          var observer = this.branchObserverAt(idx);
          ret += observer.get('length')-1;
        }, this);
      }
    } 
    return ret ;
  }
    
});


/* >>>>>>>>>> BEGIN source/controllers/tree.js */
// ========================================================================
// SproutCore -- JavaScript Application Framework
// Copyright ©2006-2011, Strobe Inc. and contributors.
// Portions copyright ©2008 Apple Inc.  All rights reserved.
// ========================================================================

sc_require('private/tree_item_observer');

/**
  @class

  A TreeController manages a tree of model objects that you might want to 
  display in the UI using a collection view.  For the most part, you should
  work with a TreeController much like you would an ObjectController, except
  that the TreeController will also provide an arrangedObjects property that 
  can be used as the content of a CollectionView.
  
  TODO: Document More

  @extends SC.ObjectController
  @extends SC.SelectionSupport
  @since SproutCore 1.0
*/
SC.TreeController = SC.ObjectController.extend(SC.SelectionSupport,
/** @scope SC.TreeController.prototype */ {

  // ..........................................................
  // PROPERTIES
  // 
  
  /**
    Set to YES if you want the top-level items in the tree to be displayed as
    group items in the collection view.
    
    @property {Boolean}
  */
  treeItemIsGrouped: NO,
  
  /**
    If your content support expanding and collapsing of content, then set this
    property to the name of the key on your model that should be used to 
    determine the expansion state of the item.  The default is 
    "treeItemIsExpanded"
    
    @property {String}
  */
  treeItemIsExpandedKey: "treeItemIsExpanded",
  
  /**
    Set to the name of the property on your content object that holds the 
    children array for each tree node.  The default is "treeItemChildren".
    
    @property {String}
  */
  treeItemChildrenKey: "treeItemChildren",
  
  /**
    Returns an SC.Array object that actually will represent the tree as a 
    flat array suitable for use by a CollectionView.  Other than binding this
    property as the content of a CollectionView, you generally should not 
    use this property directly.  Instead, work on the tree content using the
    TreeController like you would any other ObjectController.
  
    @property {SC.Array}
  */
  arrangedObjects: function() {
    var ret, content = this.get('content');
    if (content) {
      ret = SC.TreeItemObserver.create({ item: content, delegate: this });
    } else ret = null; // empty!
    this._sctc_arrangedObjects = ret ;
    
    return ret ;
  }.property().cacheable(),

  // ..........................................................
  // PRIVATE
  // 
  
  /**
    @private
    
    Manually invalidate the arrangedObjects cache so that we can teardown
    any existing value.  We do it via an observer so that this will fire 
    immediately instead of waiting on some other component to get 
    arrangedObjects again.
  */
  _sctc_invalidateArrangedObjects: function() {
    this.propertyWillChange('arrangedObjects');
    
    var ret = this._sctc_arrangedObjects;
    if (ret) ret.destroy();
    this._sctc_arrangedObjects = null;
    
    this.propertyDidChange('arrangedObjects');
  }.observes('content', 'treeItemIsExpandedKey', 'treeItemChildrenKey', 'treeItemIsGrouped'),
  
  _sctc_arrangedObjectsContentDidChange: function() {
    this.updateSelectionAfterContentChange();
  }.observes('*arrangedObjects.[]'),
  
  canSelectGroups: NO,
  
  /**
    @private
    
    Returns the first item in arrangeObjects that is not a group.  This uses
    a brute force approach right now; we assume you probably don't have a lot
    of groups up front.
  */
  firstSelectableObject: function() {
    var objects = this.get('arrangedObjects'),
        indexes, len, idx     = 0;
        
    if (!objects) return null; // fast track
    
    // other fast track. if you want something fancier use collectionViewDelegate
    if(this.get('canSelectGroups')) return objects.get('firstObject');
    
    indexes = objects.contentGroupIndexes(null, objects);
    len = objects.get('length');
    while(indexes.contains(idx) && (idx<len)) idx++;
    return idx>=len ? null : objects.objectAt(idx);
  }.property()
  
});


/* >>>>>>>>>> BEGIN source/debug/control_test_pane.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            portions copyright @2009 Apple Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global test */

// TODO: IMPROVE CODE QUALITY.  This code was put together quickly in order to
// test the SproutCore framework.  It does not match up to the project's 
// normal documentation, design and coding standards.  Do not rely on this 
// code as an example of how to build your own applications.

/** @class
  Generates a pane that will display vertically stacked views for testing.
  You can use this class in test mode to easily create a palette with views
  configured in different ways.
  
  h1. Example
  
  {{{
    var pane = SC.ControlTestPane.design()
      .add('basic', SC.CheckboxView.design({ title: "Hello World" }))
      .add('disabled', SC.CheckboxView.design({
        title: "Hello World", isEnabled: NO
      }));
      
    module("CheckboxView UI", pane);
    
    test("basic", function() {
      var view = pane.view('basic');
      ok(view.get('isEnabled'), 'should be enabled');
    });
  }}}
  
  @extends SC.Pane
  @since SproutCore 1.0
*/
SC.ControlTestPane = SC.Pane.extend(
/** @scope SC.ControlTestPane.prototype */ {
  
  classNames: ['sc-control-test-pane'],
  layout: { right: 20, width: 350, top: 65, bottom: 5 },

  /**
    The starting top location for the first row.  This will increment as 
    views are added to the pane.
  */
  top:       0,
  
  /**
    The default height of each row.  This will be used for a view unless you
    manually specify a height in the view's layout.
  */
  height:    20,
  
  /**
    The default padding added to the edges and between each row.
  */
  padding:   4,

  /**
    Retrieves the test sample view that was added with the passed key name.
    
    @param {String} keyName the key used to register the view.
    @returns {SC.View} view instance
  */
  view: function(keyName) { 
    var idx = this._views[keyName];
    if (!idx) throw "SC.ControlTestPane does not have a view named %@".fmt(keyName);
    return this.childViews[idx].childViews[0]; 
  },
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    if (!this._views) this._views = {};
    this.append(); // auto-add to screen
    
    // Also adjust unit test results to make space
    // use setTimeout to avoid screwing with the RunLoop which we might be 
    // testing.
    var l = this.get('layout'), w = l.right + l.width;
    setTimeout(function() {
      if (!Q$) return ; // nothing to do
      Q$('.core-test > .detail').css('marginRight', w);
    }, 100);
  }
});

/**
  Adds a test view to the control pane design.  The passed label will be used
  as the key which you can use to find the view layer.  You can either pass
  a view that is already designed or pass an array of attributes that will be
  used to create a design on the view.
  
  @param {String} label the view key name
  @param {SC.View} view a view class or view design
  @param {Hash} attrs optional attrs to use when designing the view
  @returns {SC.ControlTestPane} receiver
*/
SC.ControlTestPane.add = function(label, view, attrs) {
  if (attrs === undefined) attrs = {};
  if (!view.isDesign) view = view.design(attrs);

  // compute layout.
  var padding = this.prototype.padding, height = this.prototype.height;
  var top = this.prototype.top + padding*2, layout;
  var labelHeight =14;
  if (top === padding*2) top = padding; // reduce padding @ top
  
  // if the passed in view has a layout property and the layout has an 
  // explicit, numerical height, then use that instead.
  if (view.prototype.layout && (typeof view.prototype.layout.height === SC.T_NUMBER)) height = view.prototype.layout.height;
  
  this.prototype.top = top + height+labelHeight+(padding*2); // make room
  
  // calculate labelView and add it
  layout = { left: padding, width: 150, top: top, height: 20 };
  var labelView = SC.LabelView.design({
    value: label + ':', 
    layout: { left: 0, right: 0, top: 0, height: labelHeight }, 
   // textAlign: SC.ALIGN_RIGHT, 
    fontWeight: SC.BOLD_WEIGHT 
  });

  // wrap label in parent view in order to center text vertically
  labelView = SC.View.design().layout(layout).childView(labelView);
  this.childView(labelView);
  
  // now layout view itself...
  var wrapper = SC.View.design({
    classNames: ['wrapper'],
    layout: { left: padding, top: top+labelHeight+padding, right: padding, height: height },
    childViews: [view]
  });
  var idx = this.prototype.childViews.length ;
  this.childView(wrapper);
  
  var views = this.prototype._views;
  if (!views) views = this.prototype._views = {};
  views[label] = idx ;
  
  return this;
};

/**
  Returns a standard setup/teardown object for use by the module() method.
*/
SC.ControlTestPane.standardSetup = function() {
  var pane = this ;
  return {
    setup: function() { 
      SC.RunLoop.begin();
      pane._pane = pane.create(); 
      SC.RunLoop.end();
    },
    
    teardown: function() {
      SC.RunLoop.begin();
      if (pane._pane) pane._pane.remove();
      SC.RunLoop.end();
      
      pane._pane = null ;
    }
  } ;
};

/**
  Convenience method.  Returns the view with the given name on the current
  pane instance if there is one.
*/
SC.ControlTestPane.view = function(viewKey) {
  var pane = this._pane || this._showPane ;
  if (!pane) throw "view() cannot be called on a class";
  return pane.view(viewKey);
};

/**
  Registers a final test that will instantiate the control test pane and 
  display it.  This allows the developer to interact with the controls once
  the test has completed.
*/
SC.ControlTestPane.show = function() {
  var pane = this ;
  test("show control test pane", function() { 
    SC.RunLoop.begin();
    pane._showPane = pane.create(); 
    SC.RunLoop.end();
  });
};

/* >>>>>>>>>> BEGIN source/system/gesture.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  @class
  
  An SC.Gesture analyzes SC.Touch objects and determines if they are part
  of a gesture. If they are, SC.Gestures keep the views that own them up-to-date
  as that gesture progresses, informing it when it starts, when some aspect of
  it changes, when it ends, and—for convenience—when it is considered to have
  been "triggered".
  
  Gestures can call the following methods on their views:
  
  - [gestureName](gesture, args...): called when the gesture has occurred. This is 
    useful for event-style gestures, where you aren't interested in when it starts or
    ends, but just that it has occurred. SC.SwipeGesture triggers this after the
    swipe has moved a minimum amount—40px by default.

  - [gestureName]Start(gesture, args...): called when the gesture is first recognized. 
    For instance, a swipe gesture may be recognized after the finger has moved a 
    minimum distance in a horizontal.
    
  - [gestureName]Changed(gesture, args...): called when some property of the gesture 
    has changed. For instance, this may be called continuously as the user swipes as 
    the swipe's distance changes.
  
  - [gestureName]Cancelled(gesture, args...): called when a gesture, for one reason 
    or another, is no longer recognized. For instance, a horizontal swipe gesture 
    could cancel if the user moves too far in a vertical direction.
  
  - [gestureName]End(gesture, args...): called when a gesture ends. A swipe would end
    when the user lifts their finger.
  
  Gesture Lifecycle
  ------------------------
  Gestures start receiving events when their view—usually mixing in SC.Gesturable—tells it
  about activities with "unassigned" touches. "Unassigned" touches are touches that have
  not _yet_ been assigned to a gesture.
  
  The touch becomes "assigned" when the gesture's touchIsInGesture method returns YES.
  When a tocuh is assigned to a gesture, the gesture becomes the touch's touch responder;
  this means that it will receive a touchStart event (to which it must return YES), and
  then, all further touch events will be sent _directly_ to the gesture—the gesture's view
  will not receive them at all.
  
  At any point, the gesture may tell the view that it has started, ended, or changed. In
  addition, the gesture may tell the view it has been "triggered." A gesture is not
  necessarily "triggered" when it starts and ends; for instance, a swipe gesture might
  only be triggered if the swipe moves more than a specified amount. The ability to track
  when the gesture has been triggered allows views to easily handle the gesture as its own
  event, rather than as the individual events that are part of it.
  
  If, at some point, the gesture must release the touch back (perhaps the gesture had _thought_
  the touch was a part of it, but turned out to be incorrect), the release(touch) method releases
  it back to the view.
  
  Exclusivity
  ---------------------------------
  The concept described above gives the gestures a way to be either exclusive or inclusive as-needed:
  they can choose to take exclusive control of a touch if they think it is theirs, but if they are
  not sure, they can wait and see.
  
  Status Object
  ---------------------------------
  It is a common need to track some data related to the touch, but without modifying the touch itself.
  SC.Gesture is able to keep track of simple hashes for you, mapping them to the SC.Touch object,
  so that you can maintain some state related to the touch.
  
  For instance, you could set status.failed in touchesDragged, if a touch that you previously
  thought may have been part of the gesture turned out not to be, and then check for 
  status.failed in touchIsInGesture, returning NO if present. This would cause the touch
  to never be considered for your gesture again.
  
  touchIsInGesture is called with the status hash provided in the second argument. You may look
  up the status hash for a touch at any time by calling this.statusForTouch(touch).
  
  
  Implementing a Gesture
  ---------------------------------
  To write a gesture, you would generally implement the following methods:
  
  - touchIsInGesture: Return YES when the touch is—or is likely enough to be that you
    want your gesture to have exclusive control over the touch. You usually do not
    perform much gesture logic here—instead, you save it for touchStart, which will
    get called after you return YES from this method.
  
  - touchStart: Return YES to accept control of the touch. If you do not return YES,
    your gesture will not receive touchesDragged nor touchEnd events. At this point,
    you may (or may not) wish to tell the view that the gesture has started by using the
    start(args...) method.
    
  - touchesDragged: Use this as you would use it in an SC.View to track the touches
    assigned to the gesture. At this point, you might want to tell the view that the
    gesture has updated by using the change(args...) method.
  
  - touchEnd: Again, use this like you would in an SC.View to track when touches
    assigned to the gesture have ended. This is also a potential time to alert the view
    that the gesture has ended, by using the end(args...) method. Further, this may
    also be the time to "trigger" the gesture.
  
*/
SC.Gesture = SC.Object.extend({
  /**
    The gesture's name. When calling events on the owning SC.View, this name will
    be prefixed to the methods. For instance, if the method to be called is
    'Start', and the gesture's name is 'swipe', SC.Gesture will call 'swipeStart'.
  */
  name: "gesture",

  /**
    Return YES to take exclusive control over the touch. In addition to the
    SC.Touch object you may take control of, you are also provided a "status"
    hash, which is unique for both the gesture instance and the touch instance,
    which you may use for your own purposes. 
  */
  touchIsInGesture: function(touch, status) {
    return NO;
  },
  
  /**
    After you return YES from touchIsInGesture (or otherwise 'take' a touch, perhaps
    using the 'take' method), touchStart will be called.
    
    This is where you do any logic needed now that the touch is part of the gesture.
    For instance, you could inform the view that the gesture has started by calling
    this.start().
    
    NOTE: SC.Gesture is just like SC.View in that it has an acceptsMultitouch property.
    If NO (the default), the gesture will only receive touchStart for the first touch
    assigned to it, and only receive touchEnd for the last touch that ends.
  */
  touchStart: function(touch) {
    
  },
  
  /**
    Called when touches assigned to the gesture have moved.
    
    This is where you update the gesture's state, potentially calling change() to
    notify the view.
  */
  touchesDragged: function(evt, touches) {
    
  },
  
  /**
    Called when a touch assigned to the gesture ends.
    
    If there are no remaining touches on the gesture, you may want to call end() to
    notify the view that the gesture has ended (if you haven't ended the gesture
    already).
    
    NOTE: SC.Gesture is just like SC.View in that it has an acceptsMultitouch property.
    If NO (the default), the gesture will only receive touchStart for the first touch
    assigned to it, and only receive touchEnd for the last touch that ends.
  */
  touchEnd: function(touch) {
    
  },
  
  /**
    Starts the gesture (marking it as "active"), and notifies the view.
    
    You can pass any number of arguments to start. They will, along with
    the gesture instance itself, will be passed to the appropriate gesture 
    event on the SC.View.
  */
  start: function() {
    if (!this.get("isActive")) {
      this.set("isActive", YES);
      
      var args = SC.$A(arguments);
      args.unshift(this);
      
      var act = this.name + "Start";
      if (this.view[act]) this.view[act].apply(this.view, args);
    }
  },
  
  /**
    Ends the gesture, if it is active (marking it as not active), and notifies
    the view.
    
    You may pass any number of arguments to end(). They, along with your gesture
    instance itself, will be passed to the appropriate gesture event on the SC.View.
  */
  end: function() {
    if (this.get("isActive")) {
      this.set("isActive", NO);

      var args = SC.$A(arguments);
      args.unshift(this);
      
      var act = this.name + "End";
      if (this.view[act]) this.view[act].apply(this.view, args);
    }
  },
  
  /**
    If the gesture is active, notifies the view that the gesture has
    changed.
    
    The gesture, along with any arguments to change(), will be passed to
    the appropriate method on the SC.View.
  */
  change: function() {
    if (this.get('isActive')) {
      var args = SC.$A(arguments);
      args.unshift(this);

      var act = this.name + "Changed";
      if (this.view[act]) this.view[act].apply(this.view, args);
    }
  },

  /**
    Cancels the gesture, if it is active, and notifies the view that the
    gesture has been cancelled.
    
    Gestures are cancelled when they have ended, but any action that would
    normally be appropriate due to their ending should not be performed.
    
    The gesture, along with any arguments to cancel(), will be passed to the
    appropriate method on the SC.View.
  */
  cancel: function(){
    if (this.get('isActive')) {
      this.set('isActive', NO);

      var args = SC.$A(arguments);
      args.unshift(this);

      var act = this.name + "Cancelled";
      if (this.view[act]) this.view[act].apply(this.view, args);
    }
  },
  
  /**
    Triggers the gesture, notifying the view that the gesture has happened.
    
    You should trigger a gesture where it would be natural to say it has "happened";
    for instance, if a touch moves a couple of pixels, you probably wouldn't say
    a swipe has occurred—though you might say it has "begun." And you wouldn't necessarily
    wait until the touch has ended either. Once the touch has moved a certain amount,
    there has definitely been a swipe. By calling trigger() at this point, you will
    tell the view that it has occurred.
    
    For SC.SwipeGesture, this allows a view to implement only swipe(), and then be 
    automatically notified whenever any swipe has occurred.
  */
  trigger: function() {
    var args = SC.$A(arguments);
    args.unshift(this);
    
    var act = this.name;
    if (this.view[act]) this.view[act].apply(this.view, args);
  },

  /**
    Takes possession of a touch. This does not take effect immediately; it takes effect after
    the run loop finishes to prevent it from being called during another makeTouchResponder.
    
    This is called automatically when you return YES from touchIsInGesture.
  */
  take: function(touch) {
    touch.isTaken = YES; // because even changing responder won't prevent it from being used this cycle.
    if (SC.none(touch.touchResponder) || touch.touchResponder !== this) touch.makeTouchResponder(this, YES);
  },
  
  /**
    Releases a touch back to its previous owner, which is usually the view. This allows
    you to give back control of a touch that it turns out is not part of the gesture. 
    
    This takes effect immediately, because you would usually call this from
    touchesDragged or such.
  */
  release: function(touch) {
    touch.isTaken = NO;
    if (touch.nextTouchResponder) touch.makeTouchResponder(touch.nextTouchResponder);
  },
  
  /**
    Discards a touch, making its responder null. This makes the touch go away and never
    come back—not to this gesture, nor to any other, nor to the view, nor to any other
    view.
  */
  discardTouch: function(touch) {
    touch.isTaken = YES; // because even changing responder won't prevent it from being used this cycle.
    touch.makeTouchResponder(null);
  },
  
  /**
    Returns a status hash (which gestures may and should modify) for a given touch, for tracking
    whether it is a potential match, etc.
  */
  statusForTouch: function(touch) {
    var key = SC.guidFor(touch.view) + this.name;
    var status = touch[key];
    if (!status) status = touch[key] = {};
    return status;
  },
  
  /**
    Called when an unassigned touch has started. By default, this calls touchIsInGesture, and,
    if it returns YES, takes possesion of the touch (causing touchStart to  be called).
  */
  unassignedTouchDidStart: function(touch) {
    if (touch.isTaken) return;
    if (this.touchIsInGesture(touch, this.statusForTouch(touch))) {
      this.take(touch);
    }
  },
  
  /**
    This is called when the unassigned touches (touches not in a gesture) change or move
    in some way. By default, this calls touchIsInGesture(touch, status) for each touch.
  */
  unassignedTouchesDidChange: function(evt, touches) {
    touches.forEach(function(touch) {
      if (touch.isTaken) return;
      if (this.touchIsInGesture(touch, this.statusForTouch(touch))) {
        this.take(touch);
      }
    }, this);
  },
  
  /**
    This is called when the unassigned touches (touches not in the gesture) have ended.
    Default does nothing. Some gestures may want to implement this even if they don't implement
    unassignedTouchesDidChange.
  */
  unassignedTouchDidEnd: function(touch) {
    
  },
  
  /**
    Marks the touch as "interesting" to this gesture. A view could then check the 'isInteresting'
    property of the touch to see if any gestures are interested in it, potentially delaying any
    action of releasing the touch to another view.
  */
  interestedInTouch: function(touch) {
    var status = this.statusForTouch(touch);
    if (status.isInterested) return;
    status.isInterested = YES;
    touch.isInteresting++;
  },
  
  /**
    Marks the touch as "uninteresting" to this gesture.
  */
  uninterestedInTouch: function(touch) {
    var status = this.statusForTouch(touch);
    if (!status.isInterested) return;
    status.isInterested = NO;
    touch.isInteresting--;
  }
});

/* >>>>>>>>>> BEGIN source/gestures/pinch.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
sc_require("system/gesture");

SC.PinchGesture = SC.Gesture.extend({
  name: "pinch",
  acceptsMultitouch: YES,

  scale: 1,

  /**
    The default for this method is to loop through each touch one by one to see if it qualifies.
    Here, however, we want to take the touches when there are 2, and only 2 of them. As a result
    we can do the work here, with no need to pass them on.
  */
  unassignedTouchesDidChange: function(evt, touches) {
    if (touches.length == 2) {
      this.take(touches[0]);
      this.take(touches[1]);
    }
  },

  /**
    We could probably just return YES here, since unassignedTouchesDidChange shouldn't let more
    than 2 touches through, however, we're double checking here to make sure that we haven't
    already captured 2 touches.
  */
  touchStart: function(touch) {
    var touches = touch.touchesForResponder(this);
    if (!touches || touches.length == 0) {
      return YES;
    } else if (touches.length == 1) {
      this.start([touches[0], touch]);
      return YES;
    } else {
      return NO;
    }
  },

  /**
    Here we're getting the distance between the 2 touches and comparing it to their starting
    distance. It's possible we'll want to implement a more complex algorithm to make things
    a bit smoother. Once we have the relative change, we trigger the pinch action in the view.
  */
  touchesDragged: function(evt, touches) {
    var touch = touches.firstObject(),
        avg = touch.averagedTouchesForView(this);

    if (avg.touchCount == 2) {
      if (!this._startDistance) {
        this._startDistance = avg.d;
      }

      this.scale = avg.d / this._startDistance;

      this.change(touches, this.scale);
    }
  },

  /**
    Once one touch has ended we don't need to watch the other so we release all touches.
  */
  touchEnd: function(touch) {
    this._startDistance = null;

    var touches = touch.touchesForResponder(this);

    this.trigger(touches, this.scale)
    this.end(touches, this.scale);

    if (touches) {
      touches.forEach(function(touch){
        this.release(touch);
      }, this);
    }
  }
});
/* >>>>>>>>>> BEGIN source/gestures/swipe.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
sc_require("system/gesture");

SC.SWIPE_HORIZONTAL = "X";
SC.SWIPE_VERTICAL = "Y";
SC.SWIPE_ANY = "XY";
SC.SWIPE_LEFT = "LEFT";
SC.SWIPE_RIGHT = "RIGHT";
SC.SWIPE_UP = "UP";
SC.SWIPE_DOWN = "DOWN";

SC.SwipeGesture = SC.Gesture.extend({
  name: "swipe",
  acceptsMultitouch: YES,
  
  direction: SC.SWIPE_HORIZONTAL,

  /**
    Will be populated with the current direction of the swipe once
    one has been determined.
  */
  currentDirection: null,

  startDistance: 5,
  swipeDistance: 40,
  
  tolerance: 0.5, // we accept .5 the distance in the other direction as a swipe
  
  touchIsInGesture: function(touch, status) {
    // if we have not "flunked" the touch before, and it has moved 
    if (!status.flunked) {
      var d = this.get('direction'),
          cd = this.get('currentDirection'),
          startDistance = this.get('startDistance'),
          deltaX = touch.pageX - touch.startX,
          deltaY = touch.pageY - touch.startY,
          absX = Math.abs(deltaX),
          absY = Math.abs(deltaY);

      if (Math.abs(deltaX) > startDistance || Math.abs(deltaY) > startDistance) {

        if (!cd) {
          if (d == SC.SWIPE_ANY) {
            if      (absX > absY) cd = SC.SWIPE_HORIZONTAL;
            else if (absY > absX) cd = SC.SWIPE_VERTICAL;
            else                      return NO; // We can't determine a direction yet
          } else {
            cd = d;
          }
          this.set('currentDirection', cd);
        }

        var delta  = (cd == SC.SWIPE_HORIZONTAL) ? deltaX : deltaY,
            oDelta = (cd == SC.SWIPE_HORIZONTAL) ? deltaY : deltaX;

        if (Math.abs(delta) * this.get("tolerance") > Math.abs(oDelta)) {
          return YES;
        }

      }
    }
    return NO;
  },
  
  touchStart: function(touch) {
    var d = this.get("currentDirection"), 
        delta = touch["page" + d] - touch["start" + d],
        swipeDirection;
    
    if (delta < 0) swipeDirection = (d === SC.SWIPE_HORIZONTAL) ? SC.SWIPE_LEFT : SC.SWIPE_UP;
    else swipeDirection = (d === SC.SWIPE_HORIZONTAL) ? SC.SWIPE_RIGHT : SC.SWIPE_DOWN;
    
    this.start(touch, swipeDirection, delta);
    return YES;
  },
  
  touchesDragged: function(evt, touches) {
    var touch = touches.firstObject();
    var d = this.get("currentDirection"), 
        o = (d === SC.SWIPE_HORIZONTAL ? "Y" : "X"),
        delta = touch["page" + d] - touch["start" + d],
        oDelta = touch["page" + o] - touch["start" + o],
        swipeDirection;
    
    if (delta < 0) swipeDirection = (d === SC.SWIPE_HORIZONTAL) ? SC.SWIPE_LEFT : SC.SWIPE_UP;
    else swipeDirection = (d === SC.SWIPE_HORIZONTAL) ? SC.SWIPE_RIGHT : SC.SWIPE_DOWN;
    
    if (
      Math.abs(delta) < this.get("startDistance") ||
      Math.abs(delta) * this.get("tolerance") < Math.abs(oDelta)
    ) {
      // does not qualify anymore
      this.release(touch);

      var allTouches = touch.touchesForResponder(this);
      if (!allTouches || allTouches.length == 0) this.cancel(touch, swipeDirection, delta);
    } else {
      this.change(touch, swipeDirection, delta);
    }
  },
  
  touchEnd: function(touch) {
    var d = this.get("currentDirection"), 
        o = (d === SC.SWIPE_HORIZONTAL ? "Y" : "X"),
        delta = touch["page" + d] - touch["start" + d],
        oDelta = touch["page" + o] - touch["start" + o],
        swipeDirection;
    
    // determine swipe direction
    if (delta < 0) swipeDirection = (d === SC.SWIPE_HORIZONTAL) ? SC.SWIPE_LEFT : SC.SWIPE_UP;
    else swipeDirection = (d === SC.SWIPE_HORIZONTAL) ? SC.SWIPE_RIGHT : SC.SWIPE_DOWN;

    // trigger
    if (
      Math.abs(delta) > this.get("swipeDistance") ||
      Math.abs(delta) * this.get("tolerance") < Math.abs(oDelta)
    ) {
      this.trigger(touch, swipeDirection);
    }

    this.end(touch, swipeDirection, delta);

    this.set('currentDirection', null);

    // and release all others
    var touches = touch.touchesForResponder(this);
    if (touches) {
      touches.forEach(function(touch){
        this.release(touch);
      }, this);
    }
  },

  cancel: function(){
    arguments.callee.base.apply(this,arguments);
    this.set('currentDirection', null);
  }

});
/* >>>>>>>>>> BEGIN source/gestures/tap.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2010 Strobe Inc. All rights reserved.
// Author:    Peter Wagenet
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
sc_require("system/gesture");

SC.TapGesture = SC.Gesture.extend({
  name: "tap",
  acceptsMultitouch: NO,

  _tapCount: null,
  _candidateTouch: null,
  _eventTimer: null,

  tapWiggle: 10,
  tapDelay: 200,

  touchIsInGesture: function(touch, status) {
    return !status.tapFlunked
  },

  touchStart: function(touch) {
    // We don't want events triggering during a touch, will be reset when touch is over if it's a candidate
    if (this._eventTimer) this._eventTimer.invalidate();

    // We have an activeTap but another touch has been started
    if (this._candidateTouch && this._candidateTouch.touch.identifier !== touch.identifier) {
      this._cancelTap(touch);
      return NO;
    }

    // This touch is a candidate
    this._candidateTouch = {
      startTime: Date.now(),
      touch: touch
    };

    this.start(touch);

    return YES;
  },

  touchesDragged: function(evt, touches) {
    var touch = touches[0];

    // Somehow another touch got in
    var tooManyTouches = (
      touches.length > 1 ||
      !this._candidateTouch ||
      touch.identifier !== this._candidateTouch.touch.identifier
    );

    // Touch moved too much
    var touchMoved = this._calculateDragDistance(touch) > this.get('tapWiggle');

    if (tooManyTouches || touchMoved) this._cancelTap(touch);
  },

  touchEnd: function(touch){
    if (this._calculateDragDistance(touch) > this.get('tapWiggle') || Date.now() - this._candidateTouch.startTime > this.get('tapDelay') ) {
      // Touch moved too much or took too long
      this._cancelTap(touch);
    } else {
      this._addTap(touch);
    }
  },

  _addTap: function(touch){
    var self = this;

    if (this._eventTimer) this._eventTimer.invalidate();

    this._tapCount = (this._tapCount || 0) + 1;
    this._candidateTouch = null;
    this._eventTimer = SC.Timer.schedule({
      target: self,
      action: function(){ this._triggerTap(touch); },
      interval: this.get('tapDelay')
    });

    this.change(touch, this._tapCount);
    this.trigger(touch, this._tapCount);

  },

  _cancelTap: function(touch){
    this.statusForTouch(touch).tapFlunked = YES;

    this.cancel(touch, this._tapCount);

    if (this._eventTimer) this._eventTimer.invalidate();
    this._tapCount = null;
    this._candidateTouch = null;
    this._eventTimer = null;

  },

  _triggerTap: function(touch){
    this.end(touch, this._tapCount);

    this._tapCount = null;
    this._candidateTouch = null;
    this._eventTimer = null;
  },

  _calculateDragDistance: function(touch) {
    return Math.sqrt(Math.pow(touch.pageX - touch.startX, 2) + Math.pow(touch.pageY - touch.startY, 2));
  }

});


/* >>>>>>>>>> BEGIN source/license.js */
/** 
 * @license Portions of this software are copyright Yahoo, Inc, used under the following license:
 * Software License Agreement (BSD License)
 * Copyright (c) 2009, Yahoo! Inc.
 * All rights reserved.
 * Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Yahoo! Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission of Yahoo! Inc.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * Sources of Intellectual Property Included in the YUI Library
 * Where not otherwise indicated, all YUI content is authored by Yahoo! engineers and consists of Yahoo!-owned intellectual property. YUI is issued by Yahoo! under the BSD license above. In some specific instances, YUI will incorporate work done by developers outside of Yahoo! with their express permission.

*/

/** 
 * @license jQuery 1.2.6 - New Wave Javascript
 * 
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *  
 * $Date: 2008-05-24 14:22:17 -0400 (Sat, 24 May 2008) $
 * $Rev: 5685 $
*/
/* >>>>>>>>>> BEGIN source/mixins/auto_mixin.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace 

  Use this mixin to automatically mix in a a collection of mixins into all
  child views created _by the view_ (that are created at view initialization).
  
  @since SproutCore 1.0
*/
SC.AutoMixin = {
  /**
    The mixins to automatically mix in.
    @property
  */
  autoMixins: [],
  
  /**
    @private
    Override createChildViews to mix in the mixins defined in autoMixins.
  */
  createChildView: function(v, attrs) {
    if (!attrs) attrs = {};
    attrs.owner = attrs.parentView = this;
    attrs.isVisibleInWindow = this.get('isVisibleInWindow');
    if (!attrs.page) attrs.page = this.page;
    
    var applyMixins = this.get("autoMixins");
    applyMixins.push(attrs);
    
    v = v.create.apply(v, applyMixins);
    return v;
  }
};
/* >>>>>>>>>> BEGIN source/system/utils/string_measurement.js */
SC.mixin( /** @scope SC */ {

  _copy_computed_props: [
    "maxWidth", "maxHeight", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
    "fontFamily", "fontSize", "fontStyle", "fontWeight", "fontVariant", "lineHeight",
    "whiteSpace"
  ],

  /**
    Returns a string representation of the layout hash.

    Layouts can contain the following keys:
      - left: the left edge
      - top: the top edge
      - right: the right edge
      - bottom: the bottom edge
      - height: the height
      - width: the width
      - centerX: an offset from center X
      - centerY: an offset from center Y
      - minWidth: a minimum width
      - minHeight: a minimum height
      - maxWidth: a maximum width
      - maxHeight: a maximum height

    @param layout {Hash} The layout hash to stringify.
    @returns {String} A string representation of the layout hash.
  */
  stringFromLayout: function(layout) {
    // Put them in the reverse order that we want to display them, because
    // iterating in reverse is faster for CPUs that can compare against zero
    // quickly.
    var keys = ['maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'centerY',
                'centerX', 'width', 'height', 'bottom', 'right', 'top',
                'left'],
        keyValues = [], key,
        i = keys.length;
    while (--i >= 0) {
      key = keys[i];
      if (layout.hasOwnProperty(key)) {
        keyValues.push(key + ':' + layout[key]);
      }
    }

    return '{' + keyValues.join(', ') + '}';
  },

  /**
    Given a string and a fixed width, calculates the height of that
    block of text using a style string, a set of class names,
    or both.

    @param str {String} The text to calculate
    @param width {Number} The fixed width to assume the text will fill
    @param style {String} A CSS style declaration.  E.g., 'font-weight: bold'
    @param classNames {Array} An array of class names that may affect the style
    @param ignoreEscape {Boolean} To NOT html escape the string.
    @returns {Number} The height of the text given the passed parameters
  */
  heightForString: function(str, width, style, classNames, ignoreEscape) {
    var elem = this._heightCalcElement, classes, height;

    if(!ignoreEscape) str = SC.RenderContext.escapeHTML(str);

    // Coalesce the array of class names to one string, if the array exists
    classes = (classNames && SC.typeOf(classNames) === SC.T_ARRAY) ? classNames.join(' ') : '';

    if (!width) width = 100; // default to 100 pixels

    // Only create the offscreen element once, then cache it
    if (!elem) {
      elem = this._heightCalcElement = document.createElement('div');
      document.body.insertBefore(elem, null);
    }

    style = style+'; width: '+width+'px; left: '+(-1*width)+'px; position: absolute';
    var cqElem = SC.$(elem);
    cqElem.attr('style', style);

    if (classes !== '') {
      cqElem.attr('class', classes);
    }

    elem.innerHTML = str;
    height = elem.clientHeight;

    elem = null; // don't leak memory
    return height;
  },

  /**
    Sets up a string measuring environment.

    You may want to use this, in conjunction with teardownStringMeasurement and
    measureString, instead of metricsForString, if you will be measuring many
    strings with the same settings. It would be a lot more efficient, as it
    would only prepare and teardown once instead of several times.

    @param exampleElement The example element to grab styles from, or the style
                          string to use.
    @param classNames {String} (Optional) Class names to add to the test element.
  */
  prepareStringMeasurement: function(exampleElement, classNames) {
    var element = this._metricsCalculationElement, classes, styles, style,
        cqElem;

    // collect the class names
    classes = SC.A(classNames).join(' ');

    // get the calculation element
    if (!element) {
      var parentElement = document.createElement("div");

      // to make sure the measurement element is never visible, put it inside a 0x0 element with overflow: hidden
      SC.mixin(parentElement.style, {
        position: 'absolute',
        left: '0px',
        top: '0px',
        height: '0px',
        right: '0px',
        overflow: 'hidden'
      });

      element = this._metricsCalculationElement = document.createElement("div");

      parentElement.appendChild(element);
      document.body.insertBefore(parentElement, null);
    }

    cqElem = SC.$(element);
    // two possibilities: example element or type string
    if (SC.typeOf(exampleElement) != SC.T_STRING) {
      var computed = null;
      if (document.defaultView && document.defaultView.getComputedStyle) {
        computed = document.defaultView.getComputedStyle(exampleElement, null);
      } else {
      computed = exampleElement.currentStyle;
      }

      var props = this._copy_computed_props;

      // firefox ONLY allows this method
      for (var i = 0; i < props.length; i++) {
        var prop = props[i], val = computed[prop];
        element.style[prop] = val;
      }

      // and why does firefox specifically need "font" set?
      var cs = element.style; // cached style
      if (cs.font === "") {
        var font = "";
        if (cs.fontStyle) font += cs.fontStyle + " ";
        if (cs.fontVariant) font += cs.fontVariant + " ";
        if (cs.fontWeight) font += cs.fontWeight + " ";
        if (cs.fontSize) font += cs.fontSize; else font += "10px"; //force a default
        if (cs.lineHeight) font += "/" + cs.lineHeight;
        font += " ";
        if (cs.fontFamily) font += cs.fontFamily; else cs += "sans-serif";

        element.style.font = font;
      }

      SC.mixin(element.style, {
        left: "0px", top: "0px", position: "absolute", bottom: "auto", right: "auto", width: "auto", height: "auto"
      });
     // clean up
      computed = null;
    } else {
      // it is a style string already
      style = exampleElement;

      // set style
      cqElem.attr("style", style + "; position:absolute; left: 0px; top: 0px; bottom: auto; right: auto; width: auto; height: auto;");
    }

    element.className = classes;
    element = null;
  },

  /**
    Tears down the string measurement environment. Usually, this doesn't _have_
    to be called, but there are too many what ifs: for example, what if the measurement
    environment has a bright green background and is over 10,000px wide? Guess what: it will
    become visible on the screen.

    So, generally, we tear the measurement environment down so that it doesn't cause issue.
    However, we keep the DOM element for efficiency.
  */
  teardownStringMeasurement: function() {
    var element = this._metricsCalculationElement;

    // clear element
    element.innerHTML = "";
    element.className = "";
    element.setAttribute("style", ""); // get rid of any junk from computed style.
    element = null;
  },

  /**
    Measures a string in the prepared environment.

    An easier and simpler alternative (but less efficient for bulk measuring) is metricsForString.

    @param string {String} The string to measure.
    @param ignoreEscape {Boolean} To NOT html escape the string.
  */
  measureString: function(string, ignoreEscape) {
    if(!ignoreEscape) string = SC.RenderContext.escapeHTML(string);

    var element = this._metricsCalculationElement;
    if (!element) {
      throw "measureString requires a string measurement environment to be set up. Did you mean metricsForString?";
    }

    // the conclusion of which to use (innerText or textContent) should be cached
    if (typeof element.innerText != "undefined") element.innerText = string;
    else element.textContent = string;

    // generate result
    var result = {
      width: element.clientWidth,
      height: element.clientHeight
    };

    element = null;
    return result;
  },

  /**
    Given a string and an example element or style string, and an optional
    set of class names, calculates the width and height of that block of text.

    To constrain the width, set max-width on the exampleElement or in the style string.

    @param string {String} The string to measure.
    @param exampleElement The example element to grab styles from, or the style string to use.
    @param classNames {String} (Optional) Class names to add to the test element.
    @param ignoreEscape {Boolean} To NOT html escape the string.
  */
  metricsForString: function(string, exampleElement, classNames, ignoreEscape) {
    SC.prepareStringMeasurement(exampleElement, classNames);
    var result = SC.measureString(string, ignoreEscape);
    SC.teardownStringMeasurement();
    return result;
  }

});

/* >>>>>>>>>> BEGIN source/mixins/auto_resize.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require("system/utils/string_measurement");

/**
  @namespace
  Use this mixin to make your view automatically resize based upon its value,
  title, or other string property.
  
  The view uses SproutCore's text measuring API 
*/
SC.AutoResize = {
  /**
    Determines the property containing the string to measure.
    
    For efficiency, this may only be set _before_ initialization.
    
    @property {String}
  */
  autoResizeField: 'displayTitle',
  
  /**
    If YES, automatically resizes the view (default). If NO, only measures,
    setting 'measuredSize' to the measured value (you can bind to measuredSize
    and update size manually).
    
    @property {Boolean}
  */
  shouldAutoResize: YES,
  
  /**
    If NO, prevents SC.AutoResize from doing anything at all.
    
    @property {Boolean}
  */
  shouldMeasureSize: YES,
  
  /**
    Determines if the view's width should be resized
    on calculation. Default is YES.
    
    @property {Boolean}
  */
  shouldResizeWidth: YES,
  
  /**
    Determines if the view's height should be resized
    on calculation. Default is NO to retain backwards
    compatibility.
    
    @property {Boolean}
  */
  shouldResizeHeight: NO,
  
  /**
    The measured size of the view's content (the value of the autoResizeField). 
    This property is observable, and, if used in conjunction with setting
    shouldAutoResize to NO, allows you to customize the 'sizing' part, using
    SC.AutoResize purely for its measuring code.
    
    @property {Rect}
  */
  measuredSize: { width: 0, height: 0 },
  
  /**
    An amount to add to the calculated width and height to ensure that any parts
    not included in the measurement by the browser are covered (otherwise artifacts
    can occur).
    
    @private
  */
  autoSizePadding: 10,
  
  /**
    @private
    Begins observing the auto resize field.
  */
  initMixin: function() {
    this.addObserver(this.get('autoResizeField'), this, this._scar_valueDidChange);
  },
  
  /**
    If this property is provided, all views that share the same value for this property will be resized as a batch for increased performance.
    
    @property {String}
  */
  batchResizeId: null,
  
  _SCAR_measurementPending: NO,
  _SCAR_requestedBatchResizeId: null,
  
  // if the batch id changed while a request is out, we have to fix it
  _SCAR_batchResizeIdDidChange: function() {
    var batchResizeId = this.get('batchResizeId'),
    requestedBatchResizeId = this._SCAR_requestedBatchResizeId;
    
    // check if a request is out and the id changed
    if(this._SCAR_measurementPending && this._SCAR_requestedBatchResizeId !== batchResizeId) {
      // if so, cancel the old request and make a new one
      SC.AutoResize.cancelResize(this, requestedBatchResizeId);
      SC.AutoResize.requestResize(this, batchResizeId);
    }
  }.observes('batchResizeId'),
  
  measureSizeLater: function() {
    if (!this.get('shouldMeasureSize')) return;
    
    var batchResizeId = this.get('batchResizeId');
    
    SC.AutoResize.requestResize(this, batchResizeId);
    
    this._SCAR_measurementPending = YES;
    this._SCAR_requestedBatchResizeId = batchResizeId;
  },
  
  measureSize: function(batch) {
    var metrics, layer, value = this.get(this.get('autoResizeField')), autoSizePadding, paddingHeight, paddingWidth;
    
    // if there's nothing to measure, don't bother actually measuring it
    if(SC.none(value) || value === "") metrics = { width: 0, height: 0 };
    
    // get metrics in batch mode
    else if(batch) metrics = SC.measureString(value);
    
    // do a singleton measurement using our own layer
    else {
      layer = this.kindOf(SC.TextFieldView) ? this.$input()[0] : this.get('layer');
      if(!layer) return;
      metrics = SC.metricsForString(value, layer);
    }
    
    this.set('measuredSize', metrics);
    
    // if we are allowed to autoresize, add padding and adjust layout
    if (this.get('shouldAutoResize')) {
      autoSizePadding = this.get('autoSizePadding');
      
      if(SC.typeOf(autoSizePadding) === SC.T_NUMBER) paddingHeight = paddingWidth = autoSizePadding;
      else {
        paddingHeight = autoSizePadding.height;
        paddingWidth = autoSizePadding.width;
      }
      
      if (this.get('shouldResizeWidth')) this.adjust('width', metrics.width + paddingWidth);
      if (this.get('shouldResizeHeight')) this.adjust('height', metrics.height + paddingHeight);
    }
    
    this._SCAR_measurementPending = NO;
    
    return metrics;
  },
  
  // we need to update the measurement when the value changes
  _scar_valueDidChange: function() {
    this.measureSizeLater();
  },
  
  /**
    @private
    When the view is appended to the document, various factors (such as class names)
    could have changed, so it will need to be remeasured.
  */
  didAppendToDocument: function(){
    arguments.callee.base.apply(this,arguments); // just in case
    this.measureSizeLater();
  },
  
  /**
    @private
    When the layer is first created, measurement will need to take place.
  */
  didCreateLayer: function() {
    arguments.callee.base.apply(this,arguments);
    this.measureSizeLater();
  },
  
  needResize: null,
  untaggedViews: null,

  requestResize: function(view, id) {
    // views with no tag just get put in their own list
    if(SC.none(id)) {
      var untaggedViews = SC.AutoResize.untaggedViews || (SC.AutoResize.untaggedViews = SC.CoreSet.create());
      
      untaggedViews.add(view);
      
    // views with a tag get a set for each tag
    } else {
      var needResize = SC.AutoResize.needResize || (SC.AutoResize.needResize = {}),
      views = needResize[id] || (needResize[id] = SC.CoreSet.create());
      
      views.add(view);
    }

    SC.RunLoop.currentRunLoop.invokeLast(SC.AutoResize.doBatchResize);
  },
  
  cancelResize: function(view, id) {
    var set = SC.none(id) ? SC.AutoResize.untaggedViews : SC.AutoResize.needResize[id];
    
    if(set) set.remove(view);
  },

  doBatchResize: function() {
    var tag, views, view, layer, batches;
    
    // first measure all the batched views
    batches = SC.AutoResize.needResize;
    for(tag in batches) {
      views = batches[tag];
      
      // step through until you find one with a layer
      while(view = views.pop()) {
        layer = view.get('layer');
        
        // use the layer to prepare the measurement
        if(layer) {
          SC.prepareStringMeasurement(layer);
          view.measureSize(YES);
          break;
        }
      }
      
      // now measure the rest using the same settings
      while(view = views.pop()) {
        view.measureSize(YES);
      }

      SC.teardownStringMeasurement();
    }
    
    // measure views with no batch id
    views = SC.AutoResize.untaggedViews;
    if(!views) return;
    while(view = views.pop()) {
      view.measureSize();
    }
  }
};

/* >>>>>>>>>> BEGIN source/mixins/button.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** @namespace

  This mixin implements many of the basic state-handling attributes for 
  button-like views, including an auto-updated title, and mapping the current
  value to an isSelected state.
  
  Usually you will not work with this mixin directly.  Instead, you should use
  a class that incorporates the mixin such as SC.ButtonView, SC.CheckboxView
  or SC.RadioView.
  
  This mixin assumes you have already applied the SC.Control and 
  SC.DelegateSupport mixins as well.
  
  @since SproutCore 1.0  
*/
SC.Button = {
  
  // ..........................................................
  // VALUE PROPERTIES
  // 
  
  /**
    Used to automatically update the state of the button view for toggle style
    buttons.

    for toggle style buttons, you can set the value and it will be used to
    update the isSelected state of the button view.  The value will also
    change as the user selects or deselects.  You can control which values
    the button will treat as isSelected by setting the toggleOnValue and 
    toggleOffValue.  Alternatively, if you leave these properties set to
    YES or NO, the button will do its best to convert a value to an 
    appropriate state:
  
    - null, false, 0  -> isSelected = false
    - any other single value -> isSelected = true
    - array -> if all values are the same state: that state.  otherwise MIXED.
    
    @property {Object}
  */  
  value: null,
  
  /**
    Value of a selected toggle button.
  
    for a toggle button, set this to any object value you want.  The button
    will be selected if the value property equals the targetValue.  If the
    value is an array of multiple items that contains the targetValue, then
    the button will be set to a mixed state.

    default is YES
    
    @property {Object}
  */
  toggleOnValue: YES,

  /**
    Value of an unselected toggle button.
  
    For a toggle button, set this to any object value you want.  When the
    user toggle's the button off, the value of the button will be set to this
    value.
  
    default is NO 
  
    @property {Object}
  */
  toggleOffValue: NO,
  
  // ..........................................................
  // TITLE 
  // 
  
  /**
    If YES, then the title will be localized.
    
    @property {Boolean}
  */
  localize: NO,
  
  /** @private */
  localizeBindingDefault: SC.Binding.bool(),

  /**
    The button title.  If localize is YES, then this should be the localization key to display.  Otherwise, this will be the actual string displayed in the title.  This property is observable and bindable.
    
    @property {String}
  */  
  title: '',

  /**
    If you set this property, the title property will be updated automatically
    from the content using the key you specify.
    
    @property {String}
  */
  contentTitleKey: null,
  
  /**
    The button icon.  Set this to either a URL or a CSS class name (for 
    spriting).  Note that if you pass a URL, it must contain at 
    least one slash to be detected as such.
    
    @property {String}
  */
  icon: null,

  /**
    If you set this property, the icon will be updated automatically from the
    content using the key you specify.
    
    @property {String}
  */
  contentIconKey: null,

  /**
    If YES, button will attempt to display an ellipsis if the title cannot 
    fit inside of the visible area.  This feature is not available on all
    browsers.
    
    @property {Boolean}
  */
  needsEllipsis: YES,
  
  /**
    The computed display title.  This is generated by localizing the title 
    property if necessary.
    
    @property {String}
  */
  displayTitle: function() {
    var ret = this.get('title');
    return (ret && this.get('localize')) ? ret.loc() : (ret || '');
  }.property('title','localize').cacheable(),
  
  /**
    The key equivalent that should trigger this button on the page.
    
    @property {String}
  */
  keyEquivalent: null,
  
  // ..........................................................
  // METHODS
  // 
  
  /**
    Classes that include this mixin can invoke this method from their 
    render method to render the proper title HTML.  This will include an 
    icon if necessary along with any other standard markup.
    
    @param {SC.RenderContext} context the context to render
    @param {Boolean} firstTime YES if first time rendering
    @returns {SC.RenderContext} the context
  */
  renderTitle: function(context, firstTime) {
    var icon = this.get('icon'),
        image = '' ,
        title = this.get('displayTitle') ,
        needsTitle = (!SC.none(title) && title.length>0),
        elem, htmlNode, imgTitle;
        if(this.get('escapeHTML')) title = SC.RenderContext.escapeHTML(title) ;
        
    // get the icon.  If there is an icon, then get the image and update it.
    // if there is no image element yet, create it and insert it just before
    // title.
    
    if (icon) {
      var blank = SC.BLANK_IMAGE_URL;

      if (icon.indexOf('/') >= 0) {
        image = '<img src="'+icon+'" alt="" class="icon" />';
      } else {
        image = '<img src="'+blank+'" alt="" class="'+icon+'" />';
      }
      needsTitle = YES ;
    }
    imgTitle = image + title;
    if(firstTime){
      if(this.get('needsEllipsis')){
        context.push('<label class="sc-button-label ellipsis">'+imgTitle+'</label>'); 
      }else{
          context.push('<label class="sc-button-label">'+imgTitle+'</label>'); 
      }  
      this._ImageTitleCached = imgTitle;
    }else{
      elem = this.$('label');  
      if ( (htmlNode = elem[0])){
        if(needsTitle) { 
          elem.setClass('ellipsis', this.get('needsEllipsis'));
          if(this._ImageTitleCached !== imgTitle) {
            this._ImageTitleCached = imgTitle; // Update the cache
            htmlNode.innerHTML = imgTitle;
          } 
        }
        else { htmlNode.innerHTML = ''; } 
      }
    }  
    return context ;
  },

  /**
    Updates the value, title, and icon keys based on the content object, if 
    set.
    
    @property {Object} target the target of the object that changed
    @property {String} key name of property that changed
    @returns {SC.Button} receiver
  */
  contentPropertyDidChange: function(target, key) {
    var del = this.get('displayDelegate'), 
        content = this.get('content'), value ;

    var valueKey = this.getDelegateProperty('contentValueKey', del) ;
    if (valueKey && (key === valueKey || key === '*')) {
      this.set('value', content ? (content.get ? content.get(valueKey) : content[valueKey]) : null) ;
    }

    var titleKey = this.getDelegateProperty('contentTitleKey', del) ;
    if (titleKey && (key === titleKey || key === '*')) {
      this.set('title', content ? (content.get ? content.get(titleKey) : content[titleKey]) : null) ;
    }

    var iconKey = this.getDelegateProperty('contentIconKey', del);
    if (iconKey && (key === iconKey || key === '*')) {
      this.set('icon', content ? (content.get ? content.get(iconKey) : content[iconKey]) : null) ;
    }
    
    return this ;
  },

  /** @private - when title changes, dirty display. */
  _button_displayObserver: function() {
    this.displayDidChange();
  }.observes('title', 'icon', 'value'),

  /**
    Handle a key equivalent if set.  Trigger the default action for the 
    button.  Depending on the implementation this may vary.
    
    @param {String} keystring
    @param {SC.Event} evt
    @returns {Boolean}  YES if handled, NO otherwise
  */
  performKeyEquivalent: function(keystring, evt) {
    //If this is not visible
    if (!this.get('isVisibleInWindow')) return NO;

    if (!this.get('isEnabled')) return NO;
    var equiv = this.get('keyEquivalent');

    // button has defined a keyEquivalent and it matches!
    // if triggering succeeded, true will be returned and the operation will 
    // be handeled (i.e performKeyEquivalent will cease crawling the view 
    // tree)
    if (equiv) {
      if (equiv === keystring) return this.triggerAction(evt);
    
    // should fire if isDefault OR isCancel.  This way if isDefault AND 
    // isCancel, responds to both return and escape
    } else if ((this.get('isDefault') && (keystring === 'return')) ||
        (this.get('isCancel') && (keystring === 'escape'))) {
          return this.triggerAction(evt);
    }

    return NO; // did not handle it; keep searching
  },

  /**
    Your class should implement this method to perform the default action on
    the button.  This is used to implement keyboard control.  Your button
    may make this change in its own way also.
    
    @property {SC.Event} evt the event
    @returns {void}
  */
  triggerAction: function(evt) {
    throw "SC.Button.triggerAction() is not defined in %@".fmt(this);
  },

  // ..........................................................
  // VALUE <-> isSelected STATE MANAGEMNT
  // 

  /**
    This is the standard logic to compute a proposed isSelected state for a
    new value.  This takes into account the toggleOnValue/toggleOffValue 
    properties, among other things.  It may return YES, NO, or SC.MIXED_STATE.
    
    @param {Object} value
    @returns {Boolean} return state
  */
  computeIsSelectedForValue: function(value) {
    var targetValue = this.get('toggleOnValue'), state, next ;
    
    if (SC.typeOf(value) === SC.T_ARRAY) {

      // treat a single item array like a single value
      if (value.length === 1) {
        state = (value[0] == targetValue) ;
        
      // for a multiple item array, check the states of all items.
      } else {
        state = null;
        value.find(function(x) {
          next = (x == targetValue) ;
          if (state === null) {
            state = next ;
          } else if (next !== state) state = SC.MIXED_STATE ;
          return state === SC.MIXED_STATE ; // stop when we hit a mixed state.
        });
      }
      
    // for single values, just compare to the toggleOnValue...use truthiness
    } else {
      if(value === SC.MIXED_STATE) state = SC.MIXED_STATE;
      else state = (value === targetValue) ;
    }
    return state ;
  },
  
  /** @ignore */
  initMixin: function() {
    // if value is not null, update isSelected to match value.  If value is
    // null, we assume you may be using isSelected only.  
    if (!SC.none(this.get('value'))) this._button_valueDidChange();  
  },
  
  /** @private
    Whenever the button value changes, update the selected state to match.
  */
  _button_valueDidChange: function() {
    var value = this.get('value'),
        state = this.computeIsSelectedForValue(value);
    this.set('isSelected', state) ; // set new state...
  }.observes('value'),
  
  /** @private
    Whenever the selected state is changed, make sure the button value is also updated.  Note that this may be called because the value has just changed.  In that case this should do nothing.
  */
  _button_isSelectedDidChange: function() {
    var newState = this.get('isSelected'),
        curState = this.computeIsSelectedForValue(this.get('value'));
    
    // fix up the value, but only if computed state does not match.
    // never fix up value if isSelected is set to MIXED_STATE since this can
    // only come from the value.
    if ((newState !== SC.MIXED_STATE) && (curState !== newState)) {
      var valueKey = (newState) ? 'toggleOnValue' : 'toggleOffValue' ;
      this.set('value', this.get(valueKey));
    }
  }.observes('isSelected')
  
} ;

/* >>>>>>>>>> BEGIN source/mixins/content_display.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace

  The SC.ContentDisplay mixin makes it easy to automatically update your view
  display whenever relevant properties on a content object change.  To use
  this mixin, include it in your view and then add the names of the 
  properties on the content object you want to trigger a displayDidChange() 
  method on your view. Your updateDisplay() method will then be called at the 
  end of the run loop.
  
  h2. Example
  
  {{{
    MyApp.MyViewClass = SC.View.extend(SC.ContentDisplay, { 
      contentDisplayProperties: 'title isEnabled hasChildren'.w(),
      ...
    });
  }}}
  
  @since SproutCore 1.0
*/
SC.ContentDisplay = {
  
  /** @private */
  concatenatedProperties: 'contentDisplayProperties',

  /** @private */
  displayProperties: ['content'],
  
  /** 
    Add an array with the names of any property on the content object that
    should trigger an update of the display for your view.  Changes to the
    content object will only invoke your display method once per runloop.
    
    @property {Array}
  */
  contentDisplayProperties: [],

  /** @private
    Setup observers on the content object when initializing the mixin.
  */
  initMixin: function() {
    this._display_contentDidChange();
  },

  /**
   * Remove observer on existing content object, if present
   * @private
   */
  destroyMixin: function () {
    if (!this._display_content) return;
    this._display_stopObservingContent(this._display_content);
    this._display_content = null;
  },

  /** @private */
  _display_beginObservingContent: function(content) {
    var f = this._display_contentPropertyDidChange;

    if (SC.isArray(content)) {
      content.invoke('addObserver', '*', this, f);
    }
    else if (content.addObserver) {
      content.addObserver('*', this, f);
    }
  },

  /** @private */
  _display_stopObservingContent: function(content) {
    var f = this._display_contentPropertyDidChange;

    if (SC.isArray(content)) {
      content.invoke('removeObserver', '*', this, f);
    }
    else if (content.removeObserver) {
      content.removeObserver('*', this, f);
    }
  },

  /** @private */
  _display_contentDidChange: function(target, key, value) {
    // handle changes to the content...
    if ((value = this.get('content')) === this._display_content) return;

    // stop listening to old content.
    var content = this._display_content;
    if (content) this._display_stopObservingContent(content);

    // start listening for changes on the new content object.
    content = this._display_content = value;
    if (content) this._display_beginObservingContent(content);

    this.displayDidChange();
  }.observes('content', 'contentDisplayProperties'),
  
  /** @private Invoked when properties on the content object change. */
  _display_contentPropertyDidChange: function(target, key, value, propertyRevision) {
    if (key === '*') {
      this.displayDidChange() ;
    } else {
      // only update if a displayProperty actually changed...s
      var ary = this.get('contentDisplayProperties') ;
      if (ary && ary.indexOf(key)>=0) this.displayDidChange();
    }
  }
  
} ;

/* >>>>>>>>>> BEGIN source/mixins/string.js */
// These are basic enhancements to the string class used throughout
// SproutCore.
/** @private */
SC.STRING_TITLEIZE_REGEXP = (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g);
SC.STRING_HUMANIZE_REGEXP = (/[\-_]/g);
SC.STRING_TRIM_REGEXP = (/^\s+|\s+$/g);
SC.STRING_TRIM_LEFT_REGEXP = (/^\s+/g);
SC.STRING_TRIM_RIGHT_REGEXP = (/\s+$/g);
SC.STRING_REGEXP_ESCAPED_REGEXP = (/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g);

// Since there are many strings that are commonly dasherized(), we'll maintain
// a cache.  Moreover, we'll pre-add some common ones.
SC.STRING_DASHERIZE_CACHE = {
  top:      'top',
  left:     'left',
  right:    'right',
  bottom:   'bottom',
  width:    'width',
  height:   'height',
  minWidth: 'min-width',
  maxWidth: 'max-width'
};

// Active Support style inflection constants
SC.INFLECTION_CONSTANTS = {
  PLURAL: [
      [/(quiz)$/i,               "$1zes"  ],
      [/^(ox)$/i,                "$1en"   ],
      [/([m|l])ouse$/i,          "$1ice"  ],
      [/(matr|vert|ind)ix|ex$/i, "$1ices" ],
      [/(x|ch|ss|sh)$/i,         "$1es"   ],
      [/([^aeiouy]|qu)y$/i,      "$1ies"  ],
      [/(hive)$/i,               "$1s"    ],
      [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
      [/sis$/i,                  "ses"    ],
      [/([ti])um$/i,             "$1a"    ],
      [/(buffal|tomat)o$/i,      "$1oes"  ],
      [/(bu)s$/i,                "$1ses"  ],
      [/(alias|status)$/i,       "$1es"   ],
      [/(octop|vir)us$/i,        "$1i"    ],
      [/(ax|test)is$/i,          "$1es"   ],
      [/s$/i,                    "s"      ],
      [/$/,                      "s"      ]
  ],

  SINGULAR: [
      [/(quiz)zes$/i,                                                    "$1"     ],
      [/(matr)ices$/i,                                                   "$1ix"   ],
      [/(vert|ind)ices$/i,                                               "$1ex"   ],
      [/^(ox)en/i,                                                       "$1"     ],
      [/(alias|status)es$/i,                                             "$1"     ],
      [/(octop|vir)i$/i,                                                 "$1us"   ],
      [/(cris|ax|test)es$/i,                                             "$1is"   ],
      [/(shoe)s$/i,                                                      "$1"     ],
      [/(o)es$/i,                                                        "$1"     ],
      [/(bus)es$/i,                                                      "$1"     ],
      [/([m|l])ice$/i,                                                   "$1ouse" ],
      [/(x|ch|ss|sh)es$/i,                                               "$1"     ],
      [/(m)ovies$/i,                                                     "$1ovie" ],
      [/(s)eries$/i,                                                     "$1eries"],
      [/([^aeiouy]|qu)ies$/i,                                            "$1y"    ],
      [/([lr])ves$/i,                                                    "$1f"    ],
      [/(tive)s$/i,                                                      "$1"     ],
      [/(hive)s$/i,                                                      "$1"     ],
      [/([^f])ves$/i,                                                    "$1fe"   ],
      [/(^analy)ses$/i,                                                  "$1sis"  ],
      [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis"],
      [/([ti])a$/i,                                                      "$1um"   ],
      [/(n)ews$/i,                                                       "$1ews"  ],
      [/s$/i,                                                            ""       ]
  ],

  IRREGULAR: [
      ['move',   'moves'   ],
      ['sex',    'sexes'   ],
      ['child',  'children'],
      ['man',    'men'     ],
      ['person', 'people'  ]
  ],

  UNCOUNTABLE: [
      "sheep",
      "fish",
      "series",
      "species",
      "money",
      "rice",
      "information",
      "info",
      "equipment"
  ]
};

SC.StringInflections = {
  /**
    Capitalizes every word in a string.  Unlike titleize, spaces or dashes
    will remain in-tact.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | My Favorite Items |
    | css-class-name | Css-Class-Name |
    | action_name | Action_Name |
    | innerHTML | InnerHTML |

    @returns {String} capitalized string
  */
  capitalizeEach: function() {
    return this.replace(SC.STRING_TITLEIZE_REGEXP,
      function(str,sep,character) {
        return (character) ? (sep + character.toUpperCase()) : sep;
      }).capitalize() ;
  },

  /**
    Converts a string to a title.  This will decamelize the string, convert
    separators to spaces and capitalize every word.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | My Favorite Items |
    | css-class-name | Css Class Name |
    | action_name | Action Name |
    | innerHTML | Inner HTML |

    @return {String} titleized string.
  */
  titleize: function() {
    var ret = this.replace(SC.STRING_DECAMELIZE_REGEXP,'$1_$2'); // decamelize
    return ret.replace(SC.STRING_TITLEIZE_REGEXP,
      function(str,separater,character) {
        return (character) ? (' ' + character.toUpperCase()) : ' ';
      }).capitalize() ;
  },

  /**
    Converts the string into a class name.  This method will camelize your
    string and then capitalize the first letter.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | MyFavoriteItems |
    | css-class-name | CssClassName |
    | action_name | ActionName |
    | innerHTML | InnerHtml |

    @returns {String}
  */
  classify: function() {
    var ret = this.replace(SC.STRING_TITLEIZE_REGEXP,
      function(str,separater,character) {
        return (character) ? character.toUpperCase() : '' ;
      }) ;
    var first = ret.charAt(0), upper = first.toUpperCase() ;
    return (first !== upper) ? (upper + ret.slice(1)) : ret ;
  },

  /**
    Converts a camelized string or a string with dashes or underscores into
    a string with components separated by spaces.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | my favorite items |
    | css-class-name | css class name |
    | action_name | action name |
    | innerHTML | inner html |

    @returns {String} the humanized string.
  */
  humanize: function() {
    return this.decamelize().replace(SC.STRING_HUMANIZE_REGEXP,' ') ;
  },

  /**
    Will escape a string so it can be securely used in a regular expression.

    Useful when you need to use user input in a regular expression without
    having to worry about it breaking code if any reserved regular expression
    characters are used.

    @returns {String} the string properly escaped for use in a regexp.
  */
  escapeForRegExp: function() {
    return this.replace(SC.STRING_REGEXP_ESCAPED_REGEXP, "\\$1");
  },

  /**
    Removes any standard diacritic characters from the string. So, for
    example, all instances of 'Á' will become 'A'.

    @returns {String} the modified string
  */
  removeDiacritics: function() {
    // Lazily create the SC.diacriticMappingTable object.
    var diacriticMappingTable = SC.diacriticMappingTable;
    if (!diacriticMappingTable) {
      SC.diacriticMappingTable = {
       'À':'A', 'Á':'A', 'Â':'A', 'Ã':'A', 'Ä':'A', 'Å':'A', 'Ā':'A', 'Ă':'A',
       'Ą':'A', 'Ǎ':'A', 'Ǟ':'A', 'Ǡ':'A', 'Ǻ':'A', 'Ȁ':'A', 'Ȃ':'A', 'Ȧ':'A',
       'Ḁ':'A', 'Ạ':'A', 'Ả':'A', 'Ấ':'A', 'Ầ':'A', 'Ẩ':'A', 'Ẫ':'A', 'Ậ':'A',
       'Ắ':'A', 'Ằ':'A', 'Ẳ':'A', 'Ẵ':'A', 'Ặ':'A', 'Å':'A', 'Ḃ':'B', 'Ḅ':'B',
       'Ḇ':'B', 'Ç':'C', 'Ć':'C', 'Ĉ':'C', 'Ċ':'C', 'Č':'C', 'Ḉ':'C', 'Ď':'D',
       'Ḋ':'D', 'Ḍ':'D', 'Ḏ':'D', 'Ḑ':'D', 'Ḓ':'D', 'È':'E', 'É':'E', 'Ê':'E',
       'Ë':'E', 'Ē':'E', 'Ĕ':'E', 'Ė':'E', 'Ę':'E', 'Ě':'E', 'Ȅ':'E', 'Ȇ':'E',
       'Ȩ':'E', 'Ḕ':'E', 'Ḗ':'E', 'Ḙ':'E', 'Ḛ':'E', 'Ḝ':'E', 'Ẹ':'E', 'Ẻ':'E',
       'Ẽ':'E', 'Ế':'E', 'Ề':'E', 'Ể':'E', 'Ễ':'E', 'Ệ':'E', 'Ḟ':'F', 'Ĝ':'G',
       'Ğ':'G', 'Ġ':'G', 'Ģ':'G', 'Ǧ':'G', 'Ǵ':'G', 'Ḡ':'G', 'Ĥ':'H', 'Ȟ':'H',
       'Ḣ':'H', 'Ḥ':'H', 'Ḧ':'H', 'Ḩ':'H', 'Ḫ':'H', 'Ì':'I', 'Í':'I', 'Î':'I',
       'Ï':'I', 'Ĩ':'I', 'Ī':'I', 'Ĭ':'I', 'Į':'I', 'İ':'I', 'Ǐ':'I', 'Ȉ':'I',
       'Ȋ':'I', 'Ḭ':'I', 'Ḯ':'I', 'Ỉ':'I', 'Ị':'I', 'Ĵ':'J', 'Ķ':'K', 'Ǩ':'K',
       'Ḱ':'K', 'Ḳ':'K', 'Ḵ':'K', 'Ĺ':'L', 'Ļ':'L', 'Ľ':'L', 'Ḷ':'L', 'Ḹ':'L',
       'Ḻ':'L', 'Ḽ':'L', 'Ḿ':'M', 'Ṁ':'M', 'Ṃ':'M', 'Ñ':'N', 'Ń':'N', 'Ņ':'N',
       'Ň':'N', 'Ǹ':'N', 'Ṅ':'N', 'Ṇ':'N', 'Ṉ':'N', 'Ṋ':'N', 'Ò':'O', 'Ó':'O',
       'Ô':'O', 'Õ':'O', 'Ö':'O', 'Ō':'O', 'Ŏ':'O', 'Ő':'O', 'Ơ':'O', 'Ǒ':'O',
       'Ǫ':'O', 'Ǭ':'O', 'Ȍ':'O', 'Ȏ':'O', 'Ȫ':'O', 'Ȭ':'O', 'Ȯ':'O', 'Ȱ':'O',
       'Ṍ':'O', 'Ṏ':'O', 'Ṑ':'O', 'Ṓ':'O', 'Ọ':'O', 'Ỏ':'O', 'Ố':'O', 'Ồ':'O',
       'Ổ':'O', 'Ỗ':'O', 'Ộ':'O', 'Ớ':'O', 'Ờ':'O', 'Ở':'O', 'Ỡ':'O', 'Ợ':'O',
       'Ṕ':'P', 'Ṗ':'P', 'Ŕ':'R', 'Ŗ':'R', 'Ř':'R', 'Ȑ':'R', 'Ȓ':'R', 'Ṙ':'R',
       'Ṛ':'R', 'Ṝ':'R', 'Ṟ':'R', 'Ś':'S', 'Ŝ':'S', 'Ş':'S', 'Š':'S', 'Ș':'S',
       'Ṡ':'S', 'Ṣ':'S', 'Ṥ':'S', 'Ṧ':'S', 'Ṩ':'S', 'Ţ':'T', 'Ť':'T', 'Ț':'T',
       'Ṫ':'T', 'Ṭ':'T', 'Ṯ':'T', 'Ṱ':'T', 'Ù':'U', 'Ú':'U', 'Û':'U', 'Ü':'U',
       'Ũ':'U', 'Ū':'U', 'Ŭ':'U', 'Ů':'U', 'Ű':'U', 'Ų':'U', 'Ư':'U', 'Ǔ':'U',
       'Ǖ':'U', 'Ǘ':'U', 'Ǚ':'U', 'Ǜ':'U', 'Ȕ':'U', 'Ȗ':'U', 'Ṳ':'U', 'Ṵ':'U',
       'Ṷ':'U', 'Ṹ':'U', 'Ṻ':'U', 'Ụ':'U', 'Ủ':'U', 'Ứ':'U', 'Ừ':'U', 'Ử':'U',
       'Ữ':'U', 'Ự':'U', 'Ṽ':'V', 'Ṿ':'V', 'Ŵ':'W', 'Ẁ':'W', 'Ẃ':'W', 'Ẅ':'W',
       'Ẇ':'W', 'Ẉ':'W', 'Ẋ':'X', 'Ẍ':'X', 'Ý':'Y', 'Ŷ':'Y', 'Ÿ':'Y', 'Ȳ':'Y',
       'Ẏ':'Y', 'Ỳ':'Y', 'Ỵ':'Y', 'Ỷ':'Y', 'Ỹ':'Y', 'Ź':'Z', 'Ż':'Z', 'Ž':'Z',
       'Ẑ':'Z', 'Ẓ':'Z', 'Ẕ':'Z',
       '`': '`',
       'à':'a', 'á':'a', 'â':'a', 'ã':'a', 'ä':'a', 'å':'a', 'ā':'a', 'ă':'a',
       'ą':'a', 'ǎ':'a', 'ǟ':'a', 'ǡ':'a', 'ǻ':'a', 'ȁ':'a', 'ȃ':'a', 'ȧ':'a',
       'ḁ':'a', 'ạ':'a', 'ả':'a', 'ấ':'a', 'ầ':'a', 'ẩ':'a', 'ẫ':'a', 'ậ':'a',
       'ắ':'a', 'ằ':'a', 'ẳ':'a', 'ẵ':'a', 'ặ':'a', 'ḃ':'b', 'ḅ':'b', 'ḇ':'b',
       'ç':'c', 'ć':'c', 'ĉ':'c', 'ċ':'c', 'č':'c', 'ḉ':'c', 'ď':'d', 'ḋ':'d',
       'ḍ':'d', 'ḏ':'d', 'ḑ':'d', 'ḓ':'d', 'è':'e', 'é':'e', 'ê':'e', 'ë':'e',
       'ē':'e', 'ĕ':'e', 'ė':'e', 'ę':'e', 'ě':'e', 'ȅ':'e', 'ȇ':'e', 'ȩ':'e',
       'ḕ':'e', 'ḗ':'e', 'ḙ':'e', 'ḛ':'e', 'ḝ':'e', 'ẹ':'e', 'ẻ':'e', 'ẽ':'e',
       'ế':'e', 'ề':'e', 'ể':'e', 'ễ':'e', 'ệ':'e', 'ḟ':'f', 'ĝ':'g', 'ğ':'g',
       'ġ':'g', 'ģ':'g', 'ǧ':'g', 'ǵ':'g', 'ḡ':'g', 'ĥ':'h', 'ȟ':'h', 'ḣ':'h',
       'ḥ':'h', 'ḧ':'h', 'ḩ':'h', 'ḫ':'h', 'ẖ':'h', 'ì':'i', 'í':'i', 'î':'i',
       'ï':'i', 'ĩ':'i', 'ī':'i', 'ĭ':'i', 'į':'i', 'ǐ':'i', 'ȉ':'i', 'ȋ':'i',
       'ḭ':'i', 'ḯ':'i', 'ỉ':'i', 'ị':'i', 'ĵ':'j', 'ǰ':'j', 'ķ':'k', 'ǩ':'k',
       'ḱ':'k', 'ḳ':'k', 'ḵ':'k', 'ĺ':'l', 'ļ':'l', 'ľ':'l', 'ḷ':'l', 'ḹ':'l',
       'ḻ':'l', 'ḽ':'l', 'ḿ':'m', 'ṁ':'m', 'ṃ':'m', 'ñ':'n', 'ń':'n', 'ņ':'n',
       'ň':'n', 'ǹ':'n', 'ṅ':'n', 'ṇ':'n', 'ṉ':'n', 'ṋ':'n', 'ò':'o', 'ó':'o',
       'ô':'o', 'õ':'o', 'ö':'o', 'ō':'o', 'ŏ':'o', 'ő':'o', 'ơ':'o', 'ǒ':'o',
       'ǫ':'o', 'ǭ':'o', 'ȍ':'o', 'ȏ':'o', 'ȫ':'o', 'ȭ':'o', 'ȯ':'o', 'ȱ':'o',
       'ṍ':'o', 'ṏ':'o', 'ṑ':'o', 'ṓ':'o', 'ọ':'o', 'ỏ':'o', 'ố':'o', 'ồ':'o',
       'ổ':'o', 'ỗ':'o', 'ộ':'o', 'ớ':'o', 'ờ':'o', 'ở':'o', 'ỡ':'o', 'ợ':'o',
       'ṕ':'p', 'ṗ':'p', 'ŕ':'r', 'ŗ':'r', 'ř':'r', 'ȑ':'r', 'ȓ':'r', 'ṙ':'r',
       'ṛ':'r', 'ṝ':'r', 'ṟ':'r', 'ś':'s', 'ŝ':'s', 'ş':'s', 'š':'s', 'ș':'s',
       'ṡ':'s', 'ṣ':'s', 'ṥ':'s', 'ṧ':'s', 'ṩ':'s', 'ţ':'t', 'ť':'t', 'ț':'t',
       'ṫ':'t', 'ṭ':'t', 'ṯ':'t', 'ṱ':'t', 'ẗ':'t', 'ù':'u', 'ú':'u', 'û':'u',
       'ü':'u', 'ũ':'u', 'ū':'u', 'ŭ':'u', 'ů':'u', 'ű':'u', 'ų':'u', 'ư':'u',
       'ǔ':'u', 'ǖ':'u', 'ǘ':'u', 'ǚ':'u', 'ǜ':'u', 'ȕ':'u', 'ȗ':'u', 'ṳ':'u',
       'ṵ':'u', 'ṷ':'u', 'ṹ':'u', 'ṻ':'u', 'ụ':'u', 'ủ':'u', 'ứ':'u', 'ừ':'u',
       'ử':'u', 'ữ':'u', 'ự':'u', 'ṽ':'v', 'ṿ':'v', 'ŵ':'w', 'ẁ':'w', 'ẃ':'w',
       'ẅ':'w', 'ẇ':'w', 'ẉ':'w', 'ẘ':'w', 'ẋ':'x', 'ẍ':'x', 'ý':'y', 'ÿ':'y',
       'ŷ':'y', 'ȳ':'y', 'ẏ':'y', 'ẙ':'y', 'ỳ':'y', 'ỵ':'y', 'ỷ':'y', 'ỹ':'y',
       'ź':'z', 'ż':'z', 'ž':'z', 'ẑ':'z', 'ẓ':'z', 'ẕ':'z'
      };
      diacriticMappingTable = SC.diacriticMappingTable;
    }

    var original, replacement, ret = "",
        length = this.length;
    for (var i = 0; i <= length; ++i) {
      original = this.charAt(i);
      replacement = diacriticMappingTable[original];
      if (replacement) {
        ret += replacement;
      }
      else {
        ret += original;
      }
    }
    return ret;
  },

  /**
    Removes any extra whitespace from the edges of the string. This method is
    also aliased as strip().

    @returns {String} the trimmed string
  */
  trim: function () {
    return this.replace(SC.STRING_TRIM_REGEXP,"");
  },

  /**
    Removes any extra whitespace from the left edge of the string.

    @returns {String} the trimmed string
  */
  trimLeft: function () {
    return this.replace(SC.STRING_TRIM_LEFT_REGEXP,"");
  },

  /**
    Removes any extra whitespace from the right edge of the string.

    @returns {String} the trimmed string
  */
  trimRight: function () {
    return this.replace(SC.STRING_TRIM_RIGHT_REGEXP,"");
  },

  /**
    Converts a word into its plural form.

    @returns {String} the plural form of the string
  */
  pluralize: function() {
      var idx, len,
           compare = this.split(/\s/).pop(), //check only the last word of a string
          restOfString = this.replace(compare,''),
          isCapitalized = compare.charAt(0).match(/[A-Z]/) ? true : false;

      compare = compare.toLowerCase();
      for (idx=0, len=SC.INFLECTION_CONSTANTS.UNCOUNTABLE.length; idx < len; idx++) {
          var uncountable = SC.INFLECTION_CONSTANTS.UNCOUNTABLE[idx];
          if (compare == uncountable) {
              return this.toString();
          }
      }
      for (idx=0, len=SC.INFLECTION_CONSTANTS.IRREGULAR.length; idx < len; idx++) {
          var singular = SC.INFLECTION_CONSTANTS.IRREGULAR[idx][0],
              plural   = SC.INFLECTION_CONSTANTS.IRREGULAR[idx][1];
          if ((compare == singular) || (compare == plural)) {
              if(isCapitalized) plural = plural.capitalize();
              return restOfString + plural;
          }
      }
      for (idx=0, len=SC.INFLECTION_CONSTANTS.PLURAL.length; idx < len; idx++) {
          var regex          = SC.INFLECTION_CONSTANTS.PLURAL[idx][0],
              replace_string = SC.INFLECTION_CONSTANTS.PLURAL[idx][1];
          if (regex.test(compare)) {
              return this.replace(regex, replace_string);
          }
      }
  },

  /**
    Converts a word into its singular form.

    @returns {String} the singular form of the string
  */
  singularize: function() {
      var idx, len,
          compare = this.split(/\s/).pop(), //check only the last word of a string
          restOfString = this.replace(compare,''),
          isCapitalized = compare.charAt(0).match(/[A-Z]/) ? true : false;

      compare = compare.toLowerCase();
      for (idx=0, len=SC.INFLECTION_CONSTANTS.UNCOUNTABLE.length; idx < len; idx++) {
          var uncountable = SC.INFLECTION_CONSTANTS.UNCOUNTABLE[idx];
          if (compare == uncountable) {
              return this.toString();
          }
      }
      for (idx=0, len=SC.INFLECTION_CONSTANTS.IRREGULAR.length; idx < len; idx++) {
          var singular = SC.INFLECTION_CONSTANTS.IRREGULAR[idx][0],
              plural   = SC.INFLECTION_CONSTANTS.IRREGULAR[idx][1];
          if ((compare == singular) || (compare == plural)) {
              if(isCapitalized) singular = singular.capitalize();
              return restOfString + singular;
          }
      }
      for (idx=0, len=SC.INFLECTION_CONSTANTS.SINGULAR.length; idx < len; idx++) {
          var regex          = SC.INFLECTION_CONSTANTS.SINGULAR[idx][0],
              replace_string = SC.INFLECTION_CONSTANTS.SINGULAR[idx][1];
          if (regex.test(compare)) {
              return this.replace(regex, replace_string);
          }
      }
  }

}

/** @private */
SC.String.strip = SC.String.trim; // convenience alias.
SC.supplement(SC.String, SC.StringInflections);

// Apply SC.String mixin to built-in String object
SC.supplement(String.prototype, SC.StringInflections) ;


/* >>>>>>>>>> BEGIN source/mixins/control.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('mixins/string');

/**
  Option for controls to automatically calculate their size (should be default 
  on controls that use renderers).
*/
SC.AUTO_CONTROL_SIZE = '__AUTO__';

/** 
  Option for HUGE control size.
  
  @property {String}
*/
SC.JUMBO_CONTROL_SIZE = 'sc-jumbo-size' ;

/** 
  Option for HUGE control size.
  
  @property {String}
*/
SC.HUGE_CONTROL_SIZE = 'sc-huge-size' ;

/** 
  Option for large control size.
  
  @property {String}
*/
SC.LARGE_CONTROL_SIZE = 'sc-large-size' ;

/** 
  Option for standard control size.
  
  @property {String}
*/
SC.REGULAR_CONTROL_SIZE = 'sc-regular-size' ;

/** 
  Option for small control size.
  
  @property {String}
*/
SC.SMALL_CONTROL_SIZE = 'sc-small-size' ;

/** 
  Option for tiny control size
  
  @property {String}
*/
SC.TINY_CONTROL_SIZE = 'sc-tiny-size' ;

/**
  @namespace
  
  A Control is a view that also implements some basic state functionality.
  Apply this mixin to any view that you want to have standard control
  functionality including showing a selected state, enabled state, focus
  state, etc.
  
  h2. About Values and Content
  
  Controls typically are used to represent a single value, such as a number,
  boolean or string.  The value a control is managing is typically stored in
  a "value" property.  You will typically use the value property when working
  with controls such as buttons and text fields in a form.
  
  An alternative way of working with a control is to use it to manage some
  specific aspect of a content object.  For example, you might use a label
  view control to display the "name" property of a Contact record.  This 
  approach is often necessary when using the control as part of a collection
  view.
  
  You can use the content-approach to work with a control by setting the 
  "content" and "contentValueKey" properties of the control.  The 
  "content" property is the content object you want to manage, while the 
  "contentValueKey" is the name of the property on the content object 
  you want the control to display.
  
  The default implementation of the Control mixin will essentially map the
  contentValueKey of a content object to the value property of the 
  control.  Thus if you are writing a custom control yourself, you can simply
  work with the value property and the content object support will come for
  free.  Just write an observer for the value property and update your 
  view accordingly.
  
  If you are working with a control that needs to display multiple aspects
  of a single content object (for example showing an icon and label), then
  you can override the contentValueDidChange() method instead of observing
  the value property.  This method will be called anytime _any_ property 
  on the content object changes.  You should use this method to check the
  properties you care about on the content object and update your view if 
  anything you care about has changed.
  
  h2. Delegate Support
  
  Controls can optionally get the contentDisplayProperty from a 
  displayDelegate, if it is set.  The displayDelegate is often used to 
  delegate common display-related configurations such as which content value
  to show.  Anytime your control is shown as part of a collection view, the
  collection view will be automatically set as its displayDelegate.
  
  @since SproutCore 1.0
*/
SC.Control = {
  
  isControl: YES,
  
  /** @private */
  initMixin: function() {
    this._control_contentDidChange() ; // setup content observing if needed.
  },
  
  /** 
    The selected state of this control.  Possible options are YES, NO or 
    SC.MIXED_STATE.
    
    @property {Boolean}
  */
  isSelected: NO,
  
  /** @private */
  isSelectedBindingDefault: SC.Binding.oneWay().bool(),
  
  /**
    Set to YES when the item is currently active.  Usually this means the 
    mouse is current pressed and hovering over the control, however the 
    specific implementation my vary depending on the control.
    
    Changing this property value by default will cause the Control mixin to
    add/remove an 'active' class name to the root element.
    
    @property {Boolean}
  */
  isActive: NO,
  
  /** @private */
  isActiveBindingDefault: SC.Binding.oneWay().bool(),
  
  /**
    The value represented by this control.
    
    Most controls represent a value of some type, such as a number, string
    or image URL.  This property should hold that value.  It is bindable
    and observable.  Changing this value will immediately change the
    appearance of the control.  Likewise, editing the control 
    will immediately change this value.
    
    If instead of setting a single value on a control, you would like to 
    set a content object and have the control display a single property
    of that control, then you should use the content property instead.

    @property {Object}
  */
  value: null,
  
  /**
    The content object represented by this control.
    
    Often you need to use a control to display some single aspect of an 
    object, especially if you are using the control as an item view in a
    collection view.
    
    In those cases, you can set the content and contentValueKey for the
    control.  This will cause the control to observe the content object for
    changes to the value property and then set the value of that property 
    on the "value" property of this object.
    
    Note that unless you are using this control as part of a form or 
    collection view, then it would be better to instead bind the value of
    the control directly to a controller property.
    
    @property {SC.Object}
  */
  content: null,
  
  /**
    The property on the content object that would want to represent the 
    value of this control.  This property should only be set before the
    content object is first set.  If you have a displayDelegate, then
    you can also use the contentValueKey of the displayDelegate.
    
    @property {String}
  */
  contentValueKey: null,
  
  /**
    Invoked whenever any property on the content object changes.  
    
    The default implementation will update the value property of the view
    if the contentValueKey property has changed.  You can override this
    method to implement whatever additional changes you would like.
    
    The key will typically contain the name of the property that changed or 
    '*' if the content object itself has changed.  You should generally do
    a total reset if '*' is changed.
    
    @param {Object} target the content object
    @param {String} key the property that changes
    @returns {void}
    @test in content
  */
  contentPropertyDidChange: function(target, key) {
    return this.updatePropertyFromContent('value', key, 'contentValueKey', target);
  },
  
  /**
    Helper method you can use from your own implementation of 
    contentPropertyDidChange().  This method will look up the content key to
    extract a property and then update the property if needed.  If you do
    not pass the content key or the content object, they will be computed 
    for you.  It is more efficient, however, for you to compute these values
    yourself if you expect this method to be called frequently.
    
    @param {String} prop local property to update
    @param {String} key the contentproperty that changed
    @param {String} contentKey the local property that contains the key
    @param {Object} content
    @returns {SC.Control} receiver
  */
  updatePropertyFromContent: function(prop, key, contentKey, content) {
    var del, v;
    
    if (contentKey === undefined) contentKey = "content"+prop.capitalize()+"Key";
    
    // prefer our own definition of contentKey
    if(this[contentKey]) contentKey = this.get(contentKey);
    // if we don't have one defined check the delegate
    else if((del = this.displayDelegate) && (v = del[contentKey])) contentKey = del.get ? del.get(contentKey) : v;
    // if we have no key we can't do anything so just short circuit out
    else return this;
    
    // only bother setting value if the observer triggered for the correct key
    if (key === '*' || key === contentKey) {
      if (content === undefined) content = this.get('content');
      
      if(content) v = content.get ? content.get(contentKey) : content[contentKey];
      else v = null;
      
      this.set(prop, v) ;
    }
    
    return this ;
  },
  
  /**
    Relays changes to the value back to the content object if you are using
    a content object.
    
    This observer is triggered whenever the value changes.  It will only do
    something if it finds you are using the content property and
    contentValueKey and the new value does not match the old value of the
    content object.  
    
    If you are using contentValueKey in some other way than typically
    implemented by this mixin, then you may want to override this method as
    well.
    
    @returns {void}
  */
  updateContentWithValueObserver: function() {
    var key = this.contentValueKey ?
      this.get('contentValueKey') :
      this.getDelegateProperty('contentValueKey', this.displayDelegate),
      content = this.get('content') ;
    if (!key || !content) return ; // do nothing if disabled
    
    // get value -- set on content if changed
    var value = this.get('value');
    if (typeof content.setIfChanged === SC.T_FUNCTION) {
      content.setIfChanged(key, value);
    } else {
      // avoid re-writing inherited props
      if (content[key] !== value) content[key] = value ;
    }
  }.observes('value'),
  
  /**
    The name of the property this control should display if it is part of an
    SC.FormView.
    
    If you add a control as part of an SC.FormView, then the form view will 
    automatically bind the value to the property key you name here on the 
    content object.
    
    @property {String}
  */
  fieldKey: null,
  
  /**
    The human readable label you want shown for errors.  May be a loc string.
    
    If your field fails validation, then this is the name that will be shown
    in the error explanation.  If you do not set this property, then the 
    fieldKey or the class name will be used to generate a human readable name.
    
    @property {String}
  */
  fieldLabel: null,
  
  /**
    The human readable label for this control for use in error strings.  This
    property is computed dynamically using the following rules:
    
    If the fieldLabel is defined, that property is localized and returned.
    Otherwise, if the keyField is defined, try to localize using the string 
    "ErrorLabel.{fieldKeyName}".  If a localized name cannot be found, use a
    humanized form of the fieldKey.
    
    Try to localize using the string "ErrorLabel.{ClassName}". Return a 
    humanized form of the class name.
    
    @property {String}
  */
  errorLabel: function() {
    var ret, fk, def ;
    if (ret = this.get('fieldLabel')) return ret ;
    
    // if field label is not provided, compute something...
    fk = this.get('fieldKey') || this.constructor.toString() ;
    def = (fk || '').humanize().capitalize() ;
    return "ErrorLabel."+fk
      .locWithDefault(("FieldKey."+fk).locWithDefault(def)) ;
      
  }.property('fieldLabel','fieldKey').cacheable(),

  /**
    The control size.  This will set a CSS style on the element that can be 
    used by the current theme to vary the appearance of the control.
    
    Some controls will default to SC.AUTO_CONTROL_SIZE, which will allow you
    to simply size the control, and the most appropriate control size will
    automatically be picked; be warned, though, that if you don't specify
    a height, performance will be impacted as it must be calculated; if you do
    this, a warning will be issued. If you don't care, use SC.CALCULATED_CONTROL_SIZE.
    
    @property {String}
  */
  controlSize: SC.REGULAR_CONTROL_SIZE,
  
  /** @private */
  displayProperties: 'isEnabled isSelected isActive controlSize'.w(),
  
  /** @private */
  _CONTROL_TMP_CLASSNAMES: {},
  
  /** @private
    Invoke this method in your updateDisplay() method to update any basic 
    control CSS classes.
  */
  renderMixin: function(context, firstTime) {
    var sel = this.get('isSelected'), disabled = !this.get('isEnabled'),
    // update the CSS classes for the control.  note we reuse the same hash
    // to avoid consuming more memory
    names = this._CONTROL_TMP_CLASSNAMES ; // temporary object
    names.mixed = sel === SC.MIXED_STATE;
    names.sel = sel && (sel !== SC.MIXED_STATE) ;
    names.active = this.get('isActive') ;

    var controlSize = this.get("controlSize");

    if (firstTime) {
      context.setClass(names);
      if (controlSize !== SC.AUTO_CONTROL_SIZE) context.addClass(controlSize);
    } else {
      context.$().setClass(names);
      if (controlSize !== SC.AUTO_CONTROL_SIZE) context.$().addClass(controlSize);
    }

    // if the control implements the $input() helper, then fixup the input
    // tags
    if (!firstTime && this.$input) {
      var inps = this.$input();
      if(inps.attr('type')!=="radio"){
        this.$input().attr('disabled', disabled);
      }
    }
  },
  
  /** @private
    This should be null so that if content is also null, the
    _contentDidChange won't do anything on init.
  */
  _control_content: null,
  
  /** @private
    Observes when a content object has changed and handles notifying 
    changes to the value of the content object.
  */
  // TODO: observing * is unnecessary and inefficient, but a bunch of stuff in sproutcore depends on it (like button)
  _control_contentDidChange: function() {
    var content = this.get('content');
    
    if (this._control_content === content) return; // nothing changed
    
    var f = this.contentPropertyDidChange,
    // remove an observer from the old content if necessary
        old = this._control_content ;
    if (old && old.removeObserver) old.removeObserver('*', this, f) ;
  
    // update previous values
    this._control_content = content ;
  
    // add observer to new content if necessary.
    if (content && content.addObserver) content.addObserver('*', this, f) ;
    
    // notify that value did change.
    this.contentPropertyDidChange(content, '*') ;
    
  }.observes('content'),
  
  // since we always observe *, just call the update function
  _control_contentValueKeyDidChange: function() {
    // notify that value did change.
    this.contentPropertyDidChange(this.get('content'), '*') ;
  }.observes('contentValueKey')
};

/* >>>>>>>>>> BEGIN source/mixins/editable.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace

  The Editable mixin is a standard protocol used to activate keyboard editing 
  on views that are editable such as text fields, label views and item views.
  
  You should apply this mixin, or implement the methods, if you are
  designing an item view for a collection and you want to automatically
  trigger editing.
  
  h2. Using Editable Views
  
  To use a view that includes the Editable mixin, you simply call three
  methods on the view:
  
  - To begin editing, call beginEditing().  This will make the view first responder and allow the user to make changes to it.  If the view cannot begin editing for some reason, it will return NO.
  
  - If you want to cancel editing, you should try calling discardEditing().  This will cause the editor to discard its changed value and resign first responder.  Some editors do not support cancelling editing and will return NO.  If this is the case, you may optionally try calling commitEditing() instead to force the view to resign first responder, even though this will commit the changes.
  
  - If you want to end editing, while saving any changes that were made, try calling commitEditing().  This will cause the editor to validate and apply its changed value and resign first responder.  If the editor cannot validate its contents for some reason, it will return NO.  In this case you may optionally try calling discardEditing() instead to force the view to resign first responder, even though this will discard the changes.
  
  
  h2. Implementing an Editable View
  
  To implement a new view that is editable, you should implement the three
  methods defined below: beginEditing(), discardEditing(), and
  commitEditing().  If you already allow editing when your view becomes first
  responder and commit your changes when the view loses first responder status
  then you can simply apply this mixin and not override any methods.
  
  
  @since SproutCore 1.0
  
*/
SC.Editable = {
  editorDelegate: null,
  
  /**
    Indicates whether a view is editable or not.  You can optionally 
    implement the methods in this mixin to disallow editing is isEditable is
    NO.
    
    @property {Boolean}
  */
  isEditable: NO,
  
  /**
    Indicates whether editing is currently in progress.  The methods you
    implement should generally up this property as appropriate when you 
    begin and end editing.
    
    @property {Boolean}
  */
  isEditing: NO,
  
  /**
    Begins editing on the view.
    
    This method is called by other views when they want you to begin editing.
    You should write this method to become first responder, perform any 
    additional setup needed to begin editing and then return YES.
    
    If for some reason you do not want to allow editing right now, you can
    also return NO.  If your view is already editing, then you should not
    restart editing again but just return YES.

    The default implementation checks to see if editing is allowed, then
    becomes first responder and updates the isEditing property if appropriate.
    Generally you will want to replace this method with your own 
    implementation and not call the default.
    
    @returns {Boolean} YES if editing began or is in progress, NO otherwise
  */
  beginEditing: function() {
    if (!this.get('isEditable')) return NO ;
    if (this.get('isEditing')) return YES ;
    
    // begin editing
    this.beginPropertyChanges();
    this.set('isEditing', YES) ;
    this.becomeFirstResponder() ;
    this.endPropertyChanges();
    
    return YES ;
  },
  
  /**
    Ends editing on the view, discarding any changes that were made to the
    view value in the meantime.
    
    This method is called by other views when they want to cancel editing
    that began earlier.  When this method is called you should resign first
    responder, restore the original value of the view and return YES.
    
    If your view cannot revert back to its original state before editing began
    then you can implement this method to simply return NO.  A properly
    implemented client may try to call commitEditing() instead to force your
    view to end editing anyway.
    
    If this method is called on a view that is not currently editing, you
    should always just return YES.
    
    The default implementation does not support discarding changes and always
    returns NO.
    
    @returns {Boolean} YES if changes were discarded and editing ended.
  */
  discardEditing: function() {
    // if we are not editing, return YES, otherwise NO.
    
    return !this.get('isEditing') ;
  },
  
  /**
    Ends editing on the view, committing any changes that were made to the 
    view value in the meantime.
    
    This method is called by other views when they want to end editing, 
    saving any changes that were made to the view in the meantime.  When this
    method is called you should resign first responder, save the latest
    value of the view and return YES.
    
    If your view cannot save the current state of the view for some reason 
    (for example if validation fails), then you should return NO.  Properly
    implemented clients may then try to call discardEditing() to force your
    view to resign first responder anyway.
    
    Some views apply changes to their value immediately during an edit instead
    of waiting for the view to end editing.  If this is the case, you should
    still implement commitEditing but you simply may not save any value 
    changes.
  
    If this method is called on a view that is not currently editing, you
    should always just reutrn YES.
    
    The default implementation sets isEditing to NO, resigns first responder
    and returns YES.
    
    @returns {Boolean} YES if changes were discarded and editing ended.
  */
  commitEditing: function() {
    if (!this.get('isEditing')) return YES;
    this.set('isEditing', NO) ;
    this.resignFirstResponder() ;
    
    this.invokeDelegateMethod(this.get('editorDelegate'), 'inlineEditorShouldCommitEditing', this, this.get('value'));
    
    return YES ;
  }

} ;

/* >>>>>>>>>> BEGIN source/mixins/flowed_layout.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.ALIGN_JUSTIFY = "justify";
/**
  @namespace 

  Normal SproutCore views are absolutely positioned--parent views have relatively
  little input on where their child views are placed.
  
  This mixin makes a view layout its child views itself, flowing left-to-right
  or up-to-down, and, optionally, wrapping.
  
  Child views with useAbsoluteLayout===YES will be ignored in the layout process.
  This mixin detects when child views have changed their size, and will adjust accordingly.
  It also observes child views' isVisible and calculatedWidth/Height properties, and, as a
  flowedlayout-specific extension, isHidden.
  
  These properties are observed through `#js:observeChildLayout` and `#js:unobserveChildLayout`;
  you can override the method to add your own properties. To customize isVisible behavior,
  you will also want to override shouldIncludeChildInFlow.
  
  This relies on the children's frames or, if specified, calculatedWidth and calculatedHeight
  properties.
  
  This view mixes very well with animation. Further, it is able to automatically mix
  in to child views it manages, created or not yet created, allowing you to specify
  settings such as animation once only, and have everything "just work".
  
  Like normal views, you simply specify child views--everything will "just work."
  
  @since SproutCore 1.0
*/
SC.FlowedLayout = {
  /**
    The direction of flow.
  */
  layoutDirection: SC.LAYOUT_HORIZONTAL,

  /**
    Whether the view should automatically resize (to allow scrolling, for instance)
  */
  autoResize: YES,
  
  shouldResizeWidth: YES,
  
  shouldResizeHeight: YES,
  
  /**
    The alignment of items within rows or columns.
  */
  align: SC.ALIGN_LEFT,
  
  /**
    If YES, flowing child views are allowed to wrap to new rows or columns.
  */
  canWrap: YES,
  
  /**
    A set of spacings (left, top, right, bottom) for subviews. Defaults to 0s all around.
    This is the amount of space that will be before, after, above, and below the view. These
    spacings do not collapse into each other.
    
    You can also set flowSpacing on any child view, or implement flowSpacingForView.
  */
  defaultFlowSpacing: { left: 0, bottom: 0, top: 0, right: 0 },
  
  /**
    @property {Hash}
    
    Padding around the edges of this flow layout view. This is useful for
    situations where you don't control the layout of the FlowedLayout view;
    for instance, when the view is the contentView for a SC.ScrollView.
  */
  flowPadding: { left: 0, bottom: 0, right: 0, top: 0 },

  /**
    @private
    
    If the flowPadding somehow misses a property (one of the sides),
    we need to make sure a default value of 0 is still there.
   */
  _scfl_validFlowPadding: function() {
    var padding = this.get('flowPadding') || {}, ret = {};
    ret.left = padding.left || 0;
    ret.top = padding.top || 0;
    ret.bottom = padding.bottom || 0;
    ret.right = padding.right || 0;
    return ret;
  }.property('flowPadding').cacheable(),
  
  concatenatedProperties: ["childMixins"],
  
  initMixin: function() {
    this.invokeOnce("_scfl_tile");
  },
  
  /**
    Detects when the child views change.
  */
  _scfl_childViewsDidChange: function(c) {
    this.invokeOnce("_scfl_tile");
  }.observes("childViews"),
  
  _scfl_layoutPropertyDidChange: function(){
    this.invokeOnce("_scfl_tile");
  },
  
  /**
    Overriden to only update if it is a view we do not manage, or the width or height has changed
    since our last record of it.
  */
  layoutDidChangeFor: function(c) {
    // if we have not flowed yet, ignore as well
    if (!this._scfl_itemLayouts) return arguments.callee.base.apply(this,arguments);
    
    // now, check if anything has changed
    var l = this._scfl_itemLayouts[SC.guidFor(c)], cl = c.get('layout'), f = c.get('frame');
    if (!l) return arguments.callee.base.apply(this,arguments);
    
    var same = YES;
    
    // in short, if anything interfered with the layout, we need to
    // do something about it.
    if (l.left && l.left !== cl.left) same = NO;
    else if (l.top && l.top !== cl.top) same = NO;
    else if (!c.get('fillWidth') && l.width && l.width !== cl.width) same = NO;
    else if (!l.width && !c.get('fillWidth') && f.width !== c._scfl_lastFrame.width) same = NO;
    else if (!c.get('fillHeight') && l.height && l.height !== cl.height) same = NO;
    else if (!l.height && !c.get('fillHeight') && f.height !== c._scfl_lastFrame.height) same = NO;
    
    if (same) {
      return arguments.callee.base.apply(this,arguments);
    }
    
    // nothing has changed. This is where we do something
    this.invokeOnce("_scfl_tile");
    arguments.callee.base.apply(this,arguments);
  },
  
  /**
    Sets up layout observers on child view. We observe three things:
    - isVisible
    - calculatedWidth
    - calculatedHeight
    
    Actual layout changes are detected through layoutDidChangeFor.
  */
  observeChildLayout: function(c) {
    if (c._scfl_isBeingObserved) return;
    c._scfl_isBeingObserved = YES;
    c.addObserver('isVisible', this, '_scfl_layoutPropertyDidChange');
    c.addObserver('useAbsoluteLayout', this, '_scfl_layoutPropertyDidChange');
    c.addObserver('calculatedWidth', this, '_scfl_layoutPropertyDidChange');
    c.addObserver('calculatedHeight', this, '_scfl_layoutPropertyDidChange');
  },
  
  /**
    Removes observers on child view.
  */
  unobserveChildLayout: function(c) {
    c._scfl_isBeingObserved = NO;
    c.removeObserver('isVisible', this, '_scfl_layoutPropertyDidChange');
    c.removeObserver('useAbsoluteLayout', this, '_scfl_layoutPropertyDidChange');
    c.removeObserver('calculatedWidth', this, '_scfl_layoutPropertyDidChange');
    c.removeObserver('calculatedHeight', this, '_scfl_layoutPropertyDidChange');
  },
  
  /**
    Determines whether the specified child view should be included in the flow layout.
    By default, if it has isVisible: NO or useAbsoluteLayout: YES, it will not be included.
  */
  shouldIncludeChildInFlow: function(c) {
    return c.get('isVisible') && !c.get('useAbsoluteLayout');
  },
  
  /**
    Returns the flow spacings for a given view. By default, returns the view's flowSpacing,
    and if they don't exist, the defaultFlowSpacing for this view.
  */
  flowSpacingForView: function(idx, view) {
    var spacing = view.get("flowSpacing");
    if (SC.none(spacing)) spacing = this.get("defaultFlowSpacing");
    
    if (SC.typeOf(spacing) === SC.T_NUMBER) {
      spacing = { left: spacing, right: spacing, bottom: spacing, top: spacing };
    } else {
      spacing['left'] = spacing['left'] || 0;
      spacing['right'] = spacing['right'] || 0;
      spacing['top'] = spacing['top'] || 0;
      spacing['bottom'] = spacing['bottom'] || 0;
    }
    
    return spacing;
  },
  
  /**
    Returns the flow size for a given view. The default version checks the view's
    calculatedWidth/Height, then its frame.
    
    For spacers, this returns an empty size.
    
    This should return a structure like: { width: whatever, height: whatever }
  */
  flowSizeForView: function(idx, view) {
    var cw = view.get('calculatedWidth'), ch = view.get('calculatedHeight');
    
    var calc = {}, f = view.get('frame');
    view._scfl_lastFrame = f;
    
    // if there is a calculated width, use that. NOTE: if calculatedWidth === 0,
    // it is invalid. This is the practice in other views.
    if (cw) {
      calc.width = cw;
    } else {
      // if the width is not calculated, we can't just use the frame because
      // we may have altered the frame. _scfl_cachedFlowSize is valid, however,
      // if the frame width is equal to _scfl_cachedCalculatedFlowSize.width, as 
      // that means the width has not been recomputed.
      //
      // Keep in mind that if we are the ones who recomputed it, we can use our
      // original value. If it was recomputed by the view itself, then its value
      // should be ok and unmanipulated by us, in theory.
      if (view._scfl_cachedCalculatedFlowSize && view._scfl_cachedCalculatedFlowSize.width == f.width) {
        calc.width = view._scfl_cachedFlowSize.width;
      } else {
        calc.width = f.width;
      }
    }
    
    // same for calculated height
    if (ch) {
      calc.height = ch;
    } else {
      if (view._scfl_cachedCalculatedFlowSize && view._scfl_cachedCalculatedFlowSize.height == f.height) {
        calc.height = view._scfl_cachedFlowSize.height;
      } else {
        calc.height = f.height;
      }
    }
    
    // if it is a spacer, we must set the dimension that it
    // expands in to 0.
    if (view.get('isSpacer')) {
      if (this.get('layoutDirection') === SC.LAYOUT_HORIZONTAL) calc.width = 0;
      else calc.height = 0;
    }
    
    // if it has a fillWidth/Height, clear it for later
    if (
      this.get('layoutDirection') === SC.LAYOUT_HORIZONTAL && view.get('fillHeight')
    ) {
      calc.height = 0;
    } else if (
      this.get('layoutDirection') === SC.LAYOUT_VERTICAL && view.get('fillWidth')
    ) {
      calc.width = 0;
    }
    
    // return
    return calc;
  },
  
  /**
    Takes a row and positions everything within the row, calling updateLayout.
    It should return the row height.
  */
  flowRow: function(row, rowOffset, rowSize, availableRowLength, padding, primary, secondary, align) {
    
    // we deal with values already offset for padding
    // therefore, we must adjust availableRowLength
    if (primary === 'left') availableRowLength -= padding['left'] + padding['right'];
    else availableRowLength -= padding['top'] + padding['bottom'];
    
    // if it is justified, we'll add spacing between ALL views.
    var item, len = row.length, idx, layout, rowLength = 0, totalSpaceUnits = 0, spacePerUnit = 0;
    
    // first, determine the width of all items, and find out how many virtual spacers there are
    // this width includes spacing
    for (idx = 0; idx < len; idx++) {
      item = row[idx];
      if (item.get("isSpacer")) totalSpaceUnits += item.get("spaceUnits") || 1;
      else rowLength += item._scfl_cachedSpacedSize[primary === "left" ? "width" : "height"];
    }
    
    // add space units for justification
    // when justifying, we give one space unit between each item
    if (len > 1 && align === SC.ALIGN_JUSTIFY) {
      totalSpaceUnits += len - 1;
    }
    
    // calculate space per unit if needed
    if (totalSpaceUnits > 0) {
      spacePerUnit = (availableRowLength - rowLength) / totalSpaceUnits;
      rowLength = availableRowLength;
    }
    
    // prepare.
    // we will setup x, y
    // we _may_ set up width and/or height, if the view is a spacer or has
    // fillHeight/fillWidth.
    var x = padding['left'], y = padding['top'], width, height, itemSize = 0;
    
    if (primary === 'left') y = rowOffset;
    else x = rowOffset;
    
    // handle align
    if (align === SC.ALIGN_RIGHT || align === SC.ALIGN_BOTTOM) {
      if (primary === 'left') x = (availableRowLength - rowLength - padding.right);
      else y = (availableRowLength - rowLength - padding.bottom);
    } else if (align === SC.ALIGN_CENTER || align === SC.ALIGN_MIDDLE) {
      if (primary === 'left') x = (availableRowLength - padding.top - padding.bottom) / 2 - rowLength / 2;
      else y = (availableRowLength - padding.top - padding.bottom) / 2 - rowLength / 2;
    }
    
    // position
    for (idx = 0; idx < len; idx++) {
      item = row[idx];
      
      width = undefined; height = undefined;
      
      // sometimes a view wants to fill the row; that is, if we flow horizontally,
      // be the full height, and vertically, fill the width. This only applies if
      // we are not wrapping...
      //
      // Since we still position with spacing, we have to set the width to the total row
      // size minus the spacing. The spaced size holds only the spacing because the
      // flow size method returns 0.
      if (item.get("fillHeight") && primary === "left") {
        height = rowSize - item._scfl_cachedSpacedSize.height;
      }
      if (item.get("fillWidth") && primary === "top") {
        width = rowSize - item._scfl_cachedSpacedSize.width;
      }
      
      // update offset
      if (item.get('isSpacer')) {
        // the cached size is the minimum size for the spacer
        itemSize = item._scfl_cachedSpacedSize[primary === 'left' ? 'width' : 'height'];
        
        // get the spacer size
        itemSize = Math.max(itemSize, spacePerUnit * (item.get('spaceUnits') || 1));
        
        // and finally, set back the cached flow size value--
        // not including spacing (this is the view size for rendering)
        // spacers include 
        if (primary === "left") {
          width = itemSize;
        } else {
          height = itemSize;
        }
      } else {
        if (primary === "left") {
          itemSize = item._scfl_cachedSpacedSize.width;
        } else {
          itemSize = item._scfl_cachedSpacedSize.height;
        }
      }
      
      this.flowPositionView(idx, item, x, y, width, height);
      
      if (primary === 'left') x += itemSize;
      else y += itemSize;
      
      // update justification
      if (align === SC.ALIGN_JUSTIFY) {
        if (primary === 'left') x += spacePerUnit;
        else y += spacePerUnit;
      }
    }
    
    if (primary === 'left') return x;
    return y;
  },
  
  flowPositionView: function(idx, item, x, y, width, height) {
    var last = this._scfl_itemLayouts[SC.guidFor(item)],
        spacing = item._scfl_cachedSpacing;
    var l = {
      left: x + spacing.left,
      top: y + spacing.top
    };
    
    if (width !== undefined) l.width = width;
    if (height !== undefined) l.height = height;

    // we must set this first, or it will think it has to update layout again, and again, and again
    // and we get a crash.
    this._scfl_itemLayouts[SC.guidFor(item)] = l;

    // Also, never set if the same. We only want to compare layout properties, though
    if (last && 
      last.left == l.left && last.top == l.top && 
      last.width == l.width && l.width !== undefined && 
      last.height == l.height && l.height !== undefined
    ) {
      return;
    }
    
    item.adjust(l);
  },
  
  // hacky, but only way to allow us to use calculatedWidth/Height and avoid clobbering
  // our own layout (interfering with our tiling) while still allowing scrolling.
  renderMixin: function(context) {
    context.css('minWidth', this.get('calculatedWidth'));
    context.css('minHeight', this.get('calculatedHeight'));
  },
  
  clippingFrame: function() {
    var ret = arguments.callee.base.apply(this,arguments),
    cw = this.get('calculatedWidth'), ch = this.get('calculatedHeight');
    
    if(cw) ret.width = cw;
    if(ch) ret.height = ch;
    
    return ret;
  }.property('calculatedWidth', 'calculatedHeight'),
  
  _scfl_calculatedSizeDidChange: function() {
    var elem = this.$(),
    cw = this.get('calculatedWidth'), ch = this.get('calculatedHeight');
    
    if(cw) elem.css('minWidth', this.get('calculatedWidth'));
    if(ch) elem.css('minHeight', this.get('calculatedHeight'));
  }.observes('calculatedWidth', 'calculatedHeight'),
  
  _scfl_tile: function() {
    if (!this._scfl_itemLayouts) this._scfl_itemLayouts = {};
    
    var isObserving = this._scfl_isObserving || SC.CoreSet.create(),
        nowObserving = SC.CoreSet.create();
    
    var children = this.get('childViews'), child, idx, len = children.length,
        rows = [], row = [],
        startRowSize = 0, rowSize = 0, 
        startsNewRow, newRowPending = NO,
        rowOffset = 0, itemOffset = 0, 
        width = this.get('frame').width,
        height = this.get('frame').height,
        canWrap = this.get('canWrap'),
        layoutDirection = this.get('layoutDirection'),
        padding = this.get('_scfl_validFlowPadding'),
        childSize, childSpacing, childSpacedSize, align = this.get('align'),
        longestRow = 0;
    
    
    var primary, primary_os, primary_d, secondary, secondary_os, secondary_d, flowLimit, availableRowLength;
    if (layoutDirection === SC.LAYOUT_HORIZONTAL) {
      availableRowLength = width;
      flowLimit = width - padding["right"];
      
      primary = "left"; secondary = "top";
      primary_os = "right"; secondary_os = "bottom";
      primary_d = "width"; secondary_d = "height";
    } else {
      availableRowLength = height;
      flowLimit = height - padding["bottom"];
      
      primary = "top"; secondary = "left";
      primary_os = "bottom"; secondary_os = "right";
      primary_d = "height"; secondary_d = "width";
    }
    
    rowOffset = padding[secondary];
    itemOffset = padding[primary];
    /*
    // if we cannot wrap, the row size is our frame (minus padding)
    if (!canWrap) {
      if (layoutDirection === SC.LAYOUT_HORIZONTAL) {
        rowSize = startRowSize = height - padding.top - padding.bottom;
      } else {
        rowSize = startRowSize = width - padding.right - padding.left;
      }
    }
      */  
    // now, loop through all child views and group them into rows.
    // note that we are NOT positioning.
    // when we are done with a row, we call flowRow to finish it.
    for (idx = 0; idx < len; idx++) {
      // get a child.
      child = children[idx];
      
      // update observing lists
      isObserving.remove(SC.guidFor(child));
      nowObserving.add(child);
      
      // we need to check if it manually starts a new row, because if it does this is remembered even if the child isn't visible
      startsNewRow = child.get('startsNewRow');
      
      // skip positioning of items with isVisible === NO or isHidden === YES
      if (!this.shouldIncludeChildInFlow(child)) {
        // if the hidden view started a new row, remember it for later
        newRowPending = startsNewRow || newRowPending;
        continue;
      }
      
      // get spacing, size, and cache
      childSize = this.flowSizeForView(idx, child);
            
      childSpacing = this.flowSpacingForView(idx, child);
      childSpacedSize = {
        width: childSize.width + childSpacing.left + childSpacing.right,
        height: childSize.height + childSpacing.top + childSpacing.bottom
      };
      
      // flowRow will use this; it's purely here for performance
      child._scfl_cachedFlowSize = childSize;
      child._scfl_cachedSpacedSize = childSpacedSize;
      child._scfl_cachedSpacing = childSpacing;
      
      // determine if the item can fit in the row including the collapsed right margin+padding or if it explicitly starts a new row
      if (startsNewRow || newRowPending || (canWrap && row.length > 0 && itemOffset + childSize[primary_d] >= flowLimit)) {
        // regardless of why we just created a new row, so the flag needs to be reset
        newRowPending = NO;
        
        // first, flow this row
        this.flowRow(row, rowOffset, rowSize, availableRowLength, padding, primary, secondary, align);

        // We need another row.
        row = [];
        rows.push(row);
        rowOffset += rowSize;
        rowSize = startRowSize;
        itemOffset = padding[primary];
      
      }

      // add too row and update row size+item offset
      row.push(child);
      rowSize = Math.max(childSpacedSize[secondary_d], rowSize);
      itemOffset += childSpacedSize[primary_d];
      longestRow = Math.max(longestRow, itemOffset);
    }
    
    
    // flow last row
    itemOffset = this.flowRow(row, rowOffset, rowSize, availableRowLength, padding, primary, secondary, align);
    longestRow = Math.max(longestRow, itemOffset);

    
    // update calculated width/height
    this._scfl_lastFrameSize = this.get('frame');
    
    // size is now calculated the same whether canWrap is on or not
    if (this.get('autoResize')) {
      if(longestRow) {
        if (layoutDirection === SC.LAYOUT_HORIZONTAL) {
          if(this.get('shouldResizeWidth')) this.set('calculatedWidth', longestRow + padding[primary_os]);
        } else {
          if(this.get('shouldResizeHeight')) this.set('calculatedHeight', longestRow + padding[primary_os]);
        }
      }
      
      if(rowOffset + rowSize) {
        if (layoutDirection === SC.LAYOUT_HORIZONTAL) {
          if(this.get('shouldResizeHeight')) this.set('calculatedHeight', rowOffset + rowSize + padding[secondary_os]);
        } else {
          if(this.get('shouldResizeWidth')) this.set('calculatedWidth', rowOffset + rowSize + padding[secondary_os]);
        }
      }
    }
    
    
    // cleanup on aisle 7
    len = isObserving.length;
    for (idx = 0; idx < len; idx++) {
      this.unobserveChildLayout(isObserving[idx]);
    }

    len = nowObserving.length;
    for (idx = 0; idx < len; idx++) {
      this.observeChildLayout(nowObserving[idx]);
    }
    
    this._scfl_isObserving = nowObserving;
  },
  
  _scfl_frameDidChange: function() {
    var frame = this.get("frame"), lf = this._scfl_lastFrameSize;
    this._scfl_lastFrameSize = frame;

    if (lf && lf.width == frame.width && lf.height == frame.height) return;
    
    this.invokeOnce("_scfl_tile");
  }.observes("frame"),
  
  destroyMixin: function() {
    var isObserving = this._scfl_isObserving;
    if (!isObserving) return;
    
    var len = isObserving.length, idx;
    for (idx = 0; idx < len; idx++) {
      this.unobserveChildLayout(isObserving[idx]);
    }
  },
  
  /*
    Reorders childViews so that the passed views are at the beginning in the order they are passed. Needed because childViews are layed out in the order they appear in childViews.
  */
  reorder: function(views) {
    if(!SC.typeOf(views) === SC.T_ARRAY) views = arguments;
    
    var i = views.length, childViews = this.childViews, view;
    
    // childViews.[] should be observed
    this.beginPropertyChanges();
    
    while(i-- > 0) {
      view = views[i];
      
      childViews.removeObject(view);
      childViews.unshiftObject(view);
    }
    
    this.endPropertyChanges();
    
    this._scfl_childViewsDidChange();
    
    return this;
  }
};

/* >>>>>>>>>> BEGIN source/mixins/gestureable.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  You can mix in SC.Gesturable to your views to add some support for recognizing
  gestures.
  
  SproutCore views have built-in touch events. However, sometimes you may want
  to recognize gestures like tap, pinch, swipe, etc. This becomes tedious if you
  need to do this often, and moreso if you need to check for multiple possible
  gestures on the same view.
  
  SC.Gesturable allows you to define a collection of gestures (SC.Gesture objects)
  that your view should recognize. When a gesture is recognized, methods will be
  called on the view:
  
  - [gestureName](gesture, args...): called when the gesture has occurred. This is 
    useful for event-style gestures, where you aren't interested in when it starts or
    ends, but just that it has occurred. SC.SwipeGesture triggers this after the
    swipe has moved a minimum amount—40px by default.

  - [gestureName]Start(gesture, args...): called when the gesture is first recognized. 
    For instance, a swipe gesture may be recognized after the finger has moved a 
    minimum distance in a horizontal.
    
  - [gestureName]Changed(gesture, args...): called when some property of the gesture 
    has changed. For instance, this may be called continuously as the user swipes as 
    the swipe's distance changes.
  
  - [gestureName]Cancelled(gesture, args...): called when a gesture, for one reason 
    or another, is no longer recognized. For instance, a horizontal swipe gesture 
    could cancel if the user moves too far in a vertical direction.
  
  - [gestureName]End(gesture, args...): called when a gesture ends. A swipe would end
    when the user lifts their finger.
  
  Each of these methods is passed the gesture instance, in addition to any arguments
  the gesture sends for your convenience. The default swipe gesture sends an SC.Touch
  instance, the swipe direction, and the distance the swipe has moved in that direction.
  
  Using SC.Gesturable
  ------------------------
  To make your view recognize gestures, mix in Gesturable and add items to the 'gestures'
  property:
  
      SC.View.extend(SC.Gesturable, {
        gestures: [SC.PinchGesture, 'mySwipeGesture'],
        
        // specifying as a string allows you to configure it:
        mySwipeGesture: SC.SwipeGesture.extend({
          direction: SC.SWIPE_VERTICAL,
          startDistance: 3,
          swipeDistance: 20
        }),
        
        // handle the swipe action
        swipe: function(touch, direction) {
          console.error("Swiped! In direction: " + direction);
        },
        
        swipeStart: function(touch, direction, delta) {
          console.error("Swipe started in direction: " + direction + "; dist: " + delta);
        },
        
        swipeChanged: function(touch, direction, delta) {
          console.error("Swipe continued in direction: " + direction + "; dist: " + delta);
        },
        
        swipeEnd: function(touch, direction, delta) {
          console.error("Completed swipe in direction: " + direction + "; dist: " + delta);
        }
        
      })
  
*/
SC.Gesturable = {
  concatenatedProperties: ["gestures"],
  gestures: [],
  
  /**
    @private
    When SC.Gesturable initializes, any gestures on the view must be instantiated.
  */
  initMixin: function() {
    this.createGestures();
  },
  
  /**
    @private
    Instantiates the gestures.
  */
  createGestures: function() {
    var gestures = this.get("gestures"), idx, len = gestures.length, g, _g = [];

    // loop through all gestures
    for (idx = 0; idx < len; idx++) {
      // get the proper gesture
      if (SC.typeOf(gestures[idx]) === SC.T_STRING) {
        g = this.get(gestures[idx]);
      } else {
        g = gestures[idx];
      }
      
      // if it was not found, well, that's an error.
      if (!g) {
        throw "Could not find gesture named '" + gestures[idx] + "' on view.";
      }
      
      // if it is a class, instantiate (it really ought to be a class...)
      if (g.isClass) {
        g = g.create({
          view: this
        });
      }
      
      // and set the gesture instance and add it to the array.
      if (SC.typeOf(gestures[idx]) === SC.T_STRING) this[gestures[idx]] = g;
      _g.push(g);
    }
    
    this.set("gestures", _g);
  },
  
  /**
    Handles touch start by handing it to the gesture recognizing code.
    
    If you override touchStart, you will need to call gestureTouchStart to
    give the gesture system control of the touch. You will continue to get
    events until if and when a gesture decides to take "posession" of a touch—
    at this point, you will get a [gestureName]Start event.
    
    You do not have to call gestureTouchStart immediately; you can call it
    at any time. This allows you to avoid passing control until _after_ you
    have determined your own touchStart, touchesDragged, and touchEnd methods
    are not going to handle it.
  */
  touchStart: function(touch) {
    this.gestureTouchStart(touch);
  },
  
  /**
    Tells the gesture recognizing code about touches moving.
    
    If you override touchesDragged, you will need to call gestureTouchesDragged
    (at least for any touches you called gestureTouchStart for in touchStart) to 
    allow the gesture system to update.
  */
  touchesDragged: function(evt, touches) {
    this.gestureTouchesDragged(evt, touches);
  },
  
  /**
    Tells the gesture recognizing code about a touch ending.
    
    If you override touchEnd, you will need to call gestureTouchEnd
    for any touches you called touchStart for.
  */
  touchEnd: function(touch) {
    this.gestureTouchEnd(touch);
  },
  
  /**
    Tells the gesture recognizing system about a new touch.
    
    This informs all gestures that a new touch, "unassigned" to any gesture,
    has been located. Later, each gesture has an opportunity to claim the touch.
    
    Once they have claimed the touch, further events will go _directly_ to them—
    this view will cease receiving the touchesDragged and will not receive a touchEnd.
  */
  gestureTouchStart: function(touch) {
    touch.isInteresting = 0;
    
    var gestures = this.get("gestures"), idx, len = gestures.length, g;
    for (idx = 0; idx < len; idx++) {
      g = gestures[idx];
      g.unassignedTouchDidStart(touch);
    }
  },
  
  /**
    Tells the gesture recognition system that some touches have moved.
    
    This informs all gestures that these touches have changed. All such touches
    are "unassigned" because all "assigned" touches already get sent directly
    to the gesture.
  */
  gestureTouchesDragged: function(evt, touches) {
    var gestures = this.get("gestures"), idx, len = gestures.length, g;
    for (idx = 0; idx < len; idx++) {
      g = gestures[idx];
      g.unassignedTouchesDidChange(evt, touches);
    }
  },
  
  /**
    Tells the gesture recognition system that a touch have ended.
    
    This informs all of the gestures that the touch ended. The touch is
    an unassigned touch as, if it were assigned to a gesture, it would have
    been sent directly to the gesture, bypassing this view.
  */
  gestureTouchEnd: function(touch) {
    var gestures = this.get("gestures"), idx, len = gestures.length, g;
    for (idx = 0; idx < len; idx++) {
      g = gestures[idx];
      g.unassignedTouchDidEnd(touch);
    }
  }
};
/* >>>>>>>>>> BEGIN source/mixins/inline_editable.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  This mixin is used for views that show a seperate editor view to edit. If your view is itself editable, use SC.Editable.
  
  To use this, you must also implement an InlineEditorDelegate to manage the editor view and an InlineEditableDelegate to manage the result of editing. For simplicity these may all be implemented by your view itself, but for more complex views or editors they should be kept seperate.
*/
// TODO: ask juan if this should be combined with SC.Editable
SC.InlineEditable = {
  
  editorDelegate: null,
  /**
    Enables editing using the inline editor.
  */
  isEditable: YES,

  /**
    YES if currently editing label view.
  */
  isEditing: NO,
  
  /**
    Opens the inline text editor (closing it if it was already open for 
    another view).
    
    @return {Boolean} YES if did begin editing
  */
  beginEditing: function() {
    if(this.get('isEditing')) return YES;
    
    return this.invokeDelegateMethod(this.get('editorDelegate'), 'beginEditingFor', this, this.get('value'));
  },
  
  /**
    Cancels the current inline editor and then exits editor. 
    
    @return {Boolean} NO if the editor could not exit.
  */
  discardEditing: function() {
    if (!this.get('isEditing')) return YES;
    
    return this.invokeDelegateMethod(this.get('editorDelegate'), 'discardEditingFor', this);
  },
  
  /**
    Commits current inline editor and then exits editor.
    
    @return {Boolean} NO if the editor could not exit
  */
  commitEditing: function() {
    if (!this.get('isEditing')) return YES;
    
    return this.invokeDelegateMethod(this.get('editorDelegate'), 'commitEditingFor', this);
  },
  
  /** @private
    Set editing to true so edits will no longer be allowed.
  */
  inlineEditorWillBeginEditing: function(editor) {
    this.set('isEditing', YES);
  },

  /** @private 
    Hide the label view while the inline editor covers it.
  */
  inlineEditorDidBeginEditing: function(editor) {
    return YES;
  },
  
  // TODO: use validator
  inlineEditorShouldCommitEditing: function(editor, finalValue) {
    this.setIfChanged('value', finalValue) ;
    return YES;
  },
  
  /** @private
    Update the field value and make it visible again.
  */
  inlineEditorDidEndEditing: function(editor, finalValue) {
    this.inlineEditorShouldCommitEditing(editor, finalValue);
    this.set('isEditing', NO) ;
    return YES;
  }
};

/* >>>>>>>>>> BEGIN source/mixins/inline_editor_delegate.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  This delegate controls the editing capability of a view. It allows you to customize when a view that uses it is allowed to begin and end editing, as well as the type of editor it uses.
  
  By default it edits an SC.LabelView using an SC.InlineTextFieldView.
  
  @since SproutCore 1.0
*/
SC.InlineEditorDelegate = {
  // quack
  isInlineEditorDelegate: YES,

  /**
    The exampleInlineTextFieldView property is by default a 
    SC.InlineTextFieldView but it can be set to a customized inline text field
    view.

    @property
    @type {SC.View}
    @default {SC.InlineTextFieldView}
  */
  exampleInlineTextFieldView: SC.InlineTextFieldView,
  
  inlineEditorClassName: null,

  /**
    If you want the inline editor to be multiline set this property to YES.
  
    @type {Boolean}
    @default {NO}
  */
  isInlineEditorMultiline: NO,

  /**
    Call to tell the delegate to begin editing the given view. Returns YES if it was able to begin editing.
  
    @param {SC.View} the view the user is trying to edit
    @param {Object} the current value of the view
    @returns {Boolean} YES if the view began editing
  */
  beginEditingFor: function(view, startingValue) {
    if(!view.get('isEditable')) return NO;
    if(view.get('isEditing')) return YES;
    
    var el = view.$(),
        value = view.get('value') || '',
        f = SC.viewportOffset(el[0]),
        frameTemp = view.convertFrameFromView(view.get('frame'), null),
        exampleEditor = this.get('exampleInlineTextFieldView');
        f.width=frameTemp.width;
        f.height=frameTemp.height;
    
    view.inlineEditorWillBeginEditing();
    
    exampleEditor.beginEditing({
      pane: view.get('pane'),
      frame: f,
      layout: view.get('layout'),
      exampleInlineTextFieldView: exampleEditor,
      delegate: this,
      inlineEditorClassName: this.get('inlineEditorClassName'),
      exampleElement: el,
      value: startingValue,
      multiline: this.get('isInlineEditorMultiline'),
      isCollection: NO
    });
    
    exampleEditor.editor._target = view;
  },

  /**
    The view the editor view should attach itself to as child. For example if you are editing a row of a formview inside a scrollview, you should attach to the scrollview's containerview or the formview's div, not the label itself. This way you will scroll with the target view but also be above it so editors can reuse views.
  
    @param {SC.View} the view attempting to begin editing
    @returns {SC.View} the view that the editor should be a child of
  */
  parentViewForEditor: function(view) {
    return view.get('parentView');
  },

  /**
    Called to tell the editor associated with the given view that the user wants to end editing and save their changes.
  
    @param {SC.View} the view whose edit mode is being commited
    @param {Object} the current value of the view
    @returns {Boolean} YES if the editor was able to end and commit
  */
  commitEditingFor: function(view) {
    if(!view.get('isEditing')) return NO;
    
    // TODO: figure out how a validator works without a form
    return SC.InlineTextFieldView.commitEditing();
  },
  
  /**
    Called to tell the editor associated with the given view that the user wants to end editing and discard their changes.
  
    @param {SC.View} the view whose edit mode is ending
    @param {Object} the current value of the view
    @returns {Boolean} YES if the editor was able to end
  */
  discardEditingFor: function(view) {
    if(!view.get('isEditing')) return NO;
    
    return SC.InlineTextFieldView.discardEditing();
  },
  
  /*************
    Calls from the editor to the view
    These only have did, not will, because the delegate decides what to do with them.
  *************/
  // notify the view that its editor began editing
  inlineEditorDidBeginEditing: function(editor) {
    var view = editor._target;

    return view.inlineEditorDidBeginEditing(editor);
  },
  
  // returns true if the finalvalue is valid, false otherwise
  // this is seperate function from inlineEditorDidCommitEditing because it could just be validiting without actually commiting, for example if a field validates as you type
  inlineEditorShouldCommitEditing: function(editor, finalValue) {
    var view = editor._target;
    
    return view.inlineEditorShouldCommitEditing(editor, finalValue);
  },
  
  // ask the view if finalvalue is valid, and then commit it and cleanup the editor
  inlineEditorDidEndEditing: function(editor, finalValue) {
    var view = editor._target;
    
    return view.inlineEditorDidEndEditing(editor, finalValue);
  }
};

/* >>>>>>>>>> BEGIN source/mixins/validatable.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace

  Views that include the Validatable mixin can be used with validators to 
  ensure their values are valid.  
  
*/
SC.Validatable = {
  
  /** @private */
  initMixin: function() {
    this._validatable_validatorDidChange() ;
  },
  
  /**
    The validator for this field.  
  
    Set to a validator class or instance.  If this points to a class, it will 
    be instantiated when the validator is first used.
    
    @property {SC.Validator}
  */
  validator: null,

  /**
    This property must return the human readable name you want used when 
    describing an error condition.  For example, if set this property to
    "Your Email", then the returned error string might be something like
    "Your Email is not valid".
    
    You can return a loc string here if you like.  It will be localized when
    it is placed into the error string.
    
    @property {String}
  */
  errorLabel: null,

  /**
    YES if the receiver is currently valid.
    
    This property watches the value property by default.  You can override
    this property if you want to use some other method to calculate the
    current valid state.
    
    @property {Boolean}
  */
  isValid: function() { 
    return SC.typeOf(this.get('value')) !== SC.T_ERROR; 
  }.property('value'),
  
  /**
    The form that the view belongs to.  May be null if the view does not 
    belong to a form.  This property is usually set automatically by an 
    owner form view.
    
    @property {SC.View}
  */
  ownerForm: null,
  
  /**
    Attempts to validate the receiver. 
    
    Runs the validator and returns SC.VALIDATE_OK, SC.VALIDATE_NO_CHANGE,
    or an error object.  If no validator is installed, this method will
    always return SC.VALIDATE_OK.

    @param {Boolean} partialChange YES if this is a partial edit.
    @returns {String} SC.VALIDATE_OK, error, or SC.VALIDATE_NO_CHANGE
  */
  performValidate: function(partialChange) {
    var ret = SC.VALIDATE_OK ;

    if (this._validator) {
      var form = this.get('ownerForm') ;
      if (partialChange) {
        ret = this._validator.validatePartial(form,this) ;

        // if the partial returned NO_CHANGE, then check to see if the 
        // field is valid anyway.  If it is not valid, then don't update the
        // value.  This way the user can have partially constructed values 
        // without the validator trying to convert it to an object.
        if ((ret == SC.VALIDATE_NO_CHANGE) && (this._validator.validateChange(form, this) == SC.VALIDATE_OK)) {
          ret = SC.VALIDATE_OK; 
        }
      } else ret = this._validator.validateChange(form, this) ;
    }
    return ret ;
  },

  /**
    Runs validateSubmit.  You should use this in your implementation of 
    validateSubmit.  If no validator is installed, this always returns
    SC.VALIDATE_OK
    
    @returns {String}
  */
  performValidateSubmit: function() {
    return this._validator ? this._validator.validateSubmit(this.get('ownerForm'), this) : SC.VALIDATE_OK;
  },
  
  /**
    Runs a keypress validation.  Returns YES if the keypress should be 
    allowed, NO otherwise.  If no validator is defined, always returns YES.
    
    @param {String} charStr the key string
    @returns {Boolean}
  */
  performValidateKeyDown: function(evt) {
    // ignore anything with ctrl or meta key press
    var charStr = evt.getCharString();
    if (!charStr) return YES ;
    return this._validator ? this._validator.validateKeyDown(this.get('ownerForm'), this, charStr) : YES;
  },
  
  /**
    Returns the validator object, if one has been created.
    
    @property {SC.Validator}
  */
  validatorObject: function() {
    return this._validator;
  }.property(),
  
  /**
    Invoked by the owner form just before submission.  Override with your 
    own method to commit any final changes after you perform validation. 
    
    The default implementation simply calls performValidateSubmit() and 
    returns that value.
    
    @property {Boolean}
  */
  validateSubmit: function() { return this.performValidateSubmit(); },
  
  /**
    Convert the field value string into an object.
    
    This method will call the validators objectForFieldValue if it exists.
    
    @param {Object} fieldValue the raw value from the field.
    @param {Boolean} partialChange
    @returns {Object}
  */
  objectForFieldValue: function(fieldValue, partialChange) {
    return this._validator ? this._validator.objectForFieldValue(fieldValue, this.get('ownerForm'), this) : fieldValue ;
  },
  
  /**
    Convert the object into a field value.
    
    This method will call the validator's fieldValueForObject if it exists.
    
    @param object {Object} the objec to convert
    @returns {Object}
  */
  fieldValueForObject: function(object) {
    return this._validator ? this._validator.fieldValueForObject(object, this.get('ownerForm'), this) : object ;
  },
  
  _validatable_displayObserver: function() {
    this.displayDidChange();
  }.observes('isValid'),

  /** @private */
  renderMixin: function(context) {
    context.setClass('invalid', !this.get('isValid'));
  },

  // invoked whenever the attached validator changes.
  _validatable_validatorDidChange: function() {
    var form = this.get('ownerForm') ;
    var val = SC.Validator.findFor(form, this, this.get('validator')) ;
    if (val != this._validator) {
      this.propertyWillChange('validatorObject');
      if (this._validator) this._validator.detachFrom(form, this) ;
      this._validator = val;
      if (this._validator) this._validator.attachTo(form, this) ;
      this.propertyDidChange('validatorObject');
    }  
  }.observes('validator', 'ownerForm')
      
};

/* >>>>>>>>>> BEGIN source/views/field.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('mixins/validatable') ;

/** @class

  Base view for managing a view backed by an input element.  Since the web
  browser provides native support for editing input elements, this view
  provides basic support for listening to changes on these input elements and
  responding to them.
  
  Generally you will not work with a FieldView directly.  Instead, you should
  use one of the subclasses implemented by your target platform such as 
  SC.CheckboxView, SC.RadioView, SC.TextFieldView, and so on.
  
  @extends SC.View
  @extends SC.Control
  @extends SC.Validatable
  @since SproutCore 1.0
*/
SC.FieldView = SC.View.extend(SC.Control, SC.Validatable,
/** @scope SC.FieldView.prototype */ {
  
  /**
     If YES then we use textarea instead of input. 
     WARNING: Use only with textField** Juan
  */
  isTextArea: NO,

  _field_isMouseDown: NO,

  /**
    The raw value of the field itself.  This is computed from the 'value'
    property by passing it through any validator you might have set.  This is 
    the value that will be set on the field itself when the view is updated.
    
    @property {String}
  */  
  fieldValue: function() {
    var value = this.get('value');
    if (SC.typeOf(value) === SC.T_ERROR) value = value.get('errorValue');
    return this.fieldValueForObject(value);
  }.property('value', 'validator').cacheable(),

  // ..........................................................
  // PRIMITIVES
  // 
  
  /**
    Override to return an CoreQuery object that selects the input elements
    for the view.  If this method is defined, the field view will 
    automatically edit the attrbutes of the input element to reflect the 
    current isEnabled state among other things.
  */
  $input: function() { 
    if(this.get('isTextArea')){
      return this.$('textarea').andSelf().filter('textarea'); 
    }else{
      return this.$('input').andSelf().filter('input');
    }
  },
  
  /**
    Override to set the actual value of the field.
    
    The default implementation will simple copy the newValue to the value
    attribute of any input tags in the receiver view.  You can override this
    method to provide specific functionality needed by your view.
    
    @param {Object} newValue the value to display.
    @returns {SC.FieldView} receiver
  */
  setFieldValue: function(newValue) {
    if (SC.none(newValue)) newValue = '' ;
    var input = this.$input();
    
    // Don't needlessly set the element if it already has the value, because
    // doing so moves the cursor to the end in some browsers.
    if (input.val() !== newValue) {
      input.val(newValue);
    }
    return this ;
  },
  
  /**
    Override to retrieve the actual value of the field.
    
    The default implementation will simply retrieve the value attribute from
    the first input tag in the receiver view.
    
    @returns {String} value
  */
  getFieldValue: function() {
    return this.$input().val();
  },
  
  _field_fieldValueDidChange: function(evt) {
    SC.run(function() {
      this.fieldValueDidChange(NO);      
    }, this);
  },
  
  /**
    Your class should call this method anytime you think the value of the 
    input element may have changed.  This will retrieve the value and update
    the value property of the view accordingly.
    
    If this is a partial change (i.e. the user is still editing the field and
    you expect the value to change further), then be sure to pass YES for the
    partialChange parameter.  This will change the kind of validation done on
    the value.  Otherwise, the validator may mark the field as having an error
    when the user is still in mid-edit.
  
    @param partialChange (optional) YES if this is a partial change.
    @returns {Boolean|SC.Error} result of validation.
  */
  fieldValueDidChange: function(partialChange) {
    // collect the field value and convert it back to a value
    var fieldValue = this.getFieldValue();
    var value = this.objectForFieldValue(fieldValue, partialChange);
    this.setIfChanged('value', value);


    // ======= [Old code -- left here for concept reminders. Basic validation
    // API works without it] =======

    // validate value if needed...
    
    // this.notifyPropertyChange('fieldValue');
    // 
    // // get the field value and set it.
    // // if ret is an error, use that instead of the field value.
    // var ret = this.performValidate ? this.performValidate(partialChange) : YES;
    // if (ret === SC.VALIDATE_NO_CHANGE) return ret ;
    // 
    // this.propertyWillChange('fieldValue');
    // 
    // // if the validator says everything is OK, then in addition to posting
    // // out the value, go ahead and pass the value back through itself.
    // // This way if you have a formatter applied, it will reformat.
    // //
    // // Do this BEFORE we set the value so that the valueObserver will not
    // // overreact.
    // //
    // var ok = SC.$ok(ret);
    // var value = ok ? this._field_getFieldValue() : ret ;
    // if (!partialChange && ok) this._field_setFieldValue(value) ;
    // this.set('value',value) ;
    // 
    // this.propertyDidChange('fieldValue');
    // 
    // return ret ;
  },
  
  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private
    invoked when the value property changes.  Sets the field value...
  */
  _field_valueDidChange: function() {
    this.setFieldValue(this.get('fieldValue'));
  }.observes('fieldValue'),

  /** @private
    after the layer is created, set the field value and observe events
  */
  didCreateLayer: function() {
    this.setFieldValue(this.get('fieldValue'));
    SC.Event.add(this.$input(), 'change', this, this._field_fieldValueDidChange) ;
  },

  /** @private
    after the layer is append to the doc, set the field value and observe events
    only for textarea.
  */
  didAppendToDocument: function() {
    if (this.get('isTextArea')) {
      this.setFieldValue(this.get('fieldValue'));
      SC.Event.add(this.$input(), 'change', this, this._field_fieldValueDidChange) ;
    }
  },
  
  willDestroyLayer: function() {
    SC.Event.remove(this.$input(), 'change', this, this._field_fieldValueDidChange); 
  },
  
  // ACTIONS
  // You generally do not need to override these but they may be used.

  /**
    Called to perform validation on the field just before the form 
    is submitted.  If you have a validator attached, this will get the
    validators.
  */  
  // validateSubmit: function() {
  //   var ret = this.performValidateSubmit ? this.performValidateSubmit() : YES;
  //   // save the value if needed
  //   var value = SC.$ok(ret) ? this._field_getFieldValue() : ret ;
  //   if (value != this.get('value')) this.set('value', value) ;
  //   return ret ;
  // },
  
  // OVERRIDE IN YOUR SUBCLASS
  // Override these primitives in your subclass as required.
  
  /**
    Allow the browser to do its normal event handling for the mouse down
    event.  But first, set isActive to YES.
  */
  mouseDown: function(evt) {  
    this._field_isMouseDown = YES;
    evt.allowDefault(); 
    return YES; 
  },
  
  /** @private
    Remove the active class on mouseExited if mouse is down.
  */  
  mouseExited: function(evt) {
    if (this._field_isMouseDown) this.set('isActive', NO);
    evt.allowDefault();
    return YES;
  },
  
  /** @private
    If mouse was down and we renter the button area, set the active state again.
  */  
  mouseEntered: function(evt) {
    this.set('isActive', this._field_isMouseDown);
    evt.allowDefault();
    return YES;
  },
  
  /** @private
    on mouse up, remove the isActive class and then allow the browser to do
    its normal thing.
  */  
  mouseUp: function(evt) {
    // track independently in case isEnabled has changed
    if (this._field_isMouseDown) this.set('isActive', NO); 
    this._field_isMouseDown = NO;
    evt.allowDefault();
    return YES ;
  },
  
  /** @private
    Simply allow keyDown & keyUp to pass through to the default web browser
    implementation.
  */
  keyDown: function(evt) {

    // handle tab key
    if (evt.which === 9 || evt.keyCode===9) {
      var view = evt.shiftKey ? this.get('previousValidKeyView') : this.get('nextValidKeyView');
      if (view) view.becomeFirstResponder();
      else evt.allowDefault();
      return YES ; // handled
    }
    
    // validate keyDown...
    if (this.performValidateKeyDown(evt)) {
      this._isKeyDown = YES ;
      evt.allowDefault(); 
    } else {
      evt.stop();
    }
    
    return YES; 
  },
  
  /** tied to the isEnabled state */
  acceptsFirstResponder: function() {
    if(!SC.SAFARI_FOCUS_BEHAVIOR) return this.get('isEnabled');
    else return NO;
  }.property('isEnabled'),
  
  willBecomeKeyResponderFrom: function(keyView) {
    // focus the text field.
    if (!this._isFocused) {
      this._isFocused = YES ;
      this.becomeFirstResponder();
      if (this.get('isVisibleInWindow')) {
        this.$input()[0].focus();
      }
    }
  },
  
  willLoseKeyResponderTo: function(responder) {
    if (this._isFocused) this._isFocused = NO ;
  },
    
  // these methods use the validator to convert the raw field value returned
  // by your subclass into an object and visa versa.
  _field_setFieldValue: function(newValue) {
    this.propertyWillChange('fieldValue');
    if (this.fieldValueForObject) {
      newValue = this.fieldValueForObject(newValue) ;
    }
    var ret = this.setFieldValue(newValue) ;
    this.propertyDidChange('fieldValue');
    return ret ;
  },
  
  _field_getFieldValue: function() {
    var ret = this.getFieldValue() ;
    if (this.objectForFieldValue) ret = this.objectForFieldValue(ret);
    return ret ;
  }
  
});


/* >>>>>>>>>> BEGIN source/system/text_selection.js */
// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @class
  
  A simple object representing the selection inside a text field.  Each
  object is frozen and contains exactly three properties:
  
    *  start
    *  end
    *  length
  
  Important note:  In Internet Explorer, newlines in textara elements are
  considered two characters.  SproutCore does not currently try to hide this from you.
  
  @extends SC.Object
  @extends SC.Copyable
  @extends SC.Freezable
  @since SproutCore 1.0
*/

SC.TextSelection = SC.Object.extend(SC.Copyable, SC.Freezable,
/** @scope SC.TextSelection.prototype */ {  

  /**
    The number of characters appearing to the left of the beginning of the
    selection, starting at 0.
    
    @type {Number}
  */
  start: -1,
  
  
  /**
    The number of characters appearing to the left of the end of the
    selection.

    This will have the same value as 'start' if there is no selection and
    instead there is only a caret.
    
    @type {Number}
  */
  end: -1,
 
   
  /**
    The length of the selection.  This is equivalent to (end - start) and
    exists mainly as a convenience.
    
    @property {Number}
  */
  length: function() {
    var start = this.get('start') ;
    var end   = this.get('end') ;
    if ((start) === -1  ||  (end === -1)) {
      return -1 ;
    }
    else {
      return end - start ;
    }
  }.property('start', 'end').cacheable(),
  
  
  
  // ..........................................................
  // INTERNAL SUPPORT
  //
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this.freeze();
  },
  
  
  copy: function() {
    return SC.TextSelection.create({
      start: this.get('start'),
      end:   this.get('end')
    });
  },
  
  
  toString: function() {
    var length = this.get('length');
    if (length  &&  length > 0) {
      if (length === 1) {
        return "[%@ character selected: {%@, %@}]".fmt(length, this.get('start'), this.get('end'));
      }
      else {
        return "[%@ characters selected: {%@, %@}]".fmt(length, this.get('start'), this.get('end'));
      }
    }
    else {
      return "[no text selected; caret at %@]".fmt(this.get('start'));
    }
  }

}) ;

/* >>>>>>>>>> BEGIN source/mixins/static_layout.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace 

  __NOTE:__ SC.StaticLayout is now built in to SC.View.  You do not need to 
  apply this mixin to use static layout.  Just set useStaticLayout to YES.
  
  Normally, SproutCore views use absolute positioning to display themselves
  on the screen.  While this is both the fastest and most efficient way to 
  display content in the web browser, sometimes your user interface might need
  to take advantage of the more advanced "flow" layout offered by the browser
  when you use static and relative positioning.
  
  This mixin can be added to a view class to enable the use of any kind of 
  static and relative browser positionining.  In exchange for using static
  layout, you will lose a few features that are normally available on a view
  class such as the 'frame' and 'clippingFrame' properties as well as 
  notifications when your view or parentView are resized.
  
  Normally, if you are allowing the browser to manage the size and positioning
  of your view, these feature will not be useful to your code anyway.
  
  h2. Using StaticLayout
  
  To enable static layout on your view, just include this mixin on the view.
  SproutCore's builtin views that are capable of being used in static 
  layouts already incorporate this mixin.  Then set the "useStaticLayout" 
  property on your view class to YES.
  
  You can then use CSS or the render() method on your view to setup the 
  positioning on your view using any browser layout mechanism you want.
  
  h2. Example
  
  {{{
    
    // JavaScript
    
    MyApp.CommentView = SC.View.extend(SC.StaticLayout, {
    
      classNames: ['comment-view'],
      
      useStaticLayout: YES,

      ...
    });
    
    // CSS
    
    .comment-view {
      display: block;
      position: relative;
    }
    
  }}}
  
  @deprecated
  @since SproutCore 1.0
*/
SC.StaticLayout = {
  
  /**
    Walk like a duck.  Used to determine that this mixin has been applied.  
    Note that a view that hasStaticLayout still may not actually use static
    layout unless useStaticLayout is also set to YES.
    
    @property {Boolean}
  */
  hasStaticLayout: YES
  
};

/* >>>>>>>>>> BEGIN source/views/text_field.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/field') ;
sc_require('system/text_selection') ;
sc_require('mixins/static_layout') ;
sc_require('mixins/editable');

/**
  @class

  A text field is an input element with type "text".  This view adds support
  for hinted values, etc.

  @extends SC.FieldView
  @extends SC.Editable
  @author Charles Jolley
*/
SC.TextFieldView = SC.FieldView.extend(SC.StaticLayout, SC.Editable,
/** @scope SC.TextFieldView.prototype */ {

  tagName: 'label',
  classNames: ['sc-text-field-view'],
  isTextField: YES,

  // ..........................................................
  // PROPERTIES
  //

  applyImmediately: YES,

  /**
    If YES, the field will hide its text from display. The default value is NO.
  */
  isPassword: NO,

  /**
    If YES then allow multi-line input.  This will also change the default
    tag type from "input" to "textarea".  Otherwise, pressing return will
    trigger the default insertion handler.
  */
  isTextArea: NO,

  /**
    The hint to display while the field is not active.  Can be a loc key.
  */
  hint: '',

  /**
    If YES then the text field is currently editing.
  */
  isEditing: NO,
  
  hintON:YES,
  
  /**
    If you set this property to false the tab key won't trigger its default 
    behavior (tabbing to the next field).
  */
  defaultTabbingEnabled:YES,
  
  /**
    Enabled context menu for textfields.
  */
  isContextMenuEnabled: YES,

  /**
    If true, every change to the text in the text field updates 'value'.
    If false, 'value' is only updated when commitEditing() is called (this
    is called automatically when the text field loses focus), or whenever
    the return key is pressed while editing the field.
  */
  continuouslyUpdatesValue: YES,

  /**
    If no, will not allow transform or validation errors (SC.Error objects)
    to be passed to 'value'.  Upon focus lost, the text field will revert
    to its previous value.
  */
  allowsErrorAsValue: YES,

  /**
    An optional view instance, or view class reference, which will be visible
    on the left side of the text field.  Visually the accessory view will look
    to be inside the field but the text editing will not overlap the accessory
    view.

    The view will be rooted to the top-left of the text field.  You should use
    a layout with 'left' and/or 'top' specified if you would like to adjust
    the offset from the top-left.

    One example use would be for a web site's icon, found to the left of the
    URL field, in many popular web browsers.

    Note:  If you set a left accessory view, the left padding of the text
    field (really, the left offset of the padding element) will automatically
    be set to the width of the accessory view, overriding any CSS you may have
    defined on the "padding" element.  If you would like to customize the
    amount of left padding used when the accessory view is visible, make the
    accessory view wider, with empty space on the right.
  */
  leftAccessoryView: null,

  /**
    An optional view instance, or view class reference, which will be visible
    on the right side of the text field.  Visually the accessory view will
    look to be inside the field but the text editing will not overlap the
    accessory view.

    The view will be rooted to the top-right of the text field.  You should
    use a layout with 'right' and/or 'top' specified if you would like to
    adjust the offset from the top-right.  If 'left' is specified in the
    layout it will be cleared.

    One example use would be for a button to clear the contents of the text
    field.

    Note:  If you set a right accessory view, the right padding of the text
    field (really, the right offset of the padding element) will automatically
    be set to the width of the accessory view, overriding any CSS you may have
    defined on the "padding" element.  If you would like to customize the
    amount of right padding used when the accessory view is visible, make the
    accessory view wider, with empty space on the left.
  */
  rightAccessoryView: null,
  
  
  /**
    This property will enable disable HTML5 spell checking if available on the 
    browser. As of today Safari 4+, Chrome 3+ and Firefox 3+ support it  
  */
    
  spellCheckEnabled: YES,
  
  maxLength: 5096,
  
  
  _isFocused: NO,
  
  
  init:function(){
    var hintStatus = this.get('hintON'),
        val = this.get('value');
    if(!val || val && val.length===0) this.set('hintON', YES);
    else this.set('hintON', NO);
    return arguments.callee.base.apply(this,arguments);
  },

  /** isEditable maps to isEnabled with a TextField. */
  isEditable: function() {
    return this.get('isEnabled') ;
  }.property('isEnabled').cacheable(),

  /**
    The current selection of the text field, returned as an SC.TextSelection
    object.

    Note that if the selection changes a new object will be returned -- it is
    not the case that a previously-returned SC.TextSelection object will
    simply have its properties mutated.

    @property {SC.TextSelection}
  */
  selection: function(key, value) {
    var element = this.$input()[0],
        range, start, end;

    // Are we being asked to set the value, or return the current value?
    if (value === undefined) {
      // The client is retrieving the value.
      if (element) {
        start = null;
        end = null;

        if (!element.value) {
          start = end = 0 ;
        }
        else {
          // In IE8, input elements don't have hasOwnProperty() defined.
          try{
            if ('selectionStart' in element) {
              start = element.selectionStart ;
            }
            if ('selectionEnd' in element) {
              end = element.selectionEnd ;
            }
          }
          // In Firefox when you ask the selectionStart or End of a hidden 
          // input, sometimes it throws a weird error.
          // Adding this to just ignore it.
          catch (e){
            return null;
          }

          // Support Internet Explorer.
          if (start === null  ||  end === null ) {
            var selection = document.selection ;
            if (selection) {
              var type = selection.type ;
              if (type  &&  (type === 'None'  ||  type === 'Text')) {
                range = selection.createRange() ;

                if (!this.get('isTextArea')) {
                  // Input tag support.  Figure out the starting position by
                  // moving the range's start position as far left as possible
                  // and seeing how many characters it actually moved over.
                  var length = range.text.length ;
                  start = Math.abs(range.moveStart('character', 0 - (element.value.length + 1))) ;
                  end = start + length ;
                }
                else {
                  // Textarea support.  Unfortunately, this case is a bit more
                  // complicated than the input tag case.  We need to create a
                  // "dummy" range to help in the calculations.
                  var dummyRange = range.duplicate() ;
                  dummyRange.moveToElementText(element) ;
                  dummyRange.setEndPoint('EndToStart', range) ;
                  start = dummyRange.text.length ;
                  end = start + range.text.length ;
                }
              }
            }
          }
        }
        return SC.TextSelection.create({ start:start, end:end }) ;
      }
      else {
        return null;
      }
    }
    else {
      // The client is setting the value.  Make sure the new value is a text
      // selection object.
      if (!value  ||  !value.kindOf  ||  !value.kindOf(SC.TextSelection)) {
        throw "When setting the selection, you must specify an SC.TextSelection instance.";
      }

      if (element) {
        if (element.setSelectionRange) {
          element.setSelectionRange(value.get('start'), value.get('end')) ;
        }
        else {
          // Support Internet Explorer.
          range = element.createTextRange() ;
          start = value.get('start') ;
          range.move('character', start) ;
          range.moveEnd('character', value.get('end') - start) ;
          range.select() ;
        }
      }
      return value;
    }

    // Implementation note:
    // There are certain ways users can add/remove text that we can't identify
    // via our key/mouse down/up handlers (such as the user choosing Paste
    // from a menu).  So that's why we need to update our 'selection' property
    // whenever the field's value changes.
  }.property('fieldValue').cacheable(),

  // ..........................................................
  // INTERNAL SUPPORT
  //

  displayProperties: 'hint fieldValue isEditing leftAccessoryView rightAccessoryView isTextArea'.w(),

  createChildViews: function() {
    arguments.callee.base.apply(this,arguments);
    this.accessoryViewObserver();
  },

  acceptsFirstResponder: function() {
    return this.get('isEnabled');
  }.property('isEnabled'),

  accessoryViewObserver: function() {
    var classNames,
        viewProperties = ['leftAccessoryView', 'rightAccessoryView'],
        len = viewProperties.length , i, viewProperty, previousView, 
        accessoryView;
        
    for (i=0; i<len; i++) {
      viewProperty = viewProperties[i] ;

      // Is there an accessory view specified?
      previousView = this['_'+viewProperty] ;
      accessoryView = this.get(viewProperty) ;

      // If the view is the same, there's nothing to do.  Otherwise, remove
      // the old one (if any) and add the new one.
      if (! (previousView
             &&  accessoryView
             &&  (previousView === accessoryView) ) ) {

        // If there was a previous previous accessory view, remove it now.
        if (previousView) {
          // Remove the "sc-text-field-accessory-view" class name that we had
          // added earlier.
          classNames = previousView.get('classNames') ;
          classNames = classNames.without('sc-text-field-accessory-view') ;
          previousView.set('classNames', classNames) ;
          this.removeChild(previousView) ;
          previousView = null ;
          this['_'+viewProperty] = null ;
        }

        // If there's a new accessory view to add, do so now.
        if (accessoryView) {
          // If the user passed in a class rather than an instance, create an
          // instance now.
          if (accessoryView.isClass) {
            accessoryView = accessoryView.create({
              layoutView: this
            }) ;
          }

          // Add in the "sc-text-field-accessory-view" class name so that the
          // z-index gets set correctly.
          classNames = accessoryView.get('classNames') ;
          var className = 'sc-text-field-accessory-view' ;
          if (classNames.indexOf(className) < 0) {
            classNames = SC.clone(classNames);
            classNames.push(className) ;
            accessoryView.set('classNames', classNames);
          }

          // Actually add the view to our hierarchy and cache a reference.
          this.appendChild(accessoryView) ;
          this['_'+viewProperty] = accessoryView ;
        }
      }
    }
  }.observes('leftAccessoryView', 'rightAccessoryView'),

  layoutChildViewsIfNeeded: function(isVisible) {
    // For the right accessory view, adjust the positioning such that the view
    // is right-justified, unless 'right' is specified.
    if (!isVisible) isVisible = this.get('isVisibleInWindow') ;
    if (isVisible && this.get('childViewsNeedLayout')) {
      var rightAccessoryView = this.get('rightAccessoryView') ;
      if (rightAccessoryView  &&  rightAccessoryView.get) {
        var layout = rightAccessoryView.get('layout') ;
        if (layout) {
          // Clear out any 'left' value.
          layout.left = null;

          // Unless the user specified a 'right' value, specify a default to
          // right-justify the view.
          if (!layout.right) layout.right = 0 ;

          rightAccessoryView.adjust({ layout: layout }) ;
        }
      }
    }
    arguments.callee.base.apply(this,arguments) ;
  },

  render: function(context, firstTime) {
    arguments.callee.base.apply(this,arguments) ;
    var v, accessoryViewWidths, leftAdjustment, rightAdjustment;

    // always have at least an empty string
    v = this.get('fieldValue');
    if (SC.none(v)) v = '';
    v = String(v);

    // update layer classes always
    context.setClass('not-empty', v.length > 0);

    // If we have accessory views, we'll want to update the padding on the
    // hint to compensate for the width of the accessory view.  (It'd be nice
    // if we could add in the original padding, too, but there's no efficient
    // way to do that without first rendering the element somewhere on/off-
    // screen, and we don't want to take the performance hit.)
    accessoryViewWidths = this._getAccessoryViewWidths() ;
    leftAdjustment  = accessoryViewWidths['left'] ;
    rightAdjustment = accessoryViewWidths['right'] ;

    if (leftAdjustment)  leftAdjustment  += 'px' ;
    if (rightAdjustment) rightAdjustment += 'px' ;

   this._renderField(context, firstTime, v, leftAdjustment, rightAdjustment) ;
    if(SC.browser.mozilla) this.invokeLast(this._applyFirefoxCursorFix);
  },

  /**
    If isTextArea is changed (this might happen in inlineeditor constantly)
    force the field render to render like the firsttime to avoid writing extra
    code. This can be useful also 
  */
  _forceRenderFirstTime: NO,
    
  _renderFieldLikeFirstTime: function(){
    this.set('_forceRenderFirstTime', YES);
  }.observes('isTextArea'),
  
  shouldRenderBorder: YES,
  
  _renderField: function(context, firstTime, value, leftAdjustment, rightAdjustment) {
    // TODO:  The cleanest thing might be to create a sub- rendering context
    //        here, but currently SC.RenderContext will render sibling
    //        contexts as parent/child.

    var hint = this.get('hint'), disabled, name, adjustmentStyle, type, 
        hintElements, element, paddingElementStyle, fieldClassNames,
        spellCheckEnabled=this.get('spellCheckEnabled'), spellCheckString,
        maxLength = this.get('maxLength'), isOldSafari;
        
    context.setClass('text-area', this.get('isTextArea'));
    
    //Adding this to differentiate between older and newer versions of safari
    //since the internal default field padding changed 
    isOldSafari= (parseInt(SC.browser.safari,0)<532);
    context.setClass('oldWebKitFieldPadding', isOldSafari);
    
    spellCheckString = spellCheckEnabled ? ' spellcheck="true"' : ' spellcheck="false"';
    if (firstTime || this._forceRenderFirstTime) {
      this._forceRenderFirstTime = NO;
      disabled = this.get('isEnabled') ? '' : 'disabled="disabled"' ;
      name = this.get('layerId');
      
      if(this.get('shouldRenderBorder')) context.push('<span class="border"></span>');

      // Render the padding element, with any necessary positioning
      // adjustments to accommodate accessory views.
      adjustmentStyle = '' ;
      if (leftAdjustment  ||  rightAdjustment) {
        adjustmentStyle = 'style="' ;
        if (leftAdjustment)  adjustmentStyle += 'left: '  + leftAdjustment  + '; ' ;
        if (rightAdjustment) adjustmentStyle += 'right: ' + rightAdjustment + ';' ;
        adjustmentStyle += '"' ;
      }
      context.push('<span class="padding" '+adjustmentStyle+'>');
                  
      value = this.get('escapeHTML')?SC.RenderContext.escapeHTML(value):value;
      if(!this.get('_supportsPlaceHolder') && (!value || (value && value.length===0))) {
        value = this.get('hint');
        context.setClass('sc-hint', YES);
      } 
      
      //for gecko pre 1.9 vertical aligment is completely broken so we need
      //different styling.
      fieldClassNames = (SC.browser.mozilla &&
                          (parseFloat(SC.browser.mozilla)<1.9 || 
                          SC.browser.mozilla.match(/1\.9\.0|1\.9\.1/))) ?
                          "field oldGecko": "field";
      
      // Render the input/textarea field itself, and close off the padding.
      if (this.get('isTextArea')) {
        context.push('<textarea class="',fieldClassNames,'" name="', name, 
                      '" ', disabled, ' placeholder="',hint, '"',
                      spellCheckString,' maxlength="', maxLength, '">', 
                      value, '</textarea></span>') ;
      }
      else {
        type = this.get('isPassword') ? 'password' : 'text' ;
        context.push('<input class="',fieldClassNames,'" type="', type,
                      '" name="', name, '" ', disabled, ' value="', value,
                      '" placeholder="',hint,'"', spellCheckString, 
                      ' maxlength="', maxLength, '" /></span>') ;
      }

    }
    else {
      var input= this.$input();
      if(!this.get('_supportsPlaceHolder')){
        var val = this.get('value');
        if((!val || (val && val.length===0))){
          if(this.get('hintON') && !this.get('isFirstResponder')){
            //console.log('hint on render');
            context.setClass('sc-hint', YES);
            input.val(hint);
          }else{
            // console.log('removing hint on render');
            context.setClass('sc-hint', NO);
            input.val('');
          }
        }
      }else{
        input.attr('placeholder', hint);
      }
      
      // Enable/disable the actual input/textarea as appropriate.
      element = input[0];
      if (element) {
        if (!this.get('isEnabled')) {
          element.disabled = 'true' ;
        }
        else {
          element.disabled = null ;
        }

        // Adjust the padding element to accommodate any accessory views.
        paddingElementStyle = element.parentNode.style;
        if (leftAdjustment) {
          if (paddingElementStyle.left !== leftAdjustment) {
            paddingElementStyle.left = leftAdjustment ;
          }
        }
        else {
          paddingElementStyle.left = null ;
        }

        if (rightAdjustment) {
          if (paddingElementStyle.right !== rightAdjustment) {
            paddingElementStyle.right = rightAdjustment ;
          }
        }
        else {
          paddingElementStyle.right = null ;
        }
      }
    }
  },

  _getAccessoryViewWidths: function() {
    var widths = {},
        accessoryViewPositions = ['left', 'right'],
        numberOfAccessoryViewPositions = accessoryViewPositions.length, i,
        position, accessoryView, frames, width, layout, offset, frame;
    for (i = 0;  i < numberOfAccessoryViewPositions;  i++) {
      position = accessoryViewPositions[i];
      accessoryView = this.get(position + 'AccessoryView');
      if (accessoryView) {
        // need acessoryView as an instance, not class...
        if (accessoryView.isClass) {
          accessoryView = accessoryView.create({
            layoutView: this
          });
        }
        // sanity check
        if (accessoryView.get) {
          frame = accessoryView.get('frame');
          if (frame) {
            width = frame.width;
            if (width) {
              // Also account for the accessory view's inset.
              layout = accessoryView.get('layout');
              if (layout) {
                offset = layout[position];
                width += offset;
              }
              widths[position] = width;
            }
          }
        }
      }
    }
    return widths;
  },

  // ..........................................................
  // HANDLE NATIVE CONTROL EVENTS
  //

  didCreateLayer: function() {
    arguments.callee.base.apply(this,arguments); 
    // For some strange reason if we add focus/blur events to textarea
    // inmediately they won't work. However if I add them at the end of the
    // runLoop it works fine.
    if(!this.get('_supportsPlaceHolder') && this.get('hintON')){
      var currentValue = this.$input().val();
      if(!currentValue || (currentValue && currentValue.length===0)){
        // console.log('hint on didcreatelayer');
        this.$input().val(this.get('hint'));
      }
    }
    if(this.get('isTextArea')) {
      this.invokeLast(this._addTextAreaEvents);
    }
    else {
      this._addTextAreaEvents();
      
      // In Firefox, for input fields only (that is, not textarea elements),
      // if the cursor is at the end of the field, the "down" key will not
      // result in a "keypress" event for the document (only for the input
      // element), although it will be bubbled up in other contexts.  Since
      // SproutCore's event dispatching requires the document to see the
      // event, we'll manually forward the event along.
      if (SC.browser.mozilla) {
        var input = this.$input();
        SC.Event.add(input, 'keypress', this, this._firefox_dispatch_keypress);
      }
    }
  },
  
  
  /** 
    Adds all the textarea events. This functions is called by didCreateLayer
    at different moments depending if it is a textarea or not. Appending 
    events to text areas is not reliable unless the element is already added 
    to the DOM.
    
  */
  _addTextAreaEvents: function() {
    var input = this.$input();
    SC.Event.add(input, 'focus', this, this._textField_fieldDidFocus);
    SC.Event.add(input, 'blur',  this, this._textField_fieldDidBlur);
    
    // There are certain ways users can select text that we can't identify via
    // our key/mouse down/up handlers (such as the user choosing Select All
    // from a menu).
    SC.Event.add(input, 'select', this, this._textField_selectionDidChange);
        
    if(SC.browser.mozilla){
      // cache references to layer items to improve firefox hack perf
      this._cacheInputElement = this.$input();
      this._cachePaddingElement = this.$('.padding');
    }
  },


  /**
    Removes all the events attached to the textfield
  */
  
  willDestroyLayer: function() {
    arguments.callee.base.apply(this,arguments);

    var input = this.$input();
    SC.Event.remove(input, 'focus',  this, this._textField_fieldDidFocus);
    SC.Event.remove(input, 'blur',   this, this._textField_fieldDidBlur);
    SC.Event.remove(input, 'select', this, this._textField_selectionDidChange);
    SC.Event.remove(input, 'keypress',  this, this._firefox_dispatch_keypress);
  },
  
  /**
    This function is called by the event when the textfield gets focus
  */

  _textField_fieldDidFocus: function(evt) {
    SC.run(function() {
      this.set('focused',YES);
      this.fieldDidFocus(evt);
      var val = this.get('value');
      if(!this.get('_supportsPlaceHolder') && ((!val) || (val && val.length===0))){
        // console.log('turn off hint');
        this.set('hintON', NO);
      }
    }, this);
  },

  /**
    This function is called by the event when the textfield blurs
  */

  _textField_fieldDidBlur: function(evt) {
    SC.run(function() {
      this.set('focused',NO);
      // passing the original event here instead that was potentially set from
      // loosing the responder on the inline text editor so that we can
      // use it for the delegate to end editing
      this.fieldDidBlur(this._origEvent);
      var val = this.get('value');
      if(!this.get('_supportsPlaceHolder') && ((!val) || (val && val.length===0))){
        // console.log('turn on hint');
        this.set('hintON', YES);
      }
    }, this);
  },
  
  fieldDidFocus: function(evt) {
    this.beginEditing(evt);
    
    // We have to hide the intercept pane, as it blocks the events. 
    // However, show any that we previously hid, first just in case something wacky happened.
    if (this._didHideInterceptForPane) {
      this._didHideInterceptForPane.showTouchIntercept();
      this._didHideInterceptForPane = null;
    }
    
    // now, hide the intercept on this pane if it has one
    var pane = this.get('pane');
    if (pane && pane.get('hasTouchIntercept')) {
      // hide
      pane.hideTouchIntercept();
      
      // and set our internal one so we can unhide it (even if the pane somehow changes)
      this._didHideInterceptForPane = this.get("pane");
    }
  },
  
  fieldDidBlur: function(evt) {
    this.commitEditing(evt);
    
    // get the pane we hid intercept pane for (if any)
    var touchPane = this._didHideInterceptForPane;
    if (touchPane) {
      touchPane.showTouchIntercept();
      touchPane = null;
    }
  },
  
  _field_fieldValueDidChange: function(evt) {
    if(this.get('focused')){
      SC.run(function() {
        this.fieldValueDidChange(NO);        
      }, this);
    }
  },

  /**
    Move magic number out so it can be over-written later in inline editor
  */
  _topOffsetForFirefoxCursorFix: 3,


  /**
    Mozilla had this bug until firefox 3.5 or gecko 1.8 They rewrote input text
    and textareas and now they work better. But we have to keep this for older
    versions.
  */
  _applyFirefoxCursorFix: function() {
    // Be extremely careful changing this code.  !!!!!!!! 
    // Contact me if you need to change or improve the code. After several 
    // iterations the new way to apply the fix seems to be the most 
    // consistent.
    // This fixes: selection visibility, cursor visibility, and the ability 
    // to fix the cursor at any position. As of FF 3.5.3 mozilla hasn't fixed this 
    // bug, even though related bugs that I've found on their database appear
    // as fixed.  
    
    // UPDATE: Things seem to be working on FF3.6 therefore we are disabling the
    // hack for the latest versions of FF.
    // 
    // Juan Pinzon
    
    if (parseFloat(SC.browser.mozilla)<1.9 && !this.get('useStaticLayout')) {
      var top, left, width, height, p, layer, element, textfield;
      
      // I'm caching in didCreateLayer this elements to improve perf
      element = this._cacheInputElement;
      textfield = this._cachePaddingElement;
      if(textfield && textfield[0]){
        layer = textfield[0];
        p = SC.$(layer).offset() ;
      
        // this is to take into account an styling issue.
        // this is counterproductive in FF >= 3.6
        if(SC.browser.compareVersion(1,9,2) < 0 && 
           element[0].tagName.toLowerCase()==="input") {
          top = p.top+this._topOffsetForFirefoxCursorFix; 
        }
        else top = p.top;
        left = p.left;
        width = layer.offsetWidth;
        height = layer.offsetHeight ;
      
        var style = 'position: fixed; top: %@px; left: %@px; width: %@px; height: %@px;'.fmt(top, left, width, height) ;
        // if the style is the same don't re-apply
        if(!this._prevStyle || this._prevStyle!=style) element.attr('style', style) ;
        this._prevStyle = style;
      }
    }
    return this ;
  },
  
  
  /**
    In Firefox, as of 3.6 -- including 3.0 and 3.5 -- for input fields only
    (that is, not textarea elements), if the cursor is at the end of the
    field, the "down" key will not result in a "keypress" event for the
    document (only for the input element), although it will be bubbled up in
    other contexts.  Since SproutCore's event dispatching requires the
    document to see the event, we'll manually forward the event along.
  */
  _firefox_dispatch_keypress: function(evt) {
    var selection = this.get('selection'),
        value     = this.get('value'),
        valueLen  = value ? value.length : 0,
        responder;
    
    if (!selection  ||  ((selection.get('length') === 0  &&  (selection.get('start') === 0)  ||  selection.get('end') === valueLen))) {
      responder = SC.RootResponder.responder;
      if(evt.keyCode===9) return;
      responder.keypress.call(responder, evt);
      evt.stopPropagation();
    }
  },
  
  
  _textField_selectionDidChange: function() {
    this.notifyPropertyChange('selection');
  },

  // ..........................................................
  // FIRST RESPONDER SUPPORT
  //
  // When we become first responder, make sure the field gets focus and
  // the hint value is hidden if needed.

  // when we become first responder, focus the text field if needed and
  // hide the hint text.
  /** @private */
  willBecomeKeyResponderFrom: function(keyView) {
    if(this.get('isVisibleInWindow')) {
      var inp = this.$input()[0];
      try{ 
        if(inp) inp.focus(); 
      } 
      catch(e){}
      if(!this._txtFieldMouseDown){
        this.invokeLast(this._selectRootElement) ;
      }
    }
  },
  
  willLoseKeyResponderTo: function(responder) {
    //if (this._isFocused) this._isFocused = NO ;
  },

  // In IE, you can't modify functions on DOM elements so we need to wrap the
  // call to select() like this.
  _selectRootElement: function() {
    // make sure input element still exists, as a redraw could have remove it
    // already
    var inputElem = this.$input()[0];
    if(inputElem) inputElem.select() ;
    else this._textField_selectionDidChange();
  },

  // when we lose first responder, blur the text field if needed and show
  // the hint text if needed.
  /** @private */
  didLoseKeyResponderTo: function(keyView) {
    var el = this.$input()[0];
    if (el) el.blur();
    
    this.invokeLater("scrollToOriginIfNeeded", 100);
  },
  
  /**
    @private
    Scrolls to origin if necessary (if the pane's current firstResponder is not a text field).
  */
  scrollToOriginIfNeeded: function() {
    var pane = this.get("pane");
    if (!pane) return;
    
    var first = pane.get("firstResponder");
    if (!first || !first.get("isTextField")) {
      document.body.scrollTop = document.body.scrollLeft = 0;
    }
  },

  parentViewDidResize: function() {
    if (SC.browser.mozilla) {
      this.invokeLast(this._applyFirefoxCursorFix);
    }
    arguments.callee.base.apply(this,arguments);
  },

  /** @private
    Simply allow keyDown & keyUp to pass through to the default web browser
    implementation.
  */
  keyDown: function(evt) {
    var value, view;
    // Handle return and escape.  this way they can be passed on to the
    // responder chain.
    // If the event is triggered by a return while entering IME input,
    // don't got through this path.
    var which = evt.which, maxLengthReached = false;
    if ((which === 13 && !evt.isIMEInput) && !this.get('isTextArea')) {

      // If we're not continuously updating 'value' as we type, force an update
      // if return is pressed.
      if (!this.get('continuouslyUpdatesValue')) {
        value = this.getValidatedValueFromFieldValue(NO);
        
        if ((SC.typeOf(value) !== SC.T_ERROR) || this.get('allowsErrorAsValue')) {
          this.setIfChanged('value', value);
          this.applyValueToField(value); // sync text in the text field
        }
      }

      return NO;
    }

    if (which === 27) return NO ;

    // handle tab key
    if ((which === 9 || evt.keyCode===9) && this.get('defaultTabbingEnabled')) {
      var view = evt.shiftKey ? this.get('previousValidKeyView') : this.get('nextValidKeyView');
      if (view) view.becomeFirstResponder();
      else evt.allowDefault();
      return YES ; // handled
    }
    // maxlength for textareas
    if(!SC.browser.safari && this.get('isTextArea')){
      var val = this.get('value'),
          code = evt.which;
    // This code is nasty. It's thanks gecko .keycode table that has charters like & with the same keycode as up arrow key
      if(val && ((!SC.browser.mozilla && code>47) || 
        (SC.browser.mozilla && ((code>32 && code<43) || code>47) && !(evt.keyCode>36 && evt.keyCode<41))) &&
        (val.length >= this.get('maxLength'))) {
        maxLengthReached = true;
      }
    }
    // validate keyDown...
    // do not validate on touch, as it prevents return.
    if ((this.performValidateKeyDown(evt) || SC.platform.touch) && !maxLengthReached) {
      this._isKeyDown = YES ;
      evt.allowDefault();
    } else {
      evt.stop();
    }
    
    if (this.get('applyImmediately')) {
      // We need this invokeLater as we need to get the value of the field
      // once the event has been processed. I tried with invokeLast , but
      // I guess the field doesn't repaint until js execution finishes and 
      // therefore the field value doesn't update if we don't give it a break.
      this.invokeLater(this.fieldValueDidChange,1); // notify change
    }
    return YES;
  },

  keyUp: function(evt) {
    if(SC.browser.mozilla && evt.keyCode===13) this.fieldValueDidChange(); 
    // The caret/selection could have moved.  In some browsers, though, the
    // element's values won't be updated until after this event is finished
    // processing.
    this.notifyPropertyChange('selection');
    this._isKeyDown = NO;
    evt.allowDefault();
    return YES;
  },

  mouseDown: function(evt) {
    var fieldValue = this.get('fieldValue'); // use 'fieldValue' since we want actual text
    this._txtFieldMouseDown=YES;
    if (!this.get('isEnabled')) {
      evt.stop();
      return YES;
    } else {
      return arguments.callee.base.apply(this,arguments);
    }
  },

  mouseUp: function(evt) {
    this._txtFieldMouseDown=NO;
    // The caret/selection could have moved.  In some browsers, though, the
    // element's values won't be updated until after this event is finished
    // processing.
    this.notifyPropertyChange('selection');
    
    if (!this.get('isEnabled')) {
      evt.stop();
      return YES;
    } 
    return arguments.callee.base.apply(this,arguments);
  },
  
  /**
    Adds mouse wheel support for textareas.
  */
  mouseWheel: function(evt) {
    if(this.get('isTextArea')) {
      evt.allowDefault();
      return YES;
    } else return NO;
  },

  /*
    Allows text selection in IE. We block the IE only event selectStart to 
    block text selection in all other views.
  */
  selectStart: function(evt) {
    return YES;
  },
  
  /**
    This function is to notify if the browser supports the placeholder attribute
    or not. Currently is disabled as in webkit there is a bug where the color 
    of the placeholder doesn't refresh all the time.
  */
  _supportsPlaceHolder: function(){
    return SC.browser.safari && !this.get('isTextArea');
  }.property('isTextArea').cacheable(),
  
  
  valueObserver: function(){
    // console.log('value observer');
    var val = this.get('value'), max;
    if (val && val.length>0) {
      this.set('hintON', NO);
      max = this.get('maxLength');
      if(!SC.browser.safari && val.length>max){
        this.set('value', val.substr(0, max));
      }
    }else this.set('hintON', YES);
  }.observes('value')
  
});

/* >>>>>>>>>> BEGIN source/system/utils/misc.js */
SC.mixin( /** @scope SC */ {
  _downloadFrames: 0, // count of download frames inserted into document

  /**
    Starts a download of the file at the named path.

    Use this method when you want to cause a file to be downloaded to a users
    desktop instead of having it display in the web browser.  Note that your
    server must return a header indicating that the file  is intended for
    download also.
  */
  download: function(path) {
    var tempDLIFrame=document.createElement('iframe'),
        frameId = 'DownloadFrame_' + this._downloadFrames;
    SC.$(tempDLIFrame).attr('id',frameId);
    tempDLIFrame.style.border='10px';
    tempDLIFrame.style.width='0px';
    tempDLIFrame.style.height='0px';
    tempDLIFrame.style.position='absolute';
    tempDLIFrame.style.top='-10000px';
    tempDLIFrame.style.left='-10000px';
    // Don't set the iFrame content yet if this is Safari
    if (!SC.browser.isSafari) {
      SC.$(tempDLIFrame).attr('src',path);
    }
    document.getElementsByTagName('body')[0].appendChild(tempDLIFrame);
    if (SC.browser.isSafari) {
      SC.$(tempDLIFrame).attr('src',path);
    }
    this._downloadFrames = this._downloadFrames + 1;
    if (!SC.browser.isSafari) {
      var r = function() {
        document.body.removeChild(document.getElementById(frameId));
        frameId = null;
      } ;
      r.invokeLater(null, 2000);
    }
    //remove possible IE7 leak
    tempDLIFrame = null;
  },

  // Get the computed style from specific element. Useful for cloning styles
  getStyle: function(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
     strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
      return p1.toUpperCase();
     });
     strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  },

  // Convert double byte characters to standard Unicode. Considers only
  // conversions from zenkaku to hankaky roomaji
  uniJapaneseConvert: function (str){
    var nChar, cString= '', j, jLen;
    //here we cycle through the characters in the current value
    for (j=0, jLen = str.length; j<jLen; j++){
      nChar = str.charCodeAt(j);

      //here we do the unicode conversion from zenkaku to hankaku roomaji
      nChar = ((nChar>=65281 && nChar<=65392)?nChar-65248:nChar);

      //MS IME seems to put this character in as the hyphen from keyboard but not numeric pad...
      nChar = ( nChar===12540?45:nChar) ;
      cString = cString + String.fromCharCode(nChar);
    }
    return cString;
  }


});

/* >>>>>>>>>> BEGIN source/mixins/inline_text_field.js */
// ========================================================================
// SproutCore
// copyright 2006-2011 Strobe Inc.
// ========================================================================

sc_require('views/text_field') ;
sc_require('system/utils/misc') ;

/**
  @class
  
  The inline text editor is used to display an editable area for controls 
  that are not always editable such as label views and source list views.
  
  You generally will not use the inline editor directly but instead will
  invoke beginEditing() and endEditing() on the views you are 
  editing. If you would like to use the inline editor for your own views, 
  you can do that also by using the editing API described here.
  
  h2. Using the Inline Editor in Your Own Views

  If you need to use the inline editor with custom views you have written,
  you will need to work with the class methods to begin, commit, and discard
  editing changes.
  
  h3. Starting the Editor
  
  The inline editor works by positioning itself over the top of your view 
  with the same offset, width, and font information.  As the user types, the
  field will automatically resize vertically to make room for the user's text.
  
  To activate the inline editor you must call beginEdition() with at least 
  the target view you want the editor to position itself on top of:
  
  {{{
    SC.InlineTextFieldView.beginEditing({
      target: view, validator: validator
    }) ;
  }}}

  You can pass a variety of options to this method to configure the inline
  editor behavior, including:

  - *frame* The editors initial frame in viewport coordinates. (REQ)
  - *delegate* Delegate to receive update notices. (REQ)
  - *value* Initial value of the edit field.
  - *exampleElement* A DOM element to use when copying styles.
  - *multiline* If YES then the hitting return will add to the value instead of exiting the inline editor.
  - *selectedRange* The range of text that should be selected.  If omitted, then the insertion point will be placed at the end of the value.
  - *commitOnBlur* If YES then blurring will commit the value, otherwise it will discard the current value.  Defaults to YES.
  - *validator* Validator to be attached to the field.
  
  If the inline editor is currently in use elsewhere, it will automatically
  close itself over there and begin editing for your view instead.  The 
  editor expects your source view to implement the InlineTextFieldViewDelegate
  protocol.

  h2. Committing or Discarding Changes
  
  Normally the editor will automatically commit or discard its changes 
  whenever the user exits the edit mode.  If you need to force the editor to
  end editing, you can do so by calling commitEditing() or discardEditing():
  
  {{{
    SC.InlineTextFieldView.commitEditing();
    SC.InlineTextFieldView.discardEditing();
  }}}
  
  Both methods will try to end the editing context and will call the 
  relevant delegate methods on the delegate you passed to beginEditing().
  
  Note that it is possible an editor may not be able to commit editing 
  changes because either the delegate disallowed it or because its validator
  failed.  In this case commitEditing() will return NO.  If you want to
  end editing anyway, you can discard the editing changes instead by calling
  discardEditing().  This method will generally succeed unless your delegate
  refuses it as well.
  
  @extends SC.TextFieldView
  @since SproutCore 1.0
*/
SC.InlineTextFieldView = SC.TextFieldView.extend(
/** @scope SC.InlineTextFieldView.prototype */ {

  /**
    Over-write magic number from SC.TextFieldView
  */
  _topOffsetForFirefoxCursorFix: 0,

  /**
    Invoked by the class method to begin editing on an inline editor.
    
    You generally should call the class method beginEditing() instead of
    this one since it will make sure to create and use the shared editor
    instance.

    @params options {Hash} hash of options for editing
    @returns {SC.InlineTextFieldView|Boolean} this if editor began editing, 
      NO if it failed.
  */
  beginEditing: function(options) {

    // options are required
    //@if(debug)
    if (!options) throw "InlineTextField.beginEditing() requires options";
    //@end

    // can't begin editing again if already editing
    if (this.get('isEditing')) return NO ;
    
    var layout={}, pane, tarLayout, paneElem, del;

    del = options.delegate ;
    this.set('editorDelegate', del) ;
    
    this.beginPropertyChanges();
    
    this.set('isEditing', YES) ;
    this.set('escapeHTML', options.escapeHTML) ;
    
    this._optframe = options.frame ;
    this._optIsCollection = options.isCollection;
    this._exampleElement = options.exampleElement ;

    if (!this._optframe || !del) {
      throw "At least frame and delegate options are required for inline editor";
    }
    
    this._originalValue = options.value;
    if (SC.none(this._originalValue))
      this._originalValue = "";
    this._multiline = (options.multiline !== undefined) ? options.multiline : NO ;
    if (this._multiline) {
      this.set('isTextArea', YES);
    } else {
      this.set('isTextArea', NO);
    }
    this._commitOnBlur =  (options.commitOnBlur !== undefined) ? options.commitOnBlur : YES ;

    // set field values
    this.set('validator', options.validator) ;
    this.set('value', this._originalValue) ;
    //this.set('selectedRange', options.selectedRange || { start: this._originalValue.length, length: 0 }) ;
    
    // add to window.
    
    pane = options.pane;

    layout.height = this._optframe.height;
    layout.width=this._optframe.width;
    tarLayout = options.layout;
    paneElem = pane.$()[0];
    if (this._optIsCollection && tarLayout.left) {
      layout.left=this._optframe.x-tarLayout.left-paneElem.offsetLeft-1;
      if(SC.browser.msie==7) layout.left--;
    } else {
      layout.left=this._optframe.x-paneElem.offsetLeft-1;
      if(SC.browser.msie==7) layout.left--;
    }
    
    if (this._optIsCollection && tarLayout.top) {
      layout.top=this._optframe.y-tarLayout.top-paneElem.offsetTop;
      if(SC.browser.msie==7) layout.top=layout.top-2;
    } else {
      layout.top=this._optframe.y-paneElem.offsetTop;
      if(SC.browser.msie==7) layout.top=layout.top-2;  
    }

    this.set('layout', layout);
  
    this.set('parentNode', pane);
    // get style for view.
   
    pane.appendChild(this);
    
    this._className = options.inlineEditorClassName;
    if(this._className && !this.hasClassName(this._className)) {
      this.setClassName(this._className,true);
    }
    
    // this.resizeToFit(this.getFieldValue()) ;

    this._previousFirstResponder = pane ? pane.get('firstResponder') : null;
    this.becomeFirstResponder();
    this.endPropertyChanges() ;
    
    // TODO: remove? if(SC.browser.mozilla)this.invokeOnce(this.becomeFirstResponder) ;
      
    // Become first responder and notify the delegate after run loop completes
    this.invokeLast(function() {
      del.inlineEditorDidBeginEditing(this);
    });
    
    return YES;
  },
  
  
  /**
    Tries to commit the current value of the field and end editing.  
    
    Do not use this method, use the class method instead.
    
    @param {Event} evt that triggered the commit to happen
    @returns {Boolean}
  */
  commitEditing: function(evt) {
    // try to validate field.  If it fails, return false.  
    if (!SC.$ok(this.validateSubmit())) return NO ;
    return this._endEditing(this.get('value'), evt) ;
  },
  
  /**
    Tries to discard the current value of the field and end editing.
    
    Do not use this method, use the class method instead.

    @returns {Boolean}
  */
  discardEditing: function() {
    return this._endEditing(this._originalValue) ;
  },
  
  /**
    Invoked whenever the editor loses (or should lose) first responder 
    status to commit or discard editing.
    
    @returns {Boolean}
  */
  blurEditor: function(evt) {
    if (!this.get('isEditing')) return YES ;
    return this._commitOnBlur ? this.commitEditing(evt) : this.discardEditing(evt);
  },
  
  /** @private
    Called by commitEditing and discardEditing to actually end editing.
    
    @param {String} finalValue that will be set as value
    @param {Event} evt that triggered the end editing to occur
    @param {Boolean} didDiscard if called from discardEditing
    @returns {Boolean} NO if editing did not exit
  */
  _endEditing: function(finalValue, evt, didDiscard) {
    // get permission from the delegate.
    var del = this.get('editorDelegate') ;
    
    if (!this.get('isEditing') || !del) return YES ;
    
    if (!del.inlineEditorShouldCommitEditing(this, finalValue)) {
      //@if(debug)
      SC.Logger.warn('InlineTextField._endEditing() cannot end without inlineEditorShouldCommitEditing() on the delegate.');
      //@end
      return NO;
    }
    // OK, we are allowed to end editing.  Notify delegate of final value
    // and clean up.
    del.inlineEditorDidEndEditing(this, finalValue);

    // If the delegate set a class name, let's clean it up:
    if(this._className) this.setClassName(this._className, false);
    
    // cleanup cached values
    this._originalValue = this._delegate = this._exampleElement =  this._optframe = this._className = null ;
    this.set('isEditing', NO) ;

    // resign first responder if not done already.  This may call us in a 
    // loop but since isEditing is already NO, nothing will happen.
    if (this.get('isFirstResponder')) {
      var pane = this.get('pane');
      if (pane && this._previousFirstResponder) {
        pane.makeFirstResponder(this._previousFirstResponder);
      } else this.resignFirstResponder();
    }
    this._previousFirstResponder = null ; // clearout no matter what
    
    if (this.get('parentNode')) this.removeFromParent() ;  
    
    return YES ;
  },
  
  /**
    YES if the editor is currently visible and editing.
  
    @property {Boolean}
  */
  isEditing: NO,
  
  // TODO: make this function work for 1.0
  // /**
  //   Resizes the visible textarea to fix the actual text in the text area.
  //   
  //   This method works by keeping a div positioned immediately beneath the 
  //   text area with an opacity of 0 that contains the same text as the 
  //   input text field itself.  This is then used to calculate the required 
  //   size for the text area.
  // */
  // resizeToFit: function(newValue)
  // {
  //   
  // 
  // 
  // var sizer  = this.outlet('sizer');
  //     var field  = this.outlet('field');
  //     
  //     // XSS attack waiting to happen... escape the form input;
  //     var text = (newValue || '').escapeHTML();
  // 
  //     // convert the textarea's newlines into something comparable for the sizer 
  //     // div appending a space to give a line with no text a visible height.
  //     text = text.replace((/ {2}/g), "&nbsp; ").replace(/\n/g, "<br />&nbsp;");
  //     
  //     // get the text size
  //     sizer.set('innerHTML', text || "&nbsp;");
  //     sizer.recacheFrames() ;
  //     var h = sizer.get('frame').height;
  //     this.set('frame', { height: h }) ;
  // },
  
  /** @private */
  mouseDown: function(e) {
    arguments.callee.base.call(this, e) ;
    return this.get('isEditing');
  },
  
  touchStart: function(e){
    this.mouseDown(e);
  },
  
  /** @private */
  keyDown: function(evt) {
    var ret = this.interpretKeyEvents(evt) ;
    this.fieldValueDidChange(true);
    return !ret ? NO : ret ;
  },
  
  /** @private */
  insertText: null,
  
  //keyUp: function() { return true; },

  _scitf_blurInput: function() {
    var el = this.$input()[0];
    if (el) el.blur();
    el = null;
  },

  // [Safari] if you don't take key focus away from an element before you 
  // remove it from the DOM key events are no longer sent to the browser.
  /** @private */
  willRemoveFromParent: function() {
    return this._scitf_blurInput();
  },
  
  // ask owner to end editing.
  /** @private */
  willLoseFirstResponder: function(responder, evt) {
    if (responder !== this) return;

    // if we're about to lose first responder for any reason other than
    // ending editing, make sure we clear the previous first responder so 
    // isn't cached
    this._previousFirstResponder = null;
    
    // store the original event that caused this to loose focus so that
    // it can be passed to the delegate
    this._origEvent = evt;
    
    // should have been covered by willRemoveFromParent, but this was needed 
    // too.
    this._scitf_blurInput();
    return this.blurEditor(evt) ;
  },
  
  /**
    invoked when the user presses escape.  Returns true to ignore keystroke
    
    @returns {Boolean}
  */
  cancel: function() { 
    this.discardEditing(); 
    return YES;
  },
  
  // do it here instead of waiting on the binding to make sure the UI
  // updates immediately.
  /** @private */
  fieldValueDidChange: function(partialChange) {
    arguments.callee.base.call(this, partialChange) ;
    //this.resizeToFit(this.getFieldValue()) ;
  },
  
  // invoked when the user presses return.  If this is a multi-line field,
  // then allow the newine to proceed.  Otherwise, try to commit the 
  // edit.
  /** @private */
  insertNewline: function(evt) { 
    if (this._multiline) {
      evt.allowDefault();
      return arguments.callee.base.call(this, evt) ;
    } else {
      // TODO : this is a work around. There is a bug where the 
      // last character would get dropped 
      // if the editing was completed by pressing return
      // needs to be fixed
      if (this.get('value') != this.$input().val()) {
        this.set('value', this.$input().val());
      }
      
      this.commitEditing() ;
      return YES ;
    }
  },
  
  // Tries to find the next key view when tabbing.  If the next view is 
  // editable, begins editing.
  /** @private */
  insertTab: function(evt) {
    var delegate = this._delegate; // removed by commitEditing()
    this.resignFirstResponder();
    this.commitEditing() ;
    if(delegate){
      var next = delegate.get('nextValidKeyView');
      if(next && next.beginEditing) next.beginEditing();
    }
    return YES ;
  },

  /** @private */
  insertBacktab: function(evt) {
    var delegate = this._delegate; // removed by commitEditing()
    this.resignFirstResponder();
    this.commitEditing() ;
    if(delegate){
      var prev = delegate.get('previousValidKeyView');
      if(prev && prev.beginEditing) prev.beginEditing();
    }
    return YES ;
  },
  
  /** @private */
  deleteForward: function(evt) {
    evt.allowDefault();
    return YES;
  },
  
  /** @private */
  deleteBackward: function(evt) {
    evt.allowDefault();
    return YES ;
  }
  
});


SC.InlineTextFieldView.mixin(
/** @scope SC.InlineTextFieldView */ {
  
  /** Call this method to make the inline editor begin editing for your view.
      
      If the inline editor is already being used for another value it will
      try to dismiss itself from the other editor and attach itself to the
      new view instead.  If this process fails for some reason (for example
      if the other view did not allow the view to end editing) then this
      method will return false.

      You should pass a set of options that at least includes the target
      view.  See class definition for options.
      
      @params options {Hash} hash of options for editing
      @returns {Boolean} YES if editor began editing, NO if it failed.
  */
  beginEditing: function(options) {
    this._exampleElement = options.exampleElement ;
    
    // If exampleInlineTextFieldView is set, load this class otherwise use
    // the default, this.
    var klass = options.exampleInlineTextFieldView 
              ? options.exampleInlineTextFieldView : this,
        layout = options.layout,
        s = this.updateViewStyle(),
        p = this.updateViewPaddingStyle();
    
    var str= ".inline-editor input{"+s+"} ";
    str= str+".inline-editor textarea{"+s+"} .inline-editor .padding{"+p+"}";
    var pa= document.getElementsByTagName('head')[0],
    el= document.createElement('style');
    el.type= 'text/css';
    el.media= 'screen';
    if(el.styleSheet) el.styleSheet.cssText= str;// IE method
    else el.appendChild(document.createTextNode(str));// others
    pa.appendChild(el);
    
    this.editor = klass.create({ classNames: 'inline-editor', layout: layout}) ;
    return this.editor.beginEditing(options) ;
    
  },
  
  /** Save the current value of the inline editor and exit edit mode.
  
    If the inline editor is being used it will try to end the editing and
    close.  If the inline editor could not end for some reason (for example
    if the delegate did not allow the editing to end) then this method will
    return NO.
    
    @returns {Boolean} YES if the inline editor ended or no edit was in 
      progress.
  */
  commitEditing: function() {
    return this.editor ? this.editor.commitEditing() : YES ;
  },

  /** Discard the current value of the inline editor and exit edit mode.
  
    If the inline editor is in use, this method will try to end the editing,
    restoring the original value of the target view.  If the inline editor
    could not end for some reason (for example if the delegate did not 
    allow editing to end) then this method will return NO.
    
    @returns {Boolean} YES if the inline editor ended or no edit was in progress.
  */
  discardEditing: function() {
    return this.editor ? this.editor.discardEditing() : YES ;  
  },
  
  /** @private */
  updateViewStyle: function() {
    var el = this._exampleElement[0],
        styles = '',
        s=SC.getStyle(el,'font-size');
    if(s && s.length>0) styles = styles + "font-size: "+ s + " !important; ";
    s=SC.getStyle(el,'font-family');
    if(s && s.length>0) styles = styles + "font-family: " + s + " !important; ";
    s=SC.getStyle(el,'font-weight');
    if(s && s.length>0) styles = styles + "font-weight: " + s + " !important; ";
    s=SC.getStyle(el,'z-index');
    if(s && s.length>0) styles = styles + "z-index: " + s + " !important; ";
    s=SC.getStyle(el,'line-height');
    if(s && s.length>0) styles = styles + "line-height: " + s + " !important; ";
    s=SC.getStyle(el,'text-align');
    if(s && s.length>0) styles = styles + "text-align: " + s + " !important; ";
    s=SC.getStyle(el,'top-margin');
    if(s && s.length>0) styles = styles + "top-margin: " + s + " !important; ";
    s=SC.getStyle(el,'bottom-margin');
    if(s && s.length>0) styles = styles + "bottom-margin: " + s + " !important; ";
    s=SC.getStyle(el,'left-margin');
    if(s && s.length>0) styles = styles + "left-margin: " + s + " !important; ";
    s=SC.getStyle(el,'right-margin');
    if(s && s.length>0) styles = styles + "right-margin: " + s + " !important; ";
    
    return styles;
  },

  /** @private */
  updateViewPaddingStyle: function() {
    var el = this._exampleElement[0] ;   
    var styles = '';
    var s=SC.getStyle(el,'padding-top');
    if(s && s.length>0) styles = styles + "top: "+ s + " !important; ";
    s=SC.getStyle(el,'padding-bottom');
    if(s && s.length>0) styles = styles + "bottom: " + s + " !important; ";
    s=SC.getStyle(el,'padding-left');
    if(s && s.length>0) styles = styles + "left: " + s + " !important; ";
    s=SC.getStyle(el,'padding-right');
    if(s && s.length>0) styles = styles + "right: " + s + " !important; ";
    
    return styles;
  },

  
  /**
    The current shared inline editor.  This property will often remain NULL
    until you actually begin editing for the first time.
    
    @property {SC.InlineTextFieldView}
  */
  editor: null
  
}) ;

/* >>>>>>>>>> BEGIN source/render_delegates/render_delegate.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @class
  Base class for all render delegates.
  
  You can mix helpers into this base class; they will be available to all
  render delegates.
*/
SC.RenderDelegate = SC.Object.extend({
  
});
/* >>>>>>>>>> BEGIN source/render_delegates/canvas_image.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2010-2011 Strobe Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('render_delegates/render_delegate');

/**
  @class
  Renders and updates DOM representations of an image.

  Parameters
  --------------------------
  Expects these properties on the data source:

  - image: An Image object which has completed loading

  If any of these are not present in the data source, the render delegate
  will throw an error.

  Optional Parameters:
  ---------------------------
  If present, these properties will be used.

  - width: Used on the canvas element. If not provided, 0 is used and the canvas
            will not be visible.
  - height: Used on the canvas element. If not provided, 0 is used and the canvas
            will not be visible.
  - scale: If provided, the image will maintain aspect ratio as specified by this
          property. One of
            - SC.SCALE_NONE
            - SC.FILL
            - SC.FILL_PROPORTIONALLY
            - SC.BEST_FIT
            - SC.BEST_FIT_DOWN_ONLY
            - percentage {Number}
          If not provided, SC.FILL will be the default (ie. expected image behaviour)
  - align: If provided, the image will align itself within its frame.  One of
            - SC.ALIGN_CENTER
            - SC.ALIGN_TOP_LEFT
            - SC.ALIGN_TOP
            - SC.ALIGN_TOP_RIGHT
            - SC.ALIGN_RIGHT
            - SC.ALIGN_BOTTOM_RIGHT
            - SC.ALIGN_BOTTOM
            - SC.ALIGN_BOTTOM_LEFT
            - SC.ALIGN_LEFT
  - backgroundColor: If provided, the canvas will render a backgroundColor
*/

SC.BaseTheme.canvasImageRenderDelegate = SC.RenderDelegate.create({
  name: 'canvasImage',

  /** @private
    We don't have an element yet, so we do the minimal necessary setup
    here.
  */
  render: function(dataSource, context) {
    var width = dataSource.get('width') || 0,
        height = dataSource.get('height') || 0;

    context.attr('width', width);
    context.attr('height', height);
  },

  update: function(dataSource, jquery) {
    var elem = jquery[0],
        image = dataSource.get('image'),
        frame = dataSource.get('frame'),
        backgroundColor = dataSource.get('backgroundColor'),
        midX = 0, midY = 0,
        context;

    if (elem && elem.getContext) {
      elem.height = frame.height;
      elem.width = frame.width;

      context = elem.getContext('2d');

      context.clearRect(0, 0, frame.width, frame.height);

      if (backgroundColor) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, frame.width, frame.height);
      }

      if (image && image.complete) {
        this.updateImage(context, image, dataSource);
      }
    }
  },

  updateImage: function(context, image, dataSource) {
    var frame = dataSource.get('innerFrame');
    context.drawImage(image, Math.floor(frame.x), Math.floor(frame.y), Math.floor(frame.width), Math.floor(frame.height));
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/container.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('render_delegates/render_delegate');

SC.BaseTheme.containerRenderDelegate = SC.RenderDelegate.create({
  render: function(dataSource, context) {

  },
  
  update: function() {

  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/image.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2010-2011 Strobe Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('render_delegates/render_delegate');

/**
  @class
  Renders and updates DOM representations of an image.

  Parameters
  --------------------------
  Expects these properties on the data source:

  - image: An Image object which has completed loading

  If any of these are not present in the data source, the render delegate
  will throw an error.

  Optional Parameters:
  ---------------------------
  If present, these properties will be used.

  - imageValue: A String which represents the src or CSS class of the image
  - displayToolTip: A String which is rendered as a toolTip on the element
  - type: The type of image being rendered. One of:
              - SC.IMAGE_TYPE_NONE
              - SC.IMAGE_TYPE_URL
              - SC.IMAGE_TYPE_CSS_CLASS
          If not provided, SC.IMAGE_TYPE_URL is the default
*/

SC.BaseTheme.imageRenderDelegate = SC.RenderDelegate.create({
  name: 'image',

  render: function(dataSource, context) {
    var image = dataSource.get('image'),
        imageValue = dataSource.get('imageValue'),
        type = dataSource.get('type') || SC.IMAGE_TYPE_URL,
        toolTip = dataSource.get('toolTip');

    // Place the img within a div, so that we may scale & offset the img
    context = context.begin('img');
    context.attr('src', image.src);

    if (imageValue && type === SC.IMAGE_TYPE_CSS_CLASS) {
      context.addClass(imageValue);
      this._last_class = imageValue;
    }

    if (toolTip) {
      context.attr('title', toolTip);
      context.attr('alt', toolTip);
    }

    // Adjust the layout of the img
    context.addStyle(this.imageStyles(dataSource));

    context = context.end();
  },

  update: function(dataSource, jquery) {
    var image = dataSource.get('image'),
        imageValue = dataSource.get('imageValue'),
        toolTip = dataSource.get('toolTip');

    jquery = jquery.find('img');
    jquery.attr('src', image.src);

    if (imageValue !== this._last_class) jquery.setClass(this._last_class, NO);
    jquery.addClass(imageValue);
    this._last_class = imageValue;

    if (toolTip) {
      jquery.attr('title', toolTip);
      jquery.attr('alt', toolTip);
    }

    // Adjust the layout of the img
    jquery.css(this.imageStyles(dataSource));
  },

  imageStyles: function(dataSource) {
    var innerFrame = dataSource.get('innerFrame');
    return {
      'position': 'absolute',
      'left': Math.round(innerFrame.x),
      'top': Math.round(innerFrame.y),
      'width': Math.round(innerFrame.width),
      'height': Math.round(innerFrame.height)
    };
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/label.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('render_delegates/render_delegate');

/**
  @class
  Renders and updates DOM representations of a label.
  
  Parameters
  --------------------------
  Expects these properties on the data source:
  
  - title
  
  If any of these are not present in the data source, the render delegate
  will throw an error.
  
  Optional Parameters:
  ---------------------------
  If present, these properties will be used.
  
  - icon: should be either a class name or a URL
  - hint: allows the label to display a hint value if its title is empty.
  - escapeHTML: whether the HTML should be escaped to prevent XSS attacks
    and the like.
  - textAlign
  - fontWeight
  - needsEllipsis: Whether an ellipsis (...) should be added after the title
    if the title is too long.
*/

SC.BaseTheme.labelRenderDelegate = SC.RenderDelegate.create({
  name: 'label',
  
  render: function(dataSource, context) {
    // CONSIDER DEPRECATING THESE PROPERTIES BECAUSE THEY ARE
    // ANNOYING PAINS IN THE BUTT THAT EVERYONE HATES
    context.addStyle({
      'textAlign': dataSource.get('textAlign'),
      'fontWeight': dataSource.get('fontWeight')
    });
    
    context.setClass('ellipsis', dataSource.get('needsEllipsis') || NO);
    context.setClass('icon', dataSource.get('icon') || NO);
    
    var html = this._htmlForTitleAndIcon(dataSource);
    context.push(html);
    
    // we could use didChangeFor, but in this case, checking the generated
    // HTML will probably be faster (and definitely be simpler)
    // because several properties are used.
    dataSource.get('renderState')._lastHTMLForTitleAndIcon = html;
  },
  
  update: function(dataSource, jquery) {
    // CONSIDER DEPRECATING THESE PROPERTIES BECAUSE THEY ARE
    // ANNOYING PAINS IN THE BUTT THAT EVERYONE HATES
    jquery.css({
      'textAlign': dataSource.get('textAlign') || null,
      'fontWeight': dataSource.get('fontWeight') || null
    });
    
    jquery.setClass('ellipsis', dataSource.get('needsEllipsis') || NO);
    
    var html = this._htmlForTitleAndIcon(dataSource);
    if (dataSource.get('renderState')._lastHTMLForTitleAndIcon !== html) {
      jquery.html(html);
      dataSource.get('renderState')._lastHTMLForTitleAndIcon = html;
    }
  },
  
  _htmlForTitleAndIcon: function(dataSource) {
    var title = dataSource.get('title'),
        hint = dataSource.get('hint'),
        escapeHTML = dataSource.get('escapeHTML'),
        icon = dataSource.get('icon') || '';

    // Escape the title of the button if needed. This prevents potential
    // XSS attacks.
    if (title && escapeHTML) {
      title = SC.RenderContext.escapeHTML(title) ;
    }

    if (hint && !title) {
      if (escapeHTML) hint = SC.RenderContext.escapeHTML(hint);
      title = "<span class='sc-hint'>" + hint + "</span>";
    }

    if (icon) {
      // If the icon property is the path to an image, create an image tag
      // that points to that URL.
      if (icon.indexOf('/') >= 0) {
        icon = '<img src="'+icon+'" alt="" class="icon" />';

      // Otherwise, the icon property is a class name that should be added
      // to the image tag. Display a blank image so that the user can add
      // background image using CSS.
      } else {
        icon = '<img src="'+SC.BLANK_IMAGE_URL+'" alt="" class="icon '+icon+'" />';
      }
    }
    
    return icon + title;
  }
  
});
/* >>>>>>>>>> BEGIN source/system/benchmark.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals $A */

sc_require('core') ;

/** @namespace

  This bit of meta-programming magic can install a benchmark handler on any
  object method.  When a benchmark is installed, the time required to execute
  the method will be printed to the console log everytime the method is
  called.

  This class can be used to implement benchmarking.  To use this object, just
  call start() with a key name and end() with a keyname.  The benchmark will
  be logged.  If you set verbose = true, then benchmark will log everytime it
  saves a bench.  Otherwise, it just keeps stats.  You can get the stats by
  calling report().

  Benchmark does not require anything other than the date.js class.  It also
  does not rely on SC.Object so that you can benchmark code in that area as
  well.

  The benchmark has three types of reports.

  report(): Returns an abbreviated list with just the durations of the bench.
            Also, it averages multiple runs. Everything is reported on the top
            level only.

  timelineReport(): Returns an list of benchmarks and sub-benchmarks. If the
                    the globalStartTime is set, then it will show relative
                    time from that time.

  timelineChart(): Displays a chart of all the benchmarks (not sub-benchmarks)
                   relative to the first time capture or to the globalStartTime.
                   Hide this by calling hideChart()
*/
SC.Benchmark = {

  /**
    If true, then benchmarks will be logged to the console as they are
    recorded.

    @property {Boolean}
  */
  verbose: NO,

  /**
    If false, benchmarking will be disabled.  You might want to disable this
    during production to maximize performance.

    @property {Boolean}
  */
  enabled: YES,

  /**
    Events are a way of assigning specific, individual times to names, rather than
    durations of time. A benchmark event can only occur once—if it occurs again, it
    will overwrite the old event.

    The purpose of events is different than the purpose for normal benchmarks. Normal
    benchmarks may be used to benchmark a specific process, and may do so repeatedly;
    events, conversely, are usually used to benchmark things like startup time, and
    occur only once. For instance, an 'event' is registered when the document is ready.

    Events are kept as a hash of names to timestamps. To add an event, just set it:

        SC.Benchmark.events['myEventName'] = new Date().getTime();

        // Or, more conveniently:
        SC.Benchmark.addEvent('myEventName', [optional time]);

    On a timeline chart, events are usually represented as lines rather than bars. However,
    if you add eventNameStart and eventNameEnd, they will be automatically added as standard
    benchmarks.

    This is useful when adding preload events to SC.benchmarkPreloadEvents; as SC.Benchmark
    does not yet exist, you cannot call .start() and .end(), but adding the items to
    SC.benchmarkPreloadEvents will ensure they are included.
  */
  events: {},

  /**
     This hash stores collected stats.  It contains key value pairs.  The value
     will be a hash with the following properties:

    * * *runs*: the number of times this stat has run
    * * *amt*: the total time consumed by this (divide by runs to get avg)
    * * *name*: an optional longer name you assigned to the stat key.  Set this  using name().
    * * *_starts*: this array is used internally.
    * * *_times*: this array is used internally.

    @property {Object}
  */
  stats: {},

  /**
    If set, one can tell when the benchmark is started relatively to the global start time.

    This property is set to a default automatically (from HTML5 NavigationTiming if possible,
    otherwise the SC bootstrap).

    @property {Number}
  */
  globalStartTime: null,

  /**
    Adds an 'event' to the events hash.

    Unlike normal benchmarks, recorded with start/end and that represent a block of time,
    events represent a single instance in time. Further, unlike normal benchmarks, which
    may be run more than once for the same benchmark name, only one instance in time
    will be recorded for any event name.

    @param {String} name
      A name that identifies the event. If addEvent is called again with the same name,
      the previous call's timestamp will be overwritten.

    @param {Timestamp} time
      Optional. The timestamp to record for the event.
  */
  addEvent: function(name, time) {
    if (!time) time = new Date().getTime();
    this.events[name] = time;
  },

  /**
    Call this method at the start of whatever you want to collect.
    If a parentKey is passed, then you will attach the stat to the parent,
    otherwise it will be on the top level. If topLevelOnly is passed, then
    recursive calls to the start will be ignored and only the top level call
    will be benchmarked.

    @param {String} key
      A unique key that identifies this benchmark.  All calls to start/end
      with the same key will be groups together.

    @param {String} parentKey
      A unique key that identifies the parent benchmark.  All calls to
      start/end with the same key will be groups together.

    @param {Boolean} topLevelOnly
      If true then recursive calls to this method with the same key will be
      ignored.

    @param {Number} time
      Only pass if you want to explicitly set the start time.  Otherwise the
      start time is now.

    @returns {String} the passed key
  */
  start: function(key, parentKey, time, topLevelOnly) {
    if (!this.enabled) return ;

    var start = (time || Date.now()), stat;

    if (parentKey) stat = this._subStatFor(key, parentKey) ;
    else stat = this._statFor(key) ;

    if (topLevelOnly && stat._starts.length > 0) stat._starts.push('ignore');
    else stat._starts.push(start) ;

    stat._times.push({start: start, _subStats: {}});
    return key;
  },

  /**
    Call this method at the end of whatever you want to collect.  This will
    save the collected benchmark.

    @param {String} key
      The benchmark key you used when you called start()

    @param {String} parentKey
      The benchmark parent key you used when you called start()

    @param {Number} time
      Only pass if you want to explicitly set the end time.  Otherwise start
      time is now.
  */
  end: function(key, parentKey, time) {
    var stat;
    if (!this.enabled) return ;
    if(parentKey)
    {
      stat = this._subStatFor(key, parentKey) ;
    }
    else
    {
      stat = this._statFor(key) ;
    }
    var start = stat._starts.pop() ;
    if (!start) {
      console.log('SC.Benchmark "%@" ended without a matching start.  No information was saved.'.fmt(key));
      return ;
    }

    // top level only.
    if (start == 'ignore') return ;

    var end = (time || Date.now()) ;
    var dur = end - start;

    stat._times[stat._times.length-1].end = end;
    stat._times[stat._times.length-1].dur = dur;

    stat.amt += dur ;
    stat.runs++ ;

    if (this.verbose) this.log(key) ;
  },

  /*
    Set the inital global start time.
  */
  setGlobalStartTime: function(time)
  {
    this.globalStartTime = time;
  },

  /**
    This is a simple way to benchmark a function.  The function will be
    run with the name you provide the number of times you indicate.  Only the
    function is a required param.
  */
  bench: function(func, key, reps) {
    if (!key) key = "bench%@".fmt(this._benchCount++) ;
    if (!reps) reps = 1 ;
    var ret ;

    while(--reps >= 0) {
      var timeKey = SC.Benchmark.start(key) ;
      ret = func();
      SC.Benchmark.end(timeKey) ;
    }

    return ret ;
  },

  /**
    This bit of metaprogramming magic install a wrapper around a method and
    benchmark it whenever it is run.
  */
  install: function(object,method, topLevelOnly) {

    // vae the original method.
    object['b__' + method] = object[method] ;
    var __func = object['b__' + method];

    // replace with this helper.
    object[method] = function() {
      var key = '%@(%@)'.fmt(method, $A(arguments).join(', ')) ;
      SC.Benchmark.start(key, topLevelOnly) ;
      var ret = __func.apply(this, arguments) ;
      SC.Benchmark.end(key) ;
      return ret ;
    } ;
  },

  /**
    Restore the original method, deactivating the benchmark.

    @param {object} object the object to change
    @param {string} method the method name as a string.

  */
  restore: function(object,method) {
    object[method] = object['b__' + method] ;
  },

  /**
    This method will return a string containing a report of the stats
    collected so far.  If you pass a key, only the stats for that key will
    be returned.  Otherwise, all keys will be used.
  */
  report: function(key) {
    if (key) return this._genReport(key) ;
    var ret = [] ;
    for(var k in this.stats) {
      if (!this.stats.hasOwnProperty(k)) continue ;
      ret.push(this._genReport(k)) ;
    }
    return ret.join("\n") ;
  },

  /**
    Generate a human readable benchmark report. Pass in appName if you desire.

    @param {string} application name.
  */
  timelineReport: function(appName)
  {
    appName = (appName) ? 'SproutCore Application' : appName;
    var ret = [appName, 'User-Agent: %@'.fmt(navigator.userAgent), 'Report Generated: %@ (%@)'.fmt(new Date().toString(), Date.now()), ''] ;

    var chart = this._compileChartData(true);
    for(var i=0; i<chart.length; i++)
    {
      if(chart[i][4])
      {
        ret.push(this._timelineGenSubReport(chart[i]));
      }
      else
      {
        ret.push(this._timelineGenReport(chart[i]));
      }
    }
    return ret.join("\n") ;
  },

  /**
    Returns a hash containing the HTML representing the timeline chart, and
    various metrics and information about the chart:

        html, totalWidth, totalHeight, totalCapturedTime, pointsCaptured

  */
  getTimelineChartContent: function() {
    // Compile the data.
    var chart = this._compileChartData(false);
    var chartLen = chart.length;

    // Return if there is nothing to draw.
    if(chartLen === 0) return;

    // Get the global start of the graph.
    var gStart = this.globalStartTime ? this.globalStartTime : chart[0][1];
    var maxDur = chart[chartLen-1][2]-gStart;
    var maxHeight = 25+chartLen*30;
    var incr = Math.ceil(maxDur/200)+1;
    var maxWidth = incr*50;
    var leftPadding = 10, rightPadding = 300;


    var str = "<div class = 'sc-benchmark-timeline-chart' style = 'position:relative;'>";
    str += "<div class = 'sc-benchmark-top'></div>";

    // add tick marks
    for (var i = 0; i < incr; i++) {
      str += "<div class = 'sc-benchmark-tick' style = '";
      str += "left: " + (leftPadding + i * 50) + "px; ";
      str += "height: " + maxHeight + "px;";
      str += "'></div>";

      str += "<div class = 'sc-benchmark-tick-label' style = '";
      str += "left: " + (leftPadding + i * 50) + "px; ";
      str += "'>" + (i * 200) + "ms</div>";
    }

    // print each chart item
    for (i = 0; i < chartLen; i++) {
      str += "<div class = 'sc-benchmark-row ";
      str += (i % 2 === 0) ? 'even' : 'odd';
      str += "' style = '";
      str += "top: " + (50 + (i * 30)) + "px; ";
      str += "'></div>";

      var div = document.createElement('div');
      var start = chart[i][1];
      var end = chart[i][2];
      var duration = chart[i][3];


      str += "<div class = 'sc-benchmark-bar' style = '";
      str += 'left:'+ (leftPadding + ((start-gStart)/4))+'px; width: '+((duration/4)) + 'px;';
      str += 'top: '+(28+(i*30))+'px;';

      str += "' title = 'start: " + (start-gStart) + " ms, end: " + (end-gStart) + ' ms, duration: ' + duration + " ms'";
      str += ">";
      str += '&nbsp;' + chart[i][0] + " <span class='sc-benchmark-emphasis'>";
      str += duration + "ms (start: " + (start - gStart) + "ms)";
      str += "</span>";

      str += "</div>";
    }

    // add the events
    var events = this.events, idx = 0;
    for (i in events) {
      var t = events[i] - gStart;
      str += "<div class = 'sc-benchmark-event idx" + (idx % 10) + "' style = '";
      str += "left: " + (leftPadding + t / 4) + "px; height: " + maxHeight + "px; top: 20px;";
      str += "' title = '" + i + ": " + t + "'></div>";
      idx++;
    }

    str += "</div>";

    return {
      html: str,
      totalCapturedTime: maxDur,
      pointsCaptured: chartLen,
      width: maxWidth + leftPadding + rightPadding,
      height: maxHeight
    };
  },

  /**
    Returns a view with the timeline chart. The view has a 'reload' method to
    refresh its data.
  */
  getTimelineChartView: function() {
    var view = SC.ScrollView.create({
      contentView: SC.StaticContentView.extend({

      }),

      reload: function() {
        var content = SC.Benchmark.getTimelineChartContent();
        this.contentView.set('content', content.html);
        this.contentView.adjust({
          width: content.width,
          height: content.height
        });

        this.chartContent = content;

        SC.RunLoop.invokeLater(SC.Benchmark, function() {
          this.contentView.notifyPropertyChange('frame');
        });
      }
    });

    view.reload();

    return view;
  },

  /**
    Generate a human readable benchmark chart. Pass in appName if you desire.
  */
  timelineChart: function(appName) {
    SC.RunLoop.begin();

    var i=0;
    // Hide the chart if there is an existing one.
    this.hideChart();

    // Compile the data.
    var chartView = this.getTimelineChartView();
    var chartLen = chartView.chartContent.pointsCaptured,
        chartCapturedTime = chartView.chartContent.totalCapturedTime;

    // Get the global start of the graph.

    this._benchmarkChart = SC.Pane.create({
      classNames: "sc-benchmark-pane".w(),
      layout: { left: 20, right: 20, bottom: 20, top: 20 },
      childViews: "title exit".w(),
      exit: SC.ButtonView.extend({
        layout: { right: 20, top: 20, width: 100, height: 30 },
        title: "Hide Chart",
        target: this,
        action: "hideChart"
      }),

      title: SC.LabelView.extend({
        classNames: 'sc-benchmark-title'.w(),
        layout: { left: 20, top: 23, right: 200, height: 30 },
        value: ((appName) ? appName : 'SproutCore Application') + (' - Total Captured Time: ' + chartCapturedTime +' ms - Points Captured: ' + chartLen),
        fontWeight: 'bold'
      })

    }).append();

    chartView.set('layout', { left: 20, top: 60, bottom: 20, right: 20 });
    this._benchmarkChart.appendChild(chartView);

    SC.RunLoop.end();
  },

  /*
    Hide chart.

  */
  hideChart: function()
  {
    if(this._benchmarkChart) {
      this._benchmarkChart.remove();
      this._benchmarkChart = null;
    }

    return YES;
  },

  /**
    Because we show a pane to display the chart...
  */
  tryToPerform: function(action, sender) {
    if (this[action]) return this[action](sender);
    return NO;
  },

  /**
    This method is just like report() except that it will log the results to
    the console.
  */
  log: function(key) {
    // log each line to make this easier to read on an iPad
    var lines = this.report(key).split('\n'),
        len   = lines.length, idx;
    for(idx=0;idx<len;idx++) console.log(lines[idx]);
  },

  /**
    This will activate profiling if you have Firebug installed.  Otherwise
    does nothing.
  */
  startProfile: function(key) {
    if (!this.enabled) return ;
    if (console && console.profile) console.profile(key) ;
  },

  endProfile: function(key) {
    if (!this.enabled) return ;
    if (console && console.profileEnd) console.profileEnd(key) ;
  },

  // PRIVATE METHODS

  // @private


  /**
    Loads data from both the browser's own event hash and SC's pre-load event hash.
  */
  loadPreloadEvents: function() {
    var preloadEvents = SC.benchmarkPreloadEvents, events = [], idx, len, evt;

    // the browsers may have their own event hash. Ours uses the same format, so
    // all that we need to do is mixin the browser's to our own.
    if (typeof webkitPerformnce !== 'undefined') SC.mixin(preloadEvents, webkitPerformane.timing);

    // we will attempt to find when the loading started and use that as our
    // global start time, but only do so if the global start time is not already set.
    if (!this.globalStartTime) {
      // the potential events representing start time can be either from the browser
      // or our own recordings. We prefer the browser.
      var globalStartEvents = 'navigation navigationStart headStart'.w();
      len = globalStartEvents.length;

      for (idx = 0; idx < len; idx++) {
        if (preloadEvents[globalStartEvents[idx]]) {
          this.globalStartTime = preloadEvents[globalStartEvents[idx]];
          break;
        }
      }
    }

    // the JavaScript start time will be one recorded by us
    // we record headStart in bootstrap.
    this.javascriptStartTime = preloadEvents['headStart'];

    // finally, mix in the events to our own events hash
    SC.mixin(this.events, preloadEvents);

    this._hasLoadedPreloadEvents = true;
  },

  /**
    Some events represent a beginning and end. While this is not common for events
    that take place after the app loads (as they can just use SC.Benchmark.start/end),
    SC.Benchmark.start/end is not available before load—as such, code will add
    *Start and *End events to the event hash.

    This method iterates over the event hash and removes those items that represent
    starts and ends, calling .start/.end for them.
  */
  _loadBenchmarksFromEvents: function() {
    if (!this._hasLoadedPreloadEvents) this.loadPreloadEvents();

    var events = this.events;
    for (var i in events) {
      if (i.substr(-3) !== 'End') continue;

      var stem = i.substr(0, i.length - 3);
      if (!events[stem + 'Start']) continue;

      SC.Benchmark.start(stem, undefined, events[stem + 'Start']);
      SC.Benchmark.end(stem, undefined, events[stem + 'End']);

      delete events[stem + 'Start'];
      delete events[stem + 'End'];
    }
  },

  // Generates, sorts, and returns the array of all the data that has been captured.
  _compileChartData: function(showSub)
  {
    this._loadBenchmarksFromEvents();

    var chart = [], dispKey;
    for(var key in this.stats)
    {
      var stat = this.stats[key];
      for(var i=0; i<stat._times.length; i++)
      {
        var st = stat._times[i];
        dispKey = (stat._times.length > 1) ? (i+1)+' - '+key : key;
        chart.push([dispKey, st.start, st.end, st.dur, false]);
        if(showSub)
        {
          var subStats = st._subStats;
          for(var k in subStats)
          {

            var subStat = subStats[k];
            for(var j=0; j<subStat._times.length; j++)
            {
              var s = subStat._times[j];
              dispKey = (subStat._times.length > 1) ? (j+1)+' - '+k : k;
              chart.push([dispKey, s.start, s.end, s.dur, true]);

            }
          }
        }
      }
    }

    chart.sort(function(a,b)
    {
      if(a[1] < b[1])
      {
        return -1;
      }
      else if(a[1] == b[1])
      {
        if(a[3] && !b[3]) return -1;
        if(!a[3] && b[3]) return 1;
        return 0;
      }
      return 1;
    });

    return chart;
  },

  // Generate the traditional report show multiple runs averaged.
  _genReport: function(key) {
    var stat = this._statFor(key) ;
    var avg = (stat.runs > 0) ? (Math.floor(stat.amt * 1000 / stat.runs) / 1000) : 0 ;
    var last = stat._times[stat._times.length - 1];

    return 'BENCH %@ msec: %@ (%@x); latest: %@'.fmt(avg, (stat.name || key), stat.runs, last.end - last.start);
  },

  // Generate the report in the form of at time line. This returns the parent.
  _timelineGenReport: function(val)
  {
    if(this.globalStartTime)
    {
      return 'BENCH start: %@ msec, duration: %@ msec,  %@'.fmt((val[1]-this.globalStartTime), val[3], val[0]) ;
    }
    else
    {
      return 'BENCH duration: %@ msec, %@'.fmt( val[3],  val[0]) ;
    }
  },

  // Generate the report in the form of at time line. This returns the children.
  _timelineGenSubReport: function(val)
  {
    if(this.globalStartTime)
    {
      return '   CHECKPOINT BENCH start: %@ msec, duration: %@ msec,  %@'.fmt((val[1]-this.globalStartTime), val[3], val[0]) ;
    }
    else
    {
      return '   CHECKPOINT BENCH duration: %@ msec, %@'.fmt( val[3], val[0]) ;
    }
  },

  // returns a stats hash for the named key and parent key.  If the hash does not exist yet,
  // creates it.
  _subStatFor: function(key, parentKey) {
    var parentTimeLen = this.stats[parentKey]._times.length;
    if(parentTimeLen === 0) return;
    var parentSubStats = this.stats[parentKey]._times[this.stats[parentKey]._times.length-1]._subStats;
    var ret = parentSubStats[key] ;
    if (!ret) {
      parentSubStats[key] = {
        runs: 0, amt: 0, name: key, _starts: [], _times: []
      };
      ret = parentSubStats[key];
    }
    return ret ;
  },

  // returns a stats hash for the named key.  If the hash does not exist yet,
  // creates it.
  _statFor: function(key) {
    var ret = this.stats[key] ;
    if (!ret) {
      ret = this.stats[key] = {
        runs: 0, amt: 0, name: key, _starts: [], _times: []
      };
      ret = this.stats[key];
    }
    return ret ;
  },

  reset: function() { this.stats = {} ; },

  // This is private, but it is used in some places, so we are keeping this for
  // compatibility.
  _bench: function(func, name) {
    SC.Benchmark.bench(func, name, 1) ;
  },

  _benchCount: 1

} ;

SC.Benchmark = SC.Benchmark;

/* >>>>>>>>>> BEGIN source/system/cookie.js */
// ==========================================================================
// SC.Cookie
// ==========================================================================

/** @class

  Allows for easier handling of the document.cookie object. To create a cookie,
  simply call SC.Cookie.create. To retrieve a cookie, use SC.Cookie.find.
  Cookies are not added to document.cookie, which SC.Cookie.find uses, until you
  have called SC.Cookie#write.

  Heavy inspiration from the
  {@link <a href="http://plugins.jquery.com/project/cookie">jQuery cookie plugin</a>}.

  @extends SC.Object
  @since Sproutcore 1.0
  @author Colin Campbell
*/

SC.Cookie = SC.Object.extend({

  // ..........................................................
  // PROPERTIES
  //

  /**
    The name of the cookie

    @property {String}
  */
  name: null,

  /**
    The value of the cookie

    @property {String}
  */
  value: '',

  /**
    Amount of time until the cookie expires. Set to -1 in order to delete the cookie.

    @property {Integer|SC.DateTime|Date}
  */
  expires: null,

  /**
    The value of the path atribute of the cookie (default: path of page that created the cookie).

    @property {String}
  */
  path: null,

  /**
    The value of the domain attribute of the cookie (default: domain of page that created the cookie).

    @property {String}
  */
  domain: null,

  /**
    If true, the secure attribute of the cookie will be set and the cookie transmission will
    require a secure protocol (like HTTPS).

    @property {Boolean}
  */
  secure: NO,

  /**
    Walk like a duck

    @property {Boolean}
    @isReadOnly
  */
  isCookie: YES,

  // ..........................................................
  // METHODS
  //

  /**
    Sets SC.Cookie#expires to -1, which destroys the cookie.
  */
  destroy: function() {
    this.set('expires', -1);
    this.write();

    arguments.callee.base.apply(this,arguments);
  },

  /**
    Writes this SC.Cookie to document.cookie and adds it to SC.Cookie collection. To find this
    cookie later, or on reload, use SC.Cookie.find.

    @see SC.Cookie.find
  */
  write: function() {
    var name = this.get('name'),
        value = this.get('value'),
        expires = this.get('expires'),
        path = this.get('path'),
        domain = this.get('domain'),
        secure = this.get('secure');

    var expiresOutput = '';
    if (expires && (SC.typeOf(expires) === SC.T_NUMBER || (SC.DateTime && expires.get && expires.get('milliseconds')) || SC.typeOf(expires.toUTCString) === SC.T_FUNCTION)) {
      var date;
      if (SC.typeOf(expires) === SC.T_NUMBER) {
        date = new Date();
        date.setTime(date.getTime()+(expires*24*60*60*1000));
      }
      else if (SC.DateTime && expires.get && expires.get('milliseconds')) {
        date = new Date(expires.get('milliseconds'));
      }
      else if (SC.typeOf(expires.toUTCString) === SC.T_FUNCTION) {
        date = expires;
      }

      if (date) {
        expiresOutput = '; expires=' + date.toUTCString();
      }
    }

    var pathOutput = path ? '; path=' + path : '';
    var domainOutput = domain ? '; domain=' + domain : '';
    var secureOutput = secure ? '; secure' : '';

    document.cookie = [name, '=', encodeURIComponent(value), expiresOutput, pathOutput, domainOutput, secureOutput].join('');

    return this;
  }

});

SC.Cookie.mixin(
  /** @scope SC.Cookie */ {

  /**
    Finds a cookie that has been stored

    @param {String} name The name of the cookie
    @returns SC.Cookie object containing name and value of cookie
  */
  find: function(name) {
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = String(cookies[i]).trim();
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
          return SC.Cookie.create({
            name: name,
            value: decodeURIComponent(cookie.substring(name.length + 1))
          });
        }
      }
    }
    return null;
  }

});

/* >>>>>>>>>> BEGIN source/system/core_query.js */
SC.mixin(SC.$.fn, /** @scope SC.$.prototype */ {

  /**
    You can either pass a single class name and a boolean indicating whether
    the value should be added or removed, or you can pass a hash with all
    the class names you want to add or remove with a boolean indicating
    whether they should be there or not.

    This is far more efficient than using addClass/removeClass.

    @param {String|Hash} className class name or hash of classNames + bools
    @param {Boolean} shouldAdd for class name if a string was passed
    @returns {SC.CoreQuery} receiver
  */
  setClass: function(className, shouldAdd) {
    if (SC.none(className)) { return this; } //nothing to do
    var isHash = SC.typeOf(className) !== SC.T_STRING,
        fix = this._fixupClass, key;

    this.each(function() {
      if (this.nodeType !== 1) { return; } // nothing to do

      // collect the class name from the element and build an array
      var classNames = this.className.split(/\s+/), didChange = NO;

      // loop through hash or just fix single className
      if (isHash) {
        for(var key in className) {
          if (className.hasOwnProperty(key)) {
            didChange = fix(classNames, key, className[key]) || didChange;
          }
        }
      } else {
        didChange = fix(classNames, className, shouldAdd);
      }

      // if classNames were changed, join them and set...
      if (didChange) { this.className = classNames.join(' '); }
    });
    return this ;
  },

  /** @private used by setClass */
  _fixupClass: function(classNames, name, shouldAdd) {
    var indexOf = classNames.indexOf(name);
    // if should add, add class...
    if (shouldAdd) {
      if (indexOf < 0) { classNames.push(name); return YES ; }

    // otherwise, null out class name (this will leave some extra spaces)
    } else if (indexOf >= 0) { classNames[indexOf]=null; return YES; }
    return NO ;
  }


});

/* >>>>>>>>>> BEGIN source/system/datetime.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Standard error thrown by SC.Scanner when it runs out of bounds
  
  @property {Error}
*/
SC.SCANNER_OUT_OF_BOUNDS_ERROR = new Error("Out of bounds.");

/**
  Standard error thrown by SC.Scanner when  you pass a value not an integer.
  
  @property {Error}
*/
SC.SCANNER_INT_ERROR = new Error("Not an int.");

/**
  Standard error thrown by SC.SCanner when it cannot find a string to skip.
  
  @property {Error}
*/
SC.SCANNER_SKIP_ERROR = new Error("Did not find the string to skip.");

/** 
  Standard error thrown by SC.Scanner when it can any kind a string in the 
  matching array.
*/
SC.SCANNER_SCAN_ARRAY_ERROR = new Error("Did not find any string of the given array to scan.");

/**
  Standard error thrown when trying to compare two dates in different 
  timezones.
  
  @property {Error}
*/
SC.DATETIME_COMPAREDATE_TIMEZONE_ERROR = new Error("Can't compare the dates of two DateTimes that don't have the same timezone.");

/**
  Standard ISO8601 date format
  
  @property {String}
*/
SC.DATETIME_ISO8601 = '%Y-%m-%dT%H:%M:%S%Z';


/** @class

  A Scanner reads a string and interprets the characters into numbers. You
  assign the scanner's string on initialization and the scanner progresses
  through the characters of that string from beginning to end as you request
  items.
  
  Scanners are used by DateTime to convert strings into DateTime objects.
  
  @extends SC.Object
  @since SproutCore 1.0
  @author Martin Ottenwaelter
*/
SC.Scanner = SC.Object.extend(
/** @scope SC.Scanner.prototype */ {
  
  /**
    The string to scan. You usually pass it to the create method:
    
    {{{
      SC.Scanner.create({string: 'May, 8th'});
    }}}
    
    @property
    @type {String}
  */
  string: null,
  
  /**
    The current scan location. It is incremented by the scanner as the
    characters are processed.
    The default is 0: the beginning of the string.
    
    @property
    @type {integer}
  */
  scanLocation: 0,
  
  /**
    Reads some characters from the string, and increments the scan location
    accordingly. 
    
    @param {integer} len the amount of characters to read
    @throws {SC.SCANNER_OUT_OF_BOUNDS_ERROR} if asked to read too many characters
    @returns {String} the characters
  */
  scan: function(len) {
    if (this.scanLocation + len > this.length) throw SC.SCANNER_OUT_OF_BOUNDS_ERROR;
    var str = this.string.substr(this.scanLocation, len);
    this.scanLocation += len;
    return str;
  },
  
  /**
    Reads some characters from the string and interprets it as an integer.
    
    @param {integer} min_len the minimum amount of characters to read
    @param {integer} max_len optionally the maximum amount of characters to read (defaults to the minimum)
    @throws {SC.SCANNER_INT_ERROR} if asked to read non numeric characters
    @returns {integer} the scanned integer
  */
  scanInt: function(min_len, max_len) {
    if (max_len === undefined) max_len = min_len;
    var str = this.scan(max_len);
    var re = new RegExp("^\\d{" + min_len + "," + max_len + "}");
    var match = str.match(re);
    if (!match) throw SC.SCANNER_INT_ERROR;
    if (match[0].length < max_len) {
      this.scanLocation += match[0].length - max_len;
    }
    return parseInt(match[0], 10);
  },
  
  /**
    Attempts to skip a given string.
    
    @param {String} str the string to skip
    @throws {SC.SCANNER_SKIP_ERROR} if the given string could not be scanned
    @returns {Boolean} YES if the given string was successfully scanned
  */
  skipString: function(str) {
    if (this.scan(str.length) !== str) throw SC.SCANNER_SKIP_ERROR;
    return YES;
  },
  
  /**
    Attempts to scan any string in a given array.
    
    @param {Array} ary the array of strings to scan
    @throws {SC.SCANNER_SCAN_ARRAY_ERROR} if no string of the given array is found
    @returns {integer} the index of the scanned string of the given array
  */
  scanArray: function(ary) {
    for (var i = 0, len = ary.length; i < len; i++) {
      if (this.scan(ary[i].length) === ary[i]) {
        return i;
      }
      this.scanLocation -= ary[i].length;
    }
    throw SC.SCANNER_SCAN_ARRAY_ERROR;
  }
  
});


/** @class

  A class representation of a date and time. It's basically a wrapper around
  the Date javascript object, KVO friendly and with common date/time
  manipulation methods.

  This object differs from the standard JS Date object, however, in that it
  supports time zones other than UTC and that local to the machine on which
  it is running.  Any time zone can be specified when creating an SC.DateTime
  object, e.g

    // Creates a DateTime representing 5am in Washington, DC and 10am in London
    var d = SC.DateTime.create({ hour: 5, timezone: 300 }); // -5 hours from UTC
    var e = SC.DateTime.create({ hour: 10, timezone: 0 }); // same time, specified in UTC
    
    and it is true that d.isEqual(e).

  The time zone specified upon creation is permanent, and any calls to get() on that
  instance will return values expressed in that time zone.  So,
  
    d.get('hour') returns 5.
    e.get('hour') returns 10.
    
    but
    
    d.get('milliseconds') === e.get('milliseconds') is true, since they are technically the same position in time.
  
  @extends SC.Object
  @extends SC.Freezable
  @extends SC.Copyable
  @author Martin Ottenwaelter
  @author Jonathan Lewis
  @author Josh Holt
  @since SproutCore 1.0
*/
SC.DateTime = SC.Object.extend(SC.Freezable, SC.Copyable,
  /** @scope SC.DateTime.prototype */ {
  
  /** @private
    Internal representation of a date: the number of milliseconds
    since January, 1st 1970 00:00:00.0 UTC.
    
    @property
    @type {Integer}
  */
  _ms: 0,
  
  /** @read-only
    The offset, in minutes, between UTC and the object's timezone.
    All calls to get() will use this time zone to translate date/time
    values into the zone specified here.
    
    @property
    @type {Integer}
  */
  timezone: 0,
  
  /**
    A DateTime instance is frozen by default for better performance.
    
    @property
    @type {Boolean}
  */
  isFrozen: YES,
  
  /**
    Returns a new DateTime object where one or more of the elements have been
    changed according to the options parameter. The time options (hour,
    minute, sec, usec) reset cascadingly, so if only the hour is passed, then
    minute, sec, and usec is set to 0. If the hour and minute is passed, then
    sec and usec is set to 0.
    
    (Parts copied from the Ruby On Rails documentation)
    
    If a time zone is passed in the options hash, all dates and times are assumed
    to be local to it, and the returned DateTime instance has that time zone.  If
    none is passed, it defaults to SC.DateTime.timezone.

    Note that passing only a time zone does not affect the actual milliseconds since
    Jan 1, 1970, only the time zone in which it is expressed when displayed.
    
    @see SC.DateTime#create for the list of options you can pass
    @returns {DateTime} copy of receiver
  */
  adjust: function(options, resetCascadingly) {
    var timezone;
    
    options = options ? SC.clone(options) : {};
    timezone = (options.timezone !== undefined) ? options.timezone : (this.timezone !== undefined) ? this.timezone : 0;
    
    return this.constructor._adjust(options, this._ms, timezone, resetCascadingly)._createFromCurrentState();
  },
  
  /**
    Returns a new DateTime object advanced according the the given parameters.
    Don't use floating point values, it might give unpredicatble results.
    
    @see SC.DateTime#create for the list of options you can pass
    @param {Hash} options the amount of date/time to advance the receiver
    @returns {DateTime} copy of the receiver
  */
  advance: function(options) {
    return this.constructor._advance(options, this._ms, this.timezone)._createFromCurrentState();
  },
  
  /**
    Generic getter.
    
    The properties you can get are:
      - 'year'
      - 'month' (January is 1, contrary to JavaScript Dates for which January is 0)
      - 'day'
      - 'dayOfWeek' (Sunday is 0)
      - 'hour'
      - 'minute'
      - 'second'
      - 'millisecond'
      - 'milliseconds', the number of milliseconds since
        January, 1st 1970 00:00:00.0 UTC
      - 'isLeapYear', a boolean value indicating whether the receiver's year
        is a leap year
      - 'daysInMonth', the number of days of the receiver's current month
      - 'dayOfYear', January 1st is 1, December 31th is 365 for a common year
      - 'week' or 'week1', the week number of the current year, starting with
        the first Sunday as the first day of the first week (00..53)
      - 'week0', the week number of the current year, starting with
        the first Monday as the first day of the first week (00..53)
      - 'lastMonday', 'lastTuesday', etc., 'nextMonday', 'nextTuesday', etc.,
        the date of the last or next weekday in comparison to the receiver.
    
    @param {String} key the property name to get
    @return the value asked for
  */
  unknownProperty: function(key) {
    return this.constructor._get(key, this._ms, this.timezone);
  },
  
  /**
    Formats the receiver according to the given format string. Should behave
    like the C strftime function.
  
    The format parameter can contain the following characters:
      - %a - The abbreviated weekday name (``Sun'')
      - %A - The full weekday name (``Sunday'')
      - %b - The abbreviated month name (``Jan'')
      - %B - The full month name (``January'')
      - %c - The preferred local date and time representation
      - %d - Day of the month (01..31)
      - %h - Hour of the day, 24-hour clock (0..23)
      - %H - Hour of the day, 24-hour clock (00..23)
      - %i - Hour of the day, 12-hour clock (1..12)
      - %I - Hour of the day, 12-hour clock (01..12)
      - %j - Day of the year (001..366)
      - %m - Month of the year (01..12)
      - %M - Minute of the hour (00..59)
      - %p - Meridian indicator (``AM'' or ``PM'')
      - %S - Second of the minute (00..60)
      - %U - Week number of the current year,
          starting with the first Sunday as the first
          day of the first week (00..53)
      - %W - Week number of the current year,
          starting with the first Monday as the first 
          day of the first week (00..53)
      - %w - Day of the week (Sunday is 0, 0..6)
      - %x - Preferred representation for the date alone, no time
      - %X - Preferred representation for the time alone, no date
      - %y - Year without a century (00..99)
      - %Y - Year with century
      - %Z - Time zone (ISO 8601 formatted)
      - %% - Literal ``%'' character
    
    @param {String} format the format string
    @return {String} the formatted string
  */
  toFormattedString: function(fmt) {
    return this.constructor._toFormattedString(fmt, this._ms, this.timezone);
  },
  
  /**
    Formats the receiver according ISO 8601 standard. It is equivalent to
    calling toFormattedString with the '%Y-%m-%dT%H:%M:%S%Z' format string.
    
    @return {String} the formatted string
  */
  toISO8601: function(){
    return this.constructor._toFormattedString(SC.DATETIME_ISO8601, this._ms, this.timezone);
  },
  
  /** @private
    Creates a string representation of the receiver.
    (Debuggers call all the time the toString method. Because of the way
    DateTime is designed, calling SC.DateTime._toFormattedString would
    have a nasty side effect. We shouldn't therefore call any of SC.DateTime's
    methods from toString)
    
    @returns {String}
  */
  toString: function() {
    return "UTC: " +
           new Date(this._ms).toUTCString() +
           ", timezone: " +
           this.timezone;
  },
  
  /**
    Returns YES if the passed DateTime is equal to the receiver, ie: if their
    number of milliseconds since January, 1st 1970 00:00:00.0 UTC are equal.
    This is the preferred method for testing equality.
  
    @see SC.DateTime#compare
    @param {SC.DateTime} aDateTime the DateTime to compare to
    @returns {Boolean}
  */
  isEqual: function(aDateTime) {
    return SC.DateTime.compare(this, aDateTime) === 0;
  },
  
  /**
    Returns a copy of the receiver. Because of the way DateTime is designed,
    it just returns the receiver.
    
    @returns {DateTime}
  */
  copy: function() {
    return this;
  },
  
  /**
    Returns a copy of the receiver with the timezone set to the passed
    timezone. The returned value is equal to the receiver (ie SC.Compare
    returns 0), it is just the timezone representation that changes.
    
    If you don't pass any argument, the target timezone is assumed to be 0,
    ie UTC.

    Note that this method does not change the underlying position in time,
    but only the time zone in which it is displayed.  In other words, the underlying
    number of milliseconds since Jan 1, 1970 does not change.
    
    @return {DateTime}
  */
  toTimezone: function(timezone) {
    if (timezone === undefined) timezone = 0;
    return this.advance({ timezone: timezone - this.timezone });
  }
  
});

// Class Methods
SC.DateTime.mixin(SC.Comparable,
  /** @scope SC.DateTime */ {
  
  /**
    The default format (ISO 8601) in which DateTimes are stored in a record.
    Change this value if your backend sends and receives dates in another
    format.
    
    This value can also be customized on a per-attribute basis with the format
    property. For example:
      SC.Record.attr(SC.DateTime, { format: '%d/%m/%Y %H:%M:%S' })
    
    @property
    @type {String}
  */
  recordFormat: SC.DATETIME_ISO8601,
  
  /**
    The localized day names. Add the key '_SC.DateTime.dayNames' and its value
    to your strings.js file to add support for another language than English.

    @property
    @type {Array}
  */
  dayNames: '_SC.DateTime.dayNames'.loc().w(),
  
  /** @private
    The English day names used for the 'lastMonday',
    'nextTuesday', etc., getters.

    @property
    @type {Array}
  */
  _englishDayNames: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.w(),
  
  /**
    The localized abbreviated day names. Add the key
    '_SC.DateTime.abbreviatedDayNames' and its value to your strings.js
    file to add support for another language than English.

    @property
    @type {Array}
  */
  abbreviatedDayNames: '_SC.DateTime.abbreviatedDayNames'.loc().w(),

  /**
    The localized month names. Add the key '_SC.DateTime.monthNames' and its
    value to your strings.js file to add support for another language than
    English.

    @property
    @type {Array}
  */
  monthNames: '_SC.DateTime.monthNames'.loc().w(),

  /**
    The localized abbreviated month names. Add the key
    '_SC.DateTime.abbreviatedMonthNames' and its value to your strings.js
    file to add support for another language than English.

    @property
    @type {Array}
  */
  abbreviatedMonthNames: '_SC.DateTime.abbreviatedMonthNames'.loc().w(),
  
  /** @private
    The unique internal Date object used to make computations. Better
    performance is obtained by having only one Date object for the whole
    application and manipulating it with setTime() and getTime().
    
    Note that since this is used for internal calculations across many
    DateTime instances, it is not guaranteed to store the date/time that
    any one DateTime instance represents.  So it might be that
      
      this._date.getTime() !== this._ms

    Be sure to set it before using for internal calculations if necessary.

    @property
    @type {Date}
  */
  _date: new Date(),
  
  /** @private
    The offset, in minutes, between UTC and the currently manipulated
    DateTime instance.
    
    @property
    @type {Integer}
  */
  _tz: 0,
  
  /**
    The offset, in minutes, between UTC and the local system time. This
    property is computed at loading time and should never be changed.
    
    @property
    @type {Integer}
  */
  timezone: new Date().getTimezoneOffset(),
  
  /** @private
    A cache of SC.DateTime instances. If you attempt to create a SC.DateTime
    instance that has already been created, then it will return the cached
    value.

    @property
    @type {Array}
  */
  _dt_cache: {},
  
  /** @private
    The index of the lastest cached value. Used with _DT_CACHE_MAX_LENGTH to
    limit the size of the cache.

    @property
    @type {Integer}
  */
  _dt_cache_index: -1,
  
  /** @private
    The maximum length of _dt_cache. If this limit is reached, then the cache
    is overwritten, starting with the oldest element.

    @property
    @type {Integer}
  */
  _DT_CACHE_MAX_LENGTH: 1000,
  
  /** @private
    Both args are optional, but will only overwrite _date and _tz if defined.
    This method does not affect the DateTime instance's actual time, but simply
    initializes the one _date instance to a time relevant for a calculation.
    (this._date is just a resource optimization)

    This is mainly used as a way to store a recursion starting state during
    internal calculations.

    'milliseconds' is time since Jan 1, 1970.
    'timezone' is the current time zone we want to be working in internally.

    Returns a hash of the previous milliseconds and time zone in case they
    are wanted for later restoration.
  */
  _setCalcState: function(ms, timezone) {
    var previous = {
      milliseconds: this._date.getTime(),
      timezone: this._tz
    };

    if (ms !== undefined) this._date.setTime(ms);
    if (timezone !== undefined) this._tz = timezone;

    return previous;
  },

  /**
    By this time, any time zone setting on 'hash' will be ignored.
    'timezone' will be used, or the last this._tz.
  */
  _setCalcStateFromHash: function(hash, timezone) {
    var tz = (timezone !== undefined) ? timezone : this._tz; // use the last-known time zone if necessary
    var ms = this._toMilliseconds(hash, this._ms, tz); // convert the hash (local to specified time zone) to milliseconds (in UTC)
    return this._setCalcState(ms, tz); // now call the one we really wanted
  },

  /** @private
    @see SC.DateTime#unknownProperty
  */
  _get: function(key, start, timezone) {
    var ms, tz, doy, m, y, firstDayOfWeek, dayOfWeek, dayOfYear, prefix, suffix;
    var currentWeekday, targetWeekday;
    var d = this._date;
    var originalTime, v = null;

    // Set up an absolute date/time using the given milliseconds since Jan 1, 1970.
    // Only do it if we're given a time value, though, otherwise we want to use the
    // last one we had because this _get() method is recursive.
    //
    // Note that because these private time calc methods are recursive, and because all DateTime instances
    // share an internal this._date and this._tz state for doing calculations, methods
    // that modify this._date or this._tz should restore the last state before exiting
    // to avoid obscure calculation bugs.  So we save the original state here, and restore
    // it before returning at the end.
    originalTime = this._setCalcState(start, timezone); // save so we can restore it to how it was before we got here

    // Check this first because it is an absolute value -- no tweaks necessary when calling for milliseconds
    if (key === 'milliseconds') {
      v = d.getTime();
    }
    else if (key === 'timezone') {
      v = this._tz;
    }
    
    // 'nextWeekday' or 'lastWeekday'.
    // We want to do this calculation in local time, before shifting UTC below.
    if (v === null) {
      prefix = key.slice(0, 4);
      suffix = key.slice(4);
      if (prefix === 'last' || prefix === 'next') {
        currentWeekday = this._get('dayOfWeek', start, timezone);
        targetWeekday = this._englishDayNames.indexOf(suffix);    
        if (targetWeekday >= 0) {
          var delta = targetWeekday - currentWeekday;
          if (prefix === 'last' && delta >= 0) delta -= 7;
          if (prefix === 'next' && delta <  0) delta += 7;
          this._advance({ day: delta }, start, timezone);
          v = this._createFromCurrentState();
        }
      }
    }
    
    if (v === null) {
      // need to adjust for alternate display time zone.
      // Before calculating, we need to get everything into a common time zone to
      // negate the effects of local machine time (so we can use all the 'getUTC...() methods on Date).
      if (timezone !== undefined) {
        this._setCalcState(d.getTime() - (timezone * 60000), 0); // make this instance's time zone the new UTC temporarily
      }
    
      // simple keys
      switch (key) {
        case 'year':
          v = d.getUTCFullYear(); //TODO: investigate why some libraries do getFullYear().toString() or getFullYear()+""
          break;
        case 'month':
          v = d.getUTCMonth()+1; // January is 0 in JavaScript
          break;
        case 'day':
          v = d.getUTCDate();
          break;
        case 'dayOfWeek':
          v = d.getUTCDay();
          break;
        case 'hour':
          v = d.getUTCHours();
          break;
        case 'minute':
          v = d.getUTCMinutes();
          break;
        case 'second':
          v = d.getUTCSeconds();
          break;
        case 'millisecond':
          v = d.getUTCMilliseconds();
          break;
      }
      
      // isLeapYear
      if ((v === null) && (key === 'isLeapYear')) {
        y = this._get('year');
        v = (y%4 === 0 && y%100 !== 0) || y%400 === 0;
      }

      // daysInMonth
      if ((v === null) && (key === 'daysInMonth')) {
        switch (this._get('month')) {
          case 4:
          case 6:
          case 9:
          case 11:
            v = 30;
            break;
          case 2:
            v = this._get('isLeapYear') ? 29 : 28;
            break;
          default:
            v = 31;
            break;
        }
      }
    
      // dayOfYear
      if ((v === null) && (key === 'dayOfYear')) {
        ms = d.getTime(); // save time
        doy = this._get('day');
        this._setCalcStateFromHash({ day: 1 });
        for (m = this._get('month') - 1; m > 0; m--) {
          this._setCalcStateFromHash({ month: m });
          doy += this._get('daysInMonth');
        }
        d.setTime(ms); // restore time
        v = doy;
      }

      // week, week0 or week1
      if ((v === null) && (key.slice(0, 4) === 'week')) {
        // firstDayOfWeek should be 0 (Sunday) or 1 (Monday)
        firstDayOfWeek = key.length === 4 ? 1 : parseInt(key.slice('4'), 10);
        dayOfWeek = this._get('dayOfWeek');
        dayOfYear = this._get('dayOfYear') - 1;
        if (firstDayOfWeek === 0) {
          v = parseInt((dayOfYear - dayOfWeek + 7) / 7, 10);
        }
        else {
          v = parseInt((dayOfYear - (dayOfWeek - 1 + 7) % 7 + 7) / 7, 10);
        }
      }
    }

    // restore the internal calculation state in case someone else was in the
    // middle of a calculation (we might be recursing).
    this._setCalcState(originalTime.milliseconds, originalTime.timezone);

    return v;
  },

  /**
    Sets the internal calculation state to something specified.
  */
  _adjust: function(options, start, timezone, resetCascadingly) {
    var opts = options ? SC.clone(options) : {};
    var ms = this._toMilliseconds(options, start, timezone, resetCascadingly);
    this._setCalcState(ms, timezone);
    return this; // for chaining
  },
  
  /** @private
    @see SC.DateTime#advance
  */
  _advance: function(options, start, timezone) {
    var opts = options ? SC.clone(options) : {};
    var tz;

    for (var key in opts) {
      opts[key] += this._get(key, start, timezone);
    }
    
    // The time zone can be advanced by a delta as well, so try to use the
    // new value if there is one.
    tz = (opts.timezone !== undefined) ? opts.timezone : timezone; // watch out for zero, which is acceptable as a time zone

    return this._adjust(opts, start, tz, NO);
  },
  
  /* @private
    Converts a standard date/time options hash to an integer representing that position
    in time relative to Jan 1, 1970
  */
  _toMilliseconds: function(options, start, timezone, resetCascadingly) {
    var opts = options ? SC.clone(options) : {};
    var d = this._date;
    var previousMilliseconds = d.getTime(); // rather than create a new Date object, we'll reuse the instance we have for calculations, then restore it
    var ms, tz;

    // Initialize our internal for-calculations Date object to our current date/time.
    // Note that this object was created in the local machine time zone, so when we set
    // its params later, it will be assuming these values to be in the same time zone as it is.
    // It's ok for start to be null, in which case we'll just keep whatever we had in 'd' before.
    if (!SC.none(start)) {
      d.setTime(start); // using milliseconds here specifies an absolute location in time, regardless of time zone, so that's nice
    }
    
    // We have to get all time expressions, both in 'options' (assume to be in time zone 'timezone')
    // and in 'd', to the same time zone before we can any calculations correctly.  So because the Date object provides
    // a suite of UTC getters and setters, we'll temporarily redefine 'timezone' as our new
    // 'UTC', so we don't have to worry about local machine time.  We do this by subtracting
    // milliseconds for the time zone offset.  Then we'll do all our calculations, then convert
    // it back to real UTC.
    
    // (Zero time zone is considered a valid value.)
    tz = (timezone !== undefined) ? timezone : (this.timezone !== undefined) ? this.timezone : 0;
    d.setTime(d.getTime() - (tz * 60000)); // redefine 'UTC' to establish a new local absolute so we can use all the 'getUTC...()' Date methods
    
    // the time options (hour, minute, sec, millisecond)
    // reset cascadingly (see documentation)
    if (resetCascadingly === undefined || resetCascadingly === YES) {
      if ( !SC.none(opts.hour) && SC.none(opts.minute)) {
        opts.minute = 0;
      }
      if (!(SC.none(opts.hour) && SC.none(opts.minute))
          && SC.none(opts.second)) {
        opts.second = 0;
      }
      if (!(SC.none(opts.hour) && SC.none(opts.minute) && SC.none(opts.second))
          && SC.none(opts.millisecond)) {
        opts.millisecond = 0;
      }
    }
    
    // Get the current values for any not provided in the options hash.
    // Since everything is in 'UTC' now, use the UTC accessors.  We do this because,
    // according to javascript Date spec, you have to set year, month, and day together
    // if you're setting any one of them.  So we'll use the provided Date.UTC() method
    // to get milliseconds, and we need to get any missing values first...
    if (SC.none(opts.year))        opts.year = d.getUTCFullYear();
    if (SC.none(opts.month))       opts.month = d.getUTCMonth() + 1; // January is 0 in JavaScript
    if (SC.none(opts.day))         opts.day = d.getUTCDate();
    if (SC.none(opts.hour))        opts.hour = d.getUTCHours();
    if (SC.none(opts.minute))      opts.minute = d.getUTCMinutes();
    if (SC.none(opts.second))      opts.second = d.getUTCSeconds();
    if (SC.none(opts.millisecond)) opts.millisecond = d.getUTCMilliseconds();

    // Ask the JS Date to calculate milliseconds for us (still in redefined UTC).  It
    // is best to set them all together because, for example, a day value means different things
    // to the JS Date object depending on which month or year it is.  It can now handle that stuff
    // internally as it's made to do.
    ms = Date.UTC(opts.year, opts.month - 1, opts.day, opts.hour, opts.minute, opts.second, opts.millisecond);

    // Now that we've done all our calculations in a common time zone, add back the offset
    // to move back to real UTC.
    d.setTime(ms + (tz * 60000));
    ms = d.getTime(); // now get the corrected milliseconds value
    
    // Restore what was there previously before leaving in case someone called this method
    // in the middle of another calculation.
    d.setTime(previousMilliseconds);

    return ms;
  },
  
  /**
    Returns a new DateTime object advanced according the the given parameters.
    The parameters can be:
    - none, to create a DateTime instance initialized to the current
      date and time in the local timezone,
    - a integer, the number of milliseconds since
      January, 1st 1970 00:00:00.0 UTC
    - a options hash that can contain any of the following properties: year,
      month, day, hour, minute, second, millisecond, timezone
      
    Note that if you attempt to create a SC.DateTime instance that has already
    been created, then, for performance reasons, a cached value may be
    returned.
    
    The timezone option is the offset, in minutes, between UTC and local time.
    If you don't pass a timezone option, the date object is created in the
    local timezone. If you want to create a UTC+2 (CEST) date, for example,
    then you should pass a timezone of -120.
    
    @param options one of the three kind of parameters descibed above
    @returns {DateTime} the DateTime instance that corresponds to the
      passed parameters, possibly fetched from cache
  */
  create: function() {
    var arg = arguments.length === 0 ? {} : arguments[0];
    var timezone;
    
    // if simply milliseconds since Jan 1, 1970 are given, just use those
    if (SC.typeOf(arg) === SC.T_NUMBER) {
      arg = { milliseconds: arg };
    }

    // Default to local machine time zone if none is given
    timezone = (arg.timezone !== undefined) ? arg.timezone : this.timezone;
    if (timezone === undefined) timezone = 0;

    // Desired case: create with milliseconds if we have them.
    // If we don't, convert what we have to milliseconds and recurse.
    if (!SC.none(arg.milliseconds)) {

      // quick implementation of a FIFO set for the cache
      var key = 'nu' + arg.milliseconds + timezone, cache = this._dt_cache;
      var ret = cache[key];
      if (!ret) {
        var previousKey, idx = this._dt_cache_index, C = this;
        ret = cache[key] = new C([{ _ms: arg.milliseconds, timezone: timezone }]);
        idx = this._dt_cache_index = (idx + 1) % this._DT_CACHE_MAX_LENGTH;
        previousKey = cache[idx];
        if (previousKey !== undefined && cache[previousKey]) delete cache[previousKey];
        cache[idx] = key;
      }
      return ret;
    }
    // otherwise, convert what we have to milliseconds and try again
    else {
      var now = new Date();

      return this.create({ // recursive call with new arguments
        milliseconds: this._toMilliseconds(arg, now.getTime(), timezone, arg.resetCascadingly),
        timezone: timezone
      });
    }
  },
  
  /** @private
    Calls the create() method with the current internal _date value.
    
    @return {DateTime} the DateTime instance returned by create()
  */
  _createFromCurrentState: function() {
    return this.create({
      milliseconds: this._date.getTime(),
      timezone: this._tz
    });
  },
  
  /**
    Returns a DateTime object created from a given string parsed with a given
    format. Returns null if the parsing fails.

    @see SC.DateTime#toFormattedString for a description of the format parameter
    @param {String} str the string to parse
    @param {String} fmt the format to parse the string with
    @returns {DateTime} the DateTime corresponding to the string parameter
  */
  parse: function(str, fmt) {
    // Declared as an object not a literal since in some browsers the literal
    // retains state across function calls
    var re = new RegExp('(?:%([aAbBcdHIjmMpSUWwxXyYZ%])|(.))', "g");
    var d, parts, opts = {}, check = {}, scanner = SC.Scanner.create({string: str});
    
    if (SC.none(fmt)) fmt = SC.DATETIME_ISO8601;
    
    try {
      while ((parts = re.exec(fmt)) !== null) {
        switch(parts[1]) {
          case 'a': check.dayOfWeek = scanner.scanArray(this.abbreviatedDayNames); break;
          case 'A': check.dayOfWeek = scanner.scanArray(this.dayNames); break;
          case 'b': opts.month = scanner.scanArray(this.abbreviatedMonthNames) + 1; break;
          case 'B': opts.month = scanner.scanArray(this.monthNames) + 1; break;
          case 'c': throw "%c is not implemented";
          case 'd': opts.day = scanner.scanInt(1, 2); break;
          case 'H': opts.hour = scanner.scanInt(1, 2); break;
          case 'I': opts.hour = scanner.scanInt(1, 2); break;
          case 'j': throw "%j is not implemented";
          case 'm': opts.month = scanner.scanInt(1, 2); break;
          case 'M': opts.minute = scanner.scanInt(1, 2); break;
          case 'p': opts.meridian = scanner.scanArray(['AM', 'PM']); break;
          case 'S': opts.second = scanner.scanInt(1, 2); break;
          case 'U': throw "%U is not implemented";
          case 'W': throw "%W is not implemented";
          case 'w': throw "%w is not implemented";
          case 'x': throw "%x is not implemented";
          case 'X': throw "%X is not implemented";
          case 'y': opts.year = scanner.scanInt(2); opts.year += (opts.year > 70 ? 1900 : 2000); break;
          case 'Y': opts.year = scanner.scanInt(4); break;
          case 'Z':
            var modifier = scanner.scan(1);
            if (modifier === 'Z') {
              opts.timezone = 0;
            } else if (modifier === '+' || modifier === '-' ) {
              var h = scanner.scanInt(2);
              if (scanner.scan(1) !== ':') scanner.scan(-1);
              var m = scanner.scanInt(2);
              opts.timezone = (modifier === '+' ? -1 : 1) * (h*60 + m);
            }
            break;
          case '%': scanner.skipString('%'); break;
          default:  scanner.skipString(parts[0]); break;
        }
      }
    } catch (e) {
      console.log('SC.DateTime.createFromString ' + e.toString());
      return null;
    }
    
    if (!SC.none(opts.meridian) && !SC.none(opts.hour)) {
      if (opts.meridian === 1) opts.hour = (opts.hour + 12) % 24;
      delete opts.meridian;
    }
    
    d = SC.DateTime.create(opts);
    
    if (!SC.none(check.dayOfWeek) && d.get('dayOfWeek') !== check.dayOfWeek) {
      return null;
    }
    
    return d;
  },
  
  /** @private
    Converts the x parameter into a string padded with 0s so that the string’s
    length is at least equal to the len parameter.
    
    @param x the object to convert to a string
    @param {Integer} the minimum length of the returned string
    @returns {String} the padded string
  */
  _pad: function(x, len) {
  	var str = '' + x;
  	if (len === undefined) len = 2;
    while (str.length < len) str = '0' + str;
    return str;
  },
  
  /** @private
    @see SC.DateTime#_toFormattedString
  */
  __toFormattedString: function(part, start, timezone) {
    var hour, offset;

    // Note: all calls to _get() here should include only one
    // argument, since _get() is built for recursion and behaves differently
    // if arguments 2 and 3 are included.
    //
    // This method is simply a helper for this._toFormattedString() (one underscore);
    // this is only called from there, and _toFormattedString() has already
    // set up the appropriate internal date/time/timezone state for it.
    
    switch(part[1]) {
      case 'a': return this.abbreviatedDayNames[this._get('dayOfWeek')];
      case 'A': return this.dayNames[this._get('dayOfWeek')];
      case 'b': return this.abbreviatedMonthNames[this._get('month')-1];
      case 'B': return this.monthNames[this._get('month')-1];
      case 'c': return this._date.toString();
      case 'd': return this._pad(this._get('day'));
      case 'D': return this._get('day');
      case 'h': return this._get('hour');
      case 'H': return this._pad(this._get('hour'));
      case 'i':
        hour = this._get('hour');
        return (hour === 12 || hour === 0) ? 12 : (hour + 12) % 12;
      case 'I': 
        hour = this._get('hour');
        return this._pad((hour === 12 || hour === 0) ? 12 : (hour + 12) % 12);
      case 'j': return this._pad(this._get('dayOfYear'), 3);
      case 'm': return this._pad(this._get('month'));
      case 'M': return this._pad(this._get('minute'));
      case 'p': return this._get('hour') > 11 ? 'PM' : 'AM';
      case 'S': return this._pad(this._get('second'));
      case 'u': return this._pad(this._get('utc')); //utc
      case 'U': return this._pad(this._get('week0'));
      case 'W': return this._pad(this._get('week1'));
      case 'w': return this._get('dayOfWeek');
      case 'x': return this._date.toDateString();
      case 'X': return this._date.toTimeString();
      case 'y': return this._pad(this._get('year') % 100);
      case 'Y': return this._get('year');
      case 'Z':
        offset = -1 * timezone;
        return (offset >= 0 ? '+' : '-')
               + this._pad(parseInt(Math.abs(offset)/60, 10))
               + ':'
               + this._pad(Math.abs(offset)%60);
      case '%': return '%';
    }
  },
  
  /** @private
    @see SC.DateTime#toFormattedString
  */
  _toFormattedString: function(format, start, timezone) {
    var that = this;
    var tz = (timezone !== undefined) ? timezone : (this.timezone !== undefined) ? this.timezone : 0;

    // need to move into local time zone for these calculations
    this._setCalcState(start - (timezone * 60000), 0); // so simulate a shifted 'UTC' time

    return format.replace(/\%([aAbBcdDHiIjmMpSUWwxXyYZ\%])/g, function() {
      var v = that.__toFormattedString.call(that, arguments, start, timezone);
      return v;
    });
  },
  
  /**
    This will tell you which of the two passed DateTime is greater than the
    other, by comparing if their number of milliseconds since
    January, 1st 1970 00:00:00.0 UTC.
 
    @param {SC.DateTime} a the first DateTime instance
    @param {SC.DateTime} b the second DateTime instance
    @returns {Integer} -1 if a < b, 
                       +1 if a > b,
                       0 if a == b
  */
  compare: function(a, b) {
    var ma = a.get('milliseconds');
    var mb = b.get('milliseconds');
    return ma < mb ? -1 : ma === mb ? 0 : 1;
  },
  
  /**
    This will tell you which of the two passed DateTime is greater than the
    other, by only comparing the date parts of the passed objects. Only dates
    with the same timezone can be compared.
 
    @param {SC.DateTime} a the first DateTime instance
    @param {SC.DateTime} b the second DateTime instance
    @returns {Integer} -1 if a < b,
                       +1 if a > b,
                       0 if a == b
    @throws {SC.DATETIME_COMPAREDATE_TIMEZONE_ERROR} if the passed arguments
      don't have the same timezone
  */
  compareDate: function(a, b) {
    if (a.get('timezone') !== b.get('timezone')) throw SC.DATETIME_COMPAREDATE_TIMEZONE_ERROR;
    var ma = a.adjust({hour: 0}).get('milliseconds');
    var mb = b.adjust({hour: 0}).get('milliseconds');
    return ma < mb ? -1 : ma === mb ? 0 : 1;
  }
  
});

/**
  Adds a transform to format the DateTime value to a String value according
  to the passed format string. 
  
  {{
    valueBinding: SC.Binding.dateTime('%Y-%m-%d %H:%M:%S')
                  .from('MyApp.myController.myDateTime');
  }}

  @param {String} format format string
  @returns {SC.Binding} this
*/
SC.Binding.dateTime = function(format) {
  return this.transform(function(value, binding) {
    return value ? value.toFormattedString(format) : null;
  });
};

if (SC.RecordAttribute && !SC.RecordAttribute.transforms[SC.guidFor(SC.DateTime)]) {

  /**
    Registers a transform to allow SC.DateTime to be used as a record attribute,
    ie SC.Record.attr(SC.DateTime);

    Because SC.RecordAttribute is in the datastore framework and SC.DateTime in
    the foundation framework, and we don't know which framework is being loaded
    first, this chunck of code is duplicated in both frameworks.

    IF YOU EDIT THIS CODE MAKE SURE YOU COPY YOUR CHANGES to record_attribute.js. 
  */
  SC.RecordAttribute.registerTransform(SC.DateTime, {
  
    /** @private
      Convert a String to a DateTime
    */
    to: function(str, attr) {
      if (SC.none(str) || SC.instanceOf(str, SC.DateTime)) return str;
      var format = attr.get('format');
      return SC.DateTime.parse(str, format ? format : SC.DateTime.recordFormat);
    },
  
    /** @private
      Convert a DateTime to a String
    */
    from: function(dt, attr) {
      if (SC.none(dt)) return dt;
      var format = attr.get('format');
      return dt.toFormattedString(format ? format : SC.DateTime.recordFormat);
    }
  });
  
}

/* >>>>>>>>>> BEGIN source/system/exception_handler.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  If an exception is thrown during execution of your SproutCore app, this
  object will be given the opportunity to handle it.

  By default, a simple error message is displayed prompting the user to
  reload. You could override the handleException method to, for example, send
  an XHR to your servers so you can collect information about crashes in your
  application.

  Since the application is in an unknown state when an exception is thrown, we
  rely on JavaScript and DOM manipulation to generate the error instead of
  using SproutCore views.

  @since SproutCore 1.5
*/

SC.ExceptionHandler = {

  enabled: (SC.buildMode !== 'debug'),

  /**
    Called when an exception is encountered by code executed using SC.run().

    By default, this will display an error dialog to the user. If you
    want more sophisticated behavior, override this method.

    @param {Exception} exception the exception thrown during execution
  */
  handleException: function(exception) {
    if (this.isShowingErrorDialog) return;

    this._displayErrorDialog(exception);
  },

  /** @private
    Creates the error dialog and appends it to the DOM.

    @param {Exception} exception the exception to display
  */
  _displayErrorDialog: function(exception) {
    var html = this._errorDialogHTMLForException(exception),
        node = document.createElement('div');

    node.style.cssText = "left: 0px; right: 0px; top: 0px; bottom: 0px; position: absolute; background-color: white; background-color: rgba(255,255,255,0.6); z-index:100;";
    node.innerHTML = html;

    document.body.appendChild(node);

    this.isShowingErrorDialog = YES;
  },

  /** @private
    Given an exception, returns the HTML for the error dialog.

    @param {Exception} exception the exception to display
    @returns {String}
  */
  _errorDialogHTMLForException: function(exception) {
    var html;

    html = [
'<div id="sc-error-dialog" style="position: absolute; width: 500px; left: 50%; top: 50%; margin-left: -250px; background-color: white; border: 1px solid black; font-family: Monaco, monospace; font-size: 9px; letter-spacing: 1px; padding: 10px">',
  'An error has occurred which prevents the application from running:',
  '<br><br>',
  exception.message,
  '<div id="sc-error-dialog-reload-button" onclick="window.location.reload();" style="float: right; font-family: Monaco, monospace; font-size: 9px; letter-spacing: 1px; border: 1px solid black; padding: 3px; clear: both; margin-top: 20px; cursor: pointer;">',
  'Reload',
  '</div>',
'</div>'
    ];

    return html.join('');
  },

  /**
    YES if an exception was thrown and the error dialog is visible.

    @property {Boolean}
  */
  isShowingErrorDialog: NO
};
/* >>>>>>>>>> BEGIN source/system/image_queue.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.IMAGE_ABORTED_ERROR = SC.$error("SC.Image.AbortedError", "Image", -100) ;

SC.IMAGE_FAILED_ERROR = SC.$error("SC.Image.FailedError", "Image", -101) ;

/**
  @class
  
  The image queue can be used to control the order of loading images.
  
  Images queues are necessary because browsers impose strict limits on the 
  number of concurrent connections that can be open at any one time to any one 
  host. By controlling the order and timing of your loads using this image 
  queue, you can improve the percieved performance of your application by 
  ensuring the images you need most load first.
  
  Note that if you use the SC.ImageView class, it will use this image queue 
  for you automatically.
  
  h1. Loading Images
  
  When you need to display an image, simply call the loadImage() method with 
  the URL of the image, along with a target/method callback. The signature of 
  your callback should be:
  
  {{{
    imageDidLoad: function(imageUrl, imageOrError) {
      //...
    }
  }}}

  The "imageOrError" parameter will contain either an image object or an error 
  object if the image could not be loaded for some reason.  If you receive an 
  error object, it will be one of SC.IMAGE_ABORTED_ERROR or 
  SC.IMAGE_FAILED_ERROR.
  
  You can also optionally specify that the image should be loaded in the 
  background.  Background images are loaded with a lower priority than 
  foreground images.
  
  h1. Aborting Image Loads
  
  If you request an image load but then no longer require the image for some 
  reason, you should notify the imageQueue by calling the releaseImage() 
  method.  Pass the URL, target and method that you included in your original 
  loadImage() request.  
  
  If you have requested an image before, you should always call releaseImage() 
  when you are finished with it, even if the image has already loaded.  This 
  will allow the imageQueue to properly manage its own internal resources.
  
  This method may remove the image from the queue of images that need or load 
  or it may abort an image load in progress to make room for other images.  If 
  the image is already loaded, this method will have no effect.
  
  h1. Reloading an Image
  
  If you have already loaded an image, the imageQueue will avoid loading the 
  image again.  However, if you need to force the imageQueue to reload the 
  image for some reason, you can do so by calling reloadImage(), passing the 
  URL.
  
  This will cause the image queue to attempt to load the image again the next 
  time you call loadImage on it.
  
  @extends SC.Object
  @since SproutCore 1.0
*/
SC.imageQueue = SC.Object.create(/** @scope SC.imageQueue.prototype */ {

  /**
    The maximum number of images that can load from a single hostname at any
    one time.  For most browsers 4 is a reasonable number, though you may 
    tweak this on a browser-by-browser basis.
  */
  loadLimit: 4,
  
  /**
    The number of currently active requests on the queue. 
  */
  activeRequests: 0,
  
  /**
    Loads an image from the server, calling your target/method when complete.
    
    You should always pass at least a URL and optionally a target/method.  If 
    you do not pass the target/method, the image will be loaded in background 
    priority.  Usually, however, you will want to pass a callback to be 
    notified when the image has loaded.  Your callback should have a signature 
    like:

    {{{
      imageDidLoad: function(imageUrl, imageOrError) { .. }
    }}}
    
    If you do pass a target/method you can optionally also choose to load the 
    image either in the foreground or in the background.  The imageQueue 
    prioritizes foreground images over background images.  This does not impact 
    how many images load at one time.
    
    @param {String} url
    @param {Object} target
    @param {String|Function} method
    @param {Boolean} isBackgroundFlag
    @returns {SC.imageQueue} receiver
  */
  loadImage: function(url, target, method, isBackgroundFlag) {
    // normalize params
    var type = SC.typeOf(target);
    if (SC.none(method) && SC.typeOf(target)===SC.T_FUNCTION) {
      target = null; method = target ;
    }
    if (SC.typeOf(method) === SC.T_STRING) {
      method = target[method];      
    }
    // if no callback is passed, assume background image.  otherwise, assume
    // foreground image.
    if (SC.none(isBackgroundFlag)) {
      isBackgroundFlag = SC.none(target) && SC.none(method);
    }
    
    // get image entry in queue.  If entry is loaded, just invoke callback
    // and quit.
    var entry = this._imageEntryFor(url) ;
    if (entry.status === this.IMAGE_LOADED) {
      if (method) method.call(target || entry.image, entry.url, entry.image);
      
    // otherwise, add to list of callbacks and queue image.
    } else {
      if (target || method) this._addCallback(entry, target, method);
      entry.retainCount++; // increment retain count, regardless of callback
      this._scheduleImageEntry(entry, isBackgroundFlag);
    }
  },
  
  /**
    Invoke this method when you are finished with an image URL.  If you 
    passed a target/method, you should also pass it here to remove it from
    the list of callbacks.
    
    @param {String} url
    @param {Object} target
    @param {String|Function} method
    @returns {SC.imageQueue} receiver
  */
  releaseImage: function(url, target, method) {
    // get entry.  if there is no entry, just return as there is nothing to 
    // do.
    var entry = this._imageEntryFor(url, NO) ;
    if (!entry) return this ;
    
    // there is an entry, decrement the retain count.  If <=0, delete!
    if (--entry.retainCount <= 0) {
      this._deleteEntry(entry); 
    
    // if >0, just remove target/method if passed
    } else if (target || method) {
      // normalize
      var type = SC.typeOf(target);
      if (SC.none(method) && SC.typeOf(target)===SC.T_FUNCTION) {
        target = null; method = target ;
      }
      if (SC.typeOf(method) === SC.T_STRING) {
        method = target[method];      
      }

      // and remove
      this._removeCallback(entry, target, method) ;
    }
  },

  /** 
    Forces the image to reload the next time you try to load it.
  */
  reloadImage: function(url) {
    var entry = this._imageEntryFor(url, NO); 
    if (entry && entry.status===this.IMAGE_LOADED) {
      entry.status = this.IMAGE_WAITING;
    }
  },
  
  /**
    Initiates a load of the next image in the image queue.  Normally you will
    not need to call this method yourself as it will be initiated 
    automatically when the queue becomes active.
  */
  loadNextImage: function() {
    var entry = null, queue;

    // only run if we don't have too many active request...
    if (this.get('activeRequests')>=this.get('loadLimit')) return; 
    
    // first look in foreground queue
    queue = this._foregroundQueue ;
    while(queue.length>0 && !entry) entry = queue.shift();
    
    // then look in background queue
    if (!entry) {
      queue = this._backgroundQueue ;
      while(queue.length>0 && !entry) entry = queue.shift();
    }
    this.set('isLoading', !!entry); // update isLoading...
    
    // if we have an entry, then initiate an image load with the proper 
    // callbacks.
    if (entry) {
      // var img = (entry.image = new Image()) ;
      var img = entry.image ;
      if(!img) return;
      img.onabort = this._imageDidAbort ;
      img.onerror = this._imageDidError ;
      img.onload = this._imageDidLoad ;
      img.src = entry.url ;
      
      // add to loading queue.
      this._loading.push(entry) ;
    
      // increment active requests and start next request until queue is empty
      // or until load limit is reached.
      this.incrementProperty('activeRequests');
      this.loadNextImage();
    } 
  },
  
  // ..........................................................
  // SUPPORT METHODS
  // 

  /** @private Find or create an entry for the URL. */
  _imageEntryFor: function(url, createIfNeeded) {
    if (createIfNeeded === undefined) createIfNeeded = YES;
    var entry = this._images[url] ;
    if (!entry && createIfNeeded) {
      var img = new Image() ;
      entry = this._images[url] = { 
        url: url, status: this.IMAGE_WAITING, callbacks: [], retainCount: 0, image: img
      };
      img.entry = entry ; // provide a link back to the image
    }
    return entry ;
  },
  
  /** @private deletes an entry from the image queue, descheduling also */
  _deleteEntry: function(entry) {
    this._unscheduleImageEntry(entry) ;
    delete this._images[entry.url];    
  },
  
  /** @private 
    Add a callback to the image entry.  First search the callbacks to make
    sure this is only added once.
  */
  _addCallback: function(entry, target, method) {
    var callbacks = entry.callbacks;

    // try to find in existing array
    var handler = callbacks.find(function(x) {
      return x[0]===target && x[1]===method;
    }, this);
    
    // not found, add...
    if (!handler) callbacks.push([target, method]);
    callbacks = null; // avoid memory leaks
    return this ;
  },
  
  /** @private
    Removes a callback from the image entry.  Removing a callback just nulls
    out that position in the array.  It will be skipped when executing.
  */
  _removeCallback: function(entry, target, method) {
    var callbacks = entry.callbacks ;
    callbacks.forEach(function(x, idx) {
      if (x[0]===target && x[1]===method) callbacks[idx] = null;
    }, this);
    callbacks = null; // avoid memory leaks
    return this ;
  },
  
  /** @private 
    Adds an entry to the foreground or background queue to load.  If the 
    loader is not already running, start it as well.  If the entry is in the
    queue, but it is in the background queue, possibly move it to the
    foreground queue.
  */
  _scheduleImageEntry: function(entry, isBackgroundFlag) {

    var background = this._backgroundQueue ;
    var foreground = this._foregroundQueue ;
    
    // if entry is loaded, nothing to do...
    if (entry.status === this.IMAGE_LOADED) return this;

    // if image is already in background queue, but now needs to be
    // foreground, simply remove from background queue....
    if ((entry.status===this.IMAGE_QUEUED) && !isBackgroundFlag && entry.isBackground) {
      background[background.indexOf(entry)] = null ;
      entry.status = this.IMAGE_WAITING ;
    }
    
    // if image is not in queue already, add to queue.
    if (entry.status!==this.IMAGE_QUEUED) {
      var queue = (isBackgroundFlag) ? background : foreground ;
      queue.push(entry);
      entry.status = this.IMAGE_QUEUED ;
      entry.isBackground = isBackgroundFlag ;
    }
    
    // if the image loader is not already running, start it...
    if (!this.isLoading) this.invokeLater(this.loadNextImage, 100);
    this.set('isLoading', YES);
    
    return this ; // done!
  },
  
  /** @private
    Removes an entry from the foreground or background queue.  
  */
  _unscheduleImageEntry: function(entry) {
    // if entry is not queued, do nothing
    if (entry.status !== this.IMAGE_QUEUED) return this ;
    
    var queue = entry.isBackground ? this._backgroundQueue : this._foregroundQueue ;
    queue[queue.indexOf(entry)] = null; 
    
    // if entry is loading, abort it also.  Call local abort method in-case
    // browser decides not to follow up.
    if (this._loading.indexOf(entry) >= 0) {
      // In some cases queue.image is undefined. Is it ever defined?
      if (queue.image) queue.image.abort();
      this.imageStatusDidChange(entry, this.ABORTED);
    }
    
    return this ;
  },
  
  /** @private invoked by Image().  Note that this is the image instance */
  _imageDidAbort: function() {
    SC.run(function() {
      SC.imageQueue.imageStatusDidChange(this.entry, SC.imageQueue.ABORTED);
    }, this);
  },
  
  _imageDidError: function() {
    SC.run(function() {
      SC.imageQueue.imageStatusDidChange(this.entry, SC.imageQueue.ERROR);
    }, this);
  },
  
  _imageDidLoad: function() {
    SC.run(function() {
      SC.imageQueue.imageStatusDidChange(this.entry, SC.imageQueue.LOADED);
    }, this);
  },

  /** @private called whenever the image loading status changes.  Notifies
    items in the queue and then cleans up the entry.
  */
  imageStatusDidChange: function(entry, status) {
    if (!entry) return; // nothing to do...
    
    var url = entry.url ;
    
    // notify handlers.
    var value ;
    switch(status) {
      case this.LOADED:
        value = entry.image;
        break;
      case this.ABORTED:
        value = SC.IMAGE_ABORTED_ERROR;
        break;
      case this.ERROR:
        value = SC.IMAGE_FAILED_ERROR ;
        break;
      default:
        value = SC.IMAGE_FAILED_ERROR ;
        break;
    }
    entry.callbacks.forEach(function(x){
      var target = x[0], method = x[1];
      method.call(target, url, value);
    },this);
    
    // now clear callbacks so they aren't called again.
    entry.callbacks = [];
    
    // finally, if the image loaded OK, then set the status.  Otherwise
    // set it to waiting so that further attempts will load again
    entry.status = (status === this.LOADED) ? this.IMAGE_LOADED : this.IMAGE_WAITING ;
    
    // now cleanup image...
    var image = entry.image ;
    if (image) {
      image.onload = image.onerror = image.onabort = null ; // no more notices
      if (status !== this.LOADED) entry.image = null;
    }

    // remove from loading queue and periodically compact
    this._loading[this._loading.indexOf(entry)]=null;
    if (this._loading.length > this.loadLimit*2) {
      this._loading = this._loading.compact();
    }
    
    this.decrementProperty('activeRequests');
    this.loadNextImage() ;
  },
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this._images = {};
    this._loading = [] ;
    this._foregroundQueue = [];
    this._backgroundQueue = [];
  },
  
  IMAGE_LOADED: "loaded",
  IMAGE_QUEUED: "queued",
  IMAGE_WAITING: "waiting",
  
  ABORTED: 'aborted',
  ERROR: 'error',
  LOADED: 'loaded'
});

/* >>>>>>>>>> BEGIN source/system/math.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @class
  
  Implements some enhancements to the built-in Number object that makes it
  easier to handle rounding and display of numbers.
  
  @since SproutCore 1.0
  @author Colin Campbell
*/
SC.Math = SC.Object.create({
  
  /**
    Checks to see if the number is near the supplied parameter to a certain lambda.
    
    @param {Number} n1 First number in comparison.
    @param {Number} n2 Number to compare against the first.
    @param {Number} lambda The closeness sufficient for a positive result. Default 0.00001
    @returns {Boolean}
  */
  near: function(n1, n2, lambda) {
    if (!lambda) lambda = 0.00001;
    return Math.abs(n1 - n2) <= lambda;
  },
  
  /**
    Rounds a number to a given decimal place. If a negative decimalPlace
    parameter is provided, the number will be rounded outward (ie. providing
    -3 will round to the thousands).
    
    Function is insufficient for high negative values of decimalPlace parameter.
    For example, (123456.789).round(-5) should evaluate to 100000 but instead
    evaluates to 99999.999... 
    
    @param {Number} n The number to round
    @param {Integer} decimalPlace
    @returns {Number}
  */
  round: function(n, decimalPlace) {
    if (!decimalPlace) decimalPlace = 0;
    var factor = Math.pow(10, decimalPlace);
    if (decimalPlace < 0) {
       // stop rounding errors from hurting the factor...
      var s = factor.toString();
      factor = s.substring(0, s.indexOf("1")+1);
    }
    n = n.valueOf();
    return Math.round(n * factor) / factor;
  }
  
}) ;

/* >>>>>>>>>> BEGIN source/system/module.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*jslint evil:true */

SC.LOG_MODULE_LOADING = YES;

/**
  SC.Module is responsible for dynamically loading in JavaScript and other
  resources. These packages of code and resources, called bundles, can be
  loaded by your application once it has finished loading, allowing you to
  reduce the time taken for it to launch.

  You can explicitly load a module by calling SC.Module.loadModule(), or you
  can mark a module as prefetched in your Buildfile. In those cases,
  SproutCore will automatically start to load the bundle once the application
  has loaded and the user has remained idle for more than one second.
*/

SC.Module = SC.Object.create(/** @scope SC.Module */ {

	/**
		Returns YES if the module is ready; NO if it is not loaded or its
		dependencies have not yet loaded.

		@param {String} moduleName the name of the module to check
		@returns {Boolean}
	*/
	isModuleReady: function(moduleName) {
		var moduleInfo = SC.MODULE_INFO[moduleName] ;
		return moduleInfo ? !!moduleInfo.isReady : NO ;
	},

	/**
		Asynchronously loads a module if it is not already loaded. If you pass
		a function, or a target and action, it will be called once the module
		has finished loading.

		If the module you request has dependencies (as specified in the Buildfile)
		that are not yet loaded, it will load them first before executing the
		requested module.

		@param moduleName {String}
		@param target {Function}
		@param method {Function}
	*/
  loadModule: function(moduleName, target, method) {
    var module = SC.MODULE_INFO[moduleName], callbacks, targets;
    var args   = SC.A(arguments).slice(3);
    var log    = SC.LOG_MODULE_LOADING;
    var idx, len;

    // Treat the first parameter as the callback if the target is a function and there is
    // no method supplied.
    if (method === undefined && SC.typeOf(target) === SC.T_FUNCTION) {
      method = target;
      target = null;
    }

    if (log) {
      console.log("SC.Module: Attempting to load '%@'".fmt(moduleName));
    }

    // If we couldn't find anything in the SC.MODULE_INFO hash, we don't have any record of the
    // requested module.
    if (!module) {
      throw "SC.Module: could not find module '%@'".fmt(moduleName) ;
    }

    // If this module was in the middle of being prefetched, we now need to
    // execute it immediately when it loads.
    module.isPrefetching = NO;

    // If the module is already loaded, execute the callback immediately if SproutCore is loaded,
    // or else as soon as SC has finished loading.
    if (module.isLoaded) {
      if (log) console.log("SC.Module: Module '%@' already loaded.".fmt(moduleName));

      // If the module has finished loading and we have the string
      // representation, try to evaluate it now.
      if (module.source) {
        if (log) console.log("SC.Module: Evaluating JavaScript for module '%@'.".fmt(moduleName));
        this._evaluateStringLoadedModule(module);
      }

      if (method) {
        if (SC.isReady) {
          SC.Module._invokeCallback(moduleName, target, method, args);
        } else {
          // Queue callback for when SC has finished loading.
          SC.ready(SC.Module, function() {
            SC.Module._invokeCallback(moduleName, target, method, args);
          });
        }
      }
    }
    // The module is not yet loaded, so register the callback and, if necessary, begin loading
    // the code.
    else {
      if (log) console.log("SC.Module: Module '%@' is not loaded, loading now.".fmt(moduleName));

      // If this method is called more than once for the same module before it is finished
      // loading, we might have multiple callbacks that need to be executed once it loads.

      // Retrieve array of callbacks from MODULE_INFO hash.
      callbacks = module.callbacks || [] ;

      if (method) {
        callbacks.push(function() {
          SC.Module._invokeCallback(moduleName, target, method, args);
        });
      }

      module.callbacks = callbacks;

      // If this is the first time the module has been requested, determine its dependencies
      // and begin loading them as well as the JavaScript for this module.
      if (!module.isLoading) {
        this._loadDependenciesForModule(moduleName);
        this._loadCSSForModule(moduleName);
        this._loadJavaScriptForModule(moduleName);
        module.isLoading = YES;
      }
    }
  },

  /**
    @private

    Loads a module in string form. If you prefetch a module, its source will
    be held as a string in memory until SC.Module.loadModule() is called, at
    which time its JavaScript will be evaluated.

    You shouldn't call this method directly; instead, mark modules as
    prefetched in your Buildfile. SproutCore will automatically prefetch those
    modules once your application has loaded and the user is idle.

    @param {String} moduleName the name of the module to prefetch
  */
  prefetchModule: function(moduleName) {
    var module = SC.MODULE_INFO[moduleName];

    if (module.isLoading || module.isLoaded) return;

    if (SC.LOG_MODULE_LOADING) console.log("SC.Module: Prefetching module '%@'.".fmt(moduleName));
    this._loadDependenciesForModule(moduleName);
    this._loadCSSForModule(moduleName);
    this._loadJavaScriptForModule(moduleName);
    module.isLoading = YES;
    module.isPrefetching = YES;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private
    If a module is marked for lazy instantiation, this method will execute the closure and call
    any registered callbacks.
  */
  _executeLazilyInstantiatedModule: function(moduleName, targetName, methodName){
    var lazyInfo =  SC.LAZY_INSTANTIATION[moduleName];
    var target;
    var method;
    var idx, len;

    if (SC.LOG_MODULE_LOADING) {
      console.log("SC.Module: Module '%@' is marked for lazy instantiation, instantiating it now…".fmt(moduleName));
    }

    len = lazyInfo.length;
    for (idx = 0; idx < len; idx++) {
      // Iterate through each function associated with this module, and attempt to execute it.
      try {
        lazyInfo[idx]();
      } catch(e) {
        console.error("SC.Module: Failed to lazily instatiate entry for  '%@'".fmt(moduleName));
      }
    }

    // Free up memory containing the functions once they have been executed.
    delete SC.LAZY_INSTANTIATION[moduleName];

    // Now that we have executed the functions, try to find the target and action for the callback.
    target = this._targetForTargetName(targetName);
    method = this._methodForMethodNameInTarget(methodName, target);

    if (!method) {
      throw "SC.Module: could not find callback for lazily instantiated module '%@'".fmt(moduleName);
    }
  },

  /**
    Evaluates a module's JavaScript if it is stored in string format, then
    deletes that code from memory.

    @param {Hash} module the module to evaluate
  */
  _evaluateStringLoadedModule: function(module) {
    var moduleSource = module.source;

    jQuery.globalEval(moduleSource);
    delete module.source;

    module.isReady = YES;
  },

  /**
    @private

    Creates <link> tags for every CSS resource in a module.

    @param {String} moduleName the name of the module whose CSS should be loaded
  */
  _loadCSSForModule: function(moduleName) {
    var head = document.getElementsByTagName('head')[0] ;
    var module = SC.MODULE_INFO[moduleName];
    var styles = module.styles || [];
    var len = styles.length;
    var url;
    var el;
    var idx;

    if (!head) head = document.documentElement ; // fix for Opera
    len = styles.length;

    for (idx = 0; idx < len; idx++) {
      url = styles[idx] ;

      if (url.length > 0) {
        if (SC.LOG_MODULE_LOADING) console.log("SC.Module: Loading CSS file in '%@' -> '%@'".fmt(moduleName, url));
        el = document.createElement('link') ;
        el.setAttribute('href', url) ;
        el.setAttribute('rel', "stylesheet") ;
        el.setAttribute('type', "text/css") ;
        head.appendChild(el) ;
      }
    }

    el = null;
  },

  _loadJavaScriptForModule: function(moduleName) {
    var module = SC.MODULE_INFO[moduleName];
    var el;
    var url;
    var dependencies = module.dependencies;
    var dependenciesAreLoaded = YES;

    // If this module has dependencies, determine if they are loaded.
    if (dependencies && dependencies.length > 0) {
      dependenciesAreLoaded = this._dependenciesMetForModule(moduleName);
    }

    // If the module is prefetched, always load the string representation.
    if (module.isPrefetched) {
      url = module.stringURL;
    } else {
      if (dependenciesAreLoaded) {
        // Either we have no dependencies or they've all loaded already,
        // so just execute the code immediately once it loads.
        url = module.scriptURL;
      } else {
        // Because the dependencies might load after this module, load the
        // string representation so we can execute it once all dependencies
        // are in place.
        url = module.stringURL;
      }
    }

    if (url.length > 0) {
      if (SC.LOG_MODULE_LOADING) console.log("SC.Module: Loading JavaScript file in '%@' -> '%@'".fmt(moduleName, url));

      el = document.createElement('script') ;
      el.setAttribute('type', "text/javascript") ;
      el.setAttribute('src', url) ;

      el.onload = function() {
        SC.Module._moduleDidLoad(moduleName);
      };

      document.body.appendChild(el) ;
    }
  },

  /**
    @private

    Returns YES if all of the dependencies for a module are ready.

    @param {String} moduleName the name of the module being checked
    @returns {Boolean} whether the dependencies are loaded
  */
  _dependenciesMetForModule: function(moduleName) {
    var dependencies = SC.MODULE_INFO[moduleName].dependencies || [];
    var idx, len = dependencies.length;
    var dependencyName;
    var module;

    for (idx = 0; idx < len; idx++) {
      dependencyName = dependencies[idx];
      module = SC.MODULE_INFO[dependencyName];

      if (!module) throw "SC.loadModule: Unable to find dependency %@ for module %@.".fmt(dependencyName, moduleName);

      if (!module.isReady) {
        return NO;
      }
    }

    return YES;
  },

  /**
    Loads all unloaded dependencies for a module, then creates the <script> and <link> tags to
    load the JavaScript and CSS for the module.
  */
  _loadDependenciesForModule: function(moduleName) {
      // Load module's dependencies first.
      var moduleInfo      = SC.MODULE_INFO[moduleName];
      var log             = SC.LOG_MODULE_LOADING;
      var dependencies    = moduleInfo.dependencies || [];
      var dependenciesMet = YES;
      var len             = dependencies.length;
      var idx;
      var requiredModuleName;
      var requiredModule;
      var dependents;

      for (idx = 0; idx < len; idx++) {
        requiredModuleName = dependencies[idx];
        requiredModule = SC.MODULE_INFO[requiredModuleName];

        // Try to find dependent module in MODULE_INFO
        if (!requiredModule) {
          throw "SC.Module: could not find required module '%@' for module '%@'".fmt(requiredModuleName, moduleName) ;
        } else {

          // Required module has been requested but hasn't loaded yet.
          if (requiredModule.isLoading) {
            dependenciesMet = NO ;

            dependents = requiredModule.dependents;
            if (!dependents) requiredModule.dependents = dependents = [];
            dependents.push(moduleName);
          }

          // Required module has already been loaded and evaluated, no need to worry about it.
          else if (requiredModule.isReady) {
            continue ;
          }
          // Required module has not been loaded nor requested yet.
          else {
            dependenciesMet = NO ;

            // Register this as a dependent module (used by SC._moduleDidLoad()...)
            dependents = requiredModule.dependents;
            if (!dependents) requiredModule.dependents = dependents = [];

            dependents.push(moduleName) ;

            if (log) console.log("SC.Module: '%@' depends on '%@', loading dependency…".fmt(moduleName, requiredModuleName));

            // Load dependencies
            SC.Module.loadModule(requiredModuleName) ;
          }
        }
      }
    },

    /**
      @private

      Calls an action on a target to notify the target that a module has loaded.
    */
    _invokeCallback: function(moduleName, targetName, methodName, args) {
      var method;
      var target;

      target = this._targetForTargetName(targetName);
      method = this._methodForMethodNameInTarget(methodName, target);

      // If we weren't able to find the callback, this module may be lazily instantiated and
      // the callback won't exist until we execute the closure that it is wrapped in.
      if (!method) {
        if (SC.LAZY_INSTANTIATION[moduleName]) {
          this._executeLazilyInstantiatedModule(moduleName, targetName, methodName);
        } else {
          throw "SC.Module: could not find callback for '%@'".fmt(moduleName);
        }
      }

      if (!args) {
        args = [];
      }

      // The first parameter passed to the callback is the name of the module.
      args.unshift(moduleName);

      // Invoke the callback. Wrap it in a run loop if we are not in a runloop already.
      var needsRunLoop = !!SC.RunLoop.currentRunLoop;
      if (needsRunLoop) {
        SC.run(function() {
          method.apply(target, args);
        });
      } else {
        method.apply(target, args);
      }
    },

    /** @private
      Given a module name, iterates through all registered callbacks and calls them.
    */
    _invokeCallbacksForModule: function(moduleName) {
      var moduleInfo = SC.MODULE_INFO[moduleName], callbacks ;
      if (!moduleInfo) return ; // shouldn't happen, but recover anyway

      if (SC.LOG_MODULE_LOADING) console.log("SC.Module: Module '%@' has completed loading, invoking callbacks.".fmt(moduleName));

      callbacks = moduleInfo.callbacks || [] ;

      for (var idx=0, len=callbacks.length; idx<len; ++idx) {
        callbacks[idx]() ;
      }
    },

    _evaluateAndInvokeCallbacks: function(moduleName) {
      var moduleInfo = SC.MODULE_INFO;
      var module = moduleInfo[moduleName];
      var log = SC.LOG_MODULE_LOADING;

      if (log) console.log("SC.Module: Evaluating and invoking callbacks for '%@'.".fmt(moduleName));

      if (module.source) {
        this._evaluateStringLoadedModule(module);
      }
      module.isReady = YES;

      if (SC.isReady) {
        SC.Module._invokeCallbacksForModule(moduleName) ;
        delete module.callbacks;
      } else {
        SC.ready(SC, function() {
          SC.Module._invokeCallbacksForModule(moduleName) ;
          delete module.callbacks;
        });
      }

      // for each dependent module, try and load them again...
      var dependents = module.dependents || [] ;
      var dependentName, dependent;

      for (var idx = 0, len = dependents.length; idx < len; idx++) {
        dependentName = dependents[idx];
        dependent = moduleInfo[dependentName];
        if (dependent.isLoaded && this._dependenciesMetForModule(dependentName)) {
          if (log) console.log("SC.Module: Now that %@ has loaded, all dependencies for a dependent %@ are met.".fmt(moduleName, dependentName));
          this._evaluateAndInvokeCallbacks(dependentName);
        }
      }
    },

  /** @private
    Called when the JavaScript for a module finishes loading.

    Any pending callbacks are called (if SC.isReady), and any dependent
    modules which were waiting for this module to load are notified so they
    can continue loading.

    @param moduleName {String} the name of the module that just loaded
*/
  _moduleDidLoad: function(moduleName) {
    var module = SC.MODULE_INFO[moduleName];
    var log    = SC.LOG_MODULE_LOADING;
    var dependenciesMet;
    var callbacks, targets;


    if (log) console.log("SC.Module: Module '%@' finished loading.".fmt(moduleName));

    if (!module) {
      if (log) console.log("SC._moduleDidLoad() called for unknown module '@'.".fmt(moduleName));
      module = SC.MODULE_INFO[moduleName] = { isLoaded: YES, isReady: YES } ;
      return;
    }

    if (module.isLoaded) {
      if (log) console.log("SC._moduleDidLoad() called more than once for module '%@'. Skipping.".fmt(moduleName));
      return ;
    }

    // Remember that we're loaded.
    delete module.isLoading ;
    module.isLoaded = YES ;

    if (!module.isPrefetching) {
      dependenciesMet = this._dependenciesMetForModule(moduleName);
      if (dependenciesMet) {
        this._evaluateAndInvokeCallbacks(moduleName);
      } else {
        if (log) console.log("SC.Module: Dependencies for '%@' not met yet, waiting to evaluate.".fmt(moduleName));
      }
    } else {
      delete module.isPrefetching;
      if (log) console.log("SC.Module: Module '%@' was prefetched, not evaluating until needed.".fmt(moduleName));
    }
  },

	/**
  	@private

  	If necessary, converts a property path into a target object.

  	@param {String|Object} targetName the string or object representing the target
  	@returns Object
  */
	_targetForTargetName: function(targetName){
		if (SC.typeOf(targetName) === SC.T_STRING) {
			return SC.objectForPropertyPath(targetName);
		}

		return targetName;
	},

	/**
  	@private

  	If necessary, converts a property path into a method object.

  	@param {String|Object} methodName the string or object representing the method
  	@param {Object} target the target from which to retrieve the method
  	@returns Object
  */
	_methodForMethodNameInTarget: function(methodName, target){
		if (SC.typeOf(methodName) === SC.T_STRING) {
			return SC.objectForPropertyPath(methodName, target);
		}

		return methodName;
	}
});

/**
Inspect the list of modules and, for every prefetched module, create a
background task to load the module when the user remains idle.
*/
SC.ready(function() {
  var moduleInfo = SC.MODULE_INFO;
  var moduleName;
  var module;
  var task;

  // Iterate through all known modules and look for those that are marked
  // as prefetched.
  for (moduleName in moduleInfo) {
    module = moduleInfo[moduleName];

    if (module.isPrefetched) {
      var prefetchedModuleName = moduleName;

      // Create a task that will load the module, and then register it with
      // the global background task queue.
      task = SC.Task.create({
        run: function() {
          SC.Module.prefetchModule(prefetchedModuleName);
        }
      });

      SC.backgroundTaskQueue.push(task);
    }
  }
});

/* >>>>>>>>>> BEGIN source/system/response.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global ActiveXObject */

/**
  A response represents a single response from a server request.  An instance
  of this class is returned whenever you call SC.Request.send().
  
  TODO: Add more info
  
  @extend SC.Object
  @since SproutCore 1.0
*/
SC.Response = SC.Object.extend(
/** @scope SC.Response.prototype */ {
  
  /**
    Becomes true if there was a failure.  Makes this into an error object.
    
    @property {Boolean}
  */
  isError: NO,
  
  /**
    Always the current response
    
    @property {SC.Response}
  */
  errorValue: function() {
    return this;
  }.property().cacheable(),
  
  /**
    The error object generated when this becomes an error
    
    @property {SC.Error}
  */
  errorObject: null,
  
  /** 
    Request used to generate this response.  This is a copy of the original
    request object as you may have modified the original request object since
    then.
   
    To retrieve the original request object use originalRequest.
    
    @property {SC.Request}
  */
  request: null,
  
  /**
    The request object that originated this request series.  Mostly this is
    useful if you are looking for a reference to the original request.  To
    inspect actual properties you should use request instead.
    
    @property {SC.Request}
  */
  originalRequest: function() {
    var ret = this.get('request');
    while (ret.get('source')) ret = ret.get('source');
    return ret ;
  }.property('request').cacheable(),

  /** 
    Type of request.  Must be an HTTP method.  Based on the request
  
    @property {String}
  */
  type: function() {
    return this.getPath('request.type');
  }.property('request').cacheable(),
  
  /**
    URL of request. 
    
    @property {String}
  */
  address: function() {
    return this.getPath('request.address');
  }.property('request').cacheable(),
  
  /**
    If set then will attempt to automatically parse response as JSON 
    regardless of headers.
    
    @property {Boolean}
  */
  isJSON: function() {
    return this.getPath('request.isJSON') || NO;
  }.property('request').cacheable(),

  /**
    If set, then will attempt to automatically parse response as XML
    regarldess of headers.
    
    @property {Boolean}
  */
  isXML: function() {
    return this.getPath('request.isXML') || NO ;
  }.property('request').cacheable(),
  
  /** 
    Returns the hash of listeners set on the request.
    
    @property {Hash}
  */
  listeners: function() {
    return this.getPath('request.listeners');
  }.property('request').cacheable(),
  
  /**
    The response status code.
    
    @property {Number}
  */
  status: -100, // READY

  /**
    Headers from the response.  Computed on-demand
    
    @property {Hash}
  */
  headers: null,
  
  /**
    Response body. If isJSON was set, will be parsed automatically.
    
    @response {Hash|String|SC.Error} the response body or the parsed JSON.
      Returns a SC.Error instance if there is a JSON parsing error.
  */
  body: function() {
    // TODO: support XML
    var ret = this.get('encodedBody');
    if (ret && this.get('isJSON')) {
      try {
        ret = SC.json.decode(ret);
      } catch(e) {
        return SC.Error.create({
          message: e.name + ': ' + e.message,
          label: 'Response',
          errorValue: this });
      }
    }
    return ret;
  }.property('encodedBody').cacheable(),
  
  /** 
    @private
    @deprecated
  
    Alias for body.  Provides compatibility with older code.
    
    @property {Hash|String}
  */
  response: function() {
    return this.get('body');
  }.property('body').cacheable(),
  
  /**
    Set to YES if response is cancelled
  */
  isCancelled: NO,
  
  /**
    Set to YES if the request timed out.  Set to NO if the request has
    completed before the timeout value.  Set to null if the timeout timer is
    still ticking.
  */
  timedOut: null,
  
  /**
    The timer tracking the timeout
  */
  timeoutTimer: null,
  
  // ..........................................................
  // METHODS
  // 

  /**
    Called by the request manager when its time to actually run.  This will
    invoke any callbacks on the source request then invoke transport() to 
    begin the actual request.
  */
  fire: function() {
    var req = this.get('request'),
        source = req ? req.get('source') : null;
    
    
    // first give the source a chance to fixup the request and response
    // then freeze req so no more changes can happen.
    if (source && source.willSend) source.willSend(req, this);
    req.freeze();

    // if the source did not cancel the request, then invoke the transport
    // to actually trigger the request.  This might receive a response 
    // immediately if it is synchronous.
    if (!this.get('isCancelled')) this.invokeTransport();


    // If the request specified a timeout value, then set a timer for it now.
    var timeout = req.get('timeout');
    if (timeout) {
      var timer = SC.Timer.schedule({
        target:   this, 
        action:   'timeoutReached', 
        interval: timeout,
        repeats:  NO
      });
      this.set('timeoutTimer', timer);
    }


    // if the transport did not cancel the request for some reason, let the
    // source know that the request was sent
    if (!this.get('isCancelled') && source && source.didSend) {
      source.didSend(req, this);
    }
  },

  invokeTransport: function() {
    this.receive(function(proceed) { this.set('status', 200); }, this);
  },
  
  /**
    Invoked by the transport when it receives a response.  The passed-in
    callback will be invoked to actually process the response.  If cancelled
    we will pass NO.  You should clean up instead.
    
    Invokes callbacks on the source request also.
    
    @param {Function} callback the function to receive
    @param {Object} context context to execute the callback in
    @returns {SC.Response} receiver
  */
  receive: function(callback, context) {
    if (!this.get('timedOut')) {
      // If we had a timeout timer scheduled, invalidate it now.
      var timer = this.get('timeoutTimer');
      if (timer) timer.invalidate();
      this.set('timedOut', NO);
    }

    var req = this.get('request');
    var source = req ? req.get('source') : null;

    SC.run(function() {
      // invoke the source, giving a chance to fixup the response or (more
      // likely) cancel the request.
      if (source && source.willReceive) source.willReceive(req, this);

      // invoke the callback.  note if the response was cancelled or not
      callback.call(context, !this.get('isCancelled'));

      // if we weren't cancelled, then give the source first crack at handling
      // the response.  if the source doesn't want listeners to be notified,
      // it will cancel the response.
      if (!this.get('isCancelled') && source && source.didReceive) {
        source.didReceive(req, this);
      }

      // notify listeners if we weren't cancelled.
      if (!this.get('isCancelled')) this.notify();
    }, this);

    // no matter what, remove from inflight queue
    SC.Request.manager.transportDidClose(this) ;
    return this;
  },
  
  /**
    Default method just closes the connection.  It will also mark the request
    as cancelled, which will not call any listeners.
  */
  cancel: function() {
    if (!this.get('isCancelled')) {
      this.set('isCancelled', YES) ;
      this.cancelTransport() ;
      SC.Request.manager.transportDidClose(this) ;
    }
  },
  
  /**
    Default method just closes the connection.
  */
  timeoutReached: function() {
    // If we already received a response yet the timer still fired for some
    // reason, do nothing.
    if (this.get('timedOut') === null) {
      this.set('timedOut', YES);
      this.cancelTransport();

      // Invokes any relevant callbacks and notifies registered listeners, if
      // any. In the event of a timeout, we set the status to 0 since we
      // didn't actually get a response from the server.
      this.receive(function(proceed) {
        if (!proceed) return;

        // Set our value to an error.
        var error = SC.$error("HTTP Request timed out", "Request", 0) ;
        error.set("errorValue", this) ;
        this.set('isError', YES);
        this.set('errorObject', error);
        this.set('status', 0);
      }, this);

      return YES;
    }

    return NO;
  },
  
  /**
    Override with concrete implementation to actually cancel the transport.
  */
  cancelTransport: function() {},
  
  /** @private
    Will notify each listener.
  */
  _notifyListener: function(listeners, status) {
    var info = listeners[status], params, target, action;
    if (!info) return NO ;
    
    params = (info.params || []).copy();
    params.unshift(this);
    
    target = info.target;
    action = info.action;
    if (SC.typeOf(action) === SC.T_STRING) action = target[action];
    
    return action.apply(target, params);
  },
  
  /**
    Notifies any saved target/action.  Call whenever you cancel, or end.
    
    @returns {SC.Response} receiver
  */
  notify: function() {
    var listeners = this.get('listeners'), 
        status    = this.get('status'),
        baseStat  = Math.floor(status / 100) * 100,
        handled   = NO ;
        
    if (!listeners) return this ; // nothing to do
    
    handled = this._notifyListener(listeners, status);
    if (!handled) handled = this._notifyListener(listeners, baseStat);
    if (!handled) handled = this._notifyListener(listeners, 0);
    
    return this ;
  },
  
  /**
    String representation of the response object
  */
  toString: function() {
    var ret = arguments.callee.base.apply(this,arguments);
    return "%@<%@ %@, status=%@".fmt(ret, this.get('type'), this.get('address'), this.get('status'));
  }
  
});

/**
  Concrete implementation of SC.Response that implements support for using 
  XHR requests.
  
  @extends SC.Response
  @since SproutCore 1.0
*/
SC.XHRResponse = SC.Response.extend({

  /**
    Implement transport-specific support for fetching all headers
  */
  headers: function() {
    var xhr = this.get('rawRequest'),
        str = xhr ? xhr.getAllResponseHeaders() : null,
        ret = {};
        
    if (!str) return ret;
    
    str.split("\n").forEach(function(header) {
      var idx = header.indexOf(':'),
          key, value;
      if (idx>=0) {
        key = header.slice(0,idx);
        value = header.slice(idx+1).trim();
        ret[key] = value ;
      }
    }, this);
    
    return ret ;
  }.property('status').cacheable(),
  
  // returns a header value if found...
  header: function(key) {
    var xhr = this.get('rawRequest');
    return xhr ? xhr.getResponseHeader(key) : null;    
  },
  
  /**
    Implement transport-specific support for fetching tasks
  */
  encodedBody: function() {
    var xhr = this.get('rawRequest'), ret ;
    if (!xhr) ret = null;
    else if (this.get('isXML')) ret = xhr.responseXML;
    else ret = xhr.responseText;
    return ret ;
  }.property('status').cacheable(),
  

  cancelTransport: function() {
    var rawRequest = this.get('rawRequest');
    if (rawRequest) rawRequest.abort();
    this.set('rawRequest', null);
  },

  invokeTransport: function() {
    var rawRequest, transport, handleReadyStateChange, async, headers;
    
    rawRequest = this.createRequest();

    // save it 
    this.set('rawRequest', rawRequest);
    
    // configure async callback - differs per browser...
    async = !!this.getPath('request.isAsynchronous') ;
    if (async) {
      if (!SC.browser.msie && !SC.browser.opera ) {
        SC.Event.add(rawRequest, 'readystatechange', this, 
                     this.finishRequest, rawRequest) ;
      } else {
        transport=this;
        handleReadyStateChange = function() {
          if (!transport) return null ;
          var ret = transport.finishRequest();
          if (ret) transport = null ; // cleanup memory
          return ret ;
        };
        rawRequest.onreadystatechange = handleReadyStateChange;
      }
    }
    
    // initiate request.  
    rawRequest.open(this.get('type'), this.get('address'), async ) ;
    
    // headers need to be set *after* the open call.
    headers = this.getPath('request.headers') ;
    for (var headerKey in headers) {
      rawRequest.setRequestHeader(headerKey, headers[headerKey]) ;
    }

    // now send the actual request body - for sync requests browser will
    // block here
    rawRequest.send(this.getPath('request.encodedBody')) ;
    if (!async) this.finishRequest() ; // not async
    
    return rawRequest ;
  },
  
  /**
    Creates the correct XMLHttpRequest object for this browser.

    You can override this if you need to, for example, create an XHR on a
    different domain name from an iframe.

    @returns {XMLHttpRequest|ActiveXObject}
  */
  createRequest: function() {
    // Get an XHR object
    function tryThese() {
      for (var i=0; i < arguments.length; i++) {
        try {
          var item = arguments[i]() ;
          return item ;
        } catch (e) {}
      }
      return NO;
    }

    return tryThese(
      function() { return new XMLHttpRequest(); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
      function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
    );
  },

  /**  @private
  
    Called by the XHR when it responds with some final results.
    
    @param {XMLHttpRequest} rawRequest the actual request
    @returns {SC.XHRRequestTransport} receiver
  */
  finishRequest: function(evt) {
    var rawRequest = this.get('rawRequest'),
        readyState = rawRequest.readyState,
        error, status, msg;

    if (readyState === 4 && !this.get('timedOut')) {
      this.receive(function(proceed) {
        if (!proceed) return ; // skip receiving...
      
        // collect the status and decide if we're in an error state or not
        status = -1 ;
        try {
          status = rawRequest.status || 0;
        } catch (e) {}

        // if there was an error - setup error and save it
        if ((status < 200) || (status >= 300)) {
          
          try {
            msg = rawRequest.statusText || '';
          } catch(e2) {
            msg = '';
          }
          
          error = SC.$error(msg || "HTTP Request failed", "Request", status) ;
          error.set("errorValue", this) ;
          this.set('isError', YES);
          this.set('errorObject', error);
        }

        // set the status - this will trigger changes on relatedp properties
        this.set('status', status);
      
      }, this);

      // Avoid memory leaks
      if (!SC.browser.msie && !SC.browser.opera) {
        SC.Event.remove(rawRequest, 'readystatechange', this, this.finishRequest);	  
      } else {
        rawRequest.onreadystatechange = null;
      }

      return YES;
    }
    return NO; 
  }

  
});

/* >>>>>>>>>> BEGIN source/system/request.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('system/response');

/**
  @class
  
  Implements support for Ajax requests using XHR and other prototcols.
  
  SC.Request is much like an inverted version of the request/response objects
  you receive when implementing HTTP servers.  
  
  To send a request, you just need to create your request object, configure
  your options, and call send() to initiate the request.
  
  @extends SC.Object
  @extends SC.Copyable
  @extends SC.Freezable
  @since SproutCore 1.0
*/

SC.Request = SC.Object.extend(SC.Copyable, SC.Freezable,
  /** @scope SC.Request.prototype */ {
  
  // ..........................................................
  // PROPERTIES
  // 
  
  /**
    Sends the request asynchronously instead of blocking the browser.  You
    should almost always make requests asynchronous.  You can change this 
    options with the async() helper option (or simply set it directly).
    
    Defaults to YES. 
    
    @property {Boolean}
  */
  isAsynchronous: YES,

  /**
    Processes the request and response as JSON if possible.  You can change
    this option with the json() helper method.

    Defaults to NO 
    
    @property {Boolean}
  */
  isJSON: NO,

  /**
    Process the request and response as XML if possible.  You can change this
    option with the xml() helper method.
    
    Defaults to NO
  
    @property {Boolean}
  */
  isXML: NO,
  
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this.header('X-Requested-With', 'XMLHttpRequest');
    //TODO: we need to have the SC version in a SC variable.
    //For now I'm harcoding the variable.
    this.header('X-SproutCore-Version', SC.VERSION);
  },
  
  /**
    Current set of headers for the request
  */
  headers: function() {
    var ret = this._headers ;
    if (!ret) ret = this._headers = {} ;
    return ret ;  
  }.property().cacheable(),

  /**
    Underlying response class to actually handle this request.  Currently the
    only supported option is SC.XHRResponse which uses a traditional
    XHR transport.
    
    @property {SC.Response}
  */
  responseClass: SC.XHRResponse,

  /**
    The original request for copied requests.
    
    @property {SC.Request}
  */
  source: null,
  
  /**
    The URL this request to go to.
    
    @param {String}
  */
  address: null,
  
  /**
    The HTTP method to use.
    
    @param {String}
  */
  type: 'GET',
  
  /**
    An optional timeout value of the request, in milliseconds.  The timer
    begins when SC.Response#fire is actually invoked by the request manager
    and not necessarily when SC.Request#send is invoked.  If this timeout is
    reached before a response is received, the equivalent of
    SC.Request.manager#cancel() will be invoked on the SC.Response instance
    and the didReceive() callback will be called.

    An exception will be thrown if you try to invoke send() on a request that
    has both a timeout and isAsyncronous set to NO.
    
    @property {Number}
  */
  timeout: null,
  
  /**
    The body of the request.  May be an object is isJSON or isXML is set,
    otherwise should be a string.
  */
  body: null,
  
  /**
    The body, encoded as JSON or XML if needed.
  */
  encodedBody: function() {
    // TODO: support XML
    var ret = this.get('body');
    if (ret && this.get('isJSON')) ret = SC.json.encode(ret);
    return ret ;
  }.property('isJSON', 'isXML', 'body').cacheable(),

  // ..........................................................
  // CALLBACKS
  // 
  
  /**
    Invoked on the original request object just before a copied request is 
    frozen and then sent to the server.  This gives you one last change to 
    fixup the request; possibly adding headers and other options.
    
    If you do not want the request to actually send, call cancel().
    
    @param {SC.Request} request a copy of the request, not frozen
    @returns {void}
  */
  willSend: function(request, response) {},
  
  /**
    Invoked on the original request object just after the request is sent to
    the server.  You might use this callback to update some state in your 
    application.
    
    The passed request is a frozen copy of the request, indicating the 
    options set at the time of the request.
    
    @param {SC.Request} request a copy of the request, frozen
    @param {SC.Response} response the object that will carry the response
    @returns {void}
  */
  didSend: function(request, response) {},
  
  /**
    Invoked when a response has been received but not yet processed.  This is
    your chance to fix up the response based on the results.  If you don't
    want to continue processing the response call response.cancel().

    @param {SC.Response} response the response
    @returns {void}
  */
  willReceive: function(request, response) {},
  
  /**
    Invoked after a response has been processed but before any listeners are
    notified.  You can do any standard processing on the request at this 
    point.  If you don't want to allow notifications to continue, call
    response.cancel()

    @param {SC.Response} response reponse
    @returns {void}
  */
  didReceive: function(request, response) {},
  
  // ..........................................................
  // HELPER METHODS
  // 

  COPY_KEYS: 'isAsynchronous isJSON isXML address type timeout body responseClass willSend didSend willReceive didReceive'.w(),
  
  /**
    Returns a copy of the current request.  This will only copy certain
    properties so if you want to add additional properties to the copy you
    will need to override copy() in a subclass.
    
    @returns {SC.Request} new request
  */
  copy: function() {
    var ret = {},
        keys = this.COPY_KEYS,
        loc  = keys.length, 
        key, listeners, headers;
        
    while(--loc>=0) {
      key = keys[loc];
      if (this.hasOwnProperty(key)) ret[key] = this.get(key);
    }
    
    if (this.hasOwnProperty('listeners')) {
      ret.listeners = SC.copy(this.get('listeners'));
    }
    
    if (this.hasOwnProperty('_headers')) {
      ret._headers = SC.copy(this._headers);
    }
    
    ret.source = this.get('source') || this ;
    
    return this.constructor.create(ret);
  },
  
  /**
    To set headers on the request object.  Pass either a single key/value 
    pair or a hash of key/value pairs.  If you pass only a header name, this
    will return the current value of the header.
    
    @param {String|Hash} key
    @param {String} value
    @returns {SC.Request|Object} receiver
  */
  header: function(key, value) {
    var headers;
    
    if (SC.typeOf(key) === SC.T_STRING) {
      headers = this._headers ;
      if (arguments.length===1) {
        return headers ? headers[key] : null;
      } else {
        this.propertyWillChange('headers');
        if (!headers) headers = this._headers = {};
        headers[key] = value;
        this.propertyDidChange('headers');
        return this;
      }
    
    // handle parsing hash of parameters
    } else if (value === undefined) {
      headers = key;
      this.beginPropertyChanges();
      for(key in headers) {
        if (!headers.hasOwnProperty(key)) continue ;
        this.header(key, headers[key]);
      }
      this.endPropertyChanges();
      return this;
    }

    return this ;
  },

  /**
    Converts the current request to be asynchronous.

    @param {Boolean} flag YES to make asynchronous, NO or undefined
    @returns {SC.Request} receiver
  */
  async: function(flag) {
    if (flag === undefined) flag = YES;
    return this.set('isAsynchronous', flag);
  },

  /**
    Sets the maximum amount of time the request will wait for a response.

    @param {Number} timeout The timeout in milliseconds.
    @returns {SC.Request} receiver
  */
  timeoutAfter: function(timeout) {
    return this.set('timeout', timeout);
  },

  /**
    Converts the current request to use JSON.
    
    @param {Boolean} flag YES to make JSON, NO or undefined
    @returns {SC.Request} receiver
  */
  json: function(flag) {
    if (flag === undefined) flag = YES;
    if (flag) this.set('isXML', NO);
    return this.set('isJSON', flag);
  },
  
  /**
    Converts the current request to use XML.
    
    @param {Boolean} flag YES to make XML, NO or undefined
    @returns {SC.Request} recevier
  */
  xml: function(flag) {
    if (flag === undefined) flag = YES ;
    if (flag) this.set('isJSON', NO);
    return this.set('isXML', flag);
  },
  
  /** 
    Called just before a request is enqueued.  This will encode the body 
    into JSON if it is not already encoded.
  */
  _prep: function() {
    var hasContentType = !!this.header('Content-Type');
    if (this.get('isJSON') && !hasContentType) {
      this.header('Content-Type', 'application/json');
    } else if (this.get('isXML') && !hasContentType) {
      this.header('Content-Type', 'text/xml');
    }
    return this ;
  },
  
  /**
    Will fire the actual request.  If you have set the request to use JSON 
    mode then you can pass any object that can be converted to JSON as the 
    body.  Otherwise you should pass a string body.
    
    @param {String|Object} body (optional)
    @returns {SC.Response} new response object
  */  
  send: function(body) {
    // Sanity-check:  Be sure a timeout value was not specified if the request
    // is synchronous (because it wouldn't work).
    var timeout = this.get('timeout');
    if (timeout) {
      if (!this.get('isAsynchronous')) throw "Timeout values cannot be used with synchronous requests";
    }
    else if (timeout === 0) {
      throw "The timeout value must either not be specified or must be greater than 0";
    }
    
    if (body) this.set('body', body);
    return SC.Request.manager.sendRequest(this.copy()._prep());
  },

  /**
    Resends the current request.  This is more efficient than calling send()
    for requests that have already been used in a send.  Otherwise acts just
    like send().  Does not take a body argument.
    
    @returns {SC.Response} new response object
  */
  resend: function() {
    var req = this.get('source') ? this : this.copy()._prep();
    return SC.Request.manager.sendRequest(req);
  },
  
  /**
    Configures a callback to execute when a request completes.  You must pass
    at least a target and action/method to this and optionally a status code.
    You may also pass additional parameters which will be passed along to your
    callback. If your callback handled the notification, it should return YES.
    
    h2. Scoping With Status Codes
    
    If you pass a status code as the first option to this method, then your 
    notification callback will only be called if the response status matches
    the code.  For example, if you pass 201 (or SC.Request.CREATED) then 
    your method will only be called if the response status from the server
    is 201.
    
    You can also pass "generic" status codes such as 200, 300, or 400, which
    will be invoked anytime the status code is the range if a more specific 
    notifier was not registered first and returned YES.  
    
    Finally, passing a status code of 0 or no status at all will cause your
    method to be executed no matter what the resulting status is unless a 
    more specific notifier was registered and returned YES.
    
    h2. Callback Format
    
    Your notification callback should expect to receive the Response object
    as the first parameter plus any additional parameters that you pass.  
    
    @param {Number} status
    @param {Object} target
    @param {String|function} action
    @param {Hash} params
    @returns {SC.Request} receiver
  */
  notify: function(status, target, action, params) {
    
    // normalize status
    var hasStatus = YES ;
    if (SC.typeOf(status) !== SC.T_NUMBER) {
      params = SC.A(arguments).slice(2);
      action = target;
      target = status;
      status = 0 ;
      hasStatus = NO ;
    } else params = SC.A(arguments).slice(3);
    
    var listeners = this.get('listeners');
    if (!listeners) this.set('listeners', listeners = {});
    listeners[status] = { target: target, action: action, params: params };

    return this;
  }
    
});

SC.Request.mixin(/** @scope SC.Request */ {
  
  /**
    Helper method for quickly setting up a GET request.

    @param {String} address url of request
    @returns {SC.Request} receiver
  */
  getUrl: function(address) {
    return this.create().set('address', address).set('type', 'GET');
  },

  /**
    Helper method for quickly setting up a POST request.

    @param {String} address url of request
    @param {String} body
    @returns {SC.Request} receiver
  */
  postUrl: function(address, body) {
    var req = this.create().set('address', address).set('type', 'POST');
    if(body) req.set('body', body) ;
    return req ;
  },

  /**
    Helper method for quickly setting up a DELETE request.

    @param {String} address url of request
    @returns {SC.Request} receiver
  */
  deleteUrl: function(address) {
    return this.create().set('address', address).set('type', 'DELETE');
  },

  /**
    Helper method for quickly setting up a PUT request.

    @param {String} address url of request
    @param {String} body
    @returns {SC.Request} receiver
  */
  putUrl: function(address, body) {
    var req = this.create().set('address', address).set('type', 'PUT');
    if(body) req.set('body', body) ;
    return req ;
  }
});

/**
  The request manager coordinates all of the active XHR requests.  It will
  only allow a certain number of requests to be active at a time; queuing 
  any others.  This allows you more precise control over which requests load
  in which order.
*/
SC.Request.manager = SC.Object.create( SC.DelegateSupport, {

  /**
    Maximum number of concurrent requests allowed.  6 for all browsers.
    
    @property {Number}
  */
  maxRequests: 6,

  /**
    Current requests that are inflight.
    
    @property {Array}
  */
  inflight: [],
  
  /**
    Requests that are pending and have not been started yet.
  
    @property {Array}
  */
  pending: [],

  // ..........................................................
  // METHODS
  // 
  
  /**
    Invoked by the send() method on a request.  This will create a new low-
    level transport object and queue it if needed.
    
    @param {SC.Request} request the request to send
    @returns {SC.Object} response object
  */
  sendRequest: function(request) {
    if (!request) return null ;
    
    // create low-level transport.  copy all critical data for request over
    // so that if the request has been reconfigured the transport will still
    // work.
    var response = request.get('responseClass').create({ request: request });

    // add to pending queue
    this.get('pending').pushObject(response);
    this.fireRequestIfNeeded();
    
    return response ;
  },

  /** 
    Cancels a specific request.  If the request is pending it will simply
    be removed.  Otherwise it will actually be cancelled.
    
    @param {Object} response a response object
    @returns {Boolean} YES if cancelled
  */
  cancel: function(response) {

    var pending = this.get('pending'),
        inflight = this.get('inflight'),
        idx ;

    if (pending.indexOf(response) >= 0) {
      this.propertyWillChange('pending');
      pending.removeObject(response);
      this.propertyDidChange('pending');
      return YES;
      
    } else if (inflight.indexOf(response) >= 0) {
      
      response.cancel();
      
      inflight.removeObject(response);
      this.fireRequestIfNeeded();
      return YES;

    } else return NO ;
  },  

  /**
    Cancels all inflight and pending requests.  
    
    @returns {Boolean} YES if any items were cancelled.
  */
  cancelAll: function() {
    if (this.get('pending').length || this.get('inflight').length) {
      this.set('pending', []);
      this.get('inflight').forEach(function(r) { r.cancel(); });
      this.set('inflight', []);
      return YES;
      
    } else return NO ;
  },
  
  /**
    Checks the inflight queue.  If there is an open slot, this will move a 
    request from pending to inflight.
    
    @returns {Object} receiver
  */
  fireRequestIfNeeded: function() {
    var pending = this.get('pending'), 
        inflight = this.get('inflight'),
        max = this.get('maxRequests'),
        next ;
        
    if ((pending.length>0) && (inflight.length<max)) {
      next = pending.shiftObject();
      inflight.pushObject(next);
      next.fire();
    }
  },

  /**
    Called by a response/transport object when finishes running.  Removes 
    the transport from the queue and kicks off the next one.
  */
  transportDidClose: function(response) {
    this.get('inflight').removeObject(response);
    this.fireRequestIfNeeded();
  }
  
});

/* >>>>>>>>>> BEGIN source/system/routes.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  SC.routes manages the browser location. You can change the hash part of the
  current location. The following code
  
  {{{
    SC.routes.set('location', 'notes/edit/4');
  }}}
  
  will change the location to http://domain.tld/my_app#notes/edit/4. Adding
  routes will register a handler that will be called whenever the location
  changes and matches the route:
  
  {{{
    SC.routes.add(':controller/:action/:id', MyApp, MyApp.route);
  }}}
  
  You can pass additional parameters in the location hash that will be relayed
  to the route handler:
  
  {{{
    SC.routes.set('location', 'notes/show/4?format=xml&language=fr');
  }}}
  
  The syntax for the location hash is described in the location property
  documentation, and the syntax for adding handlers is described in the
  add method documentation.
  
  Browsers keep track of the locations in their history, so when the user
  presses the 'back' or 'forward' button, the location is changed, SC.route
  catches it and calls your handler. Except for Internet Explorer versions 7
  and earlier, which do not modify the history stack when the location hash
  changes.
  
  SC.routes also supports HTML5 history, which uses a '/' instead of a '#'
  in the URLs, so that all your website's URLs are consistent.
*/
SC.routes = SC.Object.create({
  
  /**
    Set this property to YES if you want to use HTML5 history, if available on
    the browser, instead of the location hash.
    
    HTML 5 history uses the history.pushState method and the window's popstate
    event.
    
    By default it is NO, so your URLs will look like:
    {{{
      http://domain.tld/my_app#notes/edit/4
    }}}
    
    If set to YES and the browser supports pushState(), your URLs will look
    like:
    {{{
      http://domain.tld/my_app/notes/edit/4
    }}}
    
    You will also need to make sure that baseURI is properly configured, as
    well as your server so that your routes are properly pointing to your
    SproutCore application.
    
    @see http://dev.w3.org/html5/spec/history.html#the-history-interface
    @property
    @type {Boolean}
  */
  wantsHistory: NO,
  
  /**
    A read-only boolean indicating whether or not HTML5 history is used. Based
    on the value of wantsHistory and the browser's support for pushState.
    
    @see wantsHistory
    @property
    @type {Boolean}
  */
  usesHistory: null,
  
  /**
    The base URI used to resolve routes (which are relative URLs). Only used
    when usesHistory is equal to YES.
    
    The build tools automatically configure this value if you have the
    html5_history option activated in the Buildfile:
    {{{
      config :my_app, :html5_history => true
    }}}
    
    Alternatively, it uses by default the value of the href attribute of the
    <base> tag of the HTML document. For example:
    {{{
      <base href="http://domain.tld/my_app">
    }}}
    
    The value can also be customized before or during the exectution of the
    main() method.
    
    @see http://www.w3.org/TR/html5/semantics.html#the-base-element
    @property
    @type {String}
  */
  baseURI: document.baseURI,
  
  /** @private
    A boolean value indicating whether or not the ping method has been called
    to setup the SC.routes.
  
    @property
    @type {Boolean}
  */
  _didSetup: NO,
  
  /** @private
    Internal representation of the current location hash.
  
    @property
    @type {String}
  */
  _location: null,
  
  /** @private
    Routes are stored in a tree structure, this is the root node.
  
    @property
    @type {SC.routes._Route}
  */
  _firstRoute: null,
  
  /** @private
    Internal method used to extract and merge the parameters of a URL.
    
    @returns {Hash}
  */
  _extractParametersAndRoute: function(obj) {
    var params = {},
        route = obj.route || '',
        separator, parts, i, len, crumbs, key;
    
    separator = (route.indexOf('?') < 0 && route.indexOf('&') >= 0) ? '&' : '?';
    parts = route.split(separator);
    route = parts[0];
    if (parts.length === 1) {
      parts = [];
    } else if (parts.length === 2) {
      parts = parts[1].split('&');
    } else if (parts.length > 2) {
      parts.shift();
    }
    
    // extract the parameters from the route string
    len = parts.length;
    for (i = 0; i < len; ++i) {
      crumbs = parts[i].split('=');
      params[crumbs[0]] = crumbs[1];
    }
    
    // overlay any parameter passed in obj
    for (key in obj) {
      if (obj.hasOwnProperty(key) && key !== 'route') {
        params[key] = '' + obj[key];
      }
    }
    
    // build the route
    parts = [];
    for (key in params) {
      parts.push([key, params[key]].join('='));
    }
    params.params = separator + parts.join('&');
    params.route = route;
    
    return params;
  },
  
  /**
    The current location hash. It is the part in the browser's location after
    the '#' mark.
    
    The following code
    
    {{{
      SC.routes.set('location', 'notes/edit/4');
    }}}
    
    will change the location to http://domain.tld/my_app#notes/edit/4 and call
    the correct route handler if it has been registered with the add method.
    
    You can also pass additional parameters. They will be relayed to the route
    handler. For example, the following code
    
    {{{
      SC.routes.add(':controller/:action/:id', MyApp, MyApp.route);
      SC.routes.set('location', 'notes/show/4?format=xml&language=fr');
    }}}
    
    will change the location to 
    http://domain.tld/my_app#notes/show/4?format=xml&language=fr and call the
    MyApp.route method with the following argument:
    
    {{{
      { route: 'notes/show/4',
        params: '?format=xml&language=fr',
        controller: 'notes',
        action: 'show',
        id: '4',
        format: 'xml',
        language: 'fr' }
    }}}
    
    The location can also be set with a hash, the following code
    
    {{{
      SC.routes.set('location',
        { route: 'notes/edit/4', format: 'xml', language: 'fr' });
    }}}
    
    will change the location to
    http://domain.tld/my_app#notes/show/4?format=xml&language=fr.
    
    The 'notes/show/4&format=xml&language=fr' syntax for passing parameters,
    using a '&' instead of a '?', as used in SproutCore 1.0 is still supported.
    
    @property
    @type {String}
  */
  location: function(key, value) {
    var crumbs, encodedValue;
    
    if (value !== undefined) {
      if (value === null) {
        value = '';
      }
      
      if (typeof(value) === 'object') {
        crumbs = this._extractParametersAndRoute(value);
        value = crumbs.route + crumbs.params;
      }
      
      if (!SC.empty(value) || (this._location && this._location !== value)) {
        encodedValue = encodeURI(value);
        
        if (this.usesHistory) {
          if (encodedValue.length > 0) {
            encodedValue = '/' + encodedValue;
          }
          window.history.pushState(null, null, this.get('baseURI') + encodedValue);
        } else {
          window.location.hash = encodedValue;
        }
      }
      
      this._location = value;
    }
    
    return this._location;
  }.property(),
  
  /**
    You usually don't need to call this method. It is done automatically after
    the application has been initialized.
    
    It registers for the hashchange event if available. If not, it creates a
    timer that looks for location changes every 150ms.
  */
  ping: function() {
    var that;
    
    if (!this._didSetup) {
      this._didSetup = YES;
      
      if (this.get('wantsHistory') && SC.platform.supportsHistory) {
        this.usesHistory = YES;
        
        this.popState();
        SC.Event.add(window, 'popstate', this, this.popState);
        
      } else {
        this.usesHistory = NO;
        
        if (SC.platform.supportsHashChange) {
          this.hashChange();
          SC.Event.add(window, 'hashchange', this, this.hashChange);
      
        } else {
          // we don't use a SC.Timer because we don't want
          // a run loop to be triggered at each ping
          that = this;
          this._invokeHashChange = function() {
            that.hashChange();
            setTimeout(that._invokeHashChange, 100);
          };
          this._invokeHashChange();
        }
      }
    }
  },
  
  /**
    Event handler for the hashchange event. Called automatically by the browser
    if it supports the hashchange event, or by our timer if not.
  */
  hashChange: function(event) {
    var loc = window.location.hash;
    
    // Remove the '#' prefix
    loc = (loc && loc.length > 0) ? loc.slice(1, loc.length) : '';
    
    if (!SC.browser.isMozilla) {
      // because of bug https://bugzilla.mozilla.org/show_bug.cgi?id=483304
      loc = decodeURI(loc);
    }
    
    if (this.get('location') !== loc) {
      SC.run(function() {
        this.set('location', loc);
      }, this);
    }
  },
  
  popState: function(event) {
    var base = this.get('baseURI'),
        loc = document.location.href;
    
    if (loc.slice(0, base.length) === base) {
      
      // Remove the base prefix and the extra '/'
      loc = loc.slice(base.length + 1, loc.length);
      
      if (this.get('location') !== loc) {
        SC.run(function() {
          this.set('location', loc);
        }, this);
      }
    }
  },
  
  /**
    Adds a route handler. Routes have the following format:
      - 'users/show/5' is a static route and only matches this exact string,
      - ':action/:controller/:id' is a dynamic route and the handler will be
        called with the 'action', 'controller' and 'id' parameters passed in a
        hash,
      - '*url' is a wildcard route, it matches the whole route and the handler
        will be called with the 'url' parameter passed in a hash.
    
    Route types can be combined, the following are valid routes:
      - 'users/:action/:id'
      - ':controller/show/:id'
      - ':controller/ *url' (ignore the space, because of jslint)
    
    @param {String} route the route to be registered
    @param {Object} target the object on which the method will be called, or
      directly the function to be called to handle the route
    @param {Function} method the method to be called on target to handle the
      route, can be a function or a string
  */
  add: function(route, target, method) {
    if (!this._didSetup) {
      this.invokeLast(this.ping);
    }
    
    if (method === undefined && SC.typeOf(target) === SC.T_FUNCTION) {
      method = target;
      target = null;
    } else if (SC.typeOf(method) === SC.T_STRING) {
      method = target[method];
    }
    
    if (!this._firstRoute) this._firstRoute = this._Route.create();
    this._firstRoute.add(route.split('/'), target, method);
    
    return this;
  },
  
  /**
    Observer of the 'location' property that calls the correct route handler
    when the location changes.
  */
  locationDidChange: function() {
    this.trigger();
  }.observes('location'),
  
  /**
    Triggers a route even if already in that route (does change the location, if it
    is not already changed, as well).
    
    If the location is not the same as the supplied location, this simply lets "location"
    handle it (which ends up coming back to here).
  */
  trigger: function() {
    var firstRoute = this._firstRoute,
        location = this.get('location'),
        params, route;
    
    if (firstRoute) {
      params = this._extractParametersAndRoute({ route: location });
      location = params.route;
      delete params.route;
      delete params.params;
      route = firstRoute.routeForParts(location.split('/'), params);
      if (route && route.target && route.method) {
        route.method.call(route.target, params);
      }
    }
  },
  
  /**
    @private
    @class

    SC.routes._Route is a class used internally by SC.routes. The routes defined by your
    application are stored in a tree structure, and this is the class for the
    nodes.
  */
  _Route: SC.Object.extend(
  /** @scope SC.routes._Route.prototype */ {

    target: null,

    method: null,

    staticRoutes: null,

    dynamicRoutes: null,

    wildcardRoutes: null,

    add: function(parts, target, method) {
      var part, nextRoute;

      // clone the parts array because we are going to alter it
      parts = SC.clone(parts);

      if (!parts || parts.length === 0) {
        this.target = target;
        this.method = method;

      } else {
        part = parts.shift();

        // there are 3 types of routes
        switch (part.slice(0, 1)) {

        // 1. dynamic routes
        case ':':
          part = part.slice(1, part.length);
          if (!this.dynamicRoutes) this.dynamicRoutes = {};
          if (!this.dynamicRoutes[part]) this.dynamicRoutes[part] = this.constructor.create();
          nextRoute = this.dynamicRoutes[part];
          break;

        // 2. wildcard routes
        case '*':
          part = part.slice(1, part.length);
          if (!this.wildcardRoutes) this.wildcardRoutes = {};
          nextRoute = this.wildcardRoutes[part] = this.constructor.create();
          break;

        // 3. static routes
        default:
          if (!this.staticRoutes) this.staticRoutes = {};
          if (!this.staticRoutes[part]) this.staticRoutes[part] = this.constructor.create();
          nextRoute = this.staticRoutes[part];
        }

        // recursively add the rest of the route
        if (nextRoute) nextRoute.add(parts, target, method);
      }
    },

    routeForParts: function(parts, params) {
      var part, key, route;

      // clone the parts array because we are going to alter it
      parts = SC.clone(parts);

      // if parts is empty, we are done
      if (!parts || parts.length === 0) {
        return this.method ? this : null;

      } else {
        part = parts.shift();

        // try to match a static route
        if (this.staticRoutes && this.staticRoutes[part]) {
          return this.staticRoutes[part].routeForParts(parts, params);

        } else {

          // else, try to match a dynamic route
          for (key in this.dynamicRoutes) {
            route = this.dynamicRoutes[key].routeForParts(parts, params);
            if (route) {
              params[key] = part;
              return route;
            }
          }

          // else, try to match a wilcard route
          for (key in this.wildcardRoutes) {
            parts.unshift(part);
            params[key] = parts.join('/');
            return this.wildcardRoutes[key].routeForParts(null, params);
          }

          // if nothing was found, it means that there is no match
          return null;
        }
      }
    }

  })
  
});

/* >>>>>>>>>> BEGIN source/system/staticqueue.js */
SC.StaticQueue = SC.mixin({},
{
  _content: null,
  
  create: function(max) {
    var ret = SC.beget(this);
    ret._content = [];
    ret._content.length = max;
    
    return ret;
  },
  
  enqueue: function(item) {
    if(this.length >= this._content.length) {
      return;
    }
    
    this._content[this._tail++] = item;
    
    if(this._tail >= this._content.length) this._tail = 0;
    
    this.length++;
    
    return this;
  },
  
  dequeue: function() {
    var ret;
    
    if(this.length > 0) {
      ret = this._content[this._head++];
    } else {
      return null;
    }
    
    if(this._head >= this._content.length) this._head = 0;
    
    this.length--;
    
    return ret;
  },
  
  peek: function(index) {
    index = index || 0;
    return this._content[(this._head + index) % this.length];
  },
  
  length: 0,
  
  _head: 0,
  
  _tail: 0
});

/* >>>>>>>>>> BEGIN source/tasks/task.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Represents a single task which can be run by a task queue. Note that tasks
  are actually allowed to add themselves back onto the queue if they did not/
  might not finish.
*/
SC.Task = SC.Object.extend({
  run: function(queue) {
    // if needed, you could put the task back on the queue for later finishing.
  }
});

/* >>>>>>>>>> BEGIN source/system/task_queue.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require("tasks/task");

/**
  Runs a set of tasks. Most importantly, has a runWhenIdle option that allows
  it to run when no user input is occurring. This allows, for instance, preloading
  bundles while not blocking user interaction.
*/
SC.TaskQueue = SC.Task.extend({
  
  init: function() {
    var self = this;
    this._doIdleEntry = function() {
      self._idleEntry();
    };
    
    this._tasks = [];
  },
  
  /**
    If YES, the queue will automatically run in the background when the browser idles.
  */
  runWhenIdle: NO,
  
  /**
    A limit which, if exceeded, the task queue will wait until a later run
    to continue.
  */
  runLimit: 50,
  
  /**
    The duration between idle runs.
  */
  interval: 50,
  
  /**
    If running, YES.
  */
  isRunning: NO,
  
  /**
    The minimum elapsed time since the last event. As a rule of thumb, perhaps
    something equivalent to the expected duration of a task.
  */
  minimumIdleDuration: 500,
  
  _tasks: null,
  
  /**
    Returns YES if there are tasks in the queue.
  */
  hasTasks: function() {
    return this._tasks.length > 0;
  }.property('taskCount').cacheable(),
  
  /**
    Returns the number of tasks in the queue.
  */
  taskCount: function() {
    return this._tasks.length;
  }.property().cacheable(),
  
  /**
    Adds the task to the end of the queue.
  */
  push: function(task) {
    this._tasks.push(task);
    this.notifyPropertyChange('taskCount');
  },
  
  /**
    Removes and returns the first task in the queue.
  */
  next: function() {
    // null if there is no task
    if (this._tasks.length < 1) return null;
    
    // otherwise, return the first one in the queue
    var next = this._tasks.shift();
    this.notifyPropertyChange('taskCount');
    return next;
  },
  
  /**
    @private
    Sets up idling if needed when the task count changes.
  */
  _taskCountDidChange: function() {
    this._setupIdle();
  }.observes('taskCount'),
  
  /**
    Sets up the scheduled idling check if needed and applicable.
    @private
  */
  _setupIdle: function() {
    if (this.get('runWhenIdle') && !this._idleIsScheduled && this.get('taskCount') > 0) {
      setTimeout(this._doIdleEntry, 
        this.get('interval')
      );
      this._idleIsScheduled = YES;
    }
  },
  
  /**
    The entry point for the idle.
    @private
  */
  _idleEntry: function() {
    this._idleIsScheduled = NO;
    var last = SC.RunLoop.lastRunLoopEnd;
    
    // if no recent events (within < 1s)
    if (Date.now() - last > this.get('minimumIdleDuration')) {
      SC.run(this.run, this);
      SC.RunLoop.lastRunLoopEnd = last; // we were never here
    }
    
    // set up idle timer if needed
    this._setupIdle();
  },
  
  /**
    Runs tasks until limit (TaskQueue.runLimit by default) is reached.
  */
  run: function(limit) {
    this.set("isRunning", YES);
    if (!limit) limit = this.get("runLimit");
    
    var task, start = Date.now();
    
    while (task = this.next()) {
      task.run(this);
      
      // check if the limit has been exceeded
      if (Date.now() - start > limit) break;
    }
    
    this.set("isRunning", NO);
  }
  
  
});

SC.backgroundTaskQueue = SC.TaskQueue.create({
  runWhenIdle: YES
});

/* >>>>>>>>>> BEGIN source/system/time.js */
// ========================================================================
// SproutCore -- JavaScript Application Framework
// Copyright ©2006-2011, Strobe Inc. and contributors.
// Portions copyright ©2008 Apple Inc.  All rights reserved.
// ========================================================================

/**
  The time library provides a common way for working with time offsets.

  #1 - Fast, not-chained
  
  t = SC.time.month(123) ;
  
  #2 - Chained
  
  t = SC.time(123).month(3).day(12).year(2003).done();

  t = SC.time(123).month(3) ;
*/
SC.time = function(timeoffset) {
  var ret = SC.beget(fn) ;
  ret.value = timeOffset ;
  return ret ;
} ;

(function() {

  var date = new Date();
  
  SC.mixin(SC.time, /** @scope SC.time @static */ { 

    month: function(offset, newMonth) {
      date.setTime(offset) ;
      if (newMonth === undefined) return date.getMonth() ;
      date.setMonth(newMonth) ;
      return date.getTime() ;
    },
    
    /**
      Converts an offset in local time into an offset in UTC time.
      
      @param {Time} offset the local time offset
      @returns {Time} the new offset
    */
    utc: function(offset) {
      date.setTime(offset) ;
      return offset + (date.getTimezoneOffset()*60*1000);  
    },
    
    local: function(offset) {
      date.setTime(offset) ;
      return offset - (date.getTimezoneOffset()*60*1000);  
    },
    
    parse: function(string) {
      
    },
    
    format: function(offset) {
      
    }

  }) ;
  
})() ;

SC.time.fmt = SC.time.format ;

SC.time.fn = {
  
  done: function() { return this.value ; }
  
} ;

"month day year".split(' ').forEach(function(key) {
  SC.time.fn[key] = function(newTime) {
    if (newTime === undefined) {
      return SC.time[key](this.value);
    } else {
      this.value = SC.time[key](this.value, newTime) ;
      return this ;  
    }
  } ;
}) ;

//-----

// Test.context("test basic Date mapping functions", {
//   "month() should return month, month(value) should set month": function() {
//     //...
//   }
// }) ;
// 
// Test.context("test basic Date mapping functions", (function() {
//   var methods = "month day".split(' ') ;
//   var tests = {} ;
//   methods.forEach(function(name) {
//     var testName = "%@() should return %@, %@(value) should set %@".fmt(name,name,name,name) ;
//     
//     tests[testName] = function() {
//       var date = new Date() ;
//       var time = date.getTime() ;
// 
//       var value = date["get%@".fmt(name.capitalize())]() ;
//       equals(value, SC.time[name](), "get");
//       
//       var value = date["set%@".fmt(name.capitalize())](3).getTime() ;
//       equals(value, SC.time[name](3), "set");
//       
//     } ;
//   });
//   
//   return tests ;
// })()) ;


// Extensions to the Date object. Comes from JavaScript Toolbox at:
// http://www.mattkruse.com/javascript/date/source.html

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) {return(x<0||x>9?"":"0")+x;}

SC.Locale.define('en', {
  longMonthNames: 'January February March April May'.split(' '),
  shortMonthNames: [],
  
  shortDateFormat: 'dd/mm/yy',
  longDateFormat: ''
}) ;

SC.mixin(Date,{
  
  // ------------------------------------------------------------------
  // isDate ( date_string, format_string )
  // Returns true if date string matches format of format string and
  // is a valid date. Else returns false.
  // It is recommended that you trim whitespace around the value before
  // passing it to this function, as whitespace is NOT ignored!
  // ------------------------------------------------------------------
  isDate: function(val,format) {
  	var date = Date.getDateFromFormat(val,format);
  	if (date==0) { return false; }
  	return true;
	},

  // -------------------------------------------------------------------
  // compareDates(date1,date1format,date2,date2format)
  //   Compare two date strings to see which is greater.
  //   Returns:
  //   1 if date1 is greater than date2
  //   0 if date2 is greater than date1 of if they are the same
  //  -1 if either of the dates is in an invalid format
  // -------------------------------------------------------------------
  compareDates: function(date1,dateformat1,date2,dateformat2) {
  	var d1= Date.getDateFromFormat(date1,dateformat1);
  	var d2= Date.getDateFromFormat(date2,dateformat2);
  	if (d1==0 || d2==0) {
  		return -1;
  		}
  	else if (d1 > d2) {
  		return 1;
  		}
  	return 0;
	},
	
  // ------------------------------------------------------------------
  // getDateFromFormat( date_string , format_string )
  //
  // This function takes a date string and a format string. It matches
  // If the date string matches the format string, it returns the 
  // getTime() of the date. If it does not match, it returns 0.
  // ------------------------------------------------------------------
  getDateFromFormat: function(val,format) {
  	val=val+"";
  	format=format+"";
  	var i_val=0;
  	var i_format=0;
  	var c="";
  	var token="";
  	var token2="";
  	var x,y;
  	var now=new Date();
  	var year=now.getFullYear();
  	var month=now.getMonth()+1;
  	var date=1;
  	var hh=now.getHours();
  	var mm=now.getMinutes();
  	var ss=now.getSeconds();
  	var ampm="";

    var locale = SC.Locale.currentLocale; 

  	while (i_format < format.length) {
  		// Get next token from format string
  		c=format.charAt(i_format);
  		token="";
  		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
  			token += format.charAt(i_format++);
  			}
  		// Extract contents of value based on format token
  		if (token=="yyyy" || token=="yy" || token=="y") {
  			if (token=="yyyy") { x=4;y=4; }
  			if (token=="yy")   { x=2;y=2; }
  			if (token=="y")    { x=2;y=4; }
  			year=Date._getInt(val,i_val,x,y);
  			if (year==null) { return 0; }
  			i_val += year.length;
  			if (year.length==2) {
  				if (year > 70) { year=1900+(year-0); }
  				else { year=2000+(year-0); }
  				}
  			}
  		else if (token=="MMM"||token=="NNN"){
  			month=0;
  			for (var i=0; i<MONTH_NAMES.length; i++) {
  				var month_name=MONTH_NAMES[i];
  				if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
  					if (token=="MMM"||(token=="NNN"&&i>11)) {
  						month=i+1;
  						if (month>12) { month -= 12; }
  						i_val += month_name.length;
  						break;
  						}
  					}
  				}
  			if ((month < 1)||(month>12)){return 0;}
  			}
  		else if (token=="EE"||token=="E"){
  			for (var i=0; i<DAY_NAMES.length; i++) {
  				var day_name=DAY_NAMES[i];
  				if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
  					i_val += day_name.length;
  					break;
  					}
  				}
  			}
  		else if (token=="MM"||token=="M") {
  			month=Date._getInt(val,i_val,token.length,2);
  			if(month==null||(month<1)||(month>12)){return 0;}
  			i_val+=month.length;}
  		else if (token=="dd"||token=="d") {
  			date=Date._getInt(val,i_val,token.length,2);
  			if(date==null||(date<1)||(date>31)){return 0;}
  			i_val+=date.length;}
  		else if (token=="hh"||token=="h") {
  			hh=Date._getInt(val,i_val,token.length,2);
  			if(hh==null||(hh<1)||(hh>12)){return 0;}
  			i_val+=hh.length;}
  		else if (token=="HH"||token=="H") {
  			hh=Date._getInt(val,i_val,token.length,2);
  			if(hh==null||(hh<0)||(hh>23)){return 0;}
  			i_val+=hh.length;}
  		else if (token=="KK"||token=="K") {
  			hh=Date._getInt(val,i_val,token.length,2);
  			if(hh==null||(hh<0)||(hh>11)){return 0;}
  			i_val+=hh.length;}
  		else if (token=="kk"||token=="k") {
  			hh=Date._getInt(val,i_val,token.length,2);
  			if(hh==null||(hh<1)||(hh>24)){return 0;}
  			i_val+=hh.length;hh--;}
  		else if (token=="mm"||token=="m") {
  			mm=Date._getInt(val,i_val,token.length,2);
  			if(mm==null||(mm<0)||(mm>59)){return 0;}
  			i_val+=mm.length;}
  		else if (token=="ss"||token=="s") {
  			ss=Date._getInt(val,i_val,token.length,2);
  			if(ss==null||(ss<0)||(ss>59)){return 0;}
  			i_val+=ss.length;}
  		else if (token=="a") {
  			if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
  			else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
  			else {return 0;}
  			i_val+=2;}
  		else {
  			if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
  			else {i_val+=token.length;}
  			}
  		}
  	// If there are any trailing characters left in the value, it doesn't match
  	if (i_val != val.length) { return 0; }
  	// Is date valid for month?
  	if (month==2) {
  		// Check for leap year
  		if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
  			if (date > 29){ return 0; }
  			}
  		else { if (date > 28) { return 0; } }
  		}
  	if ((month==4)||(month==6)||(month==9)||(month==11)) {
  		if (date > 30) { return 0; }
  		}
  	// Correct hours value
  	if (hh<12 && ampm=="PM") { hh=hh-0+12; }
  	else if (hh>11 && ampm=="AM") { hh-=12; }
  	var newdate=new Date(year,month-1,date,hh,mm,ss);
  	return newdate.getTime();
  },

  // ------------------------------------------------------------------
  // parseDate( date_string [, prefer_euro_format] )
  //
  // This function takes a date string and tries to match it to a
  // number of possible date formats to get the value. It will try to
  // match against the following international formats, in this order:
  // y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
  // M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
  // d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
  // 
  // Also understands: 
  // 
  // yesterday, today, tomorrow, now
  //
  // A second argument may be passed to instruct the method to search
  // for formats like d/M/y (european format) before M/d/y (American).
  // Returns a Date object or null if no patterns match.
  // ------------------------------------------------------------------
  parseDate: function(val) {
  	var preferEuro=(arguments.length==2)?arguments[1]:false;
  	generalFormats=new Array('E NNN dd HH:mm:ss UTC yyyy','y-M-d','y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d','d MMM y','d.MMM.y','y MMM d','y.MMM.d');
  	monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
  	dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
  	var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
  	var d=null;
  	
  	// first look for natural language
  	d = 0 ; var now = new Date().getTime() ;
  	switch(val.toLowerCase()) {
  	  case 'yesterday'.loc():
  	    d = now - (24*60*60*1000) ;
  	    break ;
  	  case 'today'.loc():
  	  case 'now'.loc():
  	    d = now ;
  	    break ;
  	  case 'tomorrow'.loc():
  	    d = now + (24*60*60*1000) ;
  	    break;
  	}
  	if (d>0) return new Date(d) ;
  	
  	for (var i=0; i<checkList.length; i++) {
  		var l=window[checkList[i]];
  		for (var j=0; j<l.length; j++) {
  			d=Date.getDateFromFormat(val,l[j]);
  			if (d==0) d = Date.getDateFromFormat(val,l[j] + ' H:m:s') ;
  			if (d==0) d = Date.getDateFromFormat(val,l[j] + ' h:m:s a') ;
  			if (d!=0) return new Date(d); 
  		}
  	}
  	return null;
  },
  
  // ------------------------------------------------------------------
  // Utility functions for parsing in getDateFromFormat()
  // ------------------------------------------------------------------
  _isInteger: function(val) {
  	var digits="1234567890";
  	for (var i=0; i < val.length; i++) {
  		if (digits.indexOf(val.charAt(i))==-1) { return false; }
  	}
  	return true;
  },
  
  _getInt: function(str,i,minlength,maxlength) {
  	for (var x=maxlength; x>=minlength; x--) {
  		var token=str.substring(i,i+x);
  		if (token.length < minlength) { return null; }
  		if (Date._isInteger(token)) { return token; }
  	}
  	return null;
  }

}) ;

SC.mixin(Date.prototype, {
  
  // ------------------------------------------------------------------
  // formatDate (date_object, format)
  // Returns a date in the output format specified.
  // The format string uses the same abbreviations as in getDateFromFormat()
  // 
  // ------------------------------------------------------------------
  format: function(format) {
  	format=format+"";
    var date = this ;
  	var result="";
  	var i_format=0;
  	var c="";
  	var token="";
  	var y=date.getFullYear()+"";
  	var M=date.getMonth()+1;
  	var d=date.getDate();
  	var E=date.getDay();
  	var H=date.getHours();
  	var m=date.getMinutes();
  	var s=date.getSeconds();
  	var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
  	// Convert real date parts into formatted versions
  	var value=new Object();
  	if (y.length < 4) {y=""+(y-0+1900);}
  	value["y"]=""+y;
  	value["yyyy"]=y;
  	value["yy"]=y.substring(2,4);
  	value["M"]=M;
  	value["MM"]=LZ(M);
  	value["MMM"]=MONTH_NAMES[M-1];
  	value["NNN"]=MONTH_NAMES[M+11];
  	value["d"]=d;
  	value["dd"]=LZ(d);
  	value["E"]=DAY_NAMES[E+7];
  	value["EE"]=DAY_NAMES[E];
  	value["H"]=H;
  	value["HH"]=LZ(H);
  	if (H==0){value["h"]=12;}
  	else if (H>12){value["h"]=H-12;}
  	else {value["h"]=H;}
  	value["hh"]=LZ(value["h"]);
  	if (H>11){value["K"]=H-12;} else {value["K"]=H;}
  	value["k"]=H+1;
  	value["KK"]=LZ(value["K"]);
  	value["kk"]=LZ(value["k"]);
  	if (H > 11) { value["a"]="PM"; }
  	else { value["a"]="AM"; }
  	value["m"]=m;
  	value["mm"]=LZ(m);
  	value["s"]=s;
  	value["ss"]=LZ(s);
  	while (i_format < format.length) {
  		c=format.charAt(i_format);
  		token="";
  		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
  			token += format.charAt(i_format++);
  			}
  		if (value[token] != null) { result=result + value[token]; }
  		else { result=result + token; }
  		}
  	return result;
  },
  
  utcFormat: function() { return (new Date(this.getTime() + (this.getTimezoneOffset() * 60 * 1000))).format('E NNN dd HH:mm:ss UTC yyyy'); }

}) ;

/* >>>>>>>>>> BEGIN source/system/user_defaults.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ie7userdata openDatabase*/
/**
  @class

  The UserDefaults object provides an easy way to store user preferences in
  your application on the local machine.  You use this by providing built-in
  defaults using the SC.userDefaults.defaults() method.  You can also
  implement the UserDefaultsDelegate interface to be notified whenever a
  default is required.

  You should also set the userDomain property on the defaults on page load.
  This will allow the UserDefaults application to store/fetch keys from
  localStorage for the correct user.

  You can also set an appDomain property if you want.  This will be
  automatically prepended to key names with no slashes in them.

  SC.userDefaults.getPath("global:contactInfo.userName");

  @extends SC.Object
  @since SproutCore 1.0
*/
SC.UserDefaults = SC.Object.extend(/** @scope SC.UserDefaults.prototype */ {

  ready: NO,

  /**
    the default domain for the user.  This will be used to store keys in
    local storage.  If you do not set this property, the wrong values may be
    returned.
  */
  userDomain: null,

  /**
    The default app domain for the user.  Any keys that do not include a
    slash will be prefixed with this app domain key when getting/setting.
  */
  appDomain: null,

  /** @private
    Defaults.  These will be used if not defined on localStorage.
  */
  _defaults: null,

  _safari3DB: null,

  /**
    Invoke this method to set the builtin defaults.  This will cause all
    properties to change.
  */
  defaults: function(newDefaults) {
    this._defaults = newDefaults ;
    this.allPropertiesDidChange();
  },

  /**
    Attempts to read a user default from local storage.  If not found on
    localStorage, use the the local defaults, if defined.  If the key passed
    does not include a slash, then add the appDomain or use "app/".

    @param {String} keyName
    @returns {Object} read value
  */
  readDefault: function(keyName) {
    var ret, userKeyName, localStorage, key, del, storageSafari3;

    // namespace keyname
    keyName = this._normalizeKeyName(keyName);
    userKeyName = this._userKeyName(keyName);

    // look into recently written values
    if (this._written) { ret = this._written[userKeyName]; }

    // attempt to read from localStorage

    if(SC.browser.msie=="7.0"){
      localStorage=document.body;
      try{
        localStorage.load("SC.UserDefaults");
      }catch(e){
        console.err("Couldn't load userDefaults in IE7: "+e.description);
      }
    }else if(this.HTML5DB_noLocalStorage){
      storageSafari3 = this._safari3DB;
    }else{
      localStorage = window.localStorage ;
      if (!localStorage && window.globalStorage) {
        localStorage = window.globalStorage[window.location.hostname];
      }
    }
    if (localStorage || storageSafari3) {
      key=["SC.UserDefaults",userKeyName].join('-at-');
      if(SC.browser.msie == "7.0") {
        ret=localStorage.getAttribute(key.replace(/\W/gi, ''));
      } else if(storageSafari3) {
        ret = this.dataHash[key];
      } else {
        ret = localStorage[key];
      }
      if (!SC.none(ret)) {
        try { ret = SC.json.decode(ret); }
        catch(ex) {}
      }
    }

    // if not found in localStorage, try to notify delegate
    del = this.delegate ;
    if (del && del.userDefaultsNeedsDefault) {
      ret = del.userDefaultsNeedsDefault(this, keyName, userKeyName);
    }

    // if not found in localStorage or delegate, try to find in defaults
    if ((ret===undefined) && this._defaults) {
      ret = this._defaults[userKeyName] || this._defaults[keyName];
    }

    return ret ;
  },

  /**
    Attempts to write the user default to local storage or at least saves them
    for now.  Also notifies that the value has changed.

    @param {String} keyName
    @param {Object} value
    @returns {SC.UserDefault} receiver
  */
  writeDefault: function(keyName, value) {
    var userKeyName, written, localStorage, key, del, storageSafari3;

    keyName = this._normalizeKeyName(keyName);
    userKeyName = this._userKeyName(keyName);

    // save to local hash
    written = this._written ;
    if (!written) { written = this._written = {}; }
    written[userKeyName] = value ;

    // save to local storage

    if(SC.browser.msie=="7.0"){
      localStorage=document.body;
    }else if(this.HTML5DB_noLocalStorage){
      storageSafari3 = this._safari3DB;
    }else{
       localStorage = window.localStorage ;
       if (!localStorage && window.globalStorage) {
         localStorage = window.globalStorage[window.location.hostname];
       }
    }
    key=["SC.UserDefaults",userKeyName].join('-at-');
    if (localStorage || storageSafari3) {
      var encodedValue = SC.json.encode(value);
      if(SC.browser.msie=="7.0"){
        localStorage.setAttribute(key.replace(/\W/gi, ''), encodedValue);
        localStorage.save("SC.UserDefaults");
      }else if(storageSafari3){
        var obj = this;
        storageSafari3.transaction(
          function (t) {
            t.executeSql("delete from SCLocalStorage where key = ?", [key],
              function (){
                t.executeSql("insert into SCLocalStorage(key, value)"+
                            " VALUES ('"+key+"', '"+encodedValue+"');",
                            [], obj._nullDataHandler, obj.killTransaction
                );
              }
            );
          }
        );
        this.dataHash[key] = encodedValue;
      }else{
        try{
          localStorage[key] = encodedValue;
        }catch(e){
          console.error("Failed using localStorage. "+e);
        }
      }
    }

    // also notify delegate
    del = this.delegate;
    if (del && del.userDefaultsDidChange) {
      del.userDefaultsDidChange(this, keyName, value, userKeyName);
    }

    return this ;
  },

  /**
    Removed the passed keyName from the written hash and local storage.

    @param {String} keyName
    @returns {SC.UserDefaults} receiver
  */
  resetDefault: function(keyName) {
    var fullKeyName, userKeyName, written, localStorage, key, storageSafari3;
    fullKeyName = this._normalizeKeyName(keyName);
    userKeyName = this._userKeyName(fullKeyName);

    this.propertyWillChange(keyName);
    this.propertyWillChange(fullKeyName);

    written = this._written;
    if (written) delete written[userKeyName];

    if(SC.browser.msie=="7.0"){
       localStorage=document.body;
    }else if(this.HTML5DB_noLocalStorage){
         storageSafari3 = this._safari3DB;
    }else{
       localStorage = window.localStorage ;
       if (!localStorage && window.globalStorage) {
         localStorage = window.globalStorage[window.location.hostname];
       }
    }

    key=["SC.UserDefaults",userKeyName].join('-at-');

    if (localStorage) {
      if(SC.browser.msie=="7.0"){
        localStorage.setAttribute(key.replace(/\W/gi, ''), null);
        localStorage.save("SC.UserDefaults");
      } else if(storageSafari3){
        var obj = this;
        storageSafari3.transaction(
          function (t) {
            t.executeSql("delete from SCLocalStorage where key = ?", [key], null);
          }
        );
        delete this.dataHash[key];
      }else{
        // In case error occurs while deleting local storage in any browser,
        // do not allow it to propagate further
        try{
          delete localStorage[key];
        } catch(e) {
          console.warn('Deleting local storage encountered a problem. '+e);
        }
      }
    }


    this.propertyDidChange(keyName);
    this.propertyDidChange(fullKeyName);
    return this ;
  },

  /**
    Is called whenever you .get() or .set() values on this object

    @param {Object} key
    @param {Object} value
    @returns {Object}
  */
  unknownProperty: function(key, value) {
    if (value === undefined) {
      return this.readDefault(key) ;
    } else {
      this.writeDefault(key, value);
      return value ;
    }
  },

  /**
    Normalize the passed key name.  Used by all accessors to automatically
    insert an appName if needed.
  */
  _normalizeKeyName: function(keyName) {
    if (keyName.indexOf(':')<0) {
      var domain = this.get('appDomain') || 'app';
      keyName = [domain, keyName].join(':');
    }
    return keyName;
  },

  /**
    Builds a user key name from the passed key name
  */
  _userKeyName: function(keyName) {
    var user = this.get('userDomain') || '(anonymous)' ;
    return [user,keyName].join('-at-');
  },

  _domainDidChange: function() {
    var didChange = NO;
    if (this.get("userDomain") !== this._scud_userDomain) {
      this._scud_userDomain = this.get('userDomain');
      didChange = YES;
    }

    if (this.get('appDomain') !== this._scud_appDomain) {
      this._scud_appDomain = this.get('appDomain');
      didChange = YES;
    }

    if (didChange) this.allPropertiesDidChange();
  }.observes('userDomain', 'appDomain'),

  init: function() {
    arguments.callee.base.apply(this,arguments);
    if(SC.userDefaults && SC.userDefaults.get('dataHash')){
      var dh = SC.userDefaults.get('dataHash');
      if (dh) this.dataHash=SC.userDefaults.get('dataHash')
    }
    this._scud_userDomain = this.get('userDomain');
    this._scud_appDomain  = this.get('appDomain');
    if(SC.browser.msie=="7.0"){
      //Add user behavior userData. This works in all versions of IE.
      //Adding to the body as is the only element never removed.
      document.body.addBehavior('#default#userData');
    }
    this.HTML5DB_noLocalStorage = ((parseInt(SC.browser.safari, 0)>523) && (parseInt(SC.browser.safari, 0)<528));
    if(this.HTML5DB_noLocalStorage){
      var myDB;
      try {
        if (!window.openDatabase) {
          console.error("Trying to load a database with safari version 3.1 "+
                  "to get SC.UserDefaults to work. You are either in a"+
                  " previous version or there is a problem with your browser.");
          return;
        } else {
          var shortName = 'scdb',
              version = '1.0',
              displayName = 'SproutCore database',
              maxSize = 65536; // in bytes,
          myDB = openDatabase(shortName, version, displayName, maxSize);

          // You should have a database instance in myDB.

        }
      } catch(e) {
        console.error("Trying to load a database with safari version 3.1 "+
                "to get SC.UserDefaults to work. You are either in a"+
                " previous version or there is a problem with your browser.");
        return;
      }

      if(myDB){
        var obj = this;
        myDB.transaction(
          function (transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS SCLocalStorage'+
              '(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL);',
              [], obj._nullDataHandler, obj.killTransaction);
          }
        );
        myDB.transaction(
          function (transaction) {

            transaction.parent = obj;
            transaction.executeSql('SELECT * from SCLocalStorage;',
                [], function(transaction, results){
                  var hash={}, row;
                  for(var i=0, iLen=results.rows.length; i<iLen; i++){
                    row=results.rows.item(i);
                    hash[row['key']]=row['value'];
                  }
                  transaction.parent.dataHash = hash;
                  SC.run(function() { jQuery.ready(true); });
                }, obj.killTransaction);
          }
        );
        this._safari3DB=myDB;
      }
    }else{
      jQuery.ready(true);
    }
  },


  //Private methods to use if user defaults uses the database in safari 3
  _killTransaction: function(transaction, error){
    return true; // fatal transaction error
  },

  _nullDataHandler: function(transaction, results){}
});

jQuery.readyWait++;

/** global user defaults. */
SC.userDefaults = SC.UserDefaults.create();

/* >>>>>>>>>> BEGIN source/system/utils/colors.js */
SC.mixin ( /** @scope SC */ {

  /** Returns hex color from hsv value */
  convertHsvToHex: function (h, s, v) {
    var r = 0, g = 0, b = 0;

    if (v > 0) {
      var i = (h == 1) ? 0 : Math.floor(h * 6),
          f = (h == 1) ? 0 : (h * 6) - i,
          p = v * (1 - s),
          q = v * (1 - (s * f)),
          t = v * (1 - (s * (1 - f))),
          rgb = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];
      r = Math.round(255 * rgb[i][0]);
      g = Math.round(255 * rgb[i][1]);
      b = Math.round(255 * rgb[i][2]);
    }
    return this.parseColor('rgb(' + r + ',' + g + ',' + b + ')');
  },

  /** Returns hsv color from hex value */
  convertHexToHsv: function (hex) {
    var rgb = this.expandColor(hex),
        max = Math.max(Math.max(rgb[0], rgb[1]), rgb[2]),
        min = Math.min(Math.min(rgb[0], rgb[1]), rgb[2]),
        s = (max === 0) ? 0 : (1 - min/max),
        v = max/255,
        h = (max == min) ? 0 : ((max == rgb[0]) ? ((rgb[1]-rgb[2])/(max-min)/6) : ((max == rgb[1]) ? ((rgb[2]-rgb[0])/(max-min)/6+1/3) : ((rgb[0]-rgb[1])/(max-min)/6+2/3)));
    h = (h < 0) ? (h + 1) : ((h > 1)  ? (h - 1) : h);
    return [h, s, v];
  },

  /** regular expression for parsing color: rgb, hex */
  PARSE_COLOR_RGBRE: /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
  PARSE_COLOR_HEXRE: /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,

  // return an array of r,g,b colour
  expandColor: function(color) {
    var hexColor, red, green, blue;
    hexColor = this.parseColor(color);
    if (hexColor) {
      red = parseInt(hexColor.slice(1, 3), 16);
      green = parseInt(hexColor.slice(3, 5), 16);
      blue = parseInt(hexColor.slice(5, 7), 16);
      return [red,green,blue];
    }
  },

  // parse rgb color or 3-digit hex color to return a properly formatted 6-digit hex colour spec, or false
  parseColor: function(string) {
    var i=0, color = '#', match, part;
    if(match = this.PARSE_COLOR_RGBRE.exec(string)) {
      for (i=1; i<=3; i++) {
        part = Math.max(0, Math.min(255, parseInt(match[i],0)));
        color += this.toColorPart(part);
      }
      return color;
    }
    if (match = this.PARSE_COLOR_HEXRE.exec(string)) {
      if(match[1].length == 3) {
        for (i=0; i<3; i++) {
          color += match[1].charAt(i) + match[1].charAt(i);
        }
        return color;
      }
      return '#' + match[1];
    }
    return false;
  },

  // convert one r,g,b number to a 2 digit hex string
  toColorPart: function(number) {
    if (number > 255) number = 255;
    var digits = number.toString(16);
    if (number < 16) return '0' + digits;
    return digits;
  }


});

/* >>>>>>>>>> BEGIN source/system/utils/range.js */
SC.mixin( /** @scope SC */ {
  /** A zero length range at zero. */
  ZERO_RANGE: { start: 0, length: 0 },

  RANGE_NOT_FOUND: { start: 0, length: -1 },

  /** Returns true if the passed index is in the specified range */
  valueInRange: function(value, range) {
    return (value >= 0) && (value >= range.start) && (value < (range.start + range.length));
  },

  /** Returns first value of the range. */
  minRange: function(range) { return range.start; },

  /** Returns the first value outside of the range. */
  maxRange: function(range) { return (range.length < 0) ? -1 : (range.start + range.length); },

  /** Returns the union of two ranges.  If one range is null, the other
   range will be returned.  */
  unionRanges: function(r1, r2) {
    if ((r1 == null) || (r1.length < 0)) return r2 ;
    if ((r2 == null) || (r2.length < 0)) return r1 ;

    var min = Math.min(r1.start, r2.start),
        max = Math.max(SC.maxRange(r1), SC.maxRange(r2)) ;
    return { start: min, length: max - min } ;
  },

  /** Returns the intersection of the two ranges or SC.RANGE_NOT_FOUND */
  intersectRanges: function(r1, r2) {
    if ((r1 == null) || (r2 == null)) return SC.RANGE_NOT_FOUND ;
    if ((r1.length < 0) || (r2.length < 0)) return SC.RANGE_NOT_FOUND;
    var min = Math.max(SC.minRange(r1), SC.minRange(r2)),
        max = Math.min(SC.maxRange(r1), SC.maxRange(r2)) ;
    if (max < min) return SC.RANGE_NOT_FOUND ;
    return { start: min, length: max-min };
  },

  /** Returns the difference of the two ranges or SC.RANGE_NOT_FOUND */
  subtractRanges: function(r1, r2) {
    if ((r1 == null) || (r2 == null)) return SC.RANGE_NOT_FOUND ;
    if ((r1.length < 0) || (r2.length < 0)) return SC.RANGE_NOT_FOUND;
    var max = Math.max(SC.minRange(r1), SC.minRange(r2)),
        min = Math.min(SC.maxRange(r1), SC.maxRange(r2)) ;
    if (max < min) return SC.RANGE_NOT_FOUND ;
    return { start: min, length: max-min };
  },

  /** Returns a clone of the range. */
  cloneRange: function(r) {
    return { start: r.start, length: r.length };
  },

  /** Returns true if the two passed ranges are equal.  A null value is
    treated like RANGE_NOT_FOUND.
  */
  rangesEqual: function(r1, r2) {
    if (r1===r2) return true ;
    if (r1 == null) return r2.length < 0 ;
    if (r2 == null) return r1.length < 0 ;
    return (r1.start == r2.start) && (r1.length == r2.length) ;
  }

});

/* >>>>>>>>>> BEGIN source/tasks/preload_bundle.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require("tasks/task");

// default callback
SC.didPreloadBundle = function() {};

/**
  @private
  A task that preloads a bundle, supplying a target and action to be called
  on bundle load completion.
*/
SC.PreloadBundleTask = SC.Task.extend({
  /**
    The identifier of the bundle to load.
  */
  bundle: null,
  
  /**
    The target to supply to SC.Module.loadModule.
  */
  target: "SC",
  
  /**
    The action to supply to SC.Module.loadModule.
  */
  action: "preloaded",
  
  run: function(queue) {
    var bundle;
    if (bundle = this.get("bundle")) {
      var st = Date.now();
      SC.Module.loadModule(this.get("bundle"), this.get("target"), this.get("action"));
    }
  }
});

/* >>>>>>>>>> BEGIN source/validators/validator.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.VALIDATE_OK = YES;
SC.VALIDATE_NO_CHANGE = NO;

/**
  @class
  
  Validators provide a way for you to implement simple form field validation
  and transformation.  To use a validator, simply name the validator in the
  "validate" attribute in your text field.  For example, if you want to
  validate a field using the PhoneNumberValidator use this:

  <input value="1234567890" validate="phone-number" />

  Validators get notified at three points.  You can implement one or all
  of these methods to support validation.  All of the validate methods except
  for validateKeypress behave the same way.  You are passed a form, field,
  and possibly the oldValue.  You are expected to return Validator.OK or
  an error string.  Inside this method you typically do one of all of the
  following:

  1. You can simply validate the field value and return OK or an error str
  
  2. You can modify the field value (for example, you could format the
     string to match some predefined format).
     
  3. If you need to roundtrip the server first to perform validation, you can
     return Validator.OK, then save the form and field info until after the
     roundtrip.  On return, if there is a problem, first verify the field
     value has not changed and then call form.errorFor(field,str) ;

  @extends SC.Object
  @since SproutCore 1.0
*/
SC.Validator = SC.Object.extend(
/** @scope SC.Validator.prototype */ {

  // ..........................................
  // OBJECT VALUE CONVERSION
  //
  // The following methods are used to convert the string value of a field
  // to and from an object value.  The default implementations return
  // the string, but you can override this to provide specific behaviors. 
  // For example, you might add or remove a dollar sign or convert the 
  // value to a number.
  
/**
  Returns the value to set in the field for the passed object value.  
  
  The form and view to be set MAY (but will not always) be passed also.  You
  should override this method to help convert an input object into a value
  that can be displayed by the field.  For example, you might convert a 
  date to a property formatted string or a number to a properly formatted
  value.
  
  @param {Object} object The object to transform
  @param {SC.FormView} form The form this field belongs to. (optional)
  @param {SC.View} view The view the value is required for.
  @returns {Object} a value (usually a string) suitable for display
*/
  fieldValueForObject: function(object, form, view) { return object; },
  
  /**
    Returns the object value for the passed string.
    
    The form and view MAY (but wil not always) be passed also.  You should
    override this method to convert a field value, such as string, into an
    object value suitable for consumption by the rest of the app.  For example
    you may convert a string into a date or a number.
    
    @param {String} value the field value.  (Usually a String).
    @param {SC.FormView} form The form this field belongs to. (optional)
    @param {SC.View} view The view this value was pulled from.
    @returns {Object} an object suitable for consumption by the app.
  */
  objectForFieldValue: function(value, form, view) { return value; },
  
  // ..........................................
  // VALIDATION PRIMITIVES
  //

  /**
    Validate the field value.  
    
    You can implement standard behavior for your validator by using the validate()
    and validateError() methods.  validate() should return NO if the field is not
    valid, YES otherwise.  If you return NO from this method, then the validateError()
    method will be called so you can generate an error object describing the specific problem.

    @param {SC.FormView} form the form this view belongs to
    @param {SC.View} field the field to validate.  Responds to fieldValue.
    @returns {Boolean} YES if field is valid.
  */
  validate: function(form, field) { return true; },

  /**
    Returns an error object if the field is invalid.
  
    This is the other standard validator method that can be used to impement basic validation.
    Return an error object explaining why the field is not valid.  It will only be called if
    validate() returned NO.
    
    The default implementation of htis method returns a generic error message with the loc
    string "Invalid.Generate({fieldValue})".  You can simply define this loc string in
    strings.js if you prefer or you can override this method to provide a more specific error message.
  
    @param {SC.FormView} form the form this view belongs to
    @param {SC.View} field the field to validate.  Responds to fieldValue.
    @returns {SC.Error} an error object
  */
  validateError: function(form, field) { 
    return SC.$error(
      "Invalid.General(%@)".loc(field.get('fieldValue')),
      field.get('fieldKey')) ; 
  },

  // ..........................................
  // VALIDATION API
  //

  /**
    Invoked just before the user ends editing of the field.

    This is a primitive validation method.  You can implement the two higher-level
    methods (validate() and validateError()) if you prefer.
    
    The default implementation calls your validate() method and then validateError()
    if valiate() returns NO.  This method should return SC.VALIDATE_OK if validation
    succeeded or an error object if it fails.
  
    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate
    @param {Object} oldValue: the value of the field before the change

    @returns SC.VALIDATE_OK or an error object.
  
  */
  validateChange: function(form, field, oldValue) { 
    return this.validate(form,field) ? SC.VALIDATE_OK : this.validateError(form, field);
  },

  /**
    Invoked just before the form is submitted.
  
    This method gives your validators one last chance to perform validation
    on the form as a whole.  The default version does the same thing as the 
    validateChange() method.
  
    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate

    @returns SC.VALIDATE_OK or an error object.
  
  */  
  validateSubmit: function(form, field) { 
    return this.validate(form,field) ? SC.VALIDATE_OK : this.validateError(form, field);
  },

  /**
    Invoked 1ms after the user types a key (if a change is allowed).  
  
    You can use this validate the new partial string and return an error if 
    needed. The default will validate a partial only if there was already an 
    error. This allows the user to try to get it right before you bug them.
  
    Unlike the other methods, you should return SC.VALIDATE_NO_CHANGE if you
    did not actually validate the partial string.  If you return 
    SC.VALIDATE_OK then any showing errors will be hidden.
  
    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate

    @returns SC.VALIDATE_OK, SC.VALIDATE_NO_CHANGE or an error object.
  */  
  validatePartial: function(form, field) { 
    if (!field.get('isValid')) {
      return this.validate(form,field) ? SC.VALIDATE_OK : this.validateError(form, field);
    } else return SC.VALIDATE_NO_CHANGE ;
  },
  
  /**
    Invoked when the user presses a key.  
  
    This method is used to restrict the letters and numbers the user is 
    allowed to enter.  You should not use this method to perform full 
    validation on the field.  Instead use validatePartial().
  
    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate
    @param {String} char the characters being added
    
    @returns {Boolean} YES if allowed, NO otherwise
  */
  validateKeyDown: function(form, field,charStr) { return true; },

  // .....................................
  // OTHER METHODS

  /**
    Called on all validators when they are attached to a field.  
  
    You can use this to do any setup that you need.  The default does nothing.
    
    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate
  */
  attachTo: function(form,field) { },

  /**
    Called on a validator just before it is removed from a field.  You can 
    tear down any setup you did for the attachTo() method.
    
    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate
  */
  detachFrom: function(form, field) {}

}) ;

SC.Validator.mixin(/** @scope SC.Validator */ {

  /**
    Return value when validation was performed and value is OK.
  */
  OK: true, 
  
  /**
    Return value when validation was not performed.
  */
  NO_CHANGE: false,  

  /**
    Invoked by a field whenever a validator is attached to the field.
    
    The passed validatorKey can be a validator instance, a validator class
    or a string naming a validator. To make your validator
    visible, you should name your validator under the SC.Validator base.
    for example SC.Validator.Number would get used for the 'number' 
    validator key.
  
    This understands validatorKey strings in the following format:

    * 'key' or 'multiple_words' will find validators Key and MultipleWords

    * if you want to share a single validator among multiple fields (for
      example to validate that two passwords are the same) set a name inside
      brackets. i.e. 'password[pwd]'.

    @param {SC.FormView} form the form for the field
    @param {SC.View} field the field to validate
    @param {Object} validatorKey the key to validate
    
    @returns {SC.Validator} validator instance or null
  */  
  findFor: function(form,field, validatorKey) {
    
    // Convert the validator into a validator instance.
    var validator ;
    if (!validatorKey) return ; // nothing to do...
    
    if (validatorKey instanceof SC.Validator) {
      validator = validatorKey ;
    } else if (validatorKey.isClass) {
      validator = validatorKey.create() ;
      
    } else if (SC.typeOf(validatorKey) === SC.T_STRING) {

      // extract optional key name
      var name = null ;
      var m = validatorKey.match(/^(.+)\[(.*)\]/) ;
      if (m) {
        validatorKey = m[1] ; name = m[2]; 
      }
      
      // convert the validatorKey name into a class.
      validatorKey = validatorKey.classify() ;
      var validatorClass = SC.Validator[validatorKey] ;
      if (SC.none(validatorClass)) {
        throw "validator %@ not found for %@".fmt(validatorKey, field) ;
      } else if (name) {

        // if a key was also passed, then find the validator in the list of
        // validators for the form.  Otherwise, just create a new instance.
        if (!form) {
          throw "named validator (%@) could not be found for field %@ because the field does not belong to a form".fmt(name,field) ;
        }
        
        if (!form._validatorHash) form._validatorHash = {} ;
        validator = (name) ? form._validatorHash[name] : null ;
        if (!validator) validator = validatorClass.create() ;
        if (name) form._validatorHash[name] = validator ;
      } else validator = validatorClass.create() ;
    } 
    
    return validator ;
  },
  
  /**
    Convenience class method to call the fieldValueForObject() instance
    method you define in your subclass.
  */
  fieldValueForObject: function(object, form, field) {
    if (this.prototype && this.prototype.fieldValueForObject) {
      return this.prototype.fieldValueForObject(object,form,field) ;
    }
    else return null ;
  },
  
  /**
    Convenience class method to call the objectForFieldValue() instance
    method you define in your subclass.
  */
  objectForFieldValue: function(value, form, field) {
    if (this.prototype && this.prototype.objectForFieldValue) {
      return this.prototype.objectForFieldValue(value,form,field) ;
    }
    else return null ;
  }
  
});

/* >>>>>>>>>> BEGIN source/validators/credit_card.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;

/** @class
  Validate a field value as a credit card number. 
  
  This validator will perform a basic check to ensure the credit card number
  is mathematically valid.  It will also accept numbers with spaces, dashes
  or other punctuation.  
  
  Converted credit card numbers are broken into units of 4.
  
  Basic credit card validation courtesy David Leppek 
  (https://www.azcode.com/Mod10)

  @extends SC.Validator
  @since SproutCore 1.0
*/
SC.Validator.CreditCard = SC.Validator.extend(
/** @scope SC.Validator.CreditCard.prototype */ {

  /**
    Expects a string of 16 digits.  Will split into groups of 4 for display.
  */
  fieldValueForObject: function(object, form, field) {
    if (typeof(object) == "string" && object.length == 16) {
      object = [object.slice(0,4),object.slice(4,8),object.slice(8,12),object.slice(12,16)].join(' ') ;
    }
    return object ;
  },

  /**
    Removes all whitespace or dashes to make a single string.
  */
  objectForFieldValue: function(value, form, field) {
    return value.replace(/[\s-\.\:]/g,'') ;
  },
  
  validate: function(form, field) { 
    return this.checkNumber(field.get('fieldValue')) ; 
  },
  
  validateError: function(form, field) {
    var label = field.get('errorLabel') || 'Field' ;
    return SC.$error("Invalid.CreditCard(%@)".loc(label), label);
  },
  
  /** 
    Allow only numbers, dashes, and spaces 
  */
  validateKeyDown: function(form, field, charStr) {
    return !!charStr.match(/[0-9\- ]/);
  },
  
  checkNumber: function(ccNumb) {
    
    if (!ccNumb || ccNumb.length===0) return YES; // do not validate empty
    
    // remove any spaces or dashes
    ccNumb = ccNumb.replace(/[^0-9]/g,'');
    
    var valid = "0123456789";  // Valid digits in a credit card number
    var len = ccNumb.length;  // The length of the submitted cc number
    var iCCN = parseInt(ccNumb,0);  // integer of ccNumb
    var sCCN = ccNumb.toString();  // string of ccNumb
    sCCN = sCCN.replace (/^\s+|\s+$/g,'');  // strip spaces
    var iTotal = 0;  // integer total set at zero
    var bNum = true;  // by default assume it is a number
    var bResult = false;  // by default assume it is NOT a valid cc
    var temp;  // temp variable for parsing string
    var calc;  // used for calculation of each digit

    // Determine if the ccNumb is in fact all numbers
    for (var j=0; j<len; j++) {
      temp = "" + sCCN.substring(j, j+1);
      if (valid.indexOf(temp) == "-1"){bNum = false;}
    }

    // if it is NOT a number, you can either alert to the fact, 
    // or just pass a failure
    if(!bNum) bResult = false;

    // Determine if it is the proper length 
    if((len === 0)&&(bResult)){  // nothing, field is blank AND passed above # check
      bResult = false;
    } else{  // ccNumb is a number and the proper length - let's see if it is a valid card number
      if(len >= 15){  // 15 or 16 for Amex or V/MC
        for(var i=len;i>0;i--){  // LOOP throught the digits of the card
          calc = parseInt(iCCN,0) % 10;  // right most digit
          calc = parseInt(calc,0);  // assure it is an integer
          iTotal += calc;  // running total of the card number as we loop - Do Nothing to first digit
          i--;  // decrement the count - move to the next digit in the card
          iCCN = iCCN / 10;                               // subtracts right most digit from ccNumb
          calc = parseInt(iCCN,0) % 10 ;    // NEXT right most digit
          calc = calc *2;                                 // multiply the digit by two
          // Instead of some screwy method of converting 16 to a string and then parsing 1 and 6 and then adding them to make 7,
          // I use a simple switch statement to change the value of calc2 to 7 if 16 is the multiple.
          switch(calc){
            case 10: calc = 1; break;       //5*2=10 & 1+0 = 1
            case 12: calc = 3; break;       //6*2=12 & 1+2 = 3
            case 14: calc = 5; break;       //7*2=14 & 1+4 = 5
            case 16: calc = 7; break;       //8*2=16 & 1+6 = 7
            case 18: calc = 9; break;       //9*2=18 & 1+8 = 9
            default: calc = calc;           //4*2= 8 &   8 = 8  -same for all lower numbers
          }                                               
        iCCN = iCCN / 10;  // subtracts right most digit from ccNum
        iTotal += calc;  // running total of the card number as we loop
      }  // END OF LOOP
      if ((iTotal%10)===0){  // check to see if the sum Mod 10 is zero
        bResult = true;  // This IS (or could be) a valid credit card number.
      } else {
        bResult = false;  // This could NOT be a valid credit card number
        }
      }
    }
    return bResult; // Return the results
  }
    
}) ;

/* >>>>>>>>>> BEGIN source/validators/date.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;

/**
  Handle parsing and display of dates.
  
  @class
  @extends SC.Validator
  @author Charles Jolley
  @version 1.0
*/
SC.Validator.Date = SC.Validator.extend(
/** @scope SC.Validator.Date.prototype */ {

  /**
    The standard format you want the validator to convert dates to.
  */
  format: 'NNN d, yyyy h:mm:ss a',
  
  /**
    if we have a number, then convert to a date object.
  */
  fieldValueForObject: function(object, form, field) {
    var date ;
    if (typeof(object) === "number") {
      date = new Date(object) ;
    } else if (object instanceof Date) { date = object; }
      
    if (date) object = date.format(this.get('format')) ;
    
    return object ;
  },

  /**
    Try to pase value as a date. convert into a number, or return null if
    it could not be parsed.
  */
  objectForFieldValue: function(value, form, field) {
    if (value) {
      var date = Date.parseDate(value) ;
      value = (date) ? date.getTime() : null ;
    }
    return value ;
  }
    
}) ;

/* >>>>>>>>>> BEGIN source/validators/date_time.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('validators/validator');

/**
  This validates a SC.DateTime, used in SC.DateFieldView.
  
  @class
  @extends SC.Validator
  @author Juan Pablo Goldfinger
  @version 1.0
*/
SC.Validator.DateTime = SC.Validator.extend({

  /**
    The standard format you want the validator to convert dates to.
  */
  format: '%d/%m/%Y',

  /**
    if we have a number, then convert to a date object.
  */
  fieldValueForObject: function(object, form, field) {
    if (SC.kindOf(object, SC.DateTime)) {
      object = object.toFormattedString(this.get('format'));
    } else {
      object = null;
    }
    return object;
  },

  /**
    Try to pase value as a date. convert into a number, or return null if
    it could not be parsed.
  */
  objectForFieldValue: function(value, form, field) {
    if (value) {
      value = SC.DateTime.parse(value, this.get('format'));
    }
    return value;
  }

});

/* >>>>>>>>>> BEGIN source/validators/email.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;

/**
  Requires a valid email format.
  
  @class
  @extends SC.Validator
  @version 1.0
*/
SC.Validator.Email = SC.Validator.extend(
/** @scope SC.Validator.Email.prototype */ {
  
  validate: function(form, field) { 
    return (field.get('fieldValue') || '').match(/.+@.+\...+/) ; 
  },
  
  validateError: function(form, field) {
    var label = field.get('errorLabel') || 'Field' ;
    return SC.$error("Invalid.Email(%@)".loc(label), label) ;
  }  
    
}) ;

/**
  This variant allows an empty field as well as an email address.
  
  @class
  @extends SC.Validator.Email
  @author Charles Jolley
  @version 1.0
*/
SC.Validator.EmailOrEmpty = SC.Validator.Email.extend(
/** @scope SC.Validator.EmailOrEmpty.prototype */ {
  validate: function(form, field) {
    var value = field.get('fieldValue') ; 
    return (value && value.length > 0) ? value.match(/.+@.+\...+/) : true ;
  }
}) ;

/* >>>>>>>>>> BEGIN source/validators/not_empty.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;

/**
  Requires some content in field, but does not check the specific content.
  
  @class
  @extends SC.Validator
  @author Charles Jolley
  @version 1.0
*/
SC.Validator.NotEmpty = SC.Validator.extend(
/** @scope SC.Validator.NotEmpty.prototype */ {
  
  validate: function(form, field) {
    var value = field.get('fieldValue'); 
    if (SC.none(value))
      return NO;

    if (! SC.none(value.length))
      return value.length > 0;

    return YES;
  },
  
  validateError: function(form, field) {
    var label = field.get('errorLabel') || 'Field' ;
    return SC.$error("Invalid.NotEmpty(%@)".loc(label.capitalize()), field.get('errorLabel'));
  }
    
}) ;

/* >>>>>>>>>> BEGIN source/validators/number.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;
sc_require('system/utils/misc');

/**
  Handles parsing and validating of numbers.
  
  @extends SC.Validator
  @author Charles Jolley
  @version 1.0
  @class
*/
SC.Validator.Number = SC.Validator.extend(
/** @scope SC.Validator.Number.prototype */ {

  /**
    Number of decimal places to show.  
    
    If 0, then numbers will be treated as integers.  Otherwise, numbers will
    show with a fixed number of decimals.
  */
  places: 0,
  
  fieldValueForObject: function(object, form, field) {
    switch(SC.typeOf(object)) {
      case SC.T_NUMBER:
        object = object.toFixed(this.get('places')) ;
        break ;
      case SC.T_NULL:
      case SC.T_UNDEFINED:
        object = '';
        break ;
    }
    return object ;
  },

  objectForFieldValue: function(value, form, field) {
    // strip out commas
    var result;
    value = value.replace(/,/g,'');
    switch(SC.typeOf(value)) {
      case SC.T_STRING:
        if (value.length === 0) {
          value = null ;
        } else if (this.get('places') > 0) {
          value = parseFloat(value) ;
        } else {
          if(value.length==1 && value.match(/-/)) value = null;
          else {
            result = parseInt(value,0) ;
            if(isNaN(result)){
              value = SC.uniJapaneseConvert(value);
              value = parseInt(value,0) ;
              if(isNaN(value)) value='';
            }else value = result;
          }
        }
        break ;
      case SC.T_NULL:
      case SC.T_UNDEFINED:
        value = null ;
        break ;
    }
    return value ;
  },
  
  validate: function(form, field) { 
    var value = field.get('fieldValue') ;
    return (value === '') || !(isNaN(value) || isNaN(parseFloat(value))) ; 
  },
  
  validateError: function(form, field) {
    var label = field.get('errorLabel') || 'Field' ;
    return SC.$error("Invalid.Number(%@)".loc(label), label) ;
  },
  
  /** 
    Allow only numbers, dashes, period, and commas
  */
  validateKeyDown: function(form, field, charStr) {
    var text = field.$input().val();
    if (!text) text='';
    text+=charStr;
    if(this.get('places')===0){
      if(charStr.length===0) return true;
      else return text.match(/^[\-{0,1}]?[0-9,\0]*/)[0]===text;
    }else {
      if(charStr.length===0) return true;
      else return text.match(/^[\-{0,1}]?[0-9,\0]*\.?[0-9\0]+/)===text;
    }
  }
    
}) ;

/* >>>>>>>>>> BEGIN source/validators/password.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;

/**
  Ensures all fields with the Password validator attached in the same form
  contain the same value.
  
  @class
  @extends SC.Validator
  @author Charles Jolley
  @version 1.0
*/
SC.Validator.Password = SC.Validator.extend(
/** @scope SC.Validator.Password.prototype */ {

  attachTo: function(form,field) {
    arguments.callee.base.apply(this,arguments);
    if (!this.fields) this.fields = [] ;
    this.fields.push(field) ;
  },

  validate: function(force) {
    if (!this.fields || this.fields.length === 0) return true ;
    
    var empty = false ;
    var notEmpty = false ;
    var ret = true ;
    var value = this.fields[0].get('fieldValue') ;
    this.fields.forEach(function(field) {
      var curValue = field.get('fieldValue') ;
      if (curValue != value) ret= false ;
      if (!curValue || curValue.length === 0) empty = true ;
      if (curValue && curValue.length > 0) notEmpty = true ;
    }) ;

    // if forces, valid OK if there was an empty.  If not forced, valid OK 
    // only if all fields match AND they are not all empty.
    if (force) {
      return (notEmpty === false) ? false : ret ;
    } else {
      return (empty === true) ? true : ret ;
    }
  },
  
  // update field states
  updateFields: function(form,valid) {
    if (!this.fields || this.fields.length === 0) return true ;
    var err = "Invalid.Password".loc();
    var topField = this._field ;
    this.fields.forEach(function(f) {
      var msg = (valid) ? null : ((f == topField) ? err : '') ;
      form.setErrorFor(f,msg) ;
    }) ;
    return (valid) ? SC.VALIDATE_OK : err ;
  },
  
  validateChange: function(form, field, oldValue) { 
    return this.updateFields(form, this.validate(false)) ;
  },

  // this method is called just before the form is submitted.
  // field: the field toe validate.
  validateSubmit: function(form, field) { 
    return this.updateFields(form, this.validate(true)) ;
  },

  // this method gets called 1ms after the user types a key (if a change is
  // allowed).  You can use this validate the new partial string and return 
  // an error if needed.
  //
  // The default will validate a partial only if there was already an error.
  // this allows the user to try to get it right before you bug them.
  validatePartial: function(form, field) {
    var isInvalid = !this._field.get('isValid') ;
    if (isInvalid) {
      return this.updateFields(form, this.validate(false)) ;
    } else return SC.VALIDATE_NO_CHANGE ;
  }
    
}) ;

/* >>>>>>>>>> BEGIN source/validators/positive_integer.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('validators/validator') ;

/**
  Handles parsing and validating of positive integers.
  
  @extends SC.Validator
  @author Nirumal Thomas
  @version 1.0
  @class
*/
SC.Validator.PositiveInteger = SC.Validator.extend(
/** @scope SC.Validator.PositiveInteger.prototype */ {

  /**
    Default Value to be displayed. If the value in the text field is null,
    undefined or an empty string, it will be replaced by this value.

    @property
    @type Number
    @default null
  */
  defaultValue: null,

  fieldValueForObject: function(object, form, field) {
    switch(SC.typeOf(object)) {
      case SC.T_NUMBER:
        object = object.toFixed(0) ;
        break ;
      case SC.T_NULL:
      case SC.T_UNDEFINED:
        object = this.get('defaultValue') ;
        break ;
    }
    return object ;
  },

  objectForFieldValue: function(value, form, field) {
    // strip out commas
    value = value.replace(/,/g,'');
    switch(SC.typeOf(value)) {
      case SC.T_STRING:
        if (value.length === 0) {
          value = this.get('defaultValue') ;
        } else {
          value = parseInt(value, 0) ;
        }
        break ;
      case SC.T_NULL:
      case SC.T_UNDEFINED:
        value = this.get('defaultValue') ;
        break ;
    }
    return value ;
  },

  validate: function(form, field) {
    var value = field.get('fieldValue') ;
    return (value === '') || !isNaN(value) ;
  },
  
  validateError: function(form, field) {
    var label = field.get('errorLabel') || 'Field' ;
    return SC.$error("Invalid.Number(%@)".loc(label), label) ;
  },
  
  /** 
    Allow only numbers
  */
  validateKeyDown: function(form, field, charStr) {
    var text = field.$input().val();
    if (!text) text='';
    text+=charStr;
    if(charStr.length===0) return true ;
    else return text.match(/^[0-9\0]*/)[0]===text;
  }
    
}) ;

/* >>>>>>>>>> BEGIN source/views/container.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** 
  @class
  
  A container view will display its "content" view as its only child.  You can
  use a container view to easily swap out views on your page.  In addition to
  displaying the actual view in the content property, you can also set the 
  nowShowing property to the property path of a view in your page and the
  view will be found and swapped in for you.
  
  If you want to change the way the container view swaps in your new view, 
  override the replaceContent() method.
  
  @extends SC.View
  @since SproutCore 1.0
*/
SC.ContainerView = SC.View.extend(
/** @scope SC.ContainerView.prototype */ {

  classNames: ['sc-container-view'],
  
  renderDelegateName: 'containerRenderDelegate',
  
  /**
    Optional path name for the content view.  Set this to a property path
    pointing to the view you want to display.  This will automatically change
    the content view for you. If you pass a relative property path or a single
    property name, then the container view will look for it first on its page
    object then relative to itself. If you pass a full property name
    (e.g. "MyApp.anotherPage.anotherView"), then the path will be followed
    from the top-level.
    
    @property {String, SC.View}
  */
  nowShowing: null,

  /** 
    The content view to display.  This will become the only child view of
    the view.  Note that if you set the nowShowing property to any value other
    than 'null', the container view will automatically change the contentView
    to reflect view indicated by the value.
    
    @property {SC.View}
  */
  contentView: null,
  
  /** @private */
  contentViewBindingDefault: SC.Binding.single(),
  
  /**
    Replaces any child views with the passed new content.  
    
    This method is automatically called whenever your contentView property 
    changes.  You can override it if you want to provide some behavior other
    than the default.
    
    @param {SC.View} newContent the new content view or null.
  */
  replaceContent: function(newContent) {
    this.removeAllChildren() ;
    if (newContent) this.appendChild(newContent) ;
  },

  /** @private */
  createChildViews: function() {
    // if contentView is defined, then create the content
    var view = this.get('contentView') ;
    if (view) {
      view = this.contentView = this.createChildView(view) ;
      this.childViews = [view] ;
    } 
  },
  
  /**
    When a container view awakes, it will try to find the nowShowing, if 
    there is one, and set it as content if necessary.
  */
  awake: function() {
    arguments.callee.base.apply(this,arguments);
    var nowShowing = this.get('nowShowing') ;
    if (nowShowing && nowShowing.length>0) this.nowShowingDidChange();
  },
  
  /**
    Invoked whenever the nowShowing property changes.  This will try to find
    the new content if possible and set it.  If you set nowShowing to an 
    empty string or null, then the current content will be cleared.
    
    If you set the content manually, the nowShowing property will be set to
    SC.CONTENT_SET_DIRECTLY
  */
  nowShowingDidChange: function() {
    // This code turns this.nowShowing into a view object by any means necessary.
    
    var content = this.get('nowShowing') ;
    
    // If nowShowing was changed because the content was set directly, then do nothing.
    if (content === SC.CONTENT_SET_DIRECTLY) return ;
    
    // If it's a string, try to turn it into the object it references...
    if (SC.typeOf(content) === SC.T_STRING && content.length > 0) {
      if (content.indexOf('.') > 0) {
        content = SC.objectForPropertyPath(content);
      } else {
        var tempContent = this.getPath(content);
        content = SC.kindOf(tempContent, SC.View) ? tempContent : SC.objectForPropertyPath(content, this.get('page'));
      }
    }
    
    // If it's an uninstantiated view, then attempt to instantiate it.
    // (Uninstantiated views have a create() method; instantiated ones do not.)
    if (SC.typeOf(content) === SC.T_CLASS) {
      if (content.kindOf(SC.View)) content = content.create();
      else content = null;
    } 
    
    // If content has not been turned into a view by now, it's hopeless.
    if (content && !(content instanceof SC.View)) content = null;
    
    // Sets the content.
    this.set('contentView', content) ;
    
  }.observes('nowShowing'),
  
  /**
    Invoked whenever the content property changes.  This method will simply
    call replaceContent.  Override replaceContent to change how the view is
    swapped out.
  */
  contentViewDidChange: function() {
    this.replaceContent(this.get('contentView'));
  }.observes('contentView')
  
}) ;

/* >>>>>>>>>> BEGIN source/views/image.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
//            Portions ©2010 Strobe Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.SCALE_NONE = "none";
SC.FILL = "fill";
SC.FILL_PROPORTIONALLY = "fillProportionally";
SC.BEST_FIT = "fitBest";
SC.BEST_FIT_DOWN_ONLY = "fitBestDown";

SC.IMAGE_STATE_NONE = 'none';
SC.IMAGE_STATE_LOADING = 'loading';
SC.IMAGE_STATE_LOADED = 'loaded';
SC.IMAGE_STATE_FAILED = 'failed';

SC.IMAGE_TYPE_NONE = 'NONE';
SC.IMAGE_TYPE_URL = 'URL';
SC.IMAGE_TYPE_CSS_CLASS = 'CSS_CLASS';

/**
  URL to a transparent GIF.  Used for spriting.
*/
SC.BLANK_IMAGE_DATAURL = "data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==";

SC.BLANK_IMAGE_URL = SC.browser.msie && SC.browser.msie<8 ? '/static/sproutcore/foundation/en/current/blank.gif?1296791438' : SC.BLANK_IMAGE_DATAURL;

SC.BLANK_IMAGE = new Image();
SC.BLANK_IMAGE.src = SC.BLANK_IMAGE_URL;
SC.BLANK_IMAGE.width = SC.BLANK_IMAGE.height = 1;

/**
  @class

  Displays an image in the browser.

  The ImageView can be used to efficiently display images in the browser.
  It includes a built in support for a number of features that can improve
  your page load time if you use a lot of images including a image loading
  cache and automatic support for CSS spriting.

  Note that there are actually many controls that will natively include
  images using an icon property name.

  @extends SC.View
  @extends SC.Control
  @since SproutCore 1.0
*/
SC.ImageView = SC.View.extend(SC.Control,
/** @scope SC.ImageView.prototype */ {

  classNames: 'sc-image-view',

  displayProperties: 'image imageValue innerFrame frame status scale toolTip type'.w(),

  renderDelegateName: function() {
    return (this.get('useCanvas') ? 'canvasImage' : 'image') + "RenderDelegate";
  }.property('useCanvas').cacheable(),

  tagName: function() {
    return this.get('useCanvas') ? 'canvas' : 'div';
  }.property('useCanvas').cacheable(),


  // ..........................................................
  // Properties
  //

  /**
    Align the image within its frame.

    <table>
    <tr><td>SC.ALIGN_TOP_LEFT</td><td>SC.ALIGN_TOP</td><td>SC.ALIGN_TOP_RIGHT</td></tr>
    <tr><td>SC.ALIGN_LEFT</td><td>SC.ALIGN_CENTER/td><td>SC.ALIGN_RIGHT</td></tr>
    <tr><td>SC.ALIGN_BOTTOM_LEFT</td><td>SC.ALIGN_BOTTOM</td><td>SC.ALIGN_BOTTOM_RIGHT</td></tr>
    </table>

    @property {SC.ALIGN_CENTER|SC.ALIGN_TOP_LEFT|SC.ALIGN_TOP|SC.ALIGN_TOP_RIGHT|SC.ALIGN_RIGHT|SC.ALIGN_BOTTOM_RIGHT|SC.BOTTOM|SC.BOTTOM_LEFT|SC.LEFT|Number}
    @default SC.ALIGN_CENTER
  */
  align: SC.ALIGN_CENTER,

  /**
    If YES, this image can load in the background.  Otherwise, it is treated
    as a foreground image.  If the image is not visible on screen, it will
    always be treated as a background image.
  */
  canLoadInBackground: NO,

  /**
    @property {Image}
    @default SC.BLANK_IMAGE
  */
  image: SC.BLANK_IMAGE,

  innerFrame: function() {
    var image = this.get('image'),
        align = this.get('align'),
        scale = this.get('scale'),
        frame = this.get('frame'),
        imageWidth = image.width,
        imageHeight = image.height,
        scaleX,
        scaleY,
        result;

    // Fast path
    result = { x: 0, y: 0, width: frame.width , height: frame.height };
    if (scale === SC.FILL) return result;

    // Determine the appropriate scale
    scaleX = frame.width / imageWidth;
    scaleY = frame.height / imageHeight;

    switch (scale) {
      case SC.FILL_PROPORTIONALLY:
        scale = scaleX > scaleY ? scaleX : scaleY;
        break;
      case SC.BEST_FIT:
        scale = scaleX < scaleY ? scaleX : scaleY;
        break;
      case SC.BEST_FIT_DOWN_ONLY:
        if ((imageWidth > frame.width) || (imageHeight > frame.height)) {
          scale = scaleX < scaleY ? scaleX : scaleY;
        } else {
          scale = 1.0;
        }
        break;
      case SC.SCALE_NONE:
        scale = 1.0;
        break;
      default: // Number
        if (isNaN(window.parseFloat(scale)) || (window.parseFloat(scale) <= 0)) {
          SC.Logger.warn("SC.ImageView: The scale '%@' was not understood.  Scale must be one of SC.FILL, SC.FILL_PROPORTIONALLY, SC.BEST_FIT, SC.BEST_FIT_DOWN_ONLY or a positive number greater than 0.00.".fmt(scale));

          // Don't attempt to scale or offset the image
          return result;
        }
    }

    imageWidth *= scale;
    imageHeight *= scale;
    result.width = Math.round(imageWidth);
    result.height = Math.round(imageHeight);

    // Align the image within its frame
    switch (align) {
      case SC.ALIGN_LEFT:
        result.x = 0;
        result.y = (frame.height / 2) - (imageHeight / 2);
        break;
      case SC.ALIGN_RIGHT:
        result.x = frame.width - imageWidth;
        result.y = (frame.height / 2) - (imageHeight / 2);
        break;
      case SC.ALIGN_TOP:
        result.x = (frame.width / 2) - (imageWidth / 2);
        result.y = 0;
        break;
      case SC.ALIGN_BOTTOM:
        result.x = (frame.width / 2) - (imageWidth / 2);
        result.y = frame.height - imageHeight;
        break;
      case SC.ALIGN_TOP_LEFT:
        result.x = 0;
        result.y = 0;
        break;
      case SC.ALIGN_TOP_RIGHT:
        result.x = frame.width - imageWidth;
        result.y = 0;
        break;
      case SC.ALIGN_BOTTOM_LEFT:
        result.x = 0;
        result.y = frame.height - imageHeight;
        break;
      case SC.ALIGN_BOTTOM_RIGHT:
        result.x = frame.width - imageWidth;
        result.y = frame.height - imageHeight;
        break;
      default: // SC.ALIGN_CENTER || SC.ALIGN_MIDDLE
        result.x = (frame.width / 2) - (imageWidth / 2);
        result.y = (frame.height / 2) - (imageHeight / 2);
    }

    return result;
  }.property('align', 'image', 'scale', 'frame').cacheable(),

  /**
    @property {String}
    @default null
  */
  imageValue: function() {
    var value = this.get('value');
    return value && value.isEnumerable ? value.firstObject() : value;
  }.property('value').cacheable(),

  /**
    If YES, any specified toolTip will be localized before display.

    @property {Boolean}
    @default YES
  */
  localize: YES,

  /**
    Determines how the image will scale to fit within its containing space.

    Examples:

      SC.SCALE_NONE - don't scale
      SC.FILL - stretch/shrink the image to fill the ImageView frame
      SC.FILL_PROPORTIONALLY - stretch/shrink the image to fill the ImageView frame while maintaining
        aspect ratio, such that the shortest dimension will just fit within the frame and the longest dimension will
        overflow and be cropped
      SC.BEST_FIT - stretch/shrink the image to fit the ImageView frame while maintaining aspect ration,
        such that the longest dimension will just fit within the frame
      SC.BEST_FIT_DOWN_ONLY - shrink the image to fit the ImageView frame while maintaining aspect ration,
        such that the longest dimension will just fit within the frame.  Do not stretch the image if the image's
        width is less than the frame's width.

    @property {SC.SCALE_NONE|SC.FILL|SC.FILL_PROPORTIONALLY|SC.BEST_FIT|SC.BEST_FIT_DOWN_ONLY|Number}
    @default SC.FILL
  */
  scale: SC.FILL,

  /**
    Current load status of the image.

    This status changes as an image is loaded from the server.  If spriting
    is used, this will always be loaded.  Must be one of the following
    constants: SC.IMAGE_STATE_NONE, SC.IMAGE_STATE_LOADING,
    SC.IMAGE_STATE_LOADED, SC.IMAGE_STATE_FAILED

    @property {String}
  */
  status: SC.IMAGE_STATE_NONE,

  /**
    Will be one of the following constants: SC.IMAGE_TYPE_URL or
    SC.IMAGE_TYPE_CSS_CLASS

    @property {String}
    @observes imageValue
  */
  type: function() {
    var imageValue = this.get('imageValue');
    if (SC.ImageView.valueIsUrl(imageValue)) return SC.IMAGE_TYPE_URL;
    else if (!SC.none(imageValue)) return SC.IMAGE_TYPE_CSS_CLASS;
    return SC.IMAGE_TYPE_NONE;
  }.property('imageValue').cacheable(),

  /**
    The canvas element is more performant than the img element, since we can
    update the canvas image without causing browser reflow.  As an additional
    benefit, canvas images are less easily copied, which is generally in line
    with acting as an 'application'.

    @property {Boolean}
    @default YES if supported
    @since SproutCore 1.5
  */
  useCanvas: function() {
    return SC.platform.supportsCanvas;
  }.property().cacheable(),

  /**
    If YES, image view will use the SC.imageQueue to control loading.  This
    setting is generally preferred.

    @property {Boolean}
    @default YES
  */
  useImageQueue: YES,

  /**
    A url or CSS class name.

    This is the image you want the view to display.  It should be either a
    url or css class name.  You can also set the content and
    contentValueKey properties to have this value extracted
    automatically.

    If you want to use CSS spriting, set this value to a CSS class name.  If
    you need to use multiple class names to set your icon, separate them by
    spaces.

    Note that if you provide a URL, it must contain at least one '/' as this
    is how we autodetect URLs.

    @property {String}
  */
  value: null,


  // ..........................................................
  // Methods
  //

  init: function() {
    arguments.callee.base.apply(this,arguments);

    this._image_valueDidChange();

    if (this.get('useImageCache') !== undefined) {
      SC.Logger.warn("%@ has useImageCache set, please set useImageQueue instead".fmt(this));
      this.set('useImageQueue', this.get('useImageCache'));
    }
  },


  // ..........................................................
  // Rendering
  //

  /**
    When the layer changes, we need to tell the view to render its stuff
    as the canvas won't work without this

    @observes layer
  */
  layerDidChange: function() {
    if (this.get('useCanvas')) this.set('layerNeedsUpdate', YES);
  }.observes('layer'),


  // ..........................................................
  // Value handling
  //

  /** @private
    Whenever the value changes, update the image state and possibly schedule
    an image to load.
  */
  _image_valueDidChange: function() {
    var value = this.get('imageValue'),
        type = this.get('type');

    // check to see if our value has changed
    if (value !== this._iv_value) {
      this._iv_value = value;

      // While the new image is loading use SC.BLANK_IMAGE as a placeholder
      this.set('image', SC.BLANK_IMAGE);
      this.set('status', SC.IMAGE_STATE_LOADING);

      // order: image cache, normal load
      if (!this._loadImageUsingCache()) {
        if (!this._loadImage()) {
          // CSS class? this will be handled automatically
        }
      }
    }
  }.observes('imageValue'),

  /** @private
    Tries to load the image value using the SC.imageQueue object. If the imageValue is not
    a URL, it won't attempt to load it using this method.

    @returns YES if loading using SC.imageQueue, NO otherwise
  */
  _loadImageUsingCache: function() {
    var value = this.get('imageValue'),
        type = this.get('type');

    // now update local state as needed....
    if (type === SC.IMAGE_TYPE_URL && this.get('useImageQueue')) {
      var isBackground = this.get('isVisibleInWindow') || this.get('canLoadInBackground');

      SC.imageQueue.loadImage(value, this, this._loadImageUsingCacheDidComplete, isBackground);
      return YES;
    }

    return NO;
  },

  _loadImageUsingCacheDidComplete: function(url, image) {
    var value = this.get('imageValue');

    if (value === url) {
      if (SC.ok(image)) {
        this.didLoad(image);
      } else {
        // if loading it using the cache didn't work, it's useless to try loading the image normally
        this.didError(image);
      }
    }
  },

  /** @private
    Loads an image using a normal Image object, without using the SC.imageQueue.

    @returns YES if it will load, NO otherwise
  */
  _loadImage: function() {
    var value = this.get('imageValue'),
        type = this.get('type'),
        that = this,
        image;

    if (type === SC.IMAGE_TYPE_URL) {
      image = new Image();

      image.onerror = image.onabort = function() {
        SC.run(function() {
          that._loadImageDidComplete(value, SC.$error("SC.Image.FailedError", "Image", -101));
        });
      };

      image.onload = function() {
        SC.run(function() {
          that._loadImageDidComplete(value, image);
        });
      };

      image.src = value;
      return YES;
    }

    return NO;
  },

  _loadImageDidComplete: function(url, image) {
    var value = this.get('imageValue');

    if (value === url) {
      if (SC.ok(image)) {
        this.didLoad(image);
      } else {
        this.didError(image);
      }
    }
  },

  didLoad: function(image) {
    this.set('status', SC.IMAGE_STATE_LOADED);
    if (!image) image = SC.BLANK_IMAGE;
    this.set('image', image);
  },

  didError: function(error) {
    this.set('status', SC.IMAGE_STATE_FAILED);
    this.set('image', SC.BLANK_IMAGE);
  }

}) ;

/**
  Returns YES if the passed value looks like an URL and not a CSS class
  name.
*/
SC.ImageView.valueIsUrl = function(value) {
  return value ? value.indexOf('/') >= 0 : NO ;
} ;

/* >>>>>>>>>> BEGIN source/views/label.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('mixins/inline_editable');
sc_require('mixins/inline_editor_delegate');

SC.REGULAR_WEIGHT = 'normal';
SC.BOLD_WEIGHT = 'bold';

/**
  @class
  
  Displays a static string of text.
  
  You use a label view anytime you need to display a static string of text 
  or to display text that may need to be edited using only an inline control.
  
  @extends SC.View
  @extends SC.Control
  @extends SC.InlineEditable
  @extends SC.InlineEditorDelegate
  @since SproutCore 1.0
*/
SC.LabelView = SC.View.extend(SC.Control, SC.InlineEditorDelegate, SC.InlineEditable,
/** @scope SC.LabelView.prototype */ {

  classNames: ['sc-label-view'],

  displayProperties: 'displayTitle textAlign fontWeight icon escapeHTML needsEllipsis hint'.w(),


  
  isEditable: NO,
  
  /**
    The exampleInlineTextFieldView property is by default a 
    SC.InlineTextFieldView but it can be set to a customized inline text field
    view.
  
    @property
    @type {SC.View}
    @default {SC.InlineTextFieldView}
  */
  exampleInlineTextFieldView: SC.InlineTextFieldView,
  
  /**
    LabelView is its own delegate by default, but you can change this to use a customized editor.
  */
  editorDelegate: null,
  
  /**
    Specify the font weight for this.  You may pass SC.REGULAR_WEIGHT, or SC.BOLD_WEIGHT.
  */
  fontWeight: SC.REGULAR_WEIGHT,
  
  /**
    If true, value will be escaped to avoid scripting attacks.
    
    This is a default value that can be overridden by the
    settings on the owner view.
  */
  escapeHTML: true,
  escapeHTMLBindingDefault: SC.Binding.oneWay().bool(),

  /**
    If true, then the value will be localized.
    
    This is a default default that can be overidden by the
    settings in the owner view.
  */
  localize: false,
  localizeBindingDefault: SC.Binding.oneWay().bool(),
  
  /**
    Set this to a validator or to a function and the value
    will be passed through it before being set.
    
    This is a default default that can be overidden by the
    settings in the owner view.
  */
  formatter: null,

  /** 
    The value of the label.
    
    You may also set the value using a content object and a contentValueKey.
    
    @field {String}
  */
  value: '',
  
  /**
    The hint to display if no value is set.  Should be used only if isEditable
    is set to YES.
  */
  hint: null,

  /**
    An optional icon to display to the left of the label.  Set this value
    to either a CSS class name (for spriting) or an image URL.
  */
  icon: null,
  
  /**
    Set the alignment of the label view.
  */
  textAlign: SC.ALIGN_LEFT,

  /**
    The name of the theme's SC.LabelView render delegate.

    @property {String}
  */
  renderDelegateName: 'labelRenderDelegate',

  /**
    [RO] The value that will actually be displayed.
    
    This property is dynamically computed by applying localization, 
    string conversion and other normalization utilities.
    
    @field
  */
  displayTitle: function() {
    var value, formatter;
    
    value = this.get('value') ;
    
    // 1. apply the formatter
    formatter = this.getDelegateProperty('formatter', this.displayDelegate) ;
    if (formatter) {
      var formattedValue = (SC.typeOf(formatter) === SC.T_FUNCTION) ? 
          formatter(value, this) : formatter.fieldValueForObject(value, this) ;
      if (!SC.none(formattedValue)) value = formattedValue ;
    }
    
    // 2. If the returned value is an array, convert items to strings and 
    // join with commas.
    if (SC.typeOf(value) === SC.T_ARRAY) {
      var ary = [];
      for(var idx=0, idxLen = value.get('length'); idx< idxLen;idx++) {
        var x = value.objectAt(idx) ;
        if (!SC.none(x) && x.toString) x = x.toString() ;
        ary.push(x) ;
      }
      value = ary.join(',') ;
    }
    
    // 3. If value is not a string, convert to string. (handles 0)
    if (!SC.none(value) && value.toString) value = value.toString() ;
    
    // 4. Localize
    if (value && this.getDelegateProperty('localize', this.displayDelegate)) value = value.loc() ;
        
    return value ;
  }.property('value', 'localize', 'formatter').cacheable(),
  
  
  /**
    [RO] The hint value that will actually be displayed.
    
    This property is dynamically computed by applying localization 
    and other normalization utilities.
    
  */
  hintValue: function() {
    var hintVal = this.get('hint');
    return hintVal ;
  }.property('hint').cacheable(),
  
  /**
    Event dispatcher callback.
    If isEditable is set to true, opens the inline text editor view.

    @param {DOMMouseEvent} evt DOM event
    
  */
  doubleClick: function( evt ) { return this.beginEditing(); },
  
  
  /** @private 
    Hide the label view while the inline editor covers it.
  */
  inlineEditorDidBeginEditing: function(inlineEditor) {
    var layer = this.$();
    this._oldOpacity = layer.css('opacity') ;
    layer.css('opacity', 0.0);
  },
  
  
  /** @private 
    Hide the label view while the inline editor covers it.
  */
  inlineEditorDidBeginEditing: function(editor) {
    this._oldOpacity = this.get('layout').opacity ;
    this.adjust('opacity', 0);
  },
  
  /** @private
    Update the field value and make it visible again.
  */
  inlineEditorDidEndEditing: function(editor, finalValue) {
    this.setIfChanged('value', finalValue) ;
    this.adjust('opacity', this._oldOpacity);
    this._oldOpacity = null ;
    this.set('isEditing', NO) ;
  }
});

