export function errorMiddleware(err, req, res, next) {
  console.error('API error:', err);
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    message,
    error: message,
    details: {
      name: err?.name,
      message: err?.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack
    }
  });
}
