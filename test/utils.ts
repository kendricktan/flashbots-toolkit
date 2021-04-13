import { ethers } from "hardhat";
import { ethers as ogEthers, Signer, Wallet } from "ethers";
import { parseUnits } from "@ethersproject/units";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";

const { provider } = ethers;

export const mine = async (): Promise<void> => {
  await provider.send("evm_mine", []);
};

export const sendRawTransactions = async (txs: string[]): Promise<string[]> => {
  return Promise.all(
    txs.map((x) => provider.send("eth_sendRawTransaction", [x]))
  );
};

export const unlockAccountAndGetSigner = async (
  address: string
): Promise<Signer> => {
  await provider.send("hardhat_impersonateAccount", [address]);

  return provider.getSigner(address);
};

export const sendETH = async (address: string, amount = 0.1): Promise<void> => {
  const signer = await provider.getSigner(0);
  await signer.sendTransaction({
    to: address,
    value: parseUnits(amount.toString(), 18),
  });
};

export async function getAccounts(): Promise<{
  compromised: Wallet;
  briber: Wallet;
  auth: Wallet;
  provider: ogEthers.providers.JsonRpcProvider;
  flashbotProvider: FlashbotsBundleProvider;
}> {
  let valid = true;

  if (!process.env.RPC_URL) {
    console.error("RPC_URL missing");
    valid = false;
  }

  if (!process.env.COMPROMISED_PRIVATE_KEY) {
    console.error("COMPROMISED_PRIVATE_KEY missing");
    valid = false;
  }

  if (!process.env.BRIBER_PRIVATE_KEY) {
    console.error("BRIBER_PRIVATE_KEY missing");
    valid = false;
  }

  if (!valid) {
    throw new Error("Missing environment variables");
  }

  const provider = ethers.provider;
  const auth = ethers.Wallet.createRandom(provider);
  const flashbotProvider = await FlashbotsBundleProvider.create(provider, auth);

  if (process.env.BRIBER_PRIVATE_KEY && process.env.COMPROMISED_PRIVATE_KEY) {
    return {
      compromised: new ethers.Wallet(
        process.env.COMPROMISED_PRIVATE_KEY,
        provider
      ),
      briber: new ethers.Wallet(process.env.BRIBER_PRIVATE_KEY, provider),
      auth,
      provider,
      flashbotProvider,
    };
  }

  throw new Error("Shouldn't be here.... oops");
}
