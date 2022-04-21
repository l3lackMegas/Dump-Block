const DumpBlockToken = artifacts.require("DumpBlockToken.sol");
const DumpBlockAccount = artifacts.require("DumpBlockAccount.sol");

module.exports = async function (callback) {
  dumpBlockToken = await DumpBlockToken.deployed()
  dumpBlockAccount = await DumpBlockAccount.deployed()
  balance = await dumpBlockToken.balanceOf(dumpBlockAccount.address)
  console.log(web3.utils.fromWei(balance.toString()))
  callback()
}
