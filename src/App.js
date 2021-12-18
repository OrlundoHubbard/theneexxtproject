import React, { useEffect, useState } from "react";
import TwitterIcon from './twitter.js';
import './App.css';
import { ethers } from "ethers";
import myNeexxtNFT from './utils/myNeexxtNFT.json'
import neexxtGif from './assets/Neexxt.gif';

// Constants
const TWITTER_LINK = `https://twitter.com/OrlundoH`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/neexxtnft-itwktnpw38';
const CONTRACT_ADDRESS = "0x82724c26c3e1735988E0f2c1B730b6E3511A1Df9";


const App = () => {

  /*
    Using a state variable to store user's public wallet.
  */
const [currentAccount, setCurrentAccount] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isSuccessfulMint, setIsSuccessfulMint] = useState(false);
const [openseaLink, setOpenseaLink] = useState(OPENSEA_LINK);
const [etherscanLink, setEtherscanLink] = useState('');


  const checkIfWalletIsConnected = async () => {
    /*
    Make sure we have access to window.ethereum
    */
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have Metamask!");
    return;
  } else {
    console.log("We have the ethereum object", ethereum);
  }

  /*
    Check if we have authorization to access the user's wallet
  */
  const accounts = await ethereum.request({ method: 'eth_accounts'});

  /*
    Grab first authorized account
  */
  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account:", account);
    setCurrentAccount(account);

    let chainId = await ethereum.request({ method: 'eth_chainId'});
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network! ")
    }

    setupEventListener()
  } else {
    console.log("No authorized account found")
  }
  }

  /*
    ConnectWallet Method
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
        Method to request access to account.
      */
    const accounts = await ethereum.request({ method: "eth_requestAccounts"});

    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);

    let chainId = await ethereum.request({ method: 'eth_chainId'});
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network! ")
    }

    setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // Setup Listener.
  const setupEventListener = async () => {

    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNeexxtNFT.abi, signer);

        connectedContract.on("NewNexxttNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)

          setOpenseaLink(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
        });

        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    setIsSuccessfulMint(false);
    

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNeexxtNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeYourNFT();
        setIsLoading(true);

        console.log("Mining...please wait.")
        await nftTxn.wait();
        setIsLoading(false);
        setIsSuccessfulMint(true);

        setEtherscanLink(`https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getButton = () => {
    if (currentAccount === "") {
      return (<button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>)
    } return (
      <button onClick={askContractToMintNft} className="cta-button mint-button" disabled={isLoading}>
        {isLoading ? 'Minting...' : 'Mint NFT'}
      </button>)
  };

  // Running the function when the page is loaded
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])






  // User interface

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">The Neexxt Project</p>
          <p className="sub-text">
            For those who understand the future.
          </p>
          <div className="neexxt-div">
          <img src={neexxtGif} alt={'Neexxt Gif'} className="neexxt-gif" />
          </div>
          {getButton()}
        </div>
        {isSuccessfulMint && (
          <div className="success-message">
            <p>Successful Mint!</p>
            <p>View your NFT on <a className="opensea-link" href={openseaLink} target="blank" rel="noreferrer">Opensea</a></p>
            <p>See your transaction on <a className="etherscan-link" href={etherscanLink} target="_blank" rel="noreferrer">Etherscan</a></p>
          </div>
        )}
        <div className="footer-container">
          <h5>
            Built with Insight by Orlundo Hubbard
          </h5>
          <div className="twitter-logo">
          <a className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
          >
            <TwitterIcon />
          </a>
        </div>
        </div>
        
      </div>
    </div>
  )
}

export default App;
