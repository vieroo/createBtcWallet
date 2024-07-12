const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");

// Definir a rede
// bitcoin = rede principal - mainnet
// testenet - rede de teste - testnet
const network = bitcoin.networks.testnet;

// Derivação de carteiras HD
const path = `m/49'/1'/0'/0`;

function createWallet() {
  // Criando o mnemonic para a seed - palavras de senha
  let mnemonic = bip39.generateMnemonic();

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Criando a raiz da carteira HD
  let root = bip32.fromSeed(seed, network);

  // Criando uma conta - par pvt-pub keys
  let account = root.derivePath(path);
  let node = account.derive(0).derive(0);

  let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
  }).address;

  return {
    address: btcAddress,
    privateKey: node.toWIF(),
    seed: mnemonic,
  };
}

const wallet = createWallet();
console.log("Carteira gerada");
console.log("Endereço: ", wallet.address);
console.log("Chave privada: ", wallet.privateKey);
console.log("Seed: ", wallet.seed);
