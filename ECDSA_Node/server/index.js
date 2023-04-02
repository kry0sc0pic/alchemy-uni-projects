const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex, hexToBytes } = require("ethereum-cryptography/utils");
const MSG = "Confirm Transcation";
const MSG_HASH = keccak256(utf8ToBytes(MSG));
app.use(cors());
app.use(express.json());

const balances = {
  "16bb6031cbf3a12b899ab99d96b64b7bbd719705": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  console.log('transfer request', req.body);
  const { signature, amount, recovery, recipient } = req.body;
  const senderAddress = toHex(keccak256(secp.recoverPublicKey(MSG_HASH, hexToBytes(signature), recovery).slice(1)).slice(-20)).toLowerCase();
  console.log('senderAddress', senderAddress);
  setInitialBalance(senderAddress);
  setInitialBalance(recipient);

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
