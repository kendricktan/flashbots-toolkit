// eslint-disable-next-line
require("dotenv").config();

// eslint-disable-next-line
require("log-timestamp");

import { getAccounts } from "./utils";
import { Wallet } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ask, gasPriceToGwei } from "./utils";

const { compromised, provider } = getAccounts();

async function burn(wallet: Wallet) {
  const balance = await wallet.getBalance();
  const blockNumber = await wallet.provider.getBlockNumber();

  if (balance.isZero()) {
    console.log(`${blockNumber} - Balance is zero`);
    return;
  }

  const gasPrice = balance.div(21000).sub(1);
  if (gasPrice.lt(1e9)) {
    console.log(
      `${blockNumber} - Balance too low to burn (balance=${formatEther(
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
      `${blockNumber} - Sent tx with nonce ${tx.nonce} burning ${formatEther(
        balance
      )} ETH at gas price ${gasPriceToGwei(gasPrice)} gwei: ${tx.hash}`
    );
  } catch (err) {
    console.log(`${blockNumber} - Error sending tx: ${err.message ?? err}`);
  }
}

const main = async () => {
  console.log(`Connected to ${provider.connection.url}`);
  console.log(
    `Compromised account (provided liquidity on Bancor): ${compromised.address}`
  );
  console.log("=========");
  let confirmProceed = await ask("Continue? (y/n): ");
  while (
    confirmProceed === "" ||
    (confirmProceed !== "y" && confirmProceed !== "n")
  ) {
    confirmProceed = await ask("Continue? (y/n): ");
  }

  if (confirmProceed !== "y") {
    return;
  }

  console.log(`Starting burner for account ${compromised.address}`);
  setInterval(() => burn(compromised), 2500);
};

main();
