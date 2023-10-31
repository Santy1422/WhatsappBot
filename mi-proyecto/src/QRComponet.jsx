import React from "react";
import QRCode from "react-qr-code";

export const QRComponet = ({ qr, WhatsAppRef, loading, handleQr }) => {
  // Estilos en línea para el componente
  const qrComponentStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 7px 0 rgba(0,0,0,0.1)",
    padding: "20px",
    border: "1px solid #007bff",
    width: "300px", // Ancho de la tarjeta
    margin: "0 auto", // Centrar horizontalmente
  };
  return (
    <div
      ref={WhatsAppRef}
      style={qrComponentStyles} // Aplicar estilos al contenedor principal
    >
      <div className="flex flex-col items-end">
        <div className="flex flex-col justify-center items-start gap-2 p-2">
          <div className="flex flex-col gap-1">
 
          </div>

          <div className="h-64 w-64 flex items-center justify-center">
        
            {qr ? 
              <QRCode value={qr} />
            : (
              <p>Esperando QR...</p>
            )}
          </div>
        </div>
      </div>
      <div className="self-stretch h-[1px] bg-primary-300 dark:bg-primary-950"></div>
      <div className="flex gap-2.5 p-2 justify-end items-end">
        <button
          onClick={handleQr}
          className="flex flex-row items-center h-8 gap-2.5 px-3 py-2 rounded-md text-sm border border-primary-300 dark:border-primary-950 duration-300 hover:bg-primary-100 dark:hover:bg-primary-950"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-4 h-4"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 3.25C2 2.55964 2.55964 2 3.25 2H6.25C6.94036 2 7.5 2.55964 7.5 3.25V6.25C7.5 6.94036 6.94036 7.5 6.25 7.5H3.25C2.55964 7.5 2 6.94036 2 6.25V3.25ZM3.25 3C3.11193 3 3 3.11193 3 3.25V6.25C3 6.38807 3.11193 6.5 3.25 6.5H6.25C3.5 6.5 6.5 3.5H3.25ZM10.5 6.25C10.5 6.94036 11.0596 7.5 11.75 7.5H14.75C15.4404 7.5 16 6.94036 16 6.25V3.25C16 2.55964 15.4404 2 14.75 2H11.75C11.0596 2 10.5 2.55964 10.5 3.25V6.25ZM11.75 3C11.6119 3 11.5 3.11193 11.5 3.25V6.25C11.5 6.38807 11.6119 6.5 11.75 6.5H14.75C14.8881 6.5 15 6.3881 15 6.25V3.25C15 3.11193 14.8881 3 14.75 3H11.75ZM10 9.25C10 9.11193 10.1119 9 10.25 9H13.25C13.3881 9 13.5 9.11193 13.5 9.25V12.25C13.5 12.9404 12.9404 13.5 12.25 13.5H10.25C9.55964 13.5 9 12.9404 9 12.25V9.25ZM10.25 9.5C10.1119 9.5 10 9.61193 10 9.75V12.25C10 12.3881 10.1119 12.5 10.25 12.5H13.25C13.3881 12.5 13.5 12.3881 13.5 12.25V9.75C13.5 9.61193 13.3881 9.5 13.25 9.5H10.25ZM3 9.25C3 9.05964 3.05964 9 3.25 9H6.25C6.44036 9 6.5 9.05964 6.5 9.25V12.25C6.5 12.4404 6.44036 12.5 6.25 12.5H3.25C3.05964 12.5 3 12.4404 3 12.25V9.25ZM3.25 9.5C3.11193 9.5 3 9.61193 3 9.75V12.25C3 12.3881 3.11193 12.5 3.25 12.5H6.25C6.38807 12.5 6.5 12.3881 6.5 12.25V9.75C6.5 9.61193 6.38807 9.5 6.25 9.5H3.25Z"
              fill="currentColor"
            ></path>
          </svg>
          <span>Apretar 3 o 4 veces para generar el QR</span>
        </button>
      </div>
    </div>
  );
}
