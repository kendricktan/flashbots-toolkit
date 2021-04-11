import { ERC20 } from "../typechain/ERC20";
import ERC20Abi from "../abi/ERC20";
import { BigNumber, ethers, Wallet } from "ethers";
import { FlashbotsBundleTransaction } from "@flashbots/ethers-provider-bundle";

export const ERC20Contract = new ethers.Contract(
  ethers.constants.AddressZero,
  ERC20Abi
) as ERC20;

export const makeTransferAllERC20 = async (
  sender: Wallet,
  recipient: string,
  erc20Address: string
): Promise<FlashbotsBundleTransaction> => {
  const token = await ERC20Contract.attach(erc20Address).connect(sender);
  const balance = await token.balanceOf(sender.address);

  if (balance.eq(ethers.BigNumber.from(0))) {
    throw new Error(
      `Error: ${sender.address} does not have any tokens to call \`makeTransferAllERC20\` on ERC20 ${erc20Address}`
    );
  }

  const rawTx = await token.populateTransaction.transfer(recipient, balance);

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 400000,
    },
    signer: sender,
  };
};

export const makeTransferAllERC20Amount = async (
  sender: Wallet,
  recipient: string,
  erc20Address: string,
  amount: BigNumber
): Promise<FlashbotsBundleTransaction> => {
  const token = await ERC20Contract.attach(erc20Address);
  const rawTx = await token.populateTransaction.transfer(recipient, amount);

  return {
    transaction: {
      ...rawTx,
      gasPrice: 0,
      gasLimit: 400000,
    },
    signer: sender,
  };
};

