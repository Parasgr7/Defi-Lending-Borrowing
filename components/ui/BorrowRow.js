import Image from "next/image"
import matic from "../../assets/matic.png"
import { todp } from "../../utils/todp";

export default function BorrowRow({ token, Repay, Borrow }) {
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
          <div className="text-base font-medium text-gray-800">{todp(token.userTokenBorrowedAmount.amount, 4)}</div>
          <div className="text-sm text-gray-500">${ todp(token.userTokenBorrowedAmount.inDollars, 2)}</div>
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            <div className="text-base">{todp(token.borrowAPYRate * 100, 2)}%</div>
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <span className="border text-base border-gray-400 p-1 px-3 rounded-md">
            Stable
          </span>
        </td>
        <td className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <Repay />
          <Borrow />
        </td>
      </tr>
    </>
  );
}
