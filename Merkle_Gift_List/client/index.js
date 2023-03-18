const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  let myName = "Lynn Jerde";
  let myMerkle = new MerkleTree(niceList);
  let myProof = myMerkle.getProof(niceList.findIndex(n => n === myName));
  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name: myName,
    merkleProof: myProof
  });

  console.log({ gift });
}

main();