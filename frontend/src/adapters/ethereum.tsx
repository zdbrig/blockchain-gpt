import React, { useEffect, useRef, useState } from "react";
import {_isConnectedToMetamask, _connectToMetaMask, _disconnectFromMetaMask , _getPublicKey , _getNetworkInfo , _getBalance , _deployNewToken  } from "./ethereum_fn";
import { _swap } from "./swap";

import {swapTokens} from "./swap_signer"
import { BigNumber } from "ethers";

const Ethereum: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null >(null);
  const [balanceToken, setBalanceToken] = useState<number | null >(null);
  const [network, setNetwork] = useState<{ chainId: string; networkId: number; networkName: string; } | null>(null);
  const [connected , setConnected] = useState<boolean|undefined>(undefined);
   const [newToken,setNewToken] =useState<string|null>('');

  const [token, setToken] = useState('');

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState();


  const weth='0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
  const uni='0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';



  const [balanceWeth, setBalanceWeth] = useState<number | null >(null);
  const [balanceUni, setBalanceUni] = useState<number | null >(null);


  const [balanceWethBefore, setBalanceWethBefore] = useState<number | null >(null);
  const [balanceUniBefore, setBalanceUniBefore] = useState<number | null >(null);

useEffect(() => {
    const init = async () => {
      try {
        let address = await _getPublicKey();
        let init_weth_balance=await  _getBalance(address,weth);
        setBalanceWethBefore(init_weth_balance)
        let init_uni_balance= await _getBalance(address,uni);
        setBalanceUniBefore(init_uni_balance)
      } catch (error) {
        console.error('Error getting data:', error);
      }
    };

    init();
  }, []);

  const handleChangeToken = async (event:any) => {
    setToken(event.target.value);
  }

  const handleChangeName = async (event:any) => {
    setName(event.target.value);
  }

  const handleChangeSupply = async (event:any) => {
    setSupply(event.target.value);
  }

  const handleChangeSymbol = async (event:any) => {
    setSymbol(event.target.value);
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
            let result= await  _getBalance(address,token);
            setBalanceToken(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'deploy':
        try{
            console.log(name , symbol, supply);
            
            let result= await  _deployNewToken(name,symbol,supply)

            //await result.
            setNewToken(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'swap':
        const edit_balance = async (balance1:any,balance2:any)=>{
            setBalanceWeth(balance1);
            setBalanceUni(balance2);

        }
        try{
        let address = await _getPublicKey();            
        
        let result= await  _swap();

        let balance1= await  _getBalance(address,weth);

        
        let balance2= await _getBalance(address,uni);
        
        await edit_balance(balance1,balance2);



        }catch(error){
            console.error(error);
        }
    break;

    case 'swap2':

        try{
            const tokenin = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';  //weth
            const tokenout ='0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; //uni
            const amount = BigNumber.from('1000000000000000');
            const account = await _getPublicKey()
            await swapTokens(tokenin,tokenout,amount,account);       
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
      <input type="text" value={token} onChange={handleChangeToken}  placeholder="token address" id="token"></input>
      <div>{balanceToken ? `${balanceToken}` : "Click the button to get token balance "}</div>

      <button onClick={(e:any)=>handleClick('deploy')}>Deploy new token</button>
      <input type="text" value={name} onChange={handleChangeName}  placeholder="token name" id="name"></input>
      <input type="text" value={symbol} onChange={handleChangeSymbol}  placeholder="token symbol" id="symbol"></input>
      <input  type="number"  value={supply} onChange={handleChangeSupply}  placeholder="token supply" id="supply"></input>

      <div>{newToken ? `${newToken}` : "Click the button to deploy new token "}</div>


      <button onClick={(e:any)=>handleClick('swap')}>Swap</button>
      <div>{balanceWeth ? "Your Weth Balance after swap :" +`${balanceWeth}` : " Your init Weth Balance " + `${balanceWethBefore}` }</div>
      <div>{balanceUni ?"Your Uniswap token Balance after swap :" + `${balanceUni}` : " Your init Uniswap token Balance " + `${balanceUniBefore}`}</div>

     <button onClick={(e:any)=>handleClick('swap2')}>Swap2</button>

    </div>
  );
};

export default Ethereum;
