export function requireAuth(req, res, next) {
  const email = req.header('x-user-email');
  if (!email) {
    return res.status(401).json({ error: 'Missing x-user-email header' });
  }
  req.user = { email };
  next();
}
