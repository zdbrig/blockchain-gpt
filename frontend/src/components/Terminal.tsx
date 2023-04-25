import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Terminal.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Version } from "@solana/web3.js";

import ChainId, { Token  } from "@uniswap/sdk-core";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import  SwapRouterABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';

const request = require("superagent");
const {ethers} = require ('ethers')
interface Output {
  command: string;
}
const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<Output[]>([]);
  const [remainingRequests, setRemainingRequests] = useState(2); // Define the remainingRequests variable
  const [solanaNetwork, setSolanaNetwork] = useState<string>(
    "https://api.mainnet-beta.solana.com"
  );
  const [connection, setConnection] = useState<any>(
    new window.solanaWeb3.Connection(solanaNetwork)
  ); 
  const [solanaWallet, setSolanaWallet]: any = useState(undefined);
  const [rpcUrlInitial, setRpcUrlInitial] = useState<string>("https://test.novafi.xyz/blockchainnode2");

  // Set the value of `isUserPaid` based on some condition
  const isUserPaid = true; // Example value, replace with your own logic
  type UserType = "free" | "paid";

  const MAX_REQUESTS_FREE_USER = 2;
  const MAX_REQUESTS_PAID_USER = 10;

  let userRequestCount: Map<string, number> = new Map();

  const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Example router address for Ethereum Mainnet

  const getData = (input: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      request
        .post("/gpt-test")
        .send({ command: input })
        .set("Accept", "application/json")
        .set("Access-Control-Allow-Origin", "*")
        .end((err: any, res: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  };
  
  const _getCryptoCurrencyPrice = async (
    cryptoName: string,
    date?: string
  ): Promise<number> => {
    cryptoName = cryptoName.toLowerCase();
    if (!date) {
      date = new Date().toISOString().slice(0, 10);
    }

    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}/history?date=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.market_data.current_price.usd;
  };

  const _getCurrentCryptoCurrencyPrice = async (
    cryptoName: string
  ): Promise<number> => {
    cryptoName = cryptoName.toLowerCase();
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.market_data.current_price.usd;
  };

  //ethereum functions
   const _connectToMetaMask = async (): Promise<string | null> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }
  
    // Check if the wallet is already connected
    if (window.ethereum.selectedAddress !== null) {
      console.log("You are already connected to MetaMask");
      return window.ethereum.selectedAddress;
    }
  
    try {
      // Request permission to access the user's accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // Save the selected account address to local storage
      localStorage.setItem("publicKey", accounts[0]);
      return accounts[0];
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to connect to MetaMask: " + error.message);
      return null;
    }
  };
  
   const _disconnectFromMetaMask = async (): Promise<void> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      // return null;
    }
  
    // Check if the wallet is already disconnected
    if (!window.ethereum.selectedAddress) {
      console.log("You are already disconnected from MetaMask");
      // return null;
    }
  
    try {
      // Disconnect from MetaMask
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      localStorage.removeItem("publicKey");
      console.log("You have successfully disconnected from MetaMask");
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to disconnect from MetaMask: " + error.message);
      // return null;
    }
  };
  
   const _getPublicKey = async (): Promise<void | null | string> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }
  
    try {
      // Retrieve the public key from MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error: any) {
      // Handle error gracefully
      console.log(
        "Failed to retrieve public key from MetaMask: " + error.message
      );
      return null;
    }
  };
  
   const _getNetworkInfo = async (): Promise<null | {
    chainId: string;
    networkId: number;
    networkName: string;
  }> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }
  
    try {
      // Retrieve the network information from MetaMask
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
  
      let networkName;
      switch (chainId) {
        case "0x1":
          networkName = "Mainnet";
          break;
        case "0x3":
          networkName = "Ropsten Testnet";
          break;
        case "0x4":
          networkName = "Rinkeby Testnet";
          break;
        case "0x5":
          networkName = "Goerli Testnet";
          break;
        case "0x2a":
          networkName = "Kovan Testnet";
          break;
        default:
          networkName = "Unknown Network";
      }
  
      return {
        chainId: chainId,
        networkId: networkId,
        networkName: networkName,
      };
    } catch (error: any) {
      // Handle error gracefully
      console.log(
        "Failed to retrieve network information from MetaMask: " + error.message
      );
      return null;
    }
  };
  
   const _getBalance = async (
    address: any,
    type = "ether"
  ): Promise<null | number> => {
    const ERC20 = window.ERC20;
  
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }
  
    try {
      let balance;
      if (type === "ether") {
        // Retrieve the balance in ether
        balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address],
        });
  
        balance = window.Web3.utils.fromWei(balance, "ether");
      } else {
        // Retrieve the balance of a specific token
        const web3 = new window.Web3(window.web3.currentProvider);
  
        const contract = new web3.eth.Contract(ERC20.abi, type);
  
        balance = await contract.methods.balanceOf(address).call();
        balance = window.Web3.utils.fromWei(balance, "ether");
      }
      return balance;
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to retrieve balance: " + error.message);
      return null;
    }
  };
   const _deployNewToken = async (
    name: any,
    symbol: any,
    supply: any
  ): Promise<null | string> => {
    const ERC20 = window.ERC20;
  
    if (window.ethereum) {
      // Check if the wallet is connected
      if (!window.ethereum.selectedAddress) {
        console.log("You are not connected to MetaMask");
        return null;
      } else {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
              
          const bytecode =ERC20.bytecode; // Replace with the bytecode of your contract
          // const abi = ERC20.abi; // Replace with the ABI of your contract
  
          const abi = [
            ...ERC20.abi,
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "mint",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
        
          const factory = new ethers.ContractFactory(abi, bytecode, signer);
          const contract = await factory.deploy(name, symbol);
        
          await contract.deployed();
  
      //     const recipient =_getPublicKey();
  
      //     const tx = await contract.connect(signer).mint(recipient, supply);
      //     console.log(`Transaction hash: ${tx.hash}`);
      // console.log(`New tokens minted for ${recipient}: ${supply}`);
  
          console.log(`Contract deployed at address: ${contract.address}`);
      
          return contract.address;
        } catch (error: any) {
          // Handle error gracefully
          console.log("Failed to deploy new token: " + error.message);
          return null;
        }
      }
    } else {
      // Check if MetaMask is installed
      console.log("Please install MetaMask to use this feature");
      return null;
    }
  };
  
 const _swapTokens = async (
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
    amountIn = BigNumber.from(amountIn)
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


  //solana functions
  const _connectToPhantomWallet = async (): Promise<null | PhantomWalletAdapter> => {

    //@ts-ignore
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return null;
    }
    let wallet = new PhantomWalletAdapter(provider);

    if (!wallet) {
      handleOutput("Please install Phantom Wallet to use this feature")
      console.log("Please install Phantom Wallet to use this feature");
      return null;
    }

    if (wallet.connected) {
      handleOutput("You are already connected to Phantom Wallet")
      console.log("You are already connected to Phantom Wallet");
      return wallet;
    }

    try {
      await wallet.connect();
      if (!wallet.publicKey) {
        console.log("No Connected Account");
        handleOutput("Failed to connect to Phantom Wallet")
        return null;
      }
      localStorage.setItem("solanaPublicKey", wallet.publicKey.toBase58());
      setSolanaWallet(wallet)
      handleOutput("You are now connected " + wallet.publicKey.toBase58())
      return wallet;
    } catch (error: any) {
      console.log("Failed to connect to Phantom Wallet: " + error.message);
      handleOutput("Failed to connect to Phantom Wallet: " + error.message);
      return null;
    }

  };

  const _disconnectFromPhantomWallet = async (): Promise<null | string> => {

    if (!solanaWallet || !solanaWallet.connected || !solanaWallet.publicKey) {
      console.log("This Phantom Wallet is not connected");
      handleOutput("This Phantom Wallet is not connected, please connect first")
      return null;
    }

    try {
      await solanaWallet.disconnect();
      localStorage.removeItem("solanaPublicKey");
      console.log("You have successfully disconnected from Phantom Wallet");
      handleOutput("You have successfully disconnected from Phantom Wallet")
      return "success"
    } catch (error: any) {
      console.log("Failed to disconnect from Phantom Wallet: " + error.message);
      handleOutput("Failed to disconnect from Phantom Wallet: " + error.message)
      return null;
    }
  };

  const _getSolanaPublicKey = async (): Promise<null | string> => {

    if (!solanaWallet || !solanaWallet.connected || !solanaWallet.publicKey) {
      handleOutput("You are not connected to Phantom Wallet");
      return null;
    }

    try {
      handleOutput(solanaWallet.publicKey.toBase58())
      return solanaWallet.publicKey.toBase58();
    } catch (error: any) {
      handleOutput(
        "Failed to retrieve public key from Phantom Wallet: " + error.message
      );
      return null;
    }
  };

  const _getSolanaNetworkInfo = async (rpcUrl:string): Promise<string | null> => {
    try {
      if(!rpcUrl) rpcUrl = rpcUrlInitial
      let connection = new Connection(rpcUrl)
      let version: Version = await connection.getVersion()
      const epochInfo = await connection.getEpochInfo();
      let endpoint = connection.rpcEndpoint
      const networkInfo = {
        endpoint: endpoint,
        solanaCore: version["solana-core"],
        featureSet: version["feature-set"],
        epoch: epochInfo.epoch
      };
      handleOutput(JSON.stringify(networkInfo))
      return JSON.stringify(networkInfo);
    }
    catch (error: any) {
      handleOutput("Error while connection to this RPC URL " + error.message)
      return "Error while connection to this RPC URL " + error.message;
    }
  };

 

  const _getSolanaBalance = async (address:string): Promise<null | number> => {
    try {
      let connection = new Connection(rpcUrlInitial)
      const publicKey = address?new PublicKey(address):solanaWallet.publicKey;
      const balance = await connection.getBalance(publicKey);
      if(!balance || typeof balance != 'number')
      return null
      const lamportsToSol = balance / 1e9;
      handleOutput("Your balance is " + lamportsToSol)
      return lamportsToSol;
    } catch (error: any) {
      return null;
    }
  };
  
  type CommandWriter = (message?: any, ...optionalParams: any[]) => void;

  const processServerResponse = async (
    data: string,
    commandWriter: CommandWriter
  ): Promise<string> => {
    const codeRegex: RegExp = /```(?:javascript)?\s*([\s\S]*?)\s*```/g;
    const codeMatch: RegExpExecArray | null = codeRegex.exec(data);

    if (codeMatch) {
      const scriptContent: string = codeMatch[1].trim();
      const wrappedScript: string = `(async () => { ${scriptContent} })();`;

      try {
        let capturedOutput: any;
        const originalConsoleLog: Console["log"] = console.log;
        console.log = commandWriter;
        const result: any = await eval(wrappedScript);
        return capturedOutput;
      } catch (error: any) {
        return `Error: ${error.message} \n script ${scriptContent}`;
      }
    } else {
      commandWriter("This input does not require any specific action.")
      return `${data}\n`;
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleInputSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    handleOutput(input);
    let remainingResult = await remaining() ;
    if (input.trim().toLowerCase() === "clear") {
      setOutput([]);
      setInput("");
    } else {
      if(remainingResult < 3){
        try {
          let result;  
         
          setTimeout(async() => {
          handleOutput(`Execution in progress ...\n Remaining requests: ${remainingResult}`);
          if (remainingResult > 0){
            const res = await getData(input);
            result = await processServerResponse(res.text, handleOutput);
            setInput("");
            setRemainingRequests(remainingResult-1);
          }else{
            handleOutput(`Error: Maximum request limit reached !! Please upgrade to a paid account to continue using this feature.`);
          }
          }, 2000);
          
        } catch (error: any) {
          handleOutput(`Error: ${error.message}\n`);
        }
      }
      
    
    }
  };
 
  
  const remaining = async () =>{
     // Get the user type based on whether the user has paid or not
     const userType = isUserPaid ? "free" : "paid";
     // Get the current request count for the user
     let requestCount = 0;
  
     // Calculate the remaining request count for the user
    
    if(userType === "free"){
      setRemainingRequests(MAX_REQUESTS_FREE_USER - requestCount) ;
    }else{
      setRemainingRequests(MAX_REQUESTS_PAID_USER - requestCount);
    }

     if (remainingRequests <= 0) {
       handleOutput(`Error: Maximum request limit reached ! \n`);
       return remainingRequests;
     } else {
      requestCount++;
      return remainingRequests;
         
  }
}
  const handleOutput = (new_output: string): void => {
    setOutput([...output, { command: new_output }]);
  };
 


  
  const _getStatics = async (
    coinName: string  ,
     vsCurrency: string , 
    days: number 
  ): Promise<string> => {

    const interfaceUrl = `/statics?coinName=${coinName}&vsCurrency=${vsCurrency}&days=${days}`;
    window.open(interfaceUrl, '_blank');
    return 'you will find your request on the statics page '

   
  };

  return (
    <div className="terminal">
      <div className="terminal-output" style={{ whiteSpace: "pre-wrap" , wordWrap: "break-word" }}>
        {output.map((line, index) => (
          <div key={index}>
            <span className="terminal-prompt">$</span> {line.command}
          </div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit}>
        <div className="terminal-input-container">
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            className="terminal-input"
            value={input}
            onChange={handleInputChange}
            disabled={remainingRequests > 2}
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;
function setInputDisabled(arg0: boolean) {
  throw new Error("Function not implemented.");
}

