import { FlashbotsCheckAndSend } from "../typechain/FlashbotsCheckAndSend";
import FlashbotsCheckAndSendABI from "../abi/FlashbotsCheckAndSend";
import { FlashbotsBundleTransaction } from "@flashbots/ethers-provider-bundle";
import { BigNumberish, ethers, Wallet } from "ethers";
import { ERC20Contract } from "./ERC20";
import { LiquidityProtectionStoreContract } from "./Bancor";
import { CONTRACTS } from "../constants";

export const FlashbotsCheckAndSendContract = new ethers.Contract(
  CONTRACTS.Flashbots.CheckAndSend,
  FlashbotsCheckAndSendABI
) as FlashbotsCheckAndSend;

export const makeCheckBancorLockedBalanceCount = async (
  briber: Wallet,
  bribeAmountWei: BigNumberish,
  accountAddress: string,
  expectedValue: BigNumberish
): Promise<FlashbotsBundleTransaction> => {
  const target = LiquidityProtectionStoreContract.address;
  const payload = LiquidityProtectionStoreContract.interface.encodeFunctionData(
    "lockedBalanceCount",
    [accountAddress]
  );
  const match = LiquidityProtectionStoreContract.interface.encodeFunctionResult(
    "lockedBalanceCount",
    [expectedValue]
  );

  const rawTx = await FlashbotsCheckAndSendContract.populateTransaction.check32BytesAndSend(
    target,
    payload,
    match
  );

  const tx = {
    ...rawTx,
    value: bribeAmountWei,
    gasPrice: 0,
    gasLimit: 400000,
  };

  return {
    transaction: tx,
    signer: briber,
  };
};

export const makeCheckERC20BalanceAndBribe = async (
  briber: Wallet,
  bribeAmountWei: BigNumberish,
  erc20Address: string,
  accountAddress: string,
  expectedBalance: BigNumberish
): Promise<FlashbotsBundleTransaction> => {
  const target = erc20Address;
  const payload = ERC20Contract.interface.encodeFunctionData("balanceOf", [
    accountAddress,
  ]);
  const match = ERC20Contract.interface.encodeFunctionResult("balanceOf", [
    expectedBalance,
  ]);

  const rawTx = await FlashbotsCheckAndSendContract.populateTransaction.check32BytesAndSend(
    target,
    payload,
    match
  );

  const tx = {
    ...rawTx,
    value: bribeAmountWei,
    gasPrice: 0,
    gasLimit: 400000,
  };

  return {
    transaction: tx,
    signer: briber,
  };
};
