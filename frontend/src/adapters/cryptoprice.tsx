import React, { useState } from "react";
import { _getCryptoCurrencyPrice } from "./market";

const CryptoPrice: React.FC = () => {
  const [price, setPrice] = useState<number | undefined>(undefined);

  const handleClick = async () => {
    try {
      const price = await _getCryptoCurrencyPrice("bitcoin");
      setPrice(price);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Get Bitcoin Price</button>
      <div>{price ? `$${price.toFixed(2)}` : "Click the button to get the price"}</div>
    </div>
  );
};

export default CryptoPrice;
