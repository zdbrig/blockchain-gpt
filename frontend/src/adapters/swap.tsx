import  IUniswapV3PoolABI  from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import  SwapRouterABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';


// import a from '@uniswap/v3-periphery/artifacts/contracts/interfaces/'

import   ERC20ABI  from './../ERC20ABI.json';

const {ethers} = require ('ethers')



const providerMainnet =  new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/"+process.env.REACT_APP_INFURA
  );
  const providerTestnet = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/"+process.env.REACT_APP_INFURA
  );


const wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY);
const connected_wallet = wallet.connect(providerTestnet);


const provider = providerTestnet // georli
//uni link  0x4Cff90F02897259E1aB69FF6bbD370EA14529bD8
const poolAddress = "0x4d1892f15B03db24b55E73F9801826a56d6f0755" // UNI/WETH
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

const name1 = 'Uniswap Token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

interface Immutables {
    factory: string
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    maxLiquidityPerTick: any
  }
  
  interface State {
    liquidity: any
    sqrtPriceX96: any
    tick: number
    observationIndex: number
    observationCardinality: number
    observationCardinalityNext: number
    feeProtocol: number
    unlocked: boolean
  }

  const poolContract= new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );
  
  async function getPoolImmutables() {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ])
  
    const immutables: Immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    }
    return immutables
  }


  
  async function getPoolState() {
    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])
  
    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    }
  
    return PoolState
  }




  

  const swapRouterContract  = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI.abi,
    provider
  )

  // async function getPoolAddress(){

  //   let a = await.swapRouterAddress.
  // }

export const _swap =async ()=> {
  console.log(swapRouterContract)

  const immutables = await getPoolImmutables()
  const state = await getPoolState()




  const inputAmount = 0.001
  // .001 => 1 000 000 000 000 000
  const amountIn:any = ethers.utils.parseUnits(
    inputAmount.toString(),
    decimals0
  )

  const approvalAmount = (amountIn * 100000).toString()
  const tokenContract0 = new ethers.Contract( address0, ERC20ABI,provider)
  const approvalResponse = await tokenContract0.connect(connected_wallet).approve(
    swapRouterAddress,
    approvalAmount
  )

  const params = {
    tokenIn: immutables.token1,
    tokenOut: immutables.token0,
    fee: immutables.fee,
    recipient: process.env.REACT_APP_WALLET,
    deadline: Math.floor(Date.now() / 1000) + (60 * 10),
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  }




  try {
    const tx =  await swapRouterContract.connect(connected_wallet).exactInputSingle(
        params,
        {
          gasLimit: ethers.utils.hexlify(1000000)
        }
      )
    const receipt = await tx.wait();
    console.log("receipt ", receipt);
  } catch (error) {
    console.log("error ", error);
  }
}

