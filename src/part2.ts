// eslint-disable-next-line
require("dotenv").config();

// eslint-disable-next-line
require('log-timestamp');

import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { TOKENS } from "./constants";
import { makeProtectionClaimBalance } from "./engines/Bancor";
import { ERC20Contract, makeTransferAllERC20 } from "./engines/ERC20";
import {
  makeCheckBancorLockedBalanceCount,
  makeCheckERC20BalanceAndBribe,
} from "./engines/FlashbotsCheckAndSend";
import { getAccounts, ask, keepRetryingBundleUntilSuccess } from "./utils";

const { compromised, briber, auth, provider } = getAccounts();

const BNT = ERC20Contract.connect(provider).attach(TOKENS.BNT.address);

const BNT_CLAIMABLE_AMOUNT = ethers.BigNumber.from("5089054278434251121706");
const BRIBE_AMOUNT = parseUnits("0.3");

const main = async () => {
  console.log("==================");
  console.log(
    `Compromised account (provided liquidity on Bancor): ${compromised.address}`
  );
  console.log(`Bribing account (has ETH + vBNT): ${briber.address}`);
  console.log(`Provider URL: ${provider.connection.url}`);
  console.log("==================");

  console.log(
    `Using ${formatUnits(BRIBE_AMOUNT)} ETH from ${
      briber.address
    } to bribe miners`
  );
  let confirmProceed = await ask("Continue? (y/n): ");
  while (
    confirmProceed === "" ||
    (confirmProceed !== "y" && confirmProceed !== "n")
  ) {
    confirmProceed = await ask("Continue? (y/n): ");
  }

  const flashbotProvider = await FlashbotsBundleProvider.create(provider, auth);

  const existingBalance = await BNT.balanceOf(briber.address);
  const expectedBalance = existingBalance.add(BNT_CLAIMABLE_AMOUNT);

  const claimBalanceTx = await makeProtectionClaimBalance(compromised, 0, 1);
  const transferBNTTx = await makeTransferAllERC20(
    compromised,
    briber.address,
    TOKENS.BNT.address
  );
  const checkERC20BalanceAndBribe = await makeCheckERC20BalanceAndBribe(
    briber,
    BRIBE_AMOUNT,
    BNT.address,
    briber.address,
    expectedBalance
  );

  const bundleTx = [claimBalanceTx, transferBNTTx, checkERC20BalanceAndBribe];

  await keepRetryingBundleUntilSuccess(provider, flashbotProvider, bundleTx);
};

main()
  .then((x) => console.log("success!"))
  .catch((err) => console.log("err", err.toString()));
