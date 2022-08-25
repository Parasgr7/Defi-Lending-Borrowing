import { convertToDollar } from "../../utils/helpfulScripts";
import { todp } from "../../utils/todp";
import Image from "next/image";

export default function RowBorrowAsset({ token, balance, Borrow, Details }) {


  const to2dp = (amount) => {
    return Number(amount).toFixed(2)
  }

  
  let actualAvailable = "0.00";
  let actualAvailableInDollars = "0";

  let userTotalAmountAvailableForBorrowInDollars = token.userTotalAmountAvailableForBorrowInDollars

  const tokenEquivalent =
    0.999 * ( userTotalAmountAvailableForBorrowInDollars / parseFloat(token.oneTokenToDollar));

  const tokenAvailableInContract = parseFloat(token.availableAmountInContract.amount);
  const tokenAvailableInContractInDollars = convertToDollar(token, tokenAvailableInContract)


  if (tokenAvailableInContract >= tokenEquivalent) {
    actualAvailable = tokenEquivalent;
    actualAvailableInDollars = convertToDollar(token, actualAvailable);
  } else {
    actualAvailable = tokenAvailableInContract;
    actualAvailableInDollars = tokenAvailableInContractInDollars;
  }

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
            <div className="ml-2 text-gray-800">{token.name}</div>
          </div>
        </th>
        <td className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="text-base font-medium text-gray-800">
            {todp(actualAvailable, 4)}
          </div>
          <div className="text-sm text-gray-500">${todp(actualAvailableInDollars, 2)}</div>
        </td>
        <td className="border-t-0 px-4 border text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="text-base">N/A</div>
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="text-base">
            <span className="border border-gray-400 p-1 px-3 rounded-md">
             {to2dp(token.borrowAPYRate * 100)}%
            </span>
          </div>
        </td>
        <td className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <Borrow/>
          <Details />
        </td>
      </tr>
    </>
  );
}
