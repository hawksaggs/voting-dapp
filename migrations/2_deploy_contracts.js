var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
    deployer.deploy(Voting, ['Rama', 'Nick', 'Jose', 'Ayush', 'Charlie'].map(o => web3.utils.asciiToHex(o)), {gas: 6700000});
}