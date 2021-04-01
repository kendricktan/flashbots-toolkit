import { LiquidityProtection } from "../typechain/LiquidityProtection";
import { LiquidityProtectionStore } from "../typechain/LiquidityProtectionStore";
import LiquidityProtectionAbi from "../abi/LiquidityProtection.json";
import LiquidityProtectionStoreAbi from "../abi/LiquidityProtectionStore.json";
import { BigNumberish, ethers, Wallet } from "ethers";
import { FlashbotsBundleTransaction } from "@flashbots/ethers-provider-bundle";
import { CONTRACTS } from "../constants";

export const LiquidityProtectionContract = new ethers.Contract(
  CONTRACTS.Bancor.LiquidityProtection,
  LiquidityProtectionAbi
) as LiquidityProtection;

export const LiquidityProtectionStoreContract = new ethers.Contract(
  CONTRACTS.Bancor.LiquidityProtectionStore,
  LiquidityProtectionStoreAbi
) as LiquidityProtectionStore;

export const makeProtectionRemoveAllLiquidity = async (
  sender: Wallet,
  protectionId: BigNumberish
): Promise<FlashbotsBundleTransaction> => {
  // Remove all portion
  const portion = 1000000;

  const rawTx = await LiquidityProtectionContract.populateTransaction.removeLiquidity(
    protectionId,
    portion
  );

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 1100000,
    },
    signer: sender,
  };
};

export const makeProtectionClaimBalance = async (
  sender: Wallet,
  fromIndex: BigNumberish,
  toIndex: BigNumberish
): Promise<FlashbotsBundleTransaction> => {
  const rawTx = await LiquidityProtectionContract.populateTransaction.claimBalance(
    fromIndex,
    toIndex
  );

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 120000,
    },
    signer: sender,
  };
};
