const DumpBlockToken = artifacts.require("DumpBlockToken.sol");
const DumpBlockAccount = artifacts.require("DumpBlockAccount.sol");
const DumpHero = artifacts.require("DumpHero.sol");

module.exports = async function (callback) {
  dumpBlockToken = await DumpBlockToken.deployed()
  dumpBlockAccount = await DumpBlockAccount.deployed()
  dumpHero = await DumpHero.deployed()
  
  balance = await dumpBlockAccount.balanceOf(dumpBlockAccount.address)
  console.log(web3.utils.fromWei(balance.toString()))
  heroId = await dumpHero.mintHero(dumpBlockAccount.address, "https://ipfs.io/ipfs/Qmd9MCGtdVz2miNumBHDbvj8bigSgTwnr4SbyH6DNnpWdt?filename=1-PUG.json")
  console.log("heroId", heroId);
  console.log("URI Token", await gameItem.tokenURI(heroId))
  balance = await dumpBlockToken.balanceOf(dumpBlockAccount.address)
  console.log(web3.utils.fromWei(balance.toString()))
  callback()
}
