import React, { useState } from "react";
import axios from "axios";
import { COAP_SERVER_HOST, COAP_SERVER_PORT } from "./constants";

// Constants for possible network protocols
const WIFI = "wifi";
const ZIGBEE = "zigbee";
const ZWAVE = "z-wave";
const BLUETOOTH = "bluetooth";
const THREAD = "thread";

function App() {
  // State variables for the various devices and there defualt parameters
  const [lights, setLights] = useState([
    {
      name: "Cinema Main Light Bar",
      on: false,
      brightness: 50,
      color: "#ffffff",
      protocol: BLUETOOTH,
    },
    {
      name: "Erik's Lamp",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: WIFI,
    },
    {
      name: "Cinema Lamp-%ext1",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: Thread,
    },
    {
      name: "Cinema Lamp-%ext2",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: Thread,
    },
    {
      name: "Office Lamp",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: ZIGBEE,
    },
    {
      name: "Erik's Desk",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: Z-WAVE,
    },
    {
      name: "Right Spare-%group",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: THREAD,
    },
    {
      name: "Left Spare-%group",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: THREAD,
    },
    {
      name: "Cinema Main Lights",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: ZIGBEE,
    },
    {
      name: "Erik' Main Light",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: ZIGBEE,
    },
    {
      name: "Laundry Main Lights",
      on: false,
      brightness: 75,
      color: "#ffffff",
      protocol: ZIGBEE,
    },
  ]);

  const [shades, setShades] = useState([
    {
      name: "Basement Shade Left",
      position: 100,
      protocol: ZIGBEE,
    },
    {
      name: "Basement Shade Center",
      position: 100,
      protocol: ZIGBEE,
    },
    {
      name: "Basement Shade Right",
      position: 100,
      protocol: ZIGBEE,
    },
  ]);

  const [plugs, setPlugs] = useState([
    {
      name: "Cinema Neon",
      on: true,
      protocol: ZIGBEE,
    },
    {
      name: "Cinema Stars",
      on: false,
      protocol: THREAD,
    },
    {
      name: "Hall Night Lamp",
      on: false,
      protocol: WIFI,
    },
    {
      name: "Hall Night Lamp",
      on: false,
      protocol: THREAD,
    },
    {
      name: "Master Crystal",
      on: false,
      protocol: Bluetooth,
    },
  ]);

  const [printer, setPrinter] = useState({
    name: "HP OfficeJet Pro 8710",
    inkLevels: {
      black: BlackL,
      cyan: CyanL,
      magenta: MagL,
      yellow: YellL,
    },
    protocol: WIFI,
  });

  const [speaker, setSpeaker] = useState({
    name: "Erik's Google Wifi Speaker",
    volume: 50,
    protocol: BLUETOOTH,
  });



// Handler functions for each device type

  const LightControl = () => {
    const [isOn, setIsOn] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [color, setColor] = useState("white");
  
    const handleToggle = () => {
      const newValue = !isOn;
      setIsOn(newValue);
      const payload = {
        type: "light",
        action: newValue ? "on" : "off",
        protocol: ["wifi", "zigbee"] // add the protocol you want to use here
      };
      axios.post(`coap://${COAP_SERVER_HOST}:${COAP_SERVER_PORT}/device`, payload);
    };
  
    const handleBrightnessChange = (e) => {
      const newBrightness = e.target.value;
      setBrightness(newBrightness);
      const payload = {
        type: "light",
        action: "brightness",
        value: newBrightness,
        protocol: ["wifi", "zigbee"] // add the protocol you want to use here
      };
      axios.post(`coap://${COAP_SERVER_HOST}:${COAP_SERVER_PORT}/device`, payload);
    };
  
    const handleColorChange = (e) => {
      const newColor = e.target.value;
      setColor(newColor);
      const payload = {
        type: "light",
        action: "color",
        value: newColor,
        protocol: ["wifi", "zigbee"] // add the protocol you want to use here
      };
      axios.post(`coap://${COAP_SERVER_HOST}:${COAP_SERVER_PORT}/device`, payload);
    };

  const handleLightToggle = (index) => {
    setLights((prevLights) => {
      const newLights = [...prevLights];
      newLights[index].on = !newLights[index].on;
      return newLights;
    });
  };

  const handleShadePositionChange = (index, position) => {
    setShades((prevShades) => {
      const newShades = [...prevShades];
      newShades[index].position = position;
      return newShades;
    });
  };

  const handlePlugToggle = (index) => {
    setPlugs((prevPlugs) => {
      const newPlugs = [...prevPlugs];
      newPlugs[index].on = !newPlugs[index].on;
      return newPlugs;
    });
  };

  const handlePrinterInkLevelChange = (color, level) => {
    setPrinter((prevPrinter) => {
      const newPrinter = { ...prevPrinter };
      newPrinter.inkLevels[color] = level;
      return newPrinter;
    });
  };

  const handleSpeakerVolumeChange = (volume) => {
    setSpeaker((prevSpeaker) => {
      const newSpeaker = { ...prevSpeaker };
      newSpeaker.volume;
    })
  };
  }}

  return (
    <div>
      <h2> Control</h2>
      <button onClick={handleToggle}>{isOn ? "Turn Off" : "Turn On"}</button>
      <br />
      <input
        type="range"
        min="0"
        max="100"
        value={brightness}
        onChange={handleBrightnessChange}
      />
      <br />
      <label>
        Color:
        <select value={color} onChange={handleColorChange}>
          <option value="white">White</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      </label>
    </div>
  );

export default Control;
