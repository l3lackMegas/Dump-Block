const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider({
     // Here is your free crypto wallet, don't open issue about this shit.
     privateKeys: ['ee678a5087c3b897a79dba934467b428125e86235b3807a1f63e6c54ac8d633f'],
     providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
});
module.exports = {
     networks: {
          bsc: {
               // production
          },
          binanceTestnet: {
               provider: () => provider,
               network_id: "97",
               gas: 10000000,
               skipDryRun: true
          }
     },
     compilers: {
          solc: {
               version: "0.8.3"
          }
     }
}
