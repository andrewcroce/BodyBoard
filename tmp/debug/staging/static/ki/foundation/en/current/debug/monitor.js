// ==========================================================================
// Project:   Ki - A Statechart Framework for SproutCore
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*globals Ki */

Ki.StatechartMonitor = SC.Object.extend({
  
  sequence: null,
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this.reset();
  },
  
  reset: function() {
    this.propertyWillChange('length');
    this.sequence = [];
    this.propertyDidChange('length');
  },
  
  length: function() {
    return this.sequence.length;
  }.property(),
  
  pushEnteredState: function(state) {
    this.propertyWillChange('length');
    this.sequence.push({ entered: state });
    this.propertyDidChange('length'); 
  },
  
  pushExitedState: function(state) {
    this.propertyWillChange('length');
    this.sequence.push({ exited: state });
    this.propertyDidChange('length');
  },
  
  matchSequence: function() {
    return Ki.StatechartSequenceMatcher.create({
      statechartMonitor: this
    });
  },
  
  toString: function() {
    var seq = "",
        i = 0,
        len = 0,
        item = null;
    
    seq += "[";    

    len = this.sequence.length;
    for (i = 0; i < len; i += 1) {
      item = this.sequence[i];
      if (item.exited) {
        seq += "exited %@".fmt(item.exited.get('fullPath'));
      } 
      else if (item.entered) {
        seq += "entered %@".fmt(item.entered.get('fullPath'));
      } 
      if (i < len - 1) seq += ", ";
    }

    seq += "]";

    return seq;
  }
  
});

Ki.StatechartSequenceMatcher = SC.Object.extend({
  
  statechartMonitor: null,
  
  position: 0,
  
  match: YES,
  
  begin: function() {
    this.position = -1;
    this.match = YES;
    return this;
  },
  
  end: function() {
    return this.match;
  },
  
  entered: function() {
    return this._doCheck('entered', arguments);
  },
  
  exited: function() {
    return this._doCheck('exited', arguments);
  },
  
  _doCheck: function(event, args) {
    var i = 0,
        len = args.length,
        seqItem = null,
        arg = null,
        seq = this.statechartMonitor.sequence;
        
    for (; i < len; i += 1) {
      this.position += 1;
  
      if (this.position >= seq.length) {
        this.match = NO;
        return this;
      }
      
      seqItem = seq[this.position];
      if (!seqItem[event]) {
        this.match = NO;
        return this;
      }
      
      arg = args[i];
      if (SC.typeOf(arg) === SC.T_OBJECT) {
        if (seqItem[event] !== arg) {
          this.match = NO;
          return this;
        }
      } 
      else if (seqItem[event].get('name') !== arg) {
        this.match = NO;
        return this;
      }
    }
  
    return this;
  }
  
});