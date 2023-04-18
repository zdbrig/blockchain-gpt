import React from 'react';
import CryptoPrice from './adapters/cryptoprice';
import Ethereum from './adapters/ethereum';


const Tester: React.FC = () => {
  return (
    <div>
      <h1>Crypto Tester: </h1>
        <CryptoPrice ></CryptoPrice>
      <h1> Ethereum Wallet Tester: </h1>
      <Ethereum></Ethereum>
    </div>
  );
};

export default Tester;