# evm-bruteforce

![Result](https://i.imgur.com/ju3iOKg.png)

This is a bot that can be used to bruteforce and find a wallet that has a balance of more than 0.0 ETH based on a phrase or mnemonic.

Note : <br>
Use at your own risk. I am not responsive to what you're doing. For educational purposes.

<h1>Tutorial</h1>

First, you need to clone this repo (you also need to have NodeJS v.16++ on your computer) :
```
git clone https://github.com/dante4rt/evm-bruteforce.git
```

After that, go to the folder :
```
cd evm-bruteforce
```

Don't forget to install the dependencies : 
```
npm install
```

Then, copy the .env :
```
cp .env.example .env
```

Fill the .env with your Etherscan API (you can get that here: https://etherscan.io/myapikey), for example :
```
ETHERSCAN_KEY=YOUR_API_KEY
```

Finally, you can run it :
```
node index.js
```

Or you can use V2, with different dictionaries :
```
node indexV2.js
```
