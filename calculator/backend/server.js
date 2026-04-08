const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
  const { operation, a, b } = req.body;
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || (operation !== 'sqrt' && isNaN(numB))) {
    return res.status(400).json({ error: 'Invalid numbers' });
  }

  let result;
  switch (operation) {
    case 'add':
      result = numA + numB;
      break;
    case 'subtract':
      result = numA - numB;
      break;
    case 'multiply':
      result = numA * numB;
      break;
    case 'divide':
      if (numB === 0) return res.status(400).json({ error: 'Division by zero' });
      result = numA / numB;
      break;
    case 'pow':
      result = Math.pow(numA, numB);
      break;
    case 'sqrt':
      if (numA < 0) return res.status(400).json({ error: 'Square root of negative number' });
      result = Math.sqrt(numA);
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }

  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
