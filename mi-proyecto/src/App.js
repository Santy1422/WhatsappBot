import { useRef, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { Login } from "./Login";
import { QRComponet } from "./QRComponet";
const initWhatsapp = async ({ webId, setUser, setLoading, setError }) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/init`,
    );
    setUser(response.data.payload);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const getQr = async ({ webId, setUser, setLoading, setError }) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/getqr`,
    );
    setUser(response.data.payload.qr);
    console.log(response.data, "respuesta QR")
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const App = () => {
  const WhatsAppRef = useRef();
  const [qr, setQr] = useState(null);
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initWhatsapp({
      setUser: (a) => setInit(true),
      setLoading,
      setError,
    });
    setInit(true)
  }, []);

  useEffect(() => {
    if (init) {
      handleQr();
    }
  }, [init]);

  const handleQr = async () => {
    try {
      setLoading(true);

      // Hacer tres llamadas para obtener el código QR
      await Promise.all([
        getQr({ 
           setUser: setQr
          , setLoading, 
          setError }),

          getQr({ 
             setUser: setQr
            , setLoading, 
            setError }),
  
   
        
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (WhatsAppRef.current && !WhatsAppRef.current.contains(event.target)) {
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [steps, setSteps] = useState(0)
  const [usuario, setUsuario] = useState("whatsapp")
  const [contraseña, setContraseña] = useState("contraseña123")
  return (
    <>
    {steps === 0 && <Login setSteps={setSteps} steps={steps} usuario={usuario} contraseña={contraseña}/> }
    
    {steps === 1 && <QRComponet qr={qr} WhatsAppRef={WhatsAppRef} loadig={loading} handleQr={handleQr}/> }

    </>

  );
};

export default App;
