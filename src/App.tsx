/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [neutLower, setNeutLower] = useState(-0.1);
  const [neutUpper, setNeutUpper] = useState(0.1);

  useEffect(() => {
    async function getNeutLower() {
      const result = await chrome.storage.sync.get(["neut_lower_bound"]);
      setNeutLower(parseFloat(result.neut_lower_bound));
    }
    getNeutLower();

    async function getNeutUpper() {
      const result = await chrome.storage.sync.get(["neut_upper_bound"]);
      setNeutUpper(parseFloat(result.neut_upper_bound));
    }
    getNeutUpper();
  }, []);

  function handleInputChange(key: string, value: any) {
    chrome.storage.sync.set({ [key]: value }).then(() => {
      console.log(`Value of ${key} is set to ${value}`);
    });
  }

  return (
    <div className="App">
      <header className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-lg">Settings</h3>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Neutral Lower Bound
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="number"
          step=".05"
          max="0"
          min="-4"
          value={neutLower}
          onChange={(e) => {
            setNeutLower(parseFloat(e.target.value));
            handleInputChange("neut_lower_bound", e.target.value);
          }}
        ></input>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Neutral Upper Bound
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="number"
          step=".05"
          max="4"
          min="0"
          value={neutUpper}
          onChange={(e) => {
            setNeutUpper(parseFloat(e.target.value));
            handleInputChange("neut_upper_bound", e.target.value);
          }}
        ></input>
      </header>
    </div>
  );
}

export default App;
