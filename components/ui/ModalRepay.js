import Image from "next/image";
import correct from "../../assets/correct.png";
import { useState } from "react";
import { convertToDollar, todp } from "../../utils/helpfulScripts";
import { LoadingSpinerComponent } from "../../utils/Spinner";
import BorderLayout from "./BorderLayout";
import { usePromiseTracker } from "react-promise-tracker";


export default function ModalRepay({
  token,
  closeModal,
  onRepay,
  repayError,
  repayResult,
  web3,
}) {

  const { promiseInProgress } = usePromiseTracker();

  const toWei = (value) => {
    return web3.utils.toWei(value);
  };

  const toBN = (value) => {
    return web3.utils.toBN(toWei(value));
  };

  const [value, setValue] = useState("");
  const [valueInDollars, setValueInDollars] = useState("0");

  const actualMax =
    (Number(token.walletBalance.amount) -
      Number(token.walletBalance.amount) * Number(token.borrowAPYRate));
  const tokenOwedWithInterest =
    Number(token.userTokenBorrowedAmount.amount) +
    Number(token.userTokenBorrowedAmount.amount) * Number(token.borrowAPYRate);

  let max;

  if (Number(token.walletBalance.amount) > tokenOwedWithInterest) {
    max = Number(token.userTokenBorrowedAmount.amount);
  } else {
    max = actualMax;
  }

  const maxInDollars = convertToDollar(token, max);

  const tokenAmountBorrowed = token.userTokenBorrowedAmount.amount;
  const tokenAmountBorrowedInDollars = convertToDollar(
    token,
    tokenAmountBorrowed
  );

  return (
    <BorderLayout>
      <div className="p-5">
        <div className="flex justify-between items-center rounded-t">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {repayResult?.transactionHash ? `Sucessful` : `Repay ${token.name}`}
          </h3>
          <button
            onClick={() => {
              setValue("");
              setValueInDollars("0.00");
              closeModal();
            }}
            disabled={promiseInProgress}
            type="button"
            className={`text-gray-400 bg-transparent ${promiseInProgress ? "text-gray-200": "dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-200 hover:text-gray-900" }  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center `}
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
      {repayResult?.transactionHash ? (
        <div className="pt-1 space-y-3">
          <div className="flex flex-col justiy-center items-center">
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
              You repayed {todp(value, 2)} {token.name}
            </p>

            <button
              onClick={() => {
                window.open(
                  `https://kovan.etherscan.io/tx/${repayResult.transactionHash}`,
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
                  setValue("0");
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
                      setValue("0");
                      return;
                    }

                    if (Number(value) >= Number(max)) {
                      setValue(max);
                      setValueInDollars(todp(maxInDollars, 3));
                      return;
                    }

                    let usableValue = convertToDollar(token, value);

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
                <Image
                  src={token.image}
                  width={30}
                  height={30}
                  layout="fixed"
                  className="ml-2 card-img-top"
                  alt="coinimage"
                />
                <p className="font-medium text-sm ml-2">{token.name}</p>
              </div>

              <div className="w-full justify-between flex items-center">
                <p className="pl-2 pt-0 mt-0 font-medium text-sm text-gray-400">
                  ${isNaN(valueInDollars) ? "0": valueInDollars}
                </p>
                <div className="flex items-center">
                  <p className="font-medium text-sm text-gray-600">
                    Balance: {todp(token.walletBalance.amount, 4)}
                  </p>
                  <button
                    onClick={() => {
                      setValue(Number(max));
                      setValueInDollars(todp(maxInDollars, 4));
                    }}
                    className="font-medium ml-2 text-gray-6 00 text-sm"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-1 space-y-3">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Transaction Overview
            </p>
            <div className="flex flex-col items-center border rounded-md p-2 border-gray-300">
              <div className="w-full flex items-center justify-between text-sm sm:text-md">
                Remaining Debt
                <div className="flex items-center">
                  <Image
                    src={token.image}
                    width={30}
                    height={30}
                    layout="fixed"
                    className="ml-2 card-img-top"
                    alt="coinimage"
                  />
                  <p className="font-medium text-sm ml-2">
                    {todp(tokenAmountBorrowed, 4)} {token.name}{" "}
                  </p>
                </div>
              </div>

              <div className="w-full justify-between flex items-center">
                <p></p>
                <div className="flex items-center">
                  <p className="font-medium text-sm text-gray-600">
                    ${todp(tokenAmountBorrowedInDollars, 4)}
                  </p>
                </div>
              </div>
            </div>

            {repayError && (
              <div className="text-red-600 h-auto overflow-auto scrollbar-hide text-sm mt-5 bg-red-200 border rounded-md p-2 border-red-200 font-medium">
                {repayError.message.toString()}
              </div>
            )}
          </div>

          {/* <!-- Modal footer --> */}
          <div className="flex w-full items-center p-6 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
            <button
                disabled={!!!value}
                onClick={() => onRepay(token, value)}
                data-modal-toggle="small-modal"
                type="button"
                className={`${promiseInProgress ? "bg-gray-500 cursor-wait": "bg-gray-800 hover:bg-gray-900 "}text-white w-full hover:text-white rounded-md p-2`}
            >
              <div className="flex justify-center ">
                <LoadingSpinerComponent
                  buttonText={`Repay ${token.name}`}
                  loadingMessage={`Repaying ${token.name}`}
                />
              </div>
            </button>
          </div>
        </div>
      )}
    </BorderLayout>
  );
}
