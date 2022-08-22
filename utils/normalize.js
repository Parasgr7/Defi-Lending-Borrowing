import ade from "../abis/ADE.json";
import dai from "../assets/dai.svg";
import weth from "../assets/weth.svg";
import link from "../assets/chainlink.svg";
import fau from "../assets/fau_2.png";
import { useAccount } from "../components/hooks/web3";

const tokenImages = {
  DAI: dai,
  WETH: weth,
  LINK: link,
  FAU: fau,
};

export const normalizeToken = async (web3, contract, currentToken) => {
  const fromWei = (amount) => {
    return web3.utils.fromWei(amount);
 };

 const toBN = (amount) => {
  return web3.utils.toBN(amount);
};


 const accounts = await web3.eth.getAccounts();
 const account = accounts[0];


  const tokenInst = new web3.eth.Contract(ade.abi, currentToken.tokenAddress);

  const decimals = await tokenInst.methods.decimals().call()

  const walletBalance = await tokenInst.methods.balanceOf(account).call();


  const totalSuppliedInContract = await contract.methods.getTotalTokenSupplied(currentToken.tokenAddress).call();

  const totalBorrowedInContract = await contract.methods.getTotalTokenBorrowed(currentToken.tokenAddress).call();
  const utilizationRate = (Number(totalBorrowedInContract) * 100) / Number(totalSuppliedInContract);

  const userTokenBorrowedAmount = await contract.methods.tokensBorrowedAmount(currentToken.tokenAddress,account).call();
  const userTokenLentAmount = await contract.methods.tokensLentAmount(currentToken.tokenAddress,account).call();


  const userTotalAmountAvailableToWithdrawInDollars = await contract.methods.getTokenAvailableToWithdraw(account).call();

  const userTotalAmountAvailableForBorrowInDollars = await contract.methods.getUserTotalAmountAvailableForBorrowInDollars(account).call();



  const walletBalanceInDollars = await contract.methods
    .getAmountInDollars(walletBalance, currentToken.tokenAddress)
    .call();
  const totalSuppliedInContractInDollars = await contract.methods
    .getAmountInDollars(totalSuppliedInContract, currentToken.tokenAddress)
    .call();
  const totalBorrowedInContractInDollars = await contract.methods
    .getAmountInDollars(totalBorrowedInContract, currentToken.tokenAddress)
    .call();
  const userTokenBorrowedAmountInDollars = await contract.methods
    .getAmountInDollars(userTokenBorrowedAmount, currentToken.tokenAddress)
    .call();


  const userTokenLentAmountInDollars = await contract.methods.getAmountInDollars(userTokenLentAmount, currentToken.tokenAddress).call();

  const availableAmountInContract = (toBN(totalSuppliedInContract).sub(toBN(totalBorrowedInContract))).toString()

  const availableAmountInContractInDollars = await contract.methods.getAmountInDollars(availableAmountInContract, currentToken.tokenAddress).call();




  const result = await contract.methods.oneTokenEqualsHowManyDollars(currentToken.tokenAddress).call()
  const price = result[0]
  const decimal = result[1]



  const oneTokenToDollar = parseFloat(price) / (10 ** parseInt(decimal))


  return {
    name: currentToken.name,
    image: tokenImages[currentToken.name],
    tokenAddress: currentToken.tokenAddress,
    userTotalAmountAvailableToWithdrawInDollars: fromWei(userTotalAmountAvailableToWithdrawInDollars),
    userTotalAmountAvailableForBorrowInDollars: fromWei(userTotalAmountAvailableForBorrowInDollars),
    walletBalance: {
      amount: fromWei(walletBalance),
      inDollars: fromWei(walletBalanceInDollars),
    },
    totalSuppliedInContract: {
      amount: fromWei(totalSuppliedInContract),
      inDollars: fromWei(totalSuppliedInContractInDollars),
    },
    totalBorrowedInContract: {
      amount: fromWei(totalBorrowedInContract),
      inDollars: fromWei(totalBorrowedInContractInDollars),
    },
    availableAmountInContract: {
      amount: fromWei(availableAmountInContract),
      inDollars: fromWei(availableAmountInContractInDollars),
    },
    userTokenBorrowedAmount: {
      amount: fromWei(userTokenBorrowedAmount),
      inDollars: fromWei(userTokenBorrowedAmountInDollars),
    },
    userTokenLentAmount: {
      amount: fromWei(userTokenLentAmount),
      inDollars: fromWei(userTokenLentAmountInDollars),
    },
    LTV: web3.utils.fromWei(currentToken.LTV),
    borrowAPYRate: web3.utils.fromWei(currentToken.stableRate),
    utilizationRate: utilizationRate,
    oneTokenToDollar,
    decimals
  };
};
