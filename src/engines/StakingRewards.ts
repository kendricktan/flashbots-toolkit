import { StakingRewards } from "../typechain/StakingRewards";
import StakingRewardsAbi from "../abi/StakingRewards";
import { ethers, Wallet } from "ethers";
import { FlashbotsBundleTransaction } from "@flashbots/ethers-provider-bundle";

export const StakingRewardsContract = new ethers.Contract(
  ethers.constants.AddressZero,
  StakingRewardsAbi
) as StakingRewards;

export const makeStakingRewardsExit = async (
  sender: Wallet,
  stakingRewardAddress: string
): Promise<FlashbotsBundleTransaction> => {
  const rawTx = StakingRewardsContract.attach(
    stakingRewardAddress
  ).populateTransaction.exit();

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 500000,
    },
    signer: sender,
  };
};
