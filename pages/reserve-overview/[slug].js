import Navbar from "../../components/ui/Navbar";
import ReserveStatus from "../../components/ui/ReserveStatus";
import TokenInfo from "../../components/ui/TokenInfo";
import Footer from "../../components/ui/Footer";
import Image from "next/image";
import {
  useAccount,
  useNetwork,
  useSupplyAssets,
  useYourBorrows,
  useYourSupplies,
} from "../../components/hooks/web3";
import { useWeb3 } from "../../components/providers/web3";
import { useRouter } from "next/router";
import { todp } from "../../utils/todp";
import { convertToDollar } from "../../utils/helpfulScripts";

export default function Details({ token }) {

  const { web3, contract } = useWeb3();
  const { account } = useAccount();
  const { yourSupplies } = useYourSupplies()
  const {yourBorrows} = useYourBorrows()

  let actualAvailable;
  let actualAvailableInDollars;

  let userTotalAmountAvailableForBorrowInDollars =
    token.userTotalAmountAvailableForBorrowInDollars;

  const tokenEquivalent =
    0.999 *
    (userTotalAmountAvailableForBorrowInDollars /
      parseFloat(token.oneTokenToDollar));

  const tokenAvailableInContract = parseFloat(
    token.availableAmountInContract.amount
  );
  const tokenAvailableInContractInDollars = convertToDollar(
    token,
    tokenAvailableInContract
  );

  if (tokenAvailableInContract >= tokenEquivalent) {
    actualAvailable = tokenEquivalent;
    actualAvailableInDollars = convertToDollar(token, actualAvailable);
  } else {
    actualAvailable = tokenAvailableInContract;
    actualAvailableInDollars = tokenAvailableInContractInDollars;
  }



  return (
    <div className="">
      {/* <Sidebar /> */}

      <div className="relative bg-gray-100 ">
        {/* <Navbar /> */}
        {/* Header */}
        <div className="relative bg-gray-700 md:pt-32 pb-32 pt-12">
          <div className="md:px-10 mx-auto w-full">
            <div>
              {/* Card stats */}
              <div className="flex flex-wrap">
                <div className="w-full px-2">
                  <div className="relative flex sm:flex-row sm:mt-0 mt-6 flex-col xl:w-5/12 min-w-0 p-3 rounded mb-6 xl:mb-0 ">
                    <div className="flex items-center">
                      {token.image && (
                        <Image
                          src={token.image}
                          width={40}
                          height={40}
                          layout="fixed"
                          className="card-img-top"
                          alt="coinimage"
                        />
                      )}

                      <div className="text-2xl sm:text-4xl text- ml-2 text-white font-bold">
                        {token.name}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex pt-2 sm:ml-6 items-center">
                        <div className=" h-9">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-910"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={1}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <div className=" ml-2">
                          <div className="text-sm text-white">
                            Reserve Size:{" "}
                            <div className="font-bold text-xl">
                              ${todp(token.totalSuppliedInContract.inDollars, 2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex pt-2 ml-6 items-center">
                        <div className=" h-9">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-9 w-9"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                            />
                          </svg>
                        </div>
                        <div className=" ml-2">
                          <div className="text-sm text-white">
                            Available Liquidity:{" "}
                            <div className="font-bold text-xl">
                              $
                              {todp(
                                token.availableAmountInContract.inDollars,
                                2
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-5 xl:mb-0 px-2">
              <ReserveStatus token={token} />
            </div>
            <div className="w-full xl:w-4/12 px-2">
              {web3 && contract && account && (
                <TokenInfo
                  token={token}
                  actualAvailable={actualAvailable}
                  web3={web3}
                  contract={contract}
                  account={account}
                  yourSupplies={yourSupplies}
                  yourBorrows ={yourBorrows}
                />
              )}
            </div>
          </div>

         <Footer />
        </div>
      </div>

      {/* <ModalBorrow /> */}
    </div>
  );
}


export async function getServerSideProps(context) {

  const query = context.query;

  const image = JSON.parse(query.image);

  const availableAmountInContract = JSON.parse(query.availableAmountInContract);
  const totalBorrowedInContract = JSON.parse(query.totalBorrowedInContract);
  const totalSuppliedInContract = JSON.parse(query.totalSuppliedInContract);
  const userTokenBorrowedAmount = JSON.parse(query.userTokenBorrowedAmount);
  const userTokenLentAmount = JSON.parse(query.userTokenLentAmount);
  const walletBalance = JSON.parse(query.walletBalance);

  const token = {
    ...query,
    image,
    availableAmountInContract,
    totalBorrowedInContract,
    totalSuppliedInContract,
    userTokenBorrowedAmount,
    userTokenLentAmount,
    walletBalance,
  };


  return {
    props: {
      token
    },
  };
}
