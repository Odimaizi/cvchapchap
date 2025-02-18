import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

// MongoDB client using the URI and DB name from the environment variables
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  // Ensure only POST method is allowed for user registration
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  // Validate input (simple example)
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Connect to the MongoDB database
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);  // Using the database name from the env
    const usersCollection = db.collection('users');  // Assume 'users' collection

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = { email, password: hashedPassword };

    // Insert the new user into the database
    await usersCollection.insertOne(newUser);

    // Generate a JWT token for the new user
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return a success message with the token
    return res.status(201).json({ message: 'User registered successfully', token });

  } catch (error) {
    // Catch any errors and return a 500 status
    console.error('Error signing up user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}
