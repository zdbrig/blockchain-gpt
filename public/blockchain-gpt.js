function connectToMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install MetaMask to use this feature');
      return null;
    }
  
    // Check if the wallet is already connected
    if (window.ethereum.selectedAddress !== null) {
        console.log('You are already connected to MetaMask');
      return Promise.resolve(window.ethereum.selectedAddress);
    }
  
    // Request permission to access the user's accounts
    return window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(function (accounts) {
        // Save the selected account address to local storage
        localStorage.setItem('publicKey', accounts[0]);
        return accounts[0];
      })
      .catch(function (error) {
        // Handle error gracefully
        alert('Failed to connect to MetaMask: ' + error.message);
        return null;
      });
  }


  async function getCryptoCurrencyPrice(cryptoName, date) {
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
  
  async function getCurrentCryptoCurrencyPrice(cryptoName) {
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