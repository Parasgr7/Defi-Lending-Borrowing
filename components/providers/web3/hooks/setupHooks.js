import { handler as createAccountHook } from "./useAccount"
import { handler as createNetworkHook } from "./useNetwork"
import {handler as createSupplyAssetsHook} from "./useSupplyAssets"
import {handler as createBorrowAssetsHook} from "./useBorrowAssets"
import {handler as createYourSuppliesHook} from "./useYourSupplies"
import {handler as createYourBorrowsHook} from "./useYourBorrows"

export const setupHooks = ({web3, provider, contract}) => {
    return {
        useAccount: createAccountHook(web3, provider),
        useNetwork: createNetworkHook(web3),
        useSupplyAssets: createSupplyAssetsHook(web3, contract),
        useBorrowAssets: createBorrowAssetsHook(web3, contract),
        useYourSupplies: createYourSuppliesHook(web3, contract),
        useYourBorrows: createYourBorrowsHook(web3, contract)

        // useNetwork: createNetworkHook(web3),
    }
}

/*
setUpHook function returns a dictionary where every key has a value that returns a function. In another words, every key has a hook

*/
