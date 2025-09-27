import { createContext, useState, useContext } from "react";
import { UserContext } from "./UserContext";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [connected, setConnected] = useState(false);
  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  const connectBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: [SERVICE_UUID],
      });
      setDevice(device);

      const server = await device.gatt.connect();
      setServer(server);
      setConnected(true);

      const service = await server.getPrimaryService(SERVICE_UUID);
      const char = await service.getCharacteristic(CHARACTERISTIC_UUID);
      setCharacteristic(char);

      await char.startNotifications();

      // Listen to sensor updates
      char.addEventListener("characteristicvaluechanged", (event) => {
        const value = new TextDecoder().decode(event.target.value);
        console.log("BLE update:", value); // log for debugging
        const [flex, y, z] = value.split(",").map(parseFloat);
        setFlexAngle(flex);
        setGyroY(y);
        setGyroZ(z);
      });

      // Send thresholds
      if (user?.posture_thresholds) {
        const t = user.posture_thresholds;
        const payload = `${t.flex_min},${t.flex_max},${t.gyroY_min},${t.gyroY_max},${t.gyroZ_min},${t.gyroZ_max}`;
        const encoder = new TextEncoder();
        await char.writeValue(encoder.encode(payload));
        console.log("Thresholds sent:", payload);
      }
    } catch (err) {
      console.error("BLE connection failed:", err);
      setConnected(false);
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        device,
        server,
        characteristic,
        connected,
        connectBLE,
        flexAngle,
        gyroY,
        gyroZ,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
