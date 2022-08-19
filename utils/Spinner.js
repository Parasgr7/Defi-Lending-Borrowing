import React, { Component } from "react";
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingSpinerComponent = ({ buttonText, loadingMessage }) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div className="">
      {promiseInProgress === true ? (
        <div className="flex items-center">
          <div className="loader"></div>
          {loadingMessage && <div className="ml-2 text-white font-medium">{loadingMessage}</div>}
        </div>
      ) : (
        buttonText
      )}
    </div>
  );
};
