// First, install the required dependencies
npm install --save truffle-hdwallet-provider ethereumjs-wallet

// Then, create a new file called `deploy.js` and add the following code
const HDWalletProvider = require('truffle-hdwallet-provider');
const EthereumWallet = require('ethereumjs-wallet');

const mnemonic = 'your mnemonic phrase'; // Replace with your own mnemonic phrase
const provider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/your-api-key'); // Replace with your own API key

const wallet = EthereumWallet.fromPrivateKey(provider.getPrivateKey());
const address = '0x' + wallet.getAddress().toString('hex');

console.log(`Address: ${address}`);

const contractJson = require('./build/contracts/MyERC721.json'); // Replace with the name of your ERC721 contract

const contract = new web3.eth.Contract(contractJson.abi);

// Replace with the name and symbol of your ERC721 token
const name = 'My Token';
const symbol = 'MTK';

(async () => {
  const gasPrice = await web3.eth.getGasPrice();
  const gas = await contract.deploy({
    data: contractJson.bytecode,
    arguments: [name, symbol],
  }).estimateGas();

  console.log(`Gas cost: ${gas}`);

  contract.deploy({
    data: contractJson.bytecode,
    arguments: [name, symbol],
  }).send({
    from: address,
    gasPrice,
    gas,
  }).on('error', (error) => {
    console.error(error);
  }).on('transactionHash', (transactionHash) => {
    console.log(`Transaction hash: ${transactionHash}`);
  }).on('receipt', (receipt) => {
    console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);
  }).on('confirmation', (confirmationNumber, receipt) => {
    console.log(`Confirmation: ${confirmationNumber}`);
  }).then((newContractInstance) => {
    console.log(`Contract address: ${newContractInstance.options.address}`);
  });
})();
