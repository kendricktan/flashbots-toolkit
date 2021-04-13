import { FlashbotsBundleTransaction } from "@flashbots/ethers-provider-bundle";
import { BigNumberish, Wallet } from "ethers";
import { ERC20Contract, FlashbotsCheckAndSendContract } from "./Contracts";

export const makeCheckERC20BalanceAndBribe = async (
  briber: Wallet,
  bribeAmountWei: BigNumberish,
  erc20Address: string,
  accountAddress: string,
  expectedBalance: BigNumberish
): Promise<FlashbotsBundleTransaction> => {
  const target = erc20Address;
  const payload = await ERC20Contract.interface.encodeFunctionData(
    "balanceOf",
    [accountAddress]
  );
  const match = await ERC20Contract.interface.encodeFunctionResult(
    "balanceOf",
    [expectedBalance]
  );

  const rawTx = await FlashbotsCheckAndSendContract.populateTransaction.check32BytesAndSend(
    target,
    payload,
    match
  );

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 120000,
      value: bribeAmountWei,
    },
    signer: briber,
  };
};
