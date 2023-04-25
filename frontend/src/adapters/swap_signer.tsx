import ChainId, { Token  } from "@uniswap/sdk-core";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import  SwapRouterABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';

const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Example router address for Ethereum Mainnet

const {ethers} = require ('ethers')

export const swapTokens = async (
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: BigNumber,
  account: any
) => {
  const providerUrl =
    "https://goerli.infura.io/v3/" + process.env.REACT_APP_INFURA;

  // const provider = new JsonRpcProvider(providerUrl);
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  const routerContract = new Contract(
    UNISWAP_V3_ROUTER_ADDRESS,
    SwapRouterABI.abi,
    signer
  );

  const network = await provider.getNetwork();
  const chainId = network.chainId;

  const tokenIn = new Token(chainId, tokenInAddress, 18); // Assuming 18 decimals
  const tokenOut = new Token(chainId, tokenOutAddress, 18); // Assuming 18 decimals

  // Construct the path using the token addresses and the pool's fee tier (500, 3000, or 10000)
  const poolFeeTier = 3000; // Example fee tier
  const path = `0x${tokenInAddress.slice(2)}${tokenOutAddress.slice(
    2
  )}${poolFeeTier.toString(16).padStart(6, "0")}`;

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
  const slippageTolerance = 50; // 0.5% slippage tolerance (50 bips)

  // Calculate minimum amountOut based on slippage tolerance
  const amountOutMinimum = amountIn.mul(10000 - slippageTolerance).div(10000);

  // Swap tokens
  console.log(routerContract);

  // Swap tokens
  const swapTx = await routerContract.exactInputSingle({
    tokenIn: tokenInAddress,
    tokenOut: tokenOutAddress,
    fee: poolFeeTier,
    recipient: account,
    deadline: deadline,
    amountIn: amountIn.toString(),
    amountOutMinimum: amountOutMinimum.toString(),
    sqrtPriceLimitX96: 0, // Set to 0 for no price limit
  },
  {
    gasLimit: ethers.utils.hexlify(1000000)
  });
  const receipt = await swapTx.wait();
  console.log("receipt ", receipt);
  console.log("Swap transaction hash:", swapTx.hash);
};
