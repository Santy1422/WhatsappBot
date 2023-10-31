import { useRef, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { Login } from "./Login";
import { QRComponet } from "./QRComponet";
import {AgregarEditarCliente} from "./QRComponet";



const numeroAleatorio = Math.floor(Math.random() * 1000).toString();

const initWhatsapp = async ({ webId, setUser, setLoading, setError }) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/init/${numeroAleatorio}`,
    );
    setUser(response.data.payload);
    const response2 = await axios.get(
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/init/${numeroAleatorio}`,
    );
    setUser(response.data.payload);
    const response3 = await axios.get(
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/getqr/${numeroAleatorio}`,
    );
    setUser(response.data.payload.qr);
    const response4 = await axios.get(
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/getqr/${numeroAleatorio}`,
    );
    setUser(response.data.payload.qr);
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
      `https://horse-riders-house-production.up.railway.app/v1/whatsapp/getqr/${numeroAleatorio}`,
    );
    setUser(response.data.payload.qr);
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
      setUser: (a) => setQr(a),
      setLoading,
      setError,
    });

    setInit(true)
  }, []);


  const handleQr = async () => {
    try {
      setLoading(true);

      // Hacer tres llamadas para obtener el código QR
      await Promise.all([
        getQr({ 
           setUser: (s) => setQr(s)
          , setLoading, 
          setError }),

          getQr({ 
            setUser: (s) => setQr(s)
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

  const [steps, setSteps] = useState(1)
  const [usuario, setUsuario] = useState("whatsapp")
  const [contraseña, setContraseña] = useState("contraseña123")
  return (
    <>
    {steps === 0 && <Login setSteps={setSteps} steps={steps} usuario={usuario} contraseña={contraseña}/> }
    
   {steps === 1 && <div >
      <QRComponet qr={qr} WhatsAppRef={WhatsAppRef} loading={loading} handleQr={handleQr} />
            <AgregarEditarCliente/>
    </div>}

    </>

  );
};

export default App;
