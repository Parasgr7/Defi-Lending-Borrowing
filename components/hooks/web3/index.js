import { useHooks, useWeb3 } from "../../providers/web3";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const _isEmpty = (data) => {
  return (
    data == null ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};

const enhanceHook = (swrRes) => {

  const { data, error } = swrRes;

  const hasInitialResponse = data || error;

  return {
    ...swrRes,
    hasInitialResponse,
    isEmpty: hasInitialResponse && _isEmpty(data),
  };
};

export const useAccount = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useAccount)());

  return {
    account: swrRes,
  };
};

export const useSupplyAssets = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useSupplyAssets)());

  return {
    tokens: swrRes,
  };
};

export const useBorrowAssets = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useBorrowAssets)());

  return {
    tokensForBorrow: swrRes,
  };
};

export const useYourSupplies = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useYourSupplies)());

  return {
    yourSupplies: swrRes,
  };
};

export const useYourBorrows = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useYourBorrows)());

  return {
    yourBorrows: swrRes,
  };
};


export const useAdmin = ({ redirectTo }) => {
  const { account } = useAccount();
  const { requireInstall } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (
      requireInstall ||
      (account.hasInitialResponse && !account.isAdmin) ||
      account.isEmpty
    ) {
      router.push(redirectTo);
    }
  }, [account]);

  return { account };
};

export const useNetwork = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: swrRes,
  };
};


export const useWalletInfo = () => {
  const { network } = useNetwork();
  const { account } = useAccount();
  const hasConnectedWallet = !!(account.data && network.isSupported);
  const isConnecting =
    !account.hasInitialResponse && !network.hasInitialResponse;

  return {
    network,
    account,
    hasConnectedWallet,
    isConnecting,
  };
};

/*

Create an handler of the hook. This handler returns a function which is where the functionality of the hook is programmed.
Register the handler in setUpHook()
Here, Try to call the function the handler is returning.


The reason for using enhanceHook is to provide an additional property 'hasInitialResponse' instead of specifying this property in all hooks.

useHooks((hooks) => hooks.useAccount)() =
{
  account: {
      mutate,
      data,
      isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
      ...rest,
  },
}




useHooks((hooks) => {
        return hooks.useAccount
    }
    ) = createUseAccount(web3)

return createUseAccount(web3)() =
   {
        account: {
            mutate,
            data,
            isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
            ...rest,
        }
    }


Here, useHooks() method is called, which means that we will have access to that dictionary containing key-value pairs where the keys represent name of hooks and value represent an handler to that hook.

Here, hooks is a variable that holds that dictionary.

hooks = getHooks() = setUpHooks() =
    {
        useAccount: createUseAccount(web3)
    }

useAccount is the name of a hook and createUseAccount(web3) is an handler to that hook itself (note that the hook is a function)


hooks.useAccount returns the handler to the hook. In other words,
hooks.useAccount = createUseAccount(web3)

createUseAccount(web3) is just an handler to the hook. It is a function that returns a function. That function it returns is actually the function we call hook.

createUseAccount(web3) returns

() =>
    {
        return
        {
            account: {
                mutate,
                data,
                isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
                ...rest,
        }
    }
    }

The function above is the one we actually need to invoke.

So, createUseAccount(web3)() will invoke the function


*/
