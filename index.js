// Import necessary libraries and modules
import 'dotenv/config';
import { generate } from 'random-words';
import { ethers } from 'ethers';
import axios from 'axios';
import fs from 'fs';

// Function to check if the generated mnemonic phrase is valid
const isValidMnemonic = (phrase) => {
  return (
    phrase.trim().split(' ').length >= 12 &&
    phrase.trim().split(' ').length <= 24
  );
};

// Function to generate a valid random mnemonic phrase
const generateValidRandomWords = (wordCount) => {
  let randomWords;
  do {
    randomWords = generate(wordCount).join(' ');
  } while (!isValidMnemonic(randomWords));
  return randomWords;
};

// Function to get wallet information from the Etherscan API
const getWalletInfo = async (address) => {
  const apiKey = process.env.ETHERSCAN_KEY;
  const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.result) {
        const balanceWei = response.data.result;

        if (balanceWei !== undefined) {
          const balanceEther = ethers.formatEther(balanceWei);
          return { balance: balanceEther, address };
        } else {
          throw new Error(
            'Failed to retrieve valid wallet balance from Etherscan API.'
          );
        }
      } else {
        throw new Error(
          'Failed to retrieve wallet balance from Etherscan API.'
        );
      }
    } catch (error) {
      console.error(
        `Error retrieving wallet info (retry ${i + 1}): ${error.message}`
      );
      await delay(1000);
    }
  }

  throw new Error(
    `Max retries reached. Unable to retrieve wallet info for address ${address}`
  );
};

// Function to get wallet information from the Bscscan API
const getBnbWalletInfo = async (address) => {
  const apiKey = process.env.BSCSCAN_KEY;
  const apiUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.result) {
        const balanceWei = response.data.result;

        if (balanceWei !== undefined) {
          const balanceBnb = ethers.formatEther(balanceWei);
          return { balance: balanceBnb, address };
        } else {
          throw new Error(
            'Failed to retrieve valid wallet balance from BscScan API.'
          );
        }
      } else {
        throw new Error('Failed to retrieve wallet balance from BscScan API.');
      }
    } catch (error) {
      console.error(
        `Error retrieving BNB wallet info (retry ${i + 1}): ${error.message}`
      );
      await delay(1000);
    }
  }

  throw new Error(
    `Max retries reached. Unable to retrieve BNB wallet info for address ${address}`
  );
};

// Function to get wallet information from the Polygonscan API
const getMaticWalletInfo = async (address) => {
  const apiKey = process.env.POLYGONSCAN_KEY;
  const apiUrl = `https://api.polygonscan.com/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.result) {
        const balanceWei = response.data.result;

        if (balanceWei !== undefined) {
          const balanceMatic = ethers.formatEther(balanceWei);
          return { balance: balanceMatic, address };
        } else {
          throw new Error(
            'Failed to retrieve valid wallet balance from PolygonScan API.'
          );
        }
      } else {
        throw new Error(
          'Failed to retrieve wallet balance from PolygonScan API.'
        );
      }
    } catch (error) {
      console.error(
        `Error retrieving MATIC wallet info (retry ${i + 1}): ${error.message}`
      );
      await delay(1000);
    }
  }

  throw new Error(
    `Max retries reached. Unable to retrieve MATIC wallet info for address ${address}`
  );
};

// Function to get wallet information from the Arbiscan API
const getArbitrumWalletInfo = async (address) => {
  const apiKey = process.env.ARBISCAN_KEY;
  const apiUrl = `https://api.arbiscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.result) {
        const balanceWei = response.data.result;

        if (balanceWei !== undefined) {
          const balanceArbitrum = ethers.formatEther(balanceWei);
          return { balance: balanceArbitrum, address };
        } else {
          throw new Error(
            'Failed to retrieve valid wallet balance from Arbiscan API.'
          );
        }
      } else {
        throw new Error('Failed to retrieve wallet balance from Arbiscan API.');
      }
    } catch (error) {
      console.error(
        `Error retrieving Arbitrum wallet info (retry ${i + 1}): ${
          error.message
        }`
      );
      await delay(1000);
    }
  }

  throw new Error(
    `Max retries reached. Unable to retrieve Arbitrum wallet info for address ${address}`
  );
};

// Function to get wallet information from the Avax API
const getAvalancheWalletInfo = async (address) => {
  const apiUrl = `https://api.avax.network/ext/bc/C/rpc`;
  const data = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBalance',
    params: [address, 'latest'],
  };

  const response = await axios.post(apiUrl, data);
  if (response.data && response.data.result) {
    const balanceWei = response.data.result;

    if (balanceWei !== undefined) {
      const balanceAvax = ethers.formatEther(balanceWei);
      return { balance: balanceAvax, address };
    } else {
      throw new Error(
        'Failed to retrieve valid wallet balance from Avax network.'
      );
    }
  } else {
    throw new Error('Failed to retrieve wallet balance from Avax network.');
  }
};

