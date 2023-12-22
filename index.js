import { generate } from "random-words";
import { ethers } from "ethers";
import axios from "axios"; 
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

const getWalletBalance = async (address) => {
    const apiKey = process.env.ETHERSCAN_KEY; 
    const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.result) {
            const balanceWei = response.data.result;

            if (balanceWei !== undefined) {
                const balanceEther = ethers.formatEther(balanceWei);
                return balanceEther;
            } else {
                throw new Error("Failed to retrieve valid wallet balance from Etherscan API.");
            }
        } else {
            throw new Error("Failed to retrieve wallet balance from Etherscan API.");
        }
    } catch (error) {
        throw new Error(`Error retrieving wallet balance: ${error.message}`);
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    try {
        let randomWords;
        let checkWallet;
        let balance = "0.0";

        do {
            try {
                const wordCount = Math.random() < 0.5 ? 12 : 24;
                randomWords = generateValidRandomWords(wordCount);
                checkWallet = ethers.Wallet.fromPhrase(randomWords);

                const walletAddress = checkWallet.address;
                balance = await getWalletBalance(walletAddress);
                console.log("Wallet Balance:", balance, "ETH");

                await delay(1000);
            } catch (error) {
                if (error.code === 'INVALID_ARGUMENT' && error.argument === 'mnemonic') {
                    console.log(`Error: ${error.shortMessage}. Regenerating mnemonic...`);
                } else {
                    throw error; 
                }
            }
        } while (balance === "0.0");

        console.log("Valid mnemonic found:", randomWords);
        console.log("Corresponding private key:", checkWallet.privateKey);
    } catch (error) {
        console.log("Your program encountered an error:", error);
    }
})();
