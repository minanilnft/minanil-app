import Web3 from 'web3';
// const INFURA_KEY = process.env.REACT_APP_INFURA_LINK;
let web3;

// first check if we are on browser and userhas metamask
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // we are in browser
  // and user has metamask
  web3 = new Web3(window.ethereum);

  try {
    // Request account access if needed
    window.ethereum.enable()

    // Acccounts now exposed
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
      // console.log("Chain changed");
    });
  } catch (error) {
    // User denied account access...
    console.log("Unable to enable web3");
  }

}
else {
  console.log("Please use metamask to enable web3");
  // todo: add custom provider for non-metamask users
  // try create provider
  // const provider = new Web3.providers.HttpProvider(INFURA_KEY);
  web3 = null;
  // web3 = new Web3(provider);
}


export default web3;