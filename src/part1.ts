// eslint-disable-next-line
require("dotenv").config();

// eslint-disable-next-line
require('log-timestamp');

import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { TOKENS } from "./constants";
import { makeProtectionRemoveAllLiquidity } from "./engines/Bancor";
import { makeTransferAllERC20 } from "./engines/ERC20";
import { makeCheckBancorLockedBalanceCount } from "./engines/FlashbotsCheckAndSend";
import { getAccounts, ask, keepRetryingBundleUntilSuccess } from "./utils";

const { compromised, briber, auth, provider } = getAccounts();

const PROTECTION_ID = 14784;
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

  const transferVBNTToCompromisedTx = await makeTransferAllERC20(
    briber,
    compromised.address,
    TOKENS.VBNT.address
  );
  const removeLiquidityTx = await makeProtectionRemoveAllLiquidity(
    compromised,
    PROTECTION_ID
  );
  const checklockBalanceCountTx = await makeCheckBancorLockedBalanceCount(
    briber,
    BRIBE_AMOUNT,
    compromised.address,
    1
  );

  const bundleTx = [
    transferVBNTToCompromisedTx,
    removeLiquidityTx,
    checklockBalanceCountTx,
  ];

  await keepRetryingBundleUntilSuccess(provider, flashbotProvider, bundleTx);

  console.log("Try part 2 in 24 hours")
};

main()
  .then((x) => console.log("success!"))
  .catch((err) => console.log("err", err.toString()));
