// eslint-disable-next-line
require("dotenv").config();

// eslint-disable-next-line
require("log-timestamp");

import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";
import { BigNumber, ethers, PopulatedTransaction, Wallet } from "ethers";
import readline from "readline";

export const ETHER = BigNumber.from(10).pow(18);
export const GWEI = BigNumber.from(10).pow(9);

export function createFlashbotsTx(
  signer: Wallet,
  tx: PopulatedTransaction
): FlashbotsBundleTransaction {
  return {
    transaction: {
      ...tx,
      gasPrice: 0,
    },
    signer,
  };
}

export async function checkSimulation(
  flashbotsProvider: FlashbotsBundleProvider,
  signedBundle: Array<string>
): Promise<BigNumber> {
  const simulationResponse = await flashbotsProvider.simulate(
    signedBundle,
    "latest"
  );

  if ("results" in simulationResponse) {
    for (let i = 0; i < simulationResponse.results.length; i++) {
      const txSimulation = simulationResponse.results[i];
      if ("error" in txSimulation) {
        throw new Error(
          `TX #${i} : ${txSimulation.error} ${txSimulation.revert}`
        );
      }
    }

    if (simulationResponse.coinbaseDiff.eq(0)) {
      throw new Error("Does not pay coinbase");
    }

    const gasUsed = simulationResponse.results.reduce(
      (acc: number, txSimulation) => acc + txSimulation.gasUsed,
      0
    );

    const gasPrice = simulationResponse.coinbaseDiff.div(gasUsed);
    return gasPrice;
  }

  console.error(
    `Similuation failed, error code: ${simulationResponse.error.code}`
  );
  console.error(simulationResponse.error.message);
  throw new Error("Failed to simulate response");
}

export async function printTransactions(
  bundleTransactions: Array<FlashbotsBundleTransaction>,
  signedBundle: Array<string>
): Promise<void> {
  console.log("--------------------------------");
  console.log(
    (
      await Promise.all(
        bundleTransactions.map(
          async (bundleTx, index) =>
            `TX #${index}: ${await bundleTx.signer.getAddress()} => ${
              bundleTx.transaction.to
            } : ${bundleTx.transaction.data}`
        )
      )
    ).join("\n")
  );

  console.log("--------------------------------");
  console.log(
    (
      await Promise.all(
        signedBundle.map(async (signedTx, index) => `TX #${index}: ${signedTx}`)
      )
    ).join("\n")
  );

  console.log("--------------------------------");
}

export function gasPriceToGwei(gasPrice: BigNumber): number {
  return gasPrice.mul(100).div(GWEI).toNumber() / 100;
}

export function getAccounts(): {
  compromised: Wallet;
  briber: Wallet;
  auth: Wallet;
  provider: ethers.providers.JsonRpcProvider;
} {
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

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

  if (process.env.BRIBER_PRIVATE_KEY && process.env.COMPROMISED_PRIVATE_KEY) {
    return {
      compromised: new ethers.Wallet(
        process.env.COMPROMISED_PRIVATE_KEY,
        provider
      ),
      briber: new ethers.Wallet(process.env.BRIBER_PRIVATE_KEY, provider),
      auth: ethers.Wallet.createRandom(provider),
      provider,
    };
  }

  throw new Error("Shouldn't be here.... oops");
}

export const ask = async (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (input) => {
      resolve(input);
      rl.close();
    });
  });
};

export const keepRetryingBundleUntilSuccess = async (
  provider: ethers.providers.JsonRpcProvider,
  flashbotsProvider: FlashbotsBundleProvider,
  bundleTransactions: FlashbotsBundleTransaction[],
  description?: string
): Promise<boolean> => {
  const BLOCKS_IN_FUTURE = 2;

  const signedBundle = await flashbotsProvider.signBundle(bundleTransactions);
  await printTransactions(bundleTransactions, signedBundle);
  const gasPrice = await checkSimulation(flashbotsProvider, signedBundle);
  console.log(`Gas Price: ${gasPriceToGwei(gasPrice)} gwei`);

  if (description) {
    console.log(description);
  }

  return new Promise((resolve) => {
    provider.on("block", async (blockNumber) => {
      const gasPrice = await checkSimulation(flashbotsProvider, signedBundle);
      const targetBlockNumber = blockNumber + BLOCKS_IN_FUTURE;
      console.log(
        `Current Block Number: ${blockNumber},   Target Block Number:${targetBlockNumber},   gasPrice: ${gasPriceToGwei(
          gasPrice
        )} gwei`
      );
      const bundleResponse = await flashbotsProvider.sendBundle(
        bundleTransactions,
        targetBlockNumber
      );
      const bundleResolution = await bundleResponse.wait();
      if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
        console.log(`Congrats, included in ${targetBlockNumber}`);
        resolve(true);
      } else if (
        bundleResolution ===
        FlashbotsBundleResolution.BlockPassedWithoutInclusion
      ) {
        console.log(`Not included in ${targetBlockNumber}`);
      } else if (
        bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh
      ) {
        console.log("Nonce too high, bailing");
        resolve(false);
      }
    });
  });
};
