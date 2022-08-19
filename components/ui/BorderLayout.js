export default function BorderLayout({ children }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity">
      <div
        tabIndex="-1"
        className="inline-block align-bottom h-5/6  rounded-lg w-full scrollbar-hide text-left outline-none overflow-auto transform max-w-sm mt-16 sm:max-w-md"
      >
        <div className="relative  h-full md:h-auto">
          {/* <!-- Modal content --> */}

          <div className="relative bg-white mx-3 rounded-lg shadow dark:bg-gray-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
