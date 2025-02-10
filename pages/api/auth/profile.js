import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Profile data', user: decoded });
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // ✅ Logs the error
    res.status(401).json({ error: `Invalid token: ${error.message}` }); // ✅ Uses error
  }
}
