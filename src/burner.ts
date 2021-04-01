// eslint-disable-next-line
require("dotenv").config();

// eslint-disable-next-line
require("log-timestamp");

import { getAccounts } from "./utils";
import { Wallet } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { gasPriceToGwei } from "./utils";

const { compromised, provider } = getAccounts();

async function burn(wallet: Wallet) {
  const balance = await wallet.getBalance();
  if (balance.isZero()) {
    console.log(` Balance is zero`);
    return;
  }

  const gasPrice = balance.div(21000).sub(1);
  if (gasPrice.lt(1e9)) {
    console.log(
      ` Balance too low to burn (balance=${formatEther(
        balance
      )} gasPrice=${gasPriceToGwei(gasPrice)})`
    );
    return;
  }

  try {
    console.log(` Burning ${formatEther(balance)}`);
    const tx = await wallet.sendTransaction({
      to: wallet.address,
      gasLimit: 21000,
      gasPrice,
    });
    console.log(
      ` Sent tx with nonce ${tx.nonce} burning ${formatEther(
        balance
      )} ETH at gas price ${gasPriceToGwei(gasPrice)} gwei: ${tx.hash}`
    );
  } catch (err) {
    console.log(` Error sending tx: ${err.message ?? err}`);
  }
}

const main = async () => {
  console.log(`Connected to ${provider.connection.url}`);
  provider.on("block", async (blockNumber) => {
    console.log(`New block ${blockNumber}`);
    await burn(compromised);
  });
};

main();
