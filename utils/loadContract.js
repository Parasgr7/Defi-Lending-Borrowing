import LendingAndBorrowing from '../abis/LendingAndBorrowing.json'
const NETWORK_ID = 5777;

export const loadContract = async (contractName, web3) => {

 const Artifact = LendingAndBorrowing;
 const lendingBorrowing = LendingAndBorrowing.networks[NETWORK_ID]
 // debugger

  let contract = null;

  try {

    contract = new web3.eth.Contract(
     Artifact.abi,
     lendingBorrowing.address
    );

  }
  catch (err) {
   console.log("This is the error")
    console.error(err);
  }

  return contract;
};
