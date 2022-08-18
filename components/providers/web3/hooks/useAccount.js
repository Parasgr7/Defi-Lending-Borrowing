import { useEffect } from "react";
import useSWR from "swr";

export const handler = (web3 = null, provider = null) => {
  return () => {
    const { mutate, data, error, ...rest } = useSWR(
      () => (web3 ? "web3/accounts" : null),
      async () => {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        if (!account) {
          throw new Error(
            "Failed to detect Account. Please refresh your browser"
          );
        }

        return account;
      }
    );


    useEffect(() => {
      const mutator = (accounts) => window.location.reload();

      provider?.on("accountsChanged", mutator);

      return () => provider?.removeListener("accountsChanged", mutator);
    }, []);

    return {
      mutate,
      data,
      error,
      ...rest,
    };
  };
};
