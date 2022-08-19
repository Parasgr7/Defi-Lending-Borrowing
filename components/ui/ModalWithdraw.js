import Image from "next/image";
import correct from "../../assets/correct.png";
import { todp } from "../../utils/todp";
import { useState } from "react";
import { LoadingSpinerComponent } from "../../utils/Spinner";
import { convertToDollar } from "../../utils/helpfulScripts";
import BorderLayout from "./BorderLayout";
import { usePromiseTracker } from "react-promise-tracker";
export default function ModalWithdraw({
  token,
  closeModal,
  onWithdraw,
  withdrawError,
  withdrawResult,
  addTokenToMetamask,
  contract,
  web3,
}) {
  const { promiseInProgress } = usePromiseTracker();

  const [value, setValue] = useState("");
  const [valueInDollars, setValueInDollars] = useState("0");
  // const max = token?.userTokenLentAmount.amount;

  let userMaximumAvailableInDollars =
    token.userTotalAmountAvailableToWithdrawInDollars;

    let max;
  let maxInDollars;


  const balanceInContractInDollars = token.userTokenLentAmount.inDollars - token.totalBorrowedInContract.inDollars;


  if (userMaximumAvailableInDollars <= balanceInContractInDollars) {

      max = userMaximumAvailableInDollars / token.oneTokenToDollar;
      maxInDollars = convertToDollar(token, max, contract, web3);
    } else {

      max = balanceInContractInDollars / token.oneTokenToDollar;
      maxInDollars =  convertToDollar(token, max, contract, web3)
    }





  // if (parseFloat(maxInDollars) > 0.0001) {
  //   maxInDollars = token.userTotalAmountAvailableToWithdrawInDollars - 0.0001
  // }

  // const maxInDollars = token?.userTokenLentAmount.inDollars;
  // const maxToWithdrawInDollars =
  // token?.userTotalAmountAvailableToWithdrawInDollars;

  return (
    <BorderLayout>
      {/* <!-- Modal header --> */}
      <div className="p-5">
        <div className="flex justify-between items-center rounded-t">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {withdrawResult?.transactionHash
              ? `Sucessful`
              : `Withdraw ${token?.name}`}
          </h3>
          <button
            onClick={() => {
              setValue("");
              setValueInDollars("0.00");
              closeModal();
            }}
            disabled={promiseInProgress}
            type="button"
            className={`text-gray-400 bg-transparent ${
              promiseInProgress
                ? "text-gray-200"
                : "dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-200 hover:text-gray-900"
            }  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center `}
            data-modal-toggle="small-modal"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        {/* <div className="p-2 mt-2 rounded-md bg-orange-200 ">
                <p className="">Wrong Network. Please switch to Kovan</p>
              </div> */}
      </div>
      {/* <!-- Modal body --> */}
      {withdrawResult?.transactionHash ? (
        <div className=" w-full   h-full md:h-auto">
          <div className="flex flex-col w-full justiy-center items-center">
            <Image
              src={correct}
              width={60}
              height={60}
              layout="fixed"
              className="card-img-top"
              alt="coinimage"
            />
            <div className="font-bold mt-4">All Done!</div>
            <p>
              You&apos;ve withdrawn {value} {token?.name}
            </p>
            <button
              onClick={() => addTokenToMetamask(token)}
              className="p-1 border my-3 border-gray-800 text-sm font-medium rounded-md"
            >
              {" "}
              + Add {token?.name} to the Wallet
            </button>

            <button
              onClick={() => {
                window.open(
                  `https://kovan.etherscan.io/tx/${withdrawResult.transactionHash}`,
                  "_blank"
                );
              }}
              className="text-sm self-end pr-3 mt-3 text-gray-500 "
            >
              Review tx details
            </button>

            <div className="flex w-full items-center p-6 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setValue("");
                  setValueInDollars("0.00");
                  closeModal();
                }}
                data-modal-toggle="small-modal"
                type="button"
                className="text-white w-full bg-gray-800  hover:bg-gray-900 hover:text-white rounded-md p-3"
              >
                <div className="flex justify-center ">Ok, Close.</div>
                {/*  */}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-6 pt-1 space-y-3">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Amount
            </p>
            <div className="flex flex-col items-center border rounded-md p-2 border-gray-300">
              <div className="w-full flex items-center">
                <input
                  onChange={async (event) => {
                    const { value } = event.target;
                    if (isNaN(value)) {
                      return;
                    }

                    if (Number(value) >= Number(max)) {
                      setValue(parseFloat(max));
                      setValueInDollars(todp(maxInDollars, 3));
                      return;
                    }

                    let usableValue = "0.00";

                    if (value) {
                      usableValue = parseFloat(value) * token?.oneTokenToDollar;
                    }

                    setValueInDollars(todp(usableValue, 3));
                    setValue(value);
                  }}
                  value={value}
                  type="text"
                  name="text"
                  id="text"
                  placeholder="0.00"
                  className="w-80 block pl-2 p-1 font-medium sm:text-lg focus:outline-none rounded-md"
                />
                {token && (
                  <Image
                    src={token.image}
                    width={30}
                    height={30}
                    layout="fixed"
                    className="ml-2 card-img-top"
                    alt="coinimage"
                  />
                )}

                <p className="font-medium text-sm ml-2">{token?.name}</p>
              </div>

              <div className="w-full justify-between flex items-center">
                <p className="pl-2 pt-0 mt-0 font-medium text-sm text-gray-400">
                  ${valueInDollars}
                </p>
                <div className="flex items-center">
                  <p className="font-medium text-sm text-gray-600">
                    Balance: {todp(max, 4)}
                  </p>
                  <button
                    onClick={() => {
                      setValue(Number(max));
                      setValueInDollars(todp(maxInDollars, 3));
                    }}
                    className="font-medium ml-2 text-gray-6 00 text-sm"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {withdrawError && (
              <div className="text-red-600 text-sm mt-5 bg-red-200 border overflow-auto scrollbar-hide rounded-md p-2 border-red-200 font-medium">
                {withdrawError.message}
              </div>
            )}
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex w-full items-center p-6 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
            <button
              disabled={!!!value || promiseInProgress}
              onClick={() => onWithdraw(token, value)}
              data-modal-toggle="small-modal"
              type="button"
              className={`${
                promiseInProgress
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900 "
              }text-white w-full hover:text-white rounded-md p-2`}
            >
              <div className="flex justify-center ">
                <LoadingSpinerComponent
                  buttonText={`Withdraw ${token?.name}`}
                  loadingMessage={`Withdrawing ${token?.name}`}
                />
              </div>
            </button>
          </div>
        </div>
      )}
    </BorderLayout>
  );
}
