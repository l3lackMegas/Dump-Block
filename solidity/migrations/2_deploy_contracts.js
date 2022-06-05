const DumpBlockToken = artifacts.require("DumpBlockToken");
const DumpBlockAccount = artifacts.require("DumpBlockAccount");
const DumpBlockHero = artifacts.require("DumpHero");
module.exports = function (deployer, network, accounts) {
     deployer.deploy(DumpBlockToken)
     .then(() => DumpBlockToken.deployed())
     .then(dumpBlockToken => deployer.deploy(DumpBlockAccount, dumpBlockToken.address))
     .then(dumpBlockAccount => deployer.deploy(DumpBlockHero, dumpBlockAccount.address));
};