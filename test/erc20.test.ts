import { parseUnits } from "@ethersproject/units";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { expect } from "chai";
import { ethers as ogEthers, Wallet } from "ethers";
import { ethers } from "hardhat";

import { ERC20Contract, WETHContract } from "../src/common/Contracts";
import { makeCheckERC20BalanceAndBribe } from "../src/common/FlashbotsCheckAndSend";
import { createFlashbotsTx } from "../src/common/Utils";
import { getAccounts, mine, sendETH, sendRawTransactions } from "./utils";

describe("erc20", function () {
  let compromised: Wallet;
  let briber: Wallet;
  let flashbotProvider: FlashbotsBundleProvider;
  let provider: ogEthers.providers.JsonRpcProvider;

  beforeEach(async () => {
    ({ compromised, briber, flashbotProvider, provider } = await getAccounts());
  });

  describe("WETH", function () {
    const amount = parseUnits("1");

    beforeEach(async function () {
      const [fundedUser] = await ethers.getSigners();

      // Send some ETH to the briber so it can bribe
      await sendETH(briber.address, 1);

      // Clear out compromised address
      await WETHContract.connect(compromised).transfer(
        ethers.constants.AddressZero,
        await WETHContract.connect(provider).balanceOf(compromised.address),
        { gasPrice: 0 }
      );

      // Get some WETH and xfer to compromised address
      await WETHContract.connect(fundedUser).deposit({
        value: amount,
      });
      await WETHContract.connect(fundedUser).transfer(
        compromised.address,
        amount
      );
      await mine(); // force mint to update data
    });

    it("gasless tx bundle with right params", async function () {
      // Create flashbots bundle tx
      const transferTx = createFlashbotsTx(
        compromised,
        await WETHContract.populateTransaction.transfer(briber.address, amount)
      );
      const bribeTx = await makeCheckERC20BalanceAndBribe(
        briber,
        parseUnits("0.01"),
        WETHContract.address,
        briber.address,
        amount
      );
      const signedBundle = await flashbotProvider.signBundle([
        transferTx,
        bribeTx,
      ]);

      const [transferTxHash, bribeTxHash] = await sendRawTransactions(
        signedBundle
      );
      await mine();

      // Get receipt
      const bribeTxRecp = await provider.getTransactionReceipt(bribeTxHash);
      const transferTxRecp = await provider.getTransactionReceipt(
        transferTxHash
      );

      // Both should be successful
      expect(bribeTxRecp.status).to.be.eq(1);
      expect(transferTxRecp.status).to.be.eq(1);
    });

    it("gasless tx bundle with invalid params", async function () {
      // Create flashbots bundle tx
      const transferTx = createFlashbotsTx(
        compromised,
        await WETHContract.populateTransaction.transfer(briber.address, amount)
      );
      const invalidBribeTx = await makeCheckERC20BalanceAndBribe(
        briber,
        parseUnits("0.01"),
        WETHContract.address,
        briber.address,
        parseUnits('100')
      );
      const signedBundle = await flashbotProvider.signBundle([
        transferTx,
        invalidBribeTx,
      ]);

      const [transferTxHash, bribeTxHash] = await sendRawTransactions(
        signedBundle
      );
      await mine();

      // Get receipt
      const bribeTxRecp = await provider.getTransactionReceipt(bribeTxHash);
      const transferTxRecp = await provider.getTransactionReceipt(
        transferTxHash
      );

      // Transfer should be successful (just gasPrice 0, unrealistic in real world)
      // But bribe should fail as its invalid
      // But if bribe fails the whole thing should fail in prod
      expect(bribeTxRecp.status).to.be.eq(0);
      expect(transferTxRecp.status).to.be.eq(1);
    });
  });
});
