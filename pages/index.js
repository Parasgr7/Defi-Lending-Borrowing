import Link from "next/link";
import Head from 'next/head'
import Image from 'next/image'
import {
  useAccount,
  useBorrowAssets,
  useNetwork,
  useSupplyAssets,
  useYourBorrows,
  useYourSupplies,
} from "../components/hooks/web3";
import { useWeb3 } from "../components/providers/web3";
import { useEffect, useState } from "react";
import eth from "../assets/eth.png";
import ERC20 from "../abis/ADE.json";
import LARToken from "../abis/LARToken.json";
import { trackPromise } from "react-promise-tracker";
import { todp } from "../utils/todp";
import Navbar from "../components/ui/Navbar";
import YourSupply from "../components/ui/YourSupplies";
import YourBorrows from "../components/ui/YourBorrows";
import SupplyAsset from "../components/ui/SupplyAssets";
import BorrowAssets from "../components/ui/BorrowAssets";
import Footer from "../components/ui/Footer";
import ModalSupply from "../components/ui/ModalSupply";
import ModalWithdraw from "../components/ui/ModalWithdraw";
import ModalRepay from "../components/ui/ModalRepay";
import ModalBorrow from "../components/ui/ModalBorrow";
import RowSupplyAsset from "../components/ui/RowSupplyAsset";
import RowBorrowAsset from "../components/ui/RowBorrowAsset";
import SupplyRow from "../components/ui/SupplyRow";
import BorrowRow from "../components/ui/BorrowRow";

