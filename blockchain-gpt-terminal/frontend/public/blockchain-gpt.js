async function _connectToMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is already connected
    if (window.ethereum.selectedAddress !== null) {
      console.log('You are already connected to MetaMask');
      return window.ethereum.selectedAddress;
    }
  
    try {
      // Request permission to access the user's accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Save the selected account address to local storage
      localStorage.setItem('publicKey', accounts[0]);
      return accounts[0];
    } catch (error) {
      // Handle error gracefully
      console.log('Failed to connect to MetaMask: ' + error.message);
      return null;
    }
  }

  async function _disconnectFromMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is already disconnected
    if (!window.ethereum.selectedAddress) {
      console.log('You are already disconnected from MetaMask');
      return null;
    }
  
    try {
      // Disconnect from MetaMask
      await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      localStorage.removeItem('publicKey');
      console.log('You have successfully disconnected from MetaMask');
    } catch (error) {
      // Handle error gracefully
      console.log('Failed to disconnect from MetaMask: ' + error.message);
      return null;
    }
  }
  

  // Get public key from MetaMask
async function _getPublicKey() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log('You are not connected to MetaMask');
      return null;
    }
  
    try {
      // Retrieve the public key from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      // Handle error gracefully
      console.log('Failed to retrieve public key from MetaMask: ' + error.message);
      return null;
    }
  }
  
  // Get network information from MetaMask
  async function _getNetworkInfo() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log('You are not connected to MetaMask');
      return null;
    }
  
    try {
      // Retrieve the network information from MetaMask
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkId = await window.ethereum.request({ method: 'net_version' });
  
      let networkName;
      switch (chainId) {
        case '0x1':
          networkName = 'Mainnet';
          break;
        case '0x3':
          networkName = 'Ropsten Testnet';
          break;
        case '0x4':
          networkName = 'Rinkeby Testnet';
          break;
        case '0x5':
          networkName = 'Goerli Testnet';
          break;
        case '0x2a':
          networkName = 'Kovan Testnet';
          break;
        default:
          networkName = 'Unknown Network';
      }
  
      return {
        chainId: chainId,
        networkId: networkId,
        networkName: networkName
      };
    } catch (error) {
      // Handle error gracefully
      console.log('Failed to retrieve network information from MetaMask: ' + error.message);
      return null;
    }
  }
  
  async function _getBalance(address, type = 'ether') {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log('You are not connected to MetaMask');
      return null;
    }
  
    try {
      let balance;
  
      if (type === 'ether') {
        // Retrieve the balance in ether
        balance = await window.ethereum.request({ method: 'eth_getBalance', params: [address] });
        balance = Web3.utils.fromWei(balance, 'ether');
      } else {
        // Retrieve the balance of a specific token
        const contract = new Web3.eth.Contract(ERC20_ABI, type);
        balance = await contract.methods.balanceOf(address).call();
        balance = Web3.utils.fromWei(balance, 'ether');
      }
  
      return balance;
    } catch (error) {
      // Handle error gracefully
      console.log('Failed to retrieve balance: ' + error.message);
      return null;
    }
  }
  

  async function _deployNewToken(supply, name) {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log('You are not connected to MetaMask');
      return null;
    }
  
    try {
      // Get the account address from MetaMask
      const account = await _getPublicKey();
  
      // Create the token contract instance
      const contract = new web3.eth.Contract(ERC20_ABI);
  
      // Build the contract data
      const bytecode = ERC20_BYTECODE;
      const abi = ERC20_ABI;
      const contractData = contract.deploy({
        data: bytecode,
        arguments: [supply, name]
      }).encodeABI();
  
      // Get the gas price and estimate the transaction gas limit
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await contract.deploy({
        data: bytecode,
        arguments: [supply, name]
      }).estimateGas({ from: account });
  
      // Create the transaction object
      const transaction = {
        from: account,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: contractData
      };
  
      // Sign and send the transaction
      const signedTransaction = await window.ethereum.request({ method: 'eth_signTransaction', params: [transaction] });
      const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
      // Get the deployed contract address
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);
      const contractAddress = receipt.contractAddress;
  
      return contractAddress;
    } catch (error) {
      // Handle error gracefully
      console.log('Failed to deploy new token: ' + error.message);
      return null;
    }
  }
  


  async function _getCryptoCurrencyPrice(cryptoName, date) {
     cryptoName = cryptoName.toLowerCase();
    // If no date is specified, use today's date
    if (!date) {
      date = new Date().toISOString().slice(0, 10);
    }
  
    // Construct the API URL
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}/history?date=${date}`;
  
    // Fetch the data from the API
    const response = await fetch(apiUrl);
    const data = await response.json();
  
    // If the API returns an error, throw an error
    if (data.error) {
      throw new Error(data.error);
    }
  
    // Return the price in USD
    return data.market_data.current_price.usd;
  }
  
  async function _getCurrentCryptoCurrencyPrice(cryptoName) {
    cryptoName = cryptoName.toLowerCase();
    // Construct the API URL
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;
  
    // Fetch the data from the API
    const response = await fetch(apiUrl);
    const data = await response.json();
  
    // If the API returns an error, throw an error
    if (data.error) {
      throw new Error(data.error);
    }
  
    // Return the current price in USD
    return data.market_data.current_price.usd;
  }