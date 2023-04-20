import React from 'react';
import CryptoPrice from './adapters/cryptoprice';
import Ethereum from './adapters/ethereum';
import ChartComponentTest from './adapters/ChartComponentTest';


const Tester: React.FC = () => {
  return (
    <div>
      <h1>Crypto Tester: </h1>
        <CryptoPrice ></CryptoPrice>
      <h1> Ethereum Wallet Tester: </h1>
      <Ethereum></Ethereum>
    
      <h1> charts: </h1>
      <ChartComponentTest></ChartComponentTest>
    </div>
  );
};

export default Tester;