export default function Home() {
  const { network } = useNetwork();
  const { requireInstall, isLoading, connect, contract, web3 } = useWeb3();
  const { account } = useAccount();
  const { tokens } = useSupplyAssets();
  const { tokensForBorrow } = useBorrowAssets();
  const { yourSupplies } = useYourSupplies();
  const { yourBorrows } = useYourBorrows();

  const IMAGES = {
    DAI:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSllrF9PNBf88kIx9USP5g73XDYjkMyRBaDig&usqp=CAU",
    WETH: "https://staging.aave.com/icons/tokens/weth.svg",
    LINK: "https://staging.aave.com/icons/tokens/link.svg",
    FAU:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5qUPi3Ar2dQZ2m9K5opr_h9QaQz4_G5HVYA&usqp=CAU",
    LAR:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZs8PLHRLaGd4QfIvOYmCg30svx5dHp0y6A&usqp=CAU",
  };

  const [selectedTokenToSupply, setSelectedTokenToSupply] = useState(null);
  const [selectedTokenToBorrow, setSelectedTokenToBorrow] = useState(null);
  const [selectedTokenToWithdraw, setSelectedTokenToWithdraw] = useState(null);
  const [selectedTokenToRepay, setSelectedTokenToRepay] = useState(null);

  const [transactionHash, setTransactionHash] = useState(null);
  const [newSupply, setNewSupply] = useState(true);

  const [supplyError, setSupplyError] = useState(null);
  const [supplyResult, setSupplyResult] = useState(null);

  const [borrowingError, setBorrowingError] = useState(null);
  const [borrowingResult, setBorrowingResult] = useState(null);

  const [WithdrawError, setWithdrawError] = useState(null);
  const [WithdrawResult, setWithdrawResult] = useState(null);

  const [repayError, setRepayError] = useState(null);
  const [repayResult, setRepayResult] = useState(null);

  const toWei = (value) => {
    return web3.utils.toWei(value.toString());
  };

  const handleCloseModal = () => {
    setSupplyError(null);
    setSupplyResult(null);
    setBorrowingError(null);
    setBorrowingResult(null);
    setWithdrawError(null);
    setWithdrawResult(null);
    setRepayError(null);
    setRepayResult(null);
    setSelectedTokenToSupply(null);
    setSelectedTokenToBorrow(null);
    setSelectedTokenToWithdraw(null);
    setSelectedTokenToRepay(null);
    setTransactionHash(null);
  };


  const supplyToken = async (token, value) => {
    let NETWORK_ID = await web3.eth.net.getId();
    const tokenInst = new web3.eth.Contract(ERC20.abi, token.tokenAddress);
    const larToken = new web3.eth.Contract(
      ERC20.abi,
      LARToken.networks[NETWORK_ID].address
    );

    try {
      await trackPromise(
        tokenInst.methods
          .approve(contract.options.address, toWei(value))
          .send({ from: account.data })
      );

      const supplyResult = await trackPromise(
        contract.methods
          .lend(tokenInst.options.address, toWei(value))
          .send({ from: account.data })
      );

      const larTokenBalance = await larToken.methods
        .balanceOf(account.data)
        .call();

      await trackPromise(
        larToken.methods
          .approve(contract.options.address, toWei(larTokenBalance))
          .send({ from: account.data })
      );

      setSupplyResult(supplyResult);
    } catch (err) {
      setSupplyError(err);
    }
  };

  const borrowToken = async (token, value) => {
    setBorrowingError(null);
    setBorrowingResult(null);

    try {
      const borrowingResult = await trackPromise(
        contract.methods
          .borrow(toWei(value), token.tokenAddress)
          .send({ from: account.data })
      );
      setBorrowingResult(borrowingResult);
    } catch (err) {
      setBorrowingError(err);
    }
  };

  const withdrawToken = async (token, value) => {
    setWithdrawError(null);
    setWithdrawResult(null);


    try {
      const withdrawResult = await trackPromise(
        contract.methods
          .withdraw(token.tokenAddress, toWei(value))
          .send({ from: account.data })
      );
      setWithdrawResult(withdrawResult);
    } catch (err) {
      setWithdrawError(err);
    }
  };

  const repayToken = async (token, value) => {
    setRepayError(null);
    setRepayResult(null);

    const tokenToRepay = new web3.eth.Contract(ERC20.abi, token.tokenAddress);
    const interest = Number(token.borrowAPYRate) * Number(toWei(value));
    const amountToPayBack = (Number(toWei(value)) + interest).toString();

    try {
      await trackPromise(
        tokenToRepay.methods
          .approve(contract.options.address, toWei(amountToPayBack))
          .send({ from: account.data })
      );

      const repayResult = await trackPromise(
        contract.methods
          .payDebt(token.tokenAddress, toWei(value))
          .send({ from: account.data })
      );
      setRepayResult(repayResult);
    } catch (err) {
      setRepayError(err);
    }
  };

  const addBorrowedToken = async (token) => {

    const tokenAddress = token.tokenAddress;
    const tokenSymbol = token.name;
    const tokenDecimals = token.decimals;
    const tokenImage = IMAGES[token.name];

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        // Added
      } else {
        // Not Added
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTokenToMetamask = async (token) => {
    const tokenAddress = token.tokenAddress;
    const tokenSymbol = token.name;
    const tokenDecimals = token.decimals;
    const tokenImage = IMAGES[token.name];

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
     // Added
      } else {
        // Not Added
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addLAR = async (token) => {
    let NETWORK_ID = await web3.eth.net.getId();
    const larToken = new web3.eth.Contract(
      ERC20.abi,
      LARToken.networks[NETWORK_ID].address
    );

    const tokenAddress = larToken.options.address;
    const tokenSymbol = "LAR";
    const tokenDecimals = 18;
    const tokenImage = IMAGES["LAR"];

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        // Added
      } else {
        // Not Added
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div>
      <Head>
        <title>DeFi Lending Borrowing</title>
      </Head>
      {!isLoading ? (
        account.data ? (
          <>
            {false ? (
              <div>Page is Loading</div>
            ) : (
              <div>
                <div className="relative bg-gray-100 ">
                  <Navbar accountAddress={account.data} />
                  {/* Header */}
                  <div className="relative bg-gray-700 md:pt-32 pb-32 pt-12">
                    <div className="px-1 md:px-10 mx-auto w-full">
                      <div>
                        {/* Card stats */}
                        <div className="flex flex-wrap">
                          <div className="w-full px-2">
                            <div className="relative flex sm:flex-row sm:mt-0 mt-6 flex-col xl:w-5/12 min-w-0 p-3 rounded mb-6 xl:mb-0 ">
                              <div className="flex items-center">
                                <Image
                                  src={eth}
                                  width={50}
                                  height={40}
                                  layout="fixed"
                                  className="card-img-top"
                                  alt="coinimage"
                                />

                                <div className="">
                                    {network.data === "Kovan Test Network"
                                    ?<div className="text-2xl sm:text-2xl text- ml-2 text-white font-bold">Ethereum Kovan Market</div>
                                    :  (<><div className="bg-red-500 p-2 text-sm rounded-md text-white">Connected to the Wrong network</div>
                                    <div className="text-2xl sm:text-2xl text- ml-2 text-white font-bold">Switch to Kovan</div></>)
                                    }
                                </div>
                              </div>
                              <div className="flex mt-2">
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
                                      Networth{" "}
                                      <p className="font-bold text-xl">
                                        $
                                        {isNaN(
                                          yourSupplies.data?.yourBalance -
                                            yourBorrows.data?.yourBalance
                                        )
                                          ? "0"
                                          : todp(
                                              yourSupplies.data?.yourBalance -
                                                yourBorrows.data?.yourBalance,
                                              3
                                            )}
                                      </p>
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
                      <div className="w-full xl:w-6/12 xl:mb-0 px-2">
                        {yourSupplies && (
                          <YourSupply
                            tokens={yourSupplies.data?.yourSupplies}
                            balance={yourSupplies.data?.yourBalance}
                          >
                            {(token) => {
                              return (
                                <SupplyRow
                                  key={token.tokenAddress}
                                  token={token}
                                  Withdraw={() => {
                                    return (
                                      <button
                                        onClick={() =>
                                          setSelectedTokenToWithdraw(token)
                                        }
                                        className="bg-gray-700 text-base text-white p-2 rounded-md"
                                      >
                                        Withdraw
                                      </button>
                                    );
                                  }}
                                  Supply={() => {
                                    return (
                                      <button
                                        onClick={() =>
                                          setSelectedTokenToSupply(token)
                                        }
                                        className="ml-2 border border-gray-400 text-base font-medium text-gray-800 p-2 rounded-md"
                                      >
                                        Supply
                                      </button>
                                    );
                                  }}
                                />
                              );
                            }}
                          </YourSupply>
                        )}
                      </div>
                      <div className="w-full xl:w-6/12 px-2">
                        <YourBorrows
                          tokens={yourBorrows.data?.yourBorrows}
                          balance={yourBorrows.data?.yourBalance}
                        >
                          {(token) => {
                            return (
                              <BorrowRow
                                token={token}
                                key={token.tokenAddress}
                                Repay={() => {
                                  return (
                                    <button
                                      onClick={() =>
                                        setSelectedTokenToRepay(token)
                                      }
                                      className="bg-gray-700 text-base text-white p-2 rounded-md"
                                    >
                                      Repay
                                    </button>
                                  );
                                }}
                                Borrow={() => {
                                  return (
                                    <button
                                      onClick={() =>
                                        setSelectedTokenToBorrow(token)
                                      }
                                      className="ml-2 border border-gray-400 text-base font-medium text-gray-800 p-2 rounded-md"
                                    >
                                      Borrow
                                    </button>
                                  );
                                }}
                              />
                            );
                          }}
                        </YourBorrows>
                      </div>
                    </div>

                    <div className="flex flex-wrap mt-4">
                      <div className="w-full xl:w-6/12  xl:mb-0 px-2">
                        <SupplyAsset tokens={tokens.data}>
                          {(token) => {
                            return (
                              <RowSupplyAsset
                                token={token}
                                key={token.tokenAddress}
                                Supply={() => {
                                  return (
                                    <button
                                      onClick={() =>
                                        setSelectedTokenToSupply(token)
                                      }
                                      className="bg-gray-700 text-base text-white p-2 rounded-md"
                                    >
                                      Supply
                                    </button>
                                  );
                                }}
                                Details={() => {
                                  if (web3 && contract) {
                                    return (
                                      <Link
                                        href={{
                                          pathname: `/reserve-overview/${token.name}`,
                                          query: {
                                            ...token,
                                            availableAmountInContract: JSON.stringify(
                                              token.availableAmountInContract
                                            ),
                                            image: JSON.stringify(token.image),
                                            totalBorrowedInContract: JSON.stringify(
                                              token.totalBorrowedInContract
                                            ),
                                            totalSuppliedInContract: JSON.stringify(
                                              token.totalSuppliedInContract
                                            ),

                                            userTokenBorrowedAmount: JSON.stringify(
                                              token.userTokenBorrowedAmount
                                            ),
                                            userTokenLentAmount: JSON.stringify(
                                              token.userTokenLentAmount
                                            ),
                                            walletBalance: JSON.stringify(
                                              token.walletBalance
                                            ),
                                            userTotalSupplyBalance:
                                              yourSupplies.data?.yourBalance,
                                          },
                                          // the data
                                        }}
                                        as={`/reserve-overview/${token.name}`}
                                      >
                                        <a className="ml-2 border border-gray-400 text-base font-medium text-gray-800 p-2 rounded-md">
                                          {" "}
                                          Details
                                        </a>
                                      </Link>
                                    );
                                  }
                                }}
                              />
                            );
                          }}
                        </SupplyAsset>
                      </div>
                      <div className="w-full xl:w-6/12 px-2">
                        <BorrowAssets tokens={tokensForBorrow.data}>
                          {(token) => {
                            return (
                              <RowBorrowAsset
                                token={token}
                                key={token.tokenAddress}
                                balance={yourSupplies.data?.yourBalance}
                                Borrow={() => {
                                  return (
                                    <button
                                      onClick={() => {
                                        setSelectedTokenToBorrow(token);
                                      }}
                                      className="bg-gray-700 text-base text-white p-2 rounded-md"
                                    >
                                      Borrow
                                    </button>
                                  );
                                }}
                                Details={() => {
                                  return (
                                    <Link
                                      href={{
                                        pathname: `/reserve-overview/${token.name}`,
                                        query: {
                                          ...token,
                                          availableAmountInContract: JSON.stringify(
                                            token.availableAmountInContract
                                          ),
                                          image: JSON.stringify(token.image),
                                          totalBorrowedInContract: JSON.stringify(
                                            token.totalBorrowedInContract
                                          ),
                                          totalSuppliedInContract: JSON.stringify(
                                            token.totalSuppliedInContract
                                          ),
                                          userTokenBorrowedAmount: JSON.stringify(
                                            token.userTokenBorrowedAmount
                                          ),
                                          userTokenLentAmount: JSON.stringify(
                                            token.userTokenLentAmount
                                          ),
                                          walletBalance: JSON.stringify(
                                            token.walletBalance
                                          ),
                                          userTotalSupplyBalance:
                                            yourSupplies.data?.yourBalance,
                                        },
                                        // the data
                                      }}
                                      as={`/reserve-overview/${token.name}`}
                                    >
                                      <a className="ml-2 border border-gray-400 text-base font-medium text-gray-800 p-2 rounded-md">
                                        {" "}
                                        Details
                                      </a>
                                    </Link>
                                  );
                                }}
                              />
                            );
                          }}
                        </BorrowAssets>
                      </div>
                    </div>

                     <Footer />
                  </div>
                </div>
              </div>
            )}

            <div className="flex text-center sm:block sm:p-0">
              {/* <ModalWithdraw /> */}
            </div>
          </>
        ) : requireInstall ? (
          <div className="w-full grid h-screen place-items-center bg-black text-white">
            <button onClick={() => {window.open('https://metamask.io/download/', '_blank')}} className="border border-white p-2 rounded-md">
              Install metamask
            </button>
          </div>
        ) : (
          <div className="w-full grid h-screen place-items-center bg-black text-white">
            <button
              onClick={() => connect()}
              className="border border-white p-2 rounded-md"
            >
              Connect to metamask with your browser
            </button>
          </div>
        )
      ) : (
        <div className="w-full grid h-screen place-items-center bg-black text-white">
          <div className="border border-white p-2 rounded-md">
            Connecting.... Please! Wait for a moment.
          </div>
        </div>
      )}

      <div className="flex justify-center text-center sm:block sm:p-0 mt-2">
        {selectedTokenToSupply && (
          <ModalSupply
            token={selectedTokenToSupply}
            supplyError={supplyError}
            supplyResult={supplyResult}
            transactionHash={transactionHash}
            addLAR={addLAR}
            newSupply={newSupply}
            closeModal={handleCloseModal}
            onSupply={supplyToken}
          />
        )}

        {selectedTokenToBorrow && (
          <ModalBorrow
            token={selectedTokenToBorrow}
            closeModal={handleCloseModal}
            balance={yourSupplies.data?.yourBalance}
            onBorrow={borrowToken}
            borrowingError={borrowingError}
            borrowingResult={borrowingResult}
            addBorrowedToken={addBorrowedToken}
          />
        )}

        {selectedTokenToWithdraw && (
          <ModalWithdraw
            token={selectedTokenToWithdraw}
            closeModal={handleCloseModal}
            onWithdraw={withdrawToken}
            withdrawError={WithdrawError}
            withdrawResult={WithdrawResult}
            addTokenToMetamask={addTokenToMetamask}
            contract={contract}
            web3={web3}
          />
        )}

        {selectedTokenToRepay && web3 && (
          <ModalRepay
            token={selectedTokenToRepay}
            closeModal={handleCloseModal}
            onRepay={repayToken}
            repayError={repayError}
            repayResult={repayResult}
            web3={web3}
          />
        )}
      </div>
    </div>
  );
}
