const a = require('./accounts.js');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {
  "1": 100,
  "2": 50,
  "3": 75,
}

// STARTUP
console.log(`Booting NoFi Bank...`);
const accounts = a.generateAccounts(balances);

// ROUTES

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  console.log(`balance request: ${address}`);
  const balance = accounts.get(address) || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount } = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
