import { todp } from "../../utils/todp";

export default function ReserveStatus({ token }) {





  return (
    <div className="relative flex flex-col min-w-0 break-words px-4 bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 py-3 border-0">
        <div className="flex flex-wrap">
          <div className="relative w-full  max-w-full">
            <p className="font-bold text-lg">
              Reserve status and Configuration
            </p>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right"></div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto ">
        <div className="flex sm:flex-row flex-col border mb-8 pb-8 border-r-0 border-l-0 border-t-0 border-gray-300">
          <div className="font-medium text-lg w-6/12 mb-2">Supply Info</div>
          <div className="flex flex-col">
            <div className="flex mt-3 sm:mt-0">
              <div>
                <p className="font-medium text-gray-500 text-sm ">
                  Total Supplied
                </p>
                <p className="font-medium text-lg">${todp(token.totalSuppliedInContract.inDollars, 3)}</p>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-500 text-sm">APY </p>
                <p className="font-medium sm:text-lg">N/A</p>
              </div>
            </div>
            <div className="bg-gray-200 my-3 px-2 rounded-md">
              <div className="text-green-700 font-bold">
               ✔️ Can be collateral
               </div>
              <div className="mt-2">
                <span className="text-large">MAX LTV: </span>
                <span className="font-medium">{todp((token.LTV * 100), 2)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col my-2 pb-8 ">
          <div className="font-medium text-lg w-6/12">Borrow Info</div>
          <div className="flex flex-col">
            <div className="flex mt-3 sm:mt-0">
              <div>
                <p className="font-medium text-gray-500 text-sm ">
                  Total Borrowed
                </p>
                <p className="font-medium text-lg">${todp(token.totalBorrowedInContract.inDollars, 2)}</p>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-500 text-sm">
                  APY Stable{" "}
                </p>
                <p className="font-medium sm:text-lg">{todp(token.borrowAPYRate * 100, 2) }%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <table className="items-center w-full bg-transparent border-collapse">
<thead>
  <tr>
    <th className="px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs  border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
      Assets
    </th>
    <th className="px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs  border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
      Available
    </th>
    <th className="px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs  border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
      APY, variable
    </th>
    <th className="px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs  border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
      APY, stable
    </th>
    <th className="px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs  border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"></th>
  </tr>
</thead>
<tbody>

</tbody>
</table> */
}
