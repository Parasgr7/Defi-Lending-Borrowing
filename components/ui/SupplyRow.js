import Image from "next/image";
import btc from "../../assets/btc.png"
import { todp } from "../../utils/todp";

export default function SupplyRow({ token, Withdraw, Supply }) {

  // name
  // image
  // tokenAddress
  // walletBalance: {
  //   amount: fromWei(walletBalance),
  //   inDollars: fromWei(walletBalanceInDollars),
  // },
  // totalSuppliedInContract: {
  //   amount: fromWei(totalSuppliedInContract),
  //   inDollars: fromWei(totalSuppliedInContractInDollars),
  // },
  // totalBorrowedInContract: {
  //   amount: fromWei(totalBorrowedInContract),
  //   inDollars: fromWei(totalBorrowedInContractInDollars),
  // },
  // availableAmountInContract: {
  //   amount: fromWei(availableAmountInContract),
  //   inDollars: fromWei(availableAmountInContractInDollars),
  // },
  // userTokenBorrowedAmount: {
  //   amount: fromWei(userTokenBorrowedAmount),
  //   inDollars: fromWei(userTokenBorrowedAmountInDollars),
  // },
  // userTokenLentAmount: {
  //   amount: fromWei(userTokenLentAmount),
  //   inDollars: fromWei(userTokenLentAmountInDollars),
  // },
  // LTV: web3.utils.fromWei(currentToken.LTV),
  // borrowAPYRate: web3.utils.fromWei(currentToken.stableRate),
  //   utilizationRate: utilizationRate,

  return (
    <>
      <tr>
        <th className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
          <div className="flex items-center">
            <Image
              src={token.image}
              width={30}
              height={30}
              layout="fixed"
              className="card-img-top"
              alt="coinimage"
            />
            <div className="ml-2 text-gray-800">{token?.name}</div>
          </div>
        </th>
        <td className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="text-base font-medium text-gray-800">{todp(token.userTokenLentAmount.amount, 3)}</div>
          <div className="text-sm text-gray-500">${todp(token.userTokenLentAmount.inDollars, 2)}</div>
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          __
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        <div className="text-green-700 text-lg font-medium"> &#10004; </div>
        </td>
        <td className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
         <Withdraw />
          <Supply />
        </td>
      </tr>
    </>
  );
}
