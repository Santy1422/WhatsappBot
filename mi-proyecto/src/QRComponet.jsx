import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";

import axios from 'axios';
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  qrComponent: {
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    margin: '20px',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%', // Asegura que ocupe el ancho completo en móviles
    // maxWidth: '300px', // Limita el tamaño en dispositivos más grandes
  },
  qrCode: {
    padding: '10px',
    border: '5px solid #007bff',
    display: 'inline-block',
    margin: '10px 0',
  },
  formContainer: {
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px',
    width: '100%', // Asegura que ocupe el ancho completo en móviles
    maxWidth: '500px', // Limita el tamaño en dispositivos más grandes
  },
  formInput: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '10px',
  },
  formButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'block',
    width: '100%',
    marginTop: '10px',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  textArea: {
    width: '100%', // Asegura que el textarea sea responsive
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '10px',
    height: '100px', // Ajusta la altura del textarea
  },
  // Estilos para la visualización en una fila en pantallas grandes
  rowDisplay: {
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
};

export const QRComponet = ({ qr, WhatsAppRef, loading, getQr }) => {
  return (
    <div
      ref={WhatsAppRef}
      style={styles.qrComponent}
    >
      <div>
        <div>
          <p>QR Code:</p>
          <div style={styles.qrCode}>
            {qr ? 
            <QRCode
            value={qr}
            viewBox={`0 0 256 256`}
            />
            : (
              <p>Esperando QR...</p>
            )}
          </div>
        </div>
        <div>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>

          <button
            onClick={getQr}
            style={styles.formButton}
          >
            Generar QR
          </button>
        </div>
      </div>
    </div>
  );
}

export const AgregarEditarCliente = () => {
  const [cliente, setCliente] = useState({ nombre: '', edad: '', genero: '', alergia: '', objetivos: "", apikey: "" });
let clienteId = "asd"
  useEffect(() => {
    if (clienteId) {
      // Realiza una solicitud para obtener el cliente por su ID utilizando Axios
      axios.get(`https://horse-riders-house-production.up.railway.app/v1/whatsapp/ver`)
        .then((response) => {
          const data = response.data;
          if (data.cliente) {
            console.log(data.cliente);
            setCliente(data.cliente);
          } else {
            console.error('Cliente no encontrado');
          }
        })
        .catch((error) => {
          console.error('Error al obtener el cliente por ID', error);
        });
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (clienteId) {
      // Realiza una solicitud para editar el cliente
      fetch(`https://horse-riders-house-production.up.railway.app/v1/whatsapp/editar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Cliente editado con éxito', data);
          // Redirige o realiza otras acciones necesarias
        })
        .catch((error) => {
          console.error('Error al editar el cliente', error);
        });
    } else {
      // Realiza una solicitud para agregar un nuevo cliente
      fetch('https://horse-riders-house-production.up.railway.app/v1/whatsapp/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Cliente agregado con éxito', data);
          // Redirige o realiza otras acciones necesarias
        })
        .catch((error) => {
          console.error('Error al agregar el cliente', error);
        });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.qrComponent}>
      </div>
      <div style={styles.formContainer}>
        <h2>{clienteId ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formInput}>
            <label htmlFor="nombre">Nombre:</label>
            <textarea
            style={styles.input}
              type="text"
              id="nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formInput}>
            <label htmlFor="edad">Edad:</label>
            <textarea
                        style={styles.input}

              type="text"
              id="edad"
              name="edad"
              value={cliente.edad}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formInput}>
            <label htmlFor="genero">Género:</label>
            <textarea
                        style={styles.input}

              type="text"
              id="genero"
              name="genero"
              value={cliente.genero}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formInput}>
            <label htmlFor="alergia">Alergia:</label>
            <textarea
                        style={styles.input}

              type="text"
              id="alergia"
              name="alergia"
              value={cliente.alergia}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formInput}>
            <label htmlFor="objetivos">Objetivos:</label>
            <textarea
                        style={styles.input}

              type="text"
              id="objetivos"
              name="objetivos"
              value={cliente.objetivos}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formInput}>
            <label htmlFor="apiKey">API Key:</label>
            <textarea
                        style={styles.input}

              type="text"
              id="apiKey"
              name="apikey"
              checked={cliente.apikey}
              onChange={handleInputChange}
            />
          </div>
          <div style={styles.formInput} className="text-right">
            <button
              type="submit"
              style={styles.formButton}
            >
              {clienteId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

