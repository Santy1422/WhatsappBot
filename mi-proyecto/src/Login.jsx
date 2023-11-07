import React, { useState } from "react";

export const Login = ({setSteps, steps, usuario, contraseña,}) => {
    const [username, setUsername] = useState("")
    const [pas, setPas] = useState("")

    const nextStep = () => {

        if(username === usuario && pas === contraseña) setSteps(1)
    }
return(
    <section  className="bg-red" style={{ backgroundColor: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <div style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600', color: '#333', textDecoration: 'none' }}>
        {/* <img style={{ width: '32px', height: '32px', marginRight: '8px' }} src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/> */}
        Whatsapp Login    
      </a>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.25', marginBottom: '1rem', color: '#333' }}>Ingrese a su cuenta</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#333' }}>Usuario</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', color: '#333', padding: '0.625rem', borderRadius: '0.375rem', outline: 'none' }} placeholder="name@company.com" required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#333' }}>Contraseña</label>
          <input type="password" id="password" value={pas} onChange={(e) => setPas(e.target.value)} style={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', color: '#333', padding: '0.625rem', borderRadius: '0.375rem', outline: 'none' }} placeholder="••••••••" required />
        </div>
        <button onClick={() => nextStep()} style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '0.625rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>Ingresar</button>
      </div>
    </div>
  </section>

)
}