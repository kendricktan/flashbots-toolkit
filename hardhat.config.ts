require("dotenv").config(); // eslint-disable-line
import "hardhat-typechain";
import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn moreww
const config: HardhatUserConfig = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        enabled: true,
        url: process.env.RPC_URL
          ? process.env.RPC_URL
          : "http://127.0.0.1:8545",
      },
      mining: {
        auto: false,
        interval: 15000,
      },
      blockGasLimit: 20000000,
    },
  },
  mocha: {
    timeout: 120000,
  },
};

export default config;
