import React, { useState } from "react";
import { _getCryptoCurrencyQuote } from "./market";

const CryptoPrice: React.FC = () => {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [volume, setVolume] = useState<number | undefined>(undefined);
  const [marketCap, setMarketCap] = useState<number | undefined>(undefined);

  const handleClick = async (quote:any) => {

    switch (quote) {
      case 'price':
        try {
          const price = await _getCryptoCurrencyQuote("bitcoin" , "price");
          setPrice(price);
        } catch (error) {
          console.error(error);
        }
      break;
      case 'volume':
        try {
          const volume = await _getCryptoCurrencyQuote("bitcoin",'volume');
          setVolume(volume);
        } catch (error) {
          console.error(error);
        }
      break;
      case 'marketCap':
        try {
          const marketCap = await _getCryptoCurrencyQuote("bitcoin","marketCap");
          setMarketCap(marketCap);
        } catch (error) {
          console.error(error);
        }
      break;
      
      default:
        break;
    }
    
  };

  return (
    <div>
      <button onClick={(e:any)=>handleClick('price')}>Get Bitcoin Price</button>
      <div>{price ? `$${price.toFixed(2)}` : "Click the button to get the price"}</div>

      <button onClick={(e:any)=>handleClick('volume')}>Get Bitcoin Total Volume</button>
      <div>{volume ? `$${volume.toFixed(2)}` : "Click the button to get the volume"}</div>

      <button onClick={(e:any)=>handleClick('marketCap')}>Get Bitcoin MarketCap</button>
      <div>{marketCap ? `$${marketCap.toFixed(2)}` : "Click the button to get the market cap"}</div>
    </div>
  );
};

export default CryptoPrice;
