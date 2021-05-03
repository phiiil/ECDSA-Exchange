const a = require('./accounts.js');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
// sign and verify
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require("crypto-js/sha256");


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
  const balance = accounts.get(address) || "invalid account";
  res.send({ balance });
});

app.post('/send', (req, res) => {
  console.log(`Transfer Request:`)
  console.log(req.body)
  const { transferRequest, signature } = req.body;
  const { sender, amount, recipient } = transferRequest;
  // verify signature against transferRequest
  // transfertRequest was signed with private key, verify against sender public key
  const key = ec.keyFromPublic(sender, 'hex');
  const transferRequestHashString = SHA256(JSON.stringify(transferRequest)).toString();
  const verified = key.verify(transferRequestHashString, signature);
  console.log(`Signature verified: ${verified}`);
  if (verified) {
    const senderBalance = accounts.get(sender) || 0;;
    if (senderBalance >= amount) {
      // you have enough coins, transfer
      accounts.set(sender, senderBalance - amount);
      recipientBalance = accounts.get(recipient);
      accounts.set(recipient, recipientBalance + amount);
      const response = { verified, message: "Transfer successful", balance: accounts.get(sender) };
      res.send(response);
    }
    else {
      const response = { verified, message: "Transfer failed. Not enough coins.", balance: accounts.get(sender) };
      res.send(response);
    }
  }
  else {
    const response = { verified, message: "Transfer failed. Invalid signature.", balance: accounts.get(sender) };
    res.send(response);
  }
});



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
