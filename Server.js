const coap = require("coap");
const { exec } = require("child_process");
const huejay = require("huejay"); // Library for controlling zigbee devices
const { Zwave, DeviceClass } = require("zwave-js"); // Library for controlling Z-Wave devices
const noble = require("@abandonware/noble"); // Library for interacting with Bluetooth devices
const wifi = require("node-wifi"); // Library for interacting with WiFi networks
const Thread = require("open-thread"); // Library for interacting with Thread networks

const DeviceType = {
  LIGHT: "light",
  SHADE: "shade",
  PLUG: "plug",
  SPEAKER: "speaker",
  PRINTER: "printer",
  SWITCH: "switch",
};

const NetworkProtocol = {
  WIFI: "wifi",
  ZIGBEE: "zigbee",
  ZWAVE: "z-wave",
  BLUETOOTH: "bluetooth",
  THREAD: "thread",
};

const coap = require("coap");
const { exec } = require("child_process");
const { Client } = require("zwave-js");
const { Zigbee } = require("zigbee-herdsman");
const { SmartLife, TPLink } = require("tplink-smarthome-api");
const noble = require("@abandonware/noble");
const { Printer } = require("printer-canvas");

const server = coap.createServer();

const handleDeviceRequest1 = async (req, res) => {
  const { type, action, value, protocol } = JSON.parse(req.payload.toString());
  console.log(`Received request for ${type} device to ${action} (${value}) using ${protocol.join(", ")}`);

  switch (type) {
    case DeviceType.LIGHT:
      if (protocol.includes(NetworkProtocol.WIFI)) {
        if (action === "on") {
          exec("python3 light_control.py on"); 
        } else if (action === "off") {
          exec("python3 light_control.py off");
        } else if (action === "brightness") {
          exec(`python3 light_control.py brightness ${value}`);
        } else if (action === "color") {
          exec(`python3 light_control.py color ${value}`);
        }
      }
      if (protocol.includes(NetworkProtocol.ZIGBEE)) {
        const { Zigbee } = require("zigbee-herdsman");
        const shepherd = new Zigbee();
        await shepherd.start();

        const devices = await shepherd.getClients();

        const light = devices.find((device) => device.type === "light" && device.manufacturer === "Philips");

        if (action === "on") {
          await light.setOn();
        } else if (action === "off") {
          await light.setOff();
        } else if (action === "brightness") {
          await light.setLevel(value);
        } else if (action === "color") {
          await light.setColor(value);
        }

        await shepherd.stop();
      }
      if (protocol.includes(NetworkProtocol.ZWAVE)) {
        const zwave = new Zwave({
          logConfig: {
            console: {
              enabled: true,
              level: "info",
            },
          },
          driver: {
            controller: "/dev/ttyACM0", // Path to Z-Wave USB stick
            logConfig: {
              console: {
                enabled: true,
                level: "info",
              },
            },
          },
        });

        await zwave.once("driver ready");

        const devices = await zwave.getAllNodes();

        const light = devices.find((device) => device.deviceClass === DeviceClass.Switch)
      }
    }
  }

const handleDeviceRequest2 = async (req, res) => {
  const { type, action, value, protocol } = JSON.parse(req.payload.toString());
  console.log(`Received request for ${type} device to ${action} (${value}) using ${protocol.join(", ")}`);

  switch (type) {
    case "light":
      if (protocol.includes("wifi")) {
        if (action === "on") {
          const devices = await SmartLife.discover({ onlyOn: false });
          for (const device of devices) {
            if (device.alias === value) {
              await device.powerOn();
              console.log(`Turned on ${device.alias}`);
            }
          }
        } else if (action === "off") {
          const devices = await SmartLife.discover({ onlyOn: true });
          for (const device of devices) {
            if (device.alias === value) {
              await device.powerOff();
              console.log(`Turned off ${device.alias}`);
            }
          }
        } else if (action === "brightness") {
          const devices = await SmartLife.discover({ onlyOn: true });
          for (const device of devices) {
            if (device.alias === value) {
              await device.setBrightness(parseInt(value));
              console.log(`Set brightness of ${device.alias} to ${value}`);
            }
          }
        } else if (action === "color") {
          const devices = await SmartLife.discover({ onlyOn: true });
          for (const device of devices) {
            if (device.alias === value) {
              const [r, g, b] = value.split(",");
              await device.setColor(parseInt(r), parseInt(g), parseInt(b));
              console.log(`Set color of ${device.alias} to (${r}, ${g}, ${b})`);
            }
          }
        }
      }
      if (protocol.includes("zigbee")) {
        const network = await Zigbee.herdsman.create();
        await network.start();
        const devices = await network.scan();
        for (const device of devices) {
          if (device.modelName === "light" && device.ieeeAddr === value) {
            if (action === "on") {
              await device.turnOn();
              console.log(`Turned on ${device.name}`);
            } else if (action === "off") {
              await device.turnOff();
              console.log(`Turned off ${device.name}`);
            } else if (action === "brightness") {
              await device.setLevel(parseInt(value));
              console.log(`Set brightness of ${device.name} to ${value}`);
            } else if (action === "color") {
              await device.setColor(parseInt(value));
              console.log(`Set color of ${device.name} to ${value}`);
            }
          }
        }
      }
    }
}

