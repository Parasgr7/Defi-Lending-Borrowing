import useSWR from "swr";
import { normalizeToken } from "../../../../utils/normalize"

const NETWORKS = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache",
};

export const handler = (web3, contract) => () => {
  const { data, error, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/your_borrows" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const yourBorrows = [];
      let yourBalance = 0;
      const tokenAddressTracker = [];

      const noOfTokensBorrowed = await contract.methods.noOfTokensBorrowed().call();

      if (Number(noOfTokensBorrowed) > 0) {
        for (let i = Number(noOfTokensBorrowed) - 1; i >= 0; i--) {
          const currentTokenAddress = await contract.methods.tokensBorrowed(i, account).call();

          if (tokenAddressTracker.includes(currentTokenAddress)) {
            continue;
          }

          if (currentTokenAddress.toString() !== "0x0000000000000000000000000000000000000000") {
            const currentToken = await contract.methods.getTokenFrom(currentTokenAddress).call();

            const normalized = await normalizeToken(web3, contract, currentToken);

            yourBalance += parseFloat(normalized.userTokenBorrowedAmount.inDollars);


            if (Number(normalized.userTokenBorrowedAmount.amount) > 0) {
              yourBorrows.push(normalized);
              tokenAddressTracker.push(currentTokenAddress);
            }


          }
        }

      }
      return { yourBorrows, yourBalance };
    }
  );

  const targetNetwork = NETWORKS["42"];

  return {
    data,
    error,
    ...rest,
    target: targetNetwork,
    isSupported: data === targetNetwork,
  };
};

/**

web3.eth.net.getId() will return the network id on ganache itself
web3.eth.getChainId() will return the chainId of ganache in metamask.

chainChanged event listens with web3.eth.getChainId()


 */
