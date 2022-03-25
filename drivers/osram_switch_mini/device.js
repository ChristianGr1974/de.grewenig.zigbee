"use strict";

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER } = require("zigbee-clusters");
const OnOffBoundCluster = require("../../lib/OnOffBoundCluster");
const LevelControlBoundCluster = require("../../lib/LevelControlBoundCluster");

class OsramSwitchMini extends ZigBeeDevice {
  onMeshInit() {
    this.log("onNodeInit");
  }

  async onNodeInit({ zclNode }) {
    this.log("enableDebug");
    this.enableDebug();

    this.log("printNode");
    this.printNode();

    this.batteryThreshold = 20;
    this.registerCapability("alarm_battery", CLUSTER.POWER_CONFIGURATION, {
      getOpts: {
        getOnStart: true,
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 5, // Report when value changed by 5
        },
      },
    });

    zclNode.endpoints[3].bind(
      CLUSTER.LEVEL_CONTROL.NAME,
      new LevelControlBoundCluster({
        onMoveToLevelWithOnOff: (payload) => {
          this.triggerFlow({ id: "Stop" })
            .then(() => this.log(`Stop was pressed`))
            .catch((err) => this.error(`Error: triggering flow: Stop`, err));
        },
      })
    );

    zclNode.endpoints[1].bind(
      CLUSTER.ON_OFF.NAME,
      new OnOffBoundCluster({
        onSetOn: (payload) => {
          this.triggerFlow({ id: "Up Short Press" })
            .then(() => this.log(`Up Short Press`))
            .catch((err) => this.error(`Error: Up Short Press`, err));
        },
      })
    );

    zclNode.endpoints[2].bind(
      CLUSTER.ON_OFF.NAME,
      new OnOffBoundCluster({
        onSetOff: (payload) => {
          this.triggerFlow({ id: "Down Short Press" })
            .then(() => this.log(`Down Short Press`))
            .catch((err) => this.error(`Error: Down Short Press`, err));
        },
      })
    );

    zclNode.endpoints[1].bind(
      CLUSTER.LEVEL_CONTROL.NAME,
      new LevelControlBoundCluster({
        onStop: (payload) => {
          this.triggerFlow({ id: "Stop" })
            .then(() => this.log(`Stop was pressed`))
            .catch((err) => this.error(`Error: Stop Press`, err));
        },
        onMoveWithOnOff: (payload) => {
          this.triggerFlow({ id: "Up Long Press" })
            .then(() => this.log(`Up Long Press was pressed`))
            .catch((err) => this.error(`Error: Up Long Press`, err));
        },
      })
    );

    zclNode.endpoints[2].bind(
      CLUSTER.LEVEL_CONTROL.NAME,
      new LevelControlBoundCluster({
        onStop: (payload) => {
          this.triggerFlow({ id: "Stop" })
            .then(() => this.log(`Stop was pressed`))
            .catch((err) => this.error(`Error: Stop Press`, err));
        },
        onMove: (payload) => {
          this.triggerFlow({ id: "Down Long Press" })
            .then(() => this.log(`Down Long Press was pressed`))
            .catch((err) => this.error(`Error: Down Long Press`, err));
        },
      })
    );
  }
}

module.exports = OsramSwitchMini;
