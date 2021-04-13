import { ethers } from "ethers";
import { CONTRACTS, TOKENS } from "./Constants";
import {
  ERC20,
  MasterChef,
  StakingRewards,
  FlashbotsCheckAndSend,
  IUniswapV2Router02,
  IWETH,
} from "../typechain";

import ERC20Abi from "../abi/ERC20";
import IWETHAbi from "../abi/IWETH";
import MasterChefAbi from "../abi/MasterChef";
import StakingRewardsAbi from "../abi/StakingRewards";
import IUniswapRouter02Abi from "../abi/IUniswapRouter02";
import FlashbotsCheckAndSendABI from "../abi/FlashbotsCheckAndSend";

export const ERC20Contract = new ethers.Contract(
  ethers.constants.AddressZero,
  ERC20Abi
) as ERC20;

export const WETHContract = new ethers.Contract(
  TOKENS.WETH.address,
  IWETHAbi
) as IWETH;

export const MasterChefContract = new ethers.Contract(
  ethers.constants.AddressZero,
  MasterChefAbi
) as MasterChef;

export const StakingRewardsContract = new ethers.Contract(
  ethers.constants.AddressZero,
  StakingRewardsAbi
) as StakingRewards;

export const UniV2RouterContract = new ethers.Contract(
  CONTRACTS.UniswapV2.Router,
  IUniswapRouter02Abi
) as IUniswapV2Router02;

export const SushiRouterContract = new ethers.Contract(
  CONTRACTS.Sushiswap.Router,
  IUniswapRouter02Abi
) as IUniswapV2Router02;

export const FlashbotsCheckAndSendContract = new ethers.Contract(
  CONTRACTS.Flashbots.CheckAndSend,
  FlashbotsCheckAndSendABI
) as FlashbotsCheckAndSend;
