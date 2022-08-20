import Image from "next/image";
import btc from "../../assets/btc.png";
import Link from "next/link";
import { todp } from "../../utils/todp";

export default function RowSupplyAsset({ token, Supply, Details }) {
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
          <div className="text-base font-medium text-gray-800">{todp(token.walletBalance.amount, 4)}</div>
          <div className="text-sm text-gray-500">${todp(token.walletBalance.inDollars, 2)}</div>
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="text-base">N/A</div>
        </td>
        <td className="border-t-0 px-4 border  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="text-green-700 text-lg font-large"> &#10004; </div>
        </td>
        <td className="border-t-0 px-4 border align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
         <Supply />
         <Details />
          {/* <Link href="./detail">
            <a className="ml-2 border border-gray-400 text-base font-medium text-black p-2 rounded-md">
              Details
            </a>
          </Link> */}
        </td>
      </tr>
    </>
  );
}
