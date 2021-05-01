var EC = require('elliptic').ec;
var ec = new EC('secp256k1');


function generateAccounts(balances) {
    const accounts = new Map();
    const privateKeys = [];
    const values = Object.values(balances);
    console.log(`\nNoFi bank contains ${values.length} accounts:`);
    values.forEach(value => {
        // Generate keys
        let key = ec.genKeyPair();
        const publicKey = key.getPublic().encode('hex');
        privateKeys.push(key.getPrivate().toString('hex'));
        accounts.set(publicKey, value);
        console.log(`${publicKey} = ${value}`);
    });
    console.log(`\nPrivate Keys:`)
    privateKeys.forEach(pk => {
        console.log(pk);
    })
    return accounts;
}

module.exports = { generateAccounts };