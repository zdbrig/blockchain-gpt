import React, { useRef, useState } from "react";
import {_isConnectedToMetamask, _connectToMetaMask, _disconnectFromMetaMask , _getPublicKey , _getNetworkInfo , _getBalance , _deployNewToken } from "./ethereum_fn";

const Ethereum: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null >(null);
  const [network, setNetwork] = useState<{ chainId: string; networkId: number; networkName: string; } | null>(null);
  const [connected , setConnected] = useState<boolean|undefined>(undefined);

  const [token, setToken] = useState('');

  const handleChange = async (event:any) => {
    setToken(event.target.value);
  }

  const handleClick = async (fn :any) => {
   switch (fn) {
    case 'connect':
        try{
           let result= await _connectToMetaMask();
           if(result != null){
            setConnected(true)
           }else{
            setConnected(false)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'disconnect':
        try{
           let result= await _disconnectFromMetaMask();
           if (localStorage.getItem('publicKey')){
            setConnected(false)
           }else{
            setConnected(true)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'key':
        try{
           let result= await  _getPublicKey();
           if(typeof(result) == 'string'){
            setPublicKey(result)
           }else{
            setPublicKey(undefined)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'network':
        try{
           let result= await  _getNetworkInfo();
            setNetwork(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'balance':
        try{
            
            let address = await _getPublicKey()
            let result= await  _getBalance(address);
            setBalance(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'balance_token':
        try{
            
            let address = await _getPublicKey();
            console.log(token);
            
            let result= await  _getBalance(address,token);
            setBalance(result)
        }catch(error){
            console.error(error);
        }
    break;
    default:
        break;
   }
  };

  return (
    <div>
      <button onClick={(e:any)=>handleClick('connect')}>Connect to metamask</button>
      <div>{connected ? "You are connected" : "You are not connected"}</div>

      <button onClick={(e:any)=>handleClick('disconnect')}>Disconnect from metamask</button>
      <div>{!connected ? "You are not connected" : "You are connected"}</div>

      <button onClick={(e:any)=>handleClick('key')}>Get metamask public key</button>
      <div>{publicKey ? `${publicKey}` : "Click the button to get your public key"}</div>


      <button onClick={(e:any)=>handleClick('network')}>Get network information</button>
      <div>{network ? `${JSON.stringify(network)}` : "Click the button to get network "}</div>

      <button onClick={(e:any)=>handleClick('balance')}>Get your wallet balance</button>
      <div>{balance ? `${balance}` : "Click the button to get balance "}</div>

      <button onClick={(e:any)=>handleClick('balance_token')}>Get your wallet balance by token</button>
      <input type="text" value={token} onChange={handleChange}  placeholder="token address" id="token"></input>
      <div>{balance ? `${balance}` : "Click the button to get token balance "}</div>

      
    </div>
  );
};

export default Ethereum;
