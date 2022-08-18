import { useWeb3 } from "@components/providers/web3";

export const convertToDollar = async (amount, tokenAddress) => {
  const { contract } = useWeb3();
  const amountInDollars = await contract.methods
    .getAmountInDollars(amount, tokenAddress)
  .call();

  return Number(amountInDollars);
};
