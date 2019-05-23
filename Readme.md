Guide to Project Setup:

Make sure you have `nodejs` and `ganache` installed.
Goto project folder and type `npm install`
Open `ganache` and check for port is it `8545` or `7545` and change in `truffle-config.js` accordingly
Type `truffle compile`, if its throws error run `npm i -g truffle`
Type `truffle migrate`
Type `npm run dev`, it will open a browser make sure metamask is not enabled in browser otherwise networked mismatched
 error will be thrown.
