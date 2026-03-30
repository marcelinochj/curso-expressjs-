const errorHandle = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Ocurrió un error inesperado";
  
  console.error(`[Error]: ${new Date().toISOString()} ${statusCode} ${message}`);
  
  if (error.stack) {
    console.error(error.stack);
  }
  
  // Desestructurar el entorno de Node
  const { NODE_ENV } = process.env;
  
  // Enviar respuesta JSON con el error
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    // Incluir detalles adicionales solo en modo desarrollo
    ...(NODE_ENV === "development" && { stack: error.stack })
  });
};

module.exports = errorHandle;