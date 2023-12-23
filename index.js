import { generate } from "random-words";
import { ethers } from "ethers";
import axios from "axios";
import fs from "fs";
import 'dotenv/config';

const isValidMnemonic = (phrase) => {
    return phrase.trim().split(" ").length >= 12 && phrase.trim().split(" ").length <= 24;
};

const generateValidRandomWords = (wordCount) => {
    let randomWords;
    do {
        randomWords = generate(wordCount).join(" ");
    } while (!isValidMnemonic(randomWords));
    return randomWords;
};

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
                    throw new Error("Failed to retrieve valid wallet balance from Etherscan API.");
                }
            } else {
                throw new Error("Failed to retrieve wallet balance from Etherscan API.");
            }
        } catch (error) {
            console.error(`Error retrieving wallet info (retry ${i + 1}): ${error.message}`);
            await delay(1000);
        }
    }

    throw new Error(`Max retries reached. Unable to retrieve wallet info for address ${address}`);
};

const writeToFile = (data) => {
    fs.appendFileSync('results.txt', data + '\n', 'utf8');
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    try {
        let randomWords;
        let checkWallet;
        let walletInfo = { balance: "0.0", address: "" };

        do {
            try {
                const wordCount = Math.random() < 0.5 ? 12 : 24;
                randomWords = generateValidRandomWords(wordCount);
                checkWallet = ethers.Wallet.fromPhrase(randomWords);

                walletInfo = await getWalletInfo(checkWallet.address);
                console.log("Wallet Address:", walletInfo.address);
                console.log("Wallet Balance:", walletInfo.balance, "ETH");

                writeToFile(`${walletInfo.address} || ${walletInfo.balance} ETH || ${randomWords}`);

                await delay(1000);
            } catch (error) {
                if (error.code === 'INVALID_ARGUMENT' && error.argument === 'mnemonic') {
                    console.log(`Error: ${error.shortMessage}. Regenerating mnemonic...`);
                } else {
                    throw error;
                }
            }
        } while (walletInfo.balance === "0.0");

        console.log("Valid mnemonic found:", randomWords);
        console.log("Corresponding private key:", checkWallet.privateKey);
    } catch (error) {
        console.log("Your program encountered an error:", error);
    }
})();
