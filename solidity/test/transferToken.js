const DumpBlockToken = artifacts.require("DumpBlockToken.sol");
const DumpBlockAccount = artifacts.require("DumpBlockAccount.sol");

module.exports = async function (callback) {
  const accounts = await new web3.eth.getAccounts()
  const dumpBlockToken = await DumpBlockToken.deployed()
  const dumpBlockAccount = await DumpBlockAccount.deployed()

  // Returns the remaining number of tokens that spender will be allowed to spend on behalf of owner through transferFrom.
  // This is zero by default.
  const allowanceBefore = await dumpBlockToken.allowance(
    accounts[0],
    dumpBlockAccount.address
  )
  console.log(
    "Amount of DumpBlockToken DumpBlockAccount is allowed to transfer on our behalf Before: " +
      allowanceBefore.toString()
  )

  // In order to allow the Smart Contract to transfer to DumpBlockToken (ERC-20) on the accounts[0] behalf,
  // we must explicitly allow it.
  // We allow dumpBlockAccount to transfer x amount of DumpBlockToken on our behalf
  await dumpBlockToken.approve(dumpBlockAccount.address, web3.utils.toWei("100", "ether"))

  // Validate that the dumpBlockAccount can now move x amount of DumpBlockToken on our behalf
  const allowanceAfter = await dumpBlockToken.allowance(accounts[0], dumpBlockAccount.address)
  console.log(
    "Amount of DumpBlockToken DumpBlockAccount is allowed to transfer on our behalf After: " +
      allowanceAfter.toString()
  )

  // Verify accounts[0] and dumpBlockAccount balance of DumpBlockToken before and after the transfer
  balanceDumpBlockTokenBeforeAccounts0 = await dumpBlockToken.balanceOf(accounts[0])
  balanceDumpBlockTokenBeforeDumpBlockAccount = await dumpBlockToken.balanceOf(dumpBlockAccount.address)
  console.log("*** DumpBlock Token ***")
  console.log(
    "Balance DumpBlockToken Before accounts[0] " +
      web3.utils.fromWei(balanceDumpBlockTokenBeforeAccounts0.toString())
  )
  console.log(
    "Balance DumpBlockToken Before DumpBlockAccount " +
      web3.utils.fromWei(balanceDumpBlockTokenBeforeDumpBlockAccount.toString())
  )

  console.log("*** DumpBlock Account ***")
  balanceDumpBlockAccountBeforeAccounts0 = await dumpBlockAccount.balanceOf(accounts[0])
  balanceDumpBlockAccountBeforeDumpBlockAccount = await dumpBlockAccount.balanceOf(dumpBlockAccount.address)
  console.log(
    "Balance DumpBlockAccount Before accounts[0] " +
      web3.utils.fromWei(balanceDumpBlockAccountBeforeAccounts0.toString())
  )
  console.log(
    "Balance DumpBlockAccount Before DumpBlockAccount " +
      web3.utils.fromWei(balanceDumpBlockAccountBeforeDumpBlockAccount.toString())
  )
  // Call Deposit function from DumpBlockAccount
  console.log("Call Deposit Function")
  await dumpBlockAccount.deposit(web3.utils.toWei("1000", "ether"))
  console.log("*** DumpBlock Token ***")
  balanceDumpBlockTokenAfterAccounts0 = await dumpBlockToken.balanceOf(accounts[0])
  balanceDumpBlockTokenAfterDumpBlockAccount = await dumpBlockToken.balanceOf(dumpBlockAccount.address)
  console.log(
    "Balance DumpBlockToken After accounts[0] " +
      web3.utils.fromWei(balanceDumpBlockTokenAfterAccounts0.toString())
  )
  console.log(
    "Balance DumpBlockToken After DumpBlockAccount " +
      web3.utils.fromWei(balanceDumpBlockTokenAfterDumpBlockAccount.toString())
  )

  console.log("*** DumpBlock Account ***")
  balanceDumpBlockAccountAfterAccounts0 = await dumpBlockAccount.balanceOf(accounts[0])
  balanceDumpBlockAccountAfterDumpBlockAccount = await dumpBlockAccount.balanceOf(dumpBlockAccount.address)
  console.log(
    "Balance DumpBlockAccount After accounts[0] " +
      web3.utils.fromWei(balanceDumpBlockAccountAfterAccounts0.toString())
  )
  console.log(
    "Balance DumpBlockAccount After DumpBlockAccount " +
      web3.utils.fromWei(balanceDumpBlockAccountAfterDumpBlockAccount.toString())
  )

  // End function
  callback()
}
