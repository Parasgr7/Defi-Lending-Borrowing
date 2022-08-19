import Link from "next/link";
import { useState } from "react";
import ModalContact from "./ModalContact";

export default function Footer() {
  const [contactDeveloper, setContactDeveloper] = useState(false);
  const handleCloseModal = () => {
    setContactDeveloper(false)
  };

  return (
    <>
      <footer className="block py-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">

            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <button
                    onClick={() =>
                      setContactDeveloper(true)
                    }
                    className="ml-2 border border-gray-400 text-base font-medium text-gray-800 p-2 rounded-md"
                  >
                    Contact Developer
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <div className="flex justify-center text-center sm:block sm:p-0 mt-2">
        {contactDeveloper && (
          <ModalContact
            closeModal={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}
