import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";

import axios from 'axios';
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrComponent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    alignItems: "center",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 7px 0 rgba(0,0,0,0.1)",
    padding: "20px",
    border: "1px solid #007bff",
    width: "300px",
    margin: "0 auto",
  },
  qrCode: {
    width: "200px",
    height: "200px",
  },
  formContainer: {
    flex: "1",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
  },
  input: {

    width: '95%', // Ajusta el porcentaje que desees
      padding: '8px', // Puedes ajustar el espaciado interno  },
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formInput: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  formButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export const QRComponet = ({ qr, WhatsAppRef, loading, handleQr }) => {
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
            onClick={handleQr}
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
  const [cliente, setCliente] = useState({ nombre: '', edad: '', genero: '', alergia: '', objetivos: "", apikey: false });
let clienteId = "asd"
  useEffect(() => {
    if (clienteId) {
      // Realiza una solicitud para obtener el cliente por su ID utilizando Axios
      axios.get(`http://localhost:8081/v1/whatsapp/ver`)
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
      fetch(`http://localhost:8081/v1/whatsapp/editar`, {
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
      fetch('http://localhost:8081/v1/whatsapp/agregar', {
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

