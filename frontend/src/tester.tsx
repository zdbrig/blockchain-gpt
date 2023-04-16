import React from 'react';
import CryptoPrice from './adapters/cryptoprice';



const Tester: React.FC = () => {
  return (
    <div>
      <h1>Sample Tester: </h1>
        <CryptoPrice ></CryptoPrice>
    </div>
  );
};

export default Tester;