import rateLimit from "express-rate-limit"



// Aplicar el middleware de limitación de velocidad a una ruta específica
// app.get('/ruta-especifica', limit5cada12horas, (req, res) => {
// Lógica de la ruta
// });

export const limit5cada12horas = rateLimit({
  windowMs: 60 * 60 * 1000 * 12, 
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Demaciadas peticiones, por favor purebe nuevamente en 12 horas"
});
export const limit1cada30minutos = rateLimit({
  windowMs: 60 * 60 * 1000 * 0.5, 
  max: 1, // limit each IP to 1 requests per windowMs
  message: "Demaciadas peticiones, por favor purebe nuevamente en 30 minutos"
});
export const limit5cada30minutos = rateLimit({
  windowMs: 30 * 30 * 1000, 
  max: 5, // limit each IP to 1 requests per windowMs
  message: "Demaciadas peticiones 5 cada 30, por favor purebe nuevamente en 30 minutos"
});
export const limitTest = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutos
  max: 20, // limit each IP to 20 reques ts per windowMs
  message: "Demaciadas peticiones, por favor purebe nuevamente en 2 minutos"
});
export const limit2cada1minuto = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutos
  max: 2, // limit each IP to 20 reques ts per windowMs
  message: "Demaciadas peticiones 2 cada 1 min, por favor purebe nuevamente en 2 minutos"
});
export const globalLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 150, // limit each IP to 100 requests per windowMs 
  message: "Limite 50 peticiones en margen de 2 minutos, espere 1 minutos"
});


