import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = []; // Temporary in-memory storage (Replace with DB in production)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user
  const newUser = { id: users.length + 1, email, password: hashedPassword };
  users.push(newUser);

  // Generate JWT
  const token = jwt.sign({ userId: newUser.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ message: 'User registered successfully', token });
}
