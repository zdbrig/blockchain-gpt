export const _getCryptoCurrencyQuote= async (
    cryptoName: string,
    quote:string,
    date?: string
  ): Promise<number> => {
    cryptoName = cryptoName.toLowerCase();
    if (!date) {
      const now = new Date();
      date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-");
    } else {
      date = date.replace(/\//g, "-");
    }
  
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}/history?date=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
  
    if (data.error) {
      throw new Error(data.error);
    }

    let result;
    switch (quote) {
      case 'price':
        result= data.market_data.current_price.usd;
      break;
      
      case 'marketCap':
        return data.market_data.market_cap.usd;
      break;

      case 'volume':
       result= data.market_data.total_volume.usd;
        break;
    }
    return result;
   
  };
