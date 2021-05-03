import "./index.scss";
import { ec } from 'elliptic'
import sha256 from 'crypto-js/sha256';

console.log(ec);
var elliptic = new ec('secp256k1');
console.log(elliptic);

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: { value } }) => {
  if (value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  // transfer request
  const transferRequest = { sender, amount, recipient }
  // sign request with private key
  if (sender && amount && recipient) {
    const privateKey = document.getElementById("private-key").value;
    const key = elliptic.keyFromPrivate(privateKey);
    const transferRequestHash = sha256(JSON.stringify(transferRequest));
    const signature = key.sign(transferRequestHash.toString());
    console.log(signature.toString());
    const body = JSON.stringify({ transferRequest, signature });
    console.log(body);
    // send request to the server
    const request = new Request(`${server}/send`, { method: 'POST', body });
    fetch(request, { headers: { 'Content-Type': 'application/json' } }).then(response => {
      return response.json();
    }).then(({ message, balance }) => {
      document.getElementById("balance").innerHTML = balance;
      document.getElementById("transfer-result").innerHTML = message;
    });
  }
  else {
    document.getElementById("transfer-result").innerHTML = "Missing values";
  }
});

window.onload = () => {
  //document.getElementById("exchange-address").value = "1234";
}