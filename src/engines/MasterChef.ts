import { MasterChef } from "../typechain/MasterChef";
import MasterChefAbi from "../abi/MasterChef";
import { BigNumberish, ethers, Wallet } from "ethers";
import { FlashbotsBundleTransaction } from "@flashbots/ethers-provider-bundle";

export const MasterChefContract = new ethers.Contract(
  ethers.constants.AddressZero,
  MasterChefAbi
) as MasterChef;

export const makeMasterChefWithdrawAll = async (
  sender: Wallet,
  masterchefAddress: string,
  poolId: BigNumberish
): Promise<FlashbotsBundleTransaction> => {
  const masterchef = MasterChefContract.attach(masterchefAddress).connect(
    sender.provider
  );

  const { amount } = await masterchef.userInfo(poolId, sender.address);

  const rawTx = MasterChefContract.attach(
    masterchefAddress
  ).populateTransaction.withdraw(poolId, amount);

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 500000,
    },
    signer: sender,
  };
};
