import { Contract } from "ethers";

const {ethers} = require ('ethers')

export const _isConnectedToMetamask = async (): Promise<boolean> => {
  if (typeof window.ethereum === "undefined") {
    console.log("Please install MetaMask to use this feature");
    return false;
  } else {
    // Check if the wallet is already connected
    if (window.ethereum.selectedAddress !== null) {
      console.log("You are already connected to MetaMask");
      return true;
    } else {
      console.log("You are not connected to MetaMask");
      return false;
    }
  }
};

export const _connectToMetaMask = async (): Promise<string | null> => {
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

export const _disconnectFromMetaMask = async (): Promise<void> => {
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

export const _getPublicKey = async (): Promise<void | null | string> => {
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

export const _getNetworkInfo = async (): Promise<null | {
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

export const _getBalance = async (
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

export const _deployNewToken = async (
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