// Function to get wallet information from the Optimism API
const getOptimismWalletInfo = async (address) => {
  const apiKey = process.env.OPTIMISM_ETHERSCAN_KEY;
  const apiUrl = `https://api-optimistic.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.result) {
        const balanceWei = response.data.result;

        if (balanceWei !== undefined) {
          const balanceOptimism = ethers.formatEther(balanceWei);
          return { balance: balanceOptimism, address };
        } else {
          throw new Error(
            'Failed to retrieve valid wallet balance from Optimism Etherscan API.'
          );
        }
      } else {
        throw new Error(
          'Failed to retrieve wallet balance from Optimism Etherscan API.'
        );
      }
    } catch (error) {
      console.error(
        `Error retrieving Optimism wallet info (retry ${i + 1}): ${
          error.message
        }`
      );
      await delay(1000);
    }
  }

  throw new Error(
    `Max retries reached. Unable to retrieve Optimism wallet info for address ${address}`
  );
};

// Function to write data to a file
const writeToFile = (data) => {
  fs.appendFileSync('results.txt', data + '\n', 'utf8');
};
// Function to introduce a delay using promises
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Main execution block
(async () => {
  try {
    let randomWords;
    let checkWallet;
    let walletInfo = { balance: '0.0', address: '' };

    do {
      try {
        // Generate a random mnemonic phrase with either 12 or 24 words
        const wordCount = Math.random() < 0.5 ? 12 : 24;
        randomWords = generateValidRandomWords(wordCount);
        // Create a wallet from the generated mnemonic
        checkWallet = ethers.Wallet.fromPhrase(randomWords);

        // Retrieve and display wallet information for Ethereum and others
        walletInfo = await getWalletInfo(checkWallet.address);
        console.log('Wallet Address:', walletInfo.address);
        console.log('ETH Wallet Balance:', walletInfo.balance, 'ETH');

        const bnbWalletInfo = await getBnbWalletInfo(checkWallet.address);
        console.log('BNB Wallet Balance:', bnbWalletInfo.balance, 'BNB');

        const maticWalletInfo = await getMaticWalletInfo(checkWallet.address);
        console.log('MATIC Wallet Balance:', maticWalletInfo.balance, 'MATIC');

        const arbitrumWalletInfo = await getArbitrumWalletInfo(
          checkWallet.address
        );
        console.log(
          'Arbitrum Wallet Balance:',
          arbitrumWalletInfo.balance,
          'ETH'
        );

        const avalancheWalletInfo = await getAvalancheWalletInfo(
          checkWallet.address
        );
        console.log(
          'Avalanche Wallet Balance:',
          avalancheWalletInfo.balance,
          'AVAX'
        );

        const optimismWalletInfo = await getOptimismWalletInfo(
          checkWallet.address
        );
        console.log(
          'Optimism Wallet Balance:',
          optimismWalletInfo.balance,
          'ETH'
        );

        // Check if any balance is greater than 0
        if (
          parseFloat(walletInfo.balance) > 0 ||
          parseFloat(bnbWalletInfo.balance) > 0 ||
          parseFloat(maticWalletInfo.balance) > 0 ||
          parseFloat(arbitrumWalletInfo.balance) > 0 ||
          parseFloat(avalancheWalletInfo.balance) > 0 ||
          parseFloat(optimismWalletInfo.balance) > 0
        ) {
          console.log('Wallet with balance found!');
          console.log('Address:', checkWallet.address);
          console.log('Private Key:', checkWallet.privateKey);
          console.log('ETH Balance:', walletInfo.balance);
          console.log('BNB Balance:', bnbWalletInfo.balance);
          console.log('MATIC Balance:', maticWalletInfo.balance);
          console.log('Arbitrum Balance:', arbitrumWalletInfo.balance);
          console.log('Avalanche Balance:', avalancheWalletInfo.balance);
          console.log('Optimism Balance:', optimismWalletInfo.balance);
          process.exit();
        }

        // Write wallet information to a file
        writeToFile(
          `${walletInfo.address} || ${walletInfo.balance} ETH || ${bnbWalletInfo.balance} BNB || ${randomWords}`
        );

        // Introduce a delay before the next iteration
        await delay(1000);
      } catch (error) {
        if (
          error.code === 'INVALID_ARGUMENT' &&
          error.argument === 'mnemonic'
        ) {
          console.log(`Error: ${error.shortMessage}. Regenerating mnemonic...`);
        } else {
          throw error;
        }
      }
    } while (walletInfo.balance === '0.0');

    // Display information about the valid mnemonic
    console.log('Valid mnemonic found:', randomWords);
    console.log('Corresponding private key:', checkWallet.privateKey);
  } catch (error) {
    console.log('Your program encountered an error:', error);
  }
})();
