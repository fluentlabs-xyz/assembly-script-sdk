import '@nomicfoundation/hardhat-toolbox';

const config = {
  defaultNetwork: 'hardhat',
  networks: {
    local: {
      url: 'http://127.0.0.1:8545', // Local fluent node
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        count: 10,
      },
      chainId: 1337, // Local network chain ID
    },
  },
};

export default config;
