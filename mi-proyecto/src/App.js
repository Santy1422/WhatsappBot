import { useRef, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { Login } from "./Login";
import { QRComponet } from "./QRComponet";
import {AgregarEditarCliente} from "./QRComponet";
import socket from "socket.io-client";



const numeroAleatorio = Math.floor(Math.random() * 1000).toString();





const getQr = async () => {

  try {
    await axios.get(
              // `http://localhost:8081/v1/whatsapp/getqr/${numeroAleatorio}/${"www.google.com"}`,

       `https://horse-riders-house-production.up.railway.app/v1/whatsapp/getqr/${numeroAleatorio}/${"www.google.com"}`,
      {
      }
    );
    console.log("loading");

  } catch (err) {
    console.log(err);
  }
};
const App = () => {
  const WhatsAppRef = useRef();
  const [qr, setQr] = useState(null);
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [io,setIo] = useState(undefined)

  
  useEffect(() => {
    // Llama a getQr aquí
    getQr({
      setUser: (s) => console.log("pidiendo qr"),
      setLoading,
      setError,
    });
  }, []); 

  useEffect(() => {
    setIo(socket('https://whatsappbots2-production-9603.up.railway.app/'))
    // setIo(socket('http://localhost:8081'))
  },[socket])
  
  useEffect(() => {
    if (io) {
      io?.connect()
      io?.emit('join',"www.google.com");
  
      io?.on("whatsappAuthFront",(data) => {
        const { qr } = data
     setQr(qr)
      })
      io?.on("whatsappConnectedFront",(data) => {
        const { ok } = data
      })
      io?.on("whatsappFailFront",(data) => {
      })
    }
    return () => {
      io?.off('userResponse');
      io?.off("maxPeticiones")
      io?.disconnect()
    };
  },[io]);
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
    
   {steps === 1 && <div >
      <QRComponet qr={qr} WhatsAppRef={WhatsAppRef} loading={loading} getQr={getQr} />
            <AgregarEditarCliente/>
    </div>}

    </>

  );
};

export default App;
