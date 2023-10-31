import React, { useState, useEffect } from 'react';

const AgregarEditarCliente = () => {
  const [cliente, setCliente] = useState({ nombre: '', edad: '', genero: '', alergia: '', objetivos: "", apikey: "" });
 let clienteId = 123123
  useEffect(() => {
    if (clienteId) {
      // Realiza una solicitud para obtener el cliente por su ID
      fetch(`/v1/whatsapp/receta/${clienteId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.cliente) {
            setCliente(data.cliente);
          } else {
            console.error('Cliente no encontrado');
          }
        })
        .catch((error) => {
          console.error('Error al obtener el cliente por ID', error);
        });
    }
  }, [clienteId]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (clienteId) {
      // Realiza una solicitud para editar el cliente
      fetch(`/v1/whatsapp/editar/${clienteId}`, {
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
      fetch('/v1/whatsapp/', {
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
    <div>
      <h2>{clienteId ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
      <div>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={cliente.nombre} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="edad">Edad:</label>
          <input type="text" id="edad" name="edad" value={cliente.edad} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="genero">Género:</label>
          <input type="text" id="genero" name="genero" value={cliente.genero} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="alergia">Alergia:</label>
          <input type="text" id="alergia" name="alergia" value={cliente.alergia} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="objetivos">Objetivos:</label>
          <input type="text" id="objetivos" name="objetivos" value={cliente.objetivos} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="objetivos">Api Key:</label>
          <input type="checkbox" id="objetivos" name="objetivos" checked={cliente.apikey} onChange={handleInputChange} />
        </div>
        <button onClick={handleSubmit}>Actualizar</button>
      </div>
    </div>
  );
};

export default AgregarEditarCliente;
