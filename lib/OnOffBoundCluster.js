"use strict";

const { BoundCluster } = require("zigbee-clusters");

class OnOffBoundCluster extends BoundCluster {
  constructor({
    onSetOff,
    onSetOn,
    onWithTimedOff,
    onToggle,
    onOffWithEffect,
    onWithRecallGlobalScene,
  }) {
    super();
    this._onToggle = onToggle;
    this._onWithTimedOff = onWithTimedOff;
    this._onSetOff = onSetOff;
    this._onSetOn = onSetOn;
    this._onOffWithEffect = onOffWithEffect;
    this._onWithRecallGlobalScene = onWithRecallGlobalScene;
  }

  toggle() {
    if (typeof this._onToggle === "function") {
      this._onToggle();
    }
  }

  onWithRecallGlobalScene() {
    if (typeof this._onWithRecallGlobalScene === "function") {
      this._onWithRecallGlobalScene();
    }
  }

  onWithTimedOff({ onOffControl, onTime, offWaitTime }) {
    if (typeof this._onWithTimedOff === "function") {
      this._onWithTimedOff({ onOffControl, onTime, offWaitTime });
    }
  }

  onOffWithEffect({ effectIdentifier, effectVariante }) {
    if (typeof this._onOffWithEffect === "function") {
      this._onOffWithEffect({ effectIdentifier, effectVariante });
    }
  }

  setOn() {
    if (typeof this._onSetOn === "function") {
      this._onSetOn();
    }
  }

  setOff() {
    if (typeof this._onSetOff === "function") {
      this._onSetOff();
    }
  }
}

module.exports = OnOffBoundCluster;
