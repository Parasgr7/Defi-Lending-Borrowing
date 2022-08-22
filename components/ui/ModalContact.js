import Image from "next/image";
import BorderLayout from "./BorderLayout";
export default function ModalContact({closeModal}) {

  return (
    <BorderLayout>
      <div className="p-5">
        <div className="flex justify-between items-center rounded-t">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            About Me
          </h3>
          <button
            onClick={() => {closeModal()}}
            type="button"
            className={`text-gray-400 bg-transparent dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-200 hover:text-gray-900" rounded-lg text-sm p-1.5 ml-auto inline-flex items-center `}
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
        <div className="pt-1 space-y-3">
          <div className="flex flex-col justiy-center items-center">
          <button type="button" className="text-white bg-[#175bb0] hover:bg-[#043a7d] focus:ring-2 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-1xl  text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
          onClick={() => {
            window.open(
              `https://www.linkedin.com/in/paras-gaur/`,
              "_blank"
            );
          }}>
                <svg
                  className="mr-2 -ml-1 w-7 h-7 text-blue-300 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>

                <span className="px-2 py-4 text-2xl text-gray-100 border-l-2 border-gray-100 font-mono">
                </span>
                <div className='text-xl font-mono font-bold pt-0.5'>
                    @LinkedIn
                </div>
            </button>
            <button type="button" className="text-white bg-[#565759] hover:bg-[#2f2f30] focus:ring-2 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-1xl  text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
            onClick={() => {
              window.open(
                `https://github.com/Parasgr7/`,
                "_blank"
              );
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 -ml-1 w-7 h-7 text-black fill-current" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>

                  <span className="px-2 py-4 text-2xl text-gray-100 border-l-2 border-gray-100 font-mono">
                  </span>
                  <div className='text-xl font-mono font-bold pt-0.5'>
                      @Github
                  </div>
              </button>
              <div className="font-bold mt-3 text-lg">Paras Gaur </div>Blockchain Developer
            <div className="flex w-full items-center p-6 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
            </div>
          </div>
        </div>

    </BorderLayout>
  );
}
