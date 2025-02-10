import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = []; // Temporary storage (Replace with a database)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, password } = req.body;

  // Find user
  const user = users.find(user => user.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  // Generate JWT
  const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
}
