import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example prototype endpoint
app.post('/api/calculate', (req: Request, res: Response) => {
  const { a, b, operation } = req.body;
  const numA = Number(a);
  const numB = Number(b);

  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({ error: 'Please provide valid numbers for a and b' });
  }

  let result: number;
  if (operation === 'add') {
    result = numA + numB;
  } else if (operation === 'subtract' || operation === 'sub') {
    result = numA - numB;
  } else {
    return res.status(400).json({ error: 'Invalid operation. Supported: add, subtract' });
  }

  return res.json({ a: numA, b: numB, operation, result });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
