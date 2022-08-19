import Link from "next/link";

export default function Footer() {
  return (
    <footer className="block py-4">
      <div className="container mx-auto px-4">
        <hr className="mb-4 border-b-1 border-blueGray-200" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4">
            
          </div>
          <div className="w-full md:w-8/12 px-4">
            <ul className="flex flex-wrap list-none md:justify-end  justify-center">
              <li>
              <Link href="/">
                <a className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1">
                  About Us
                </a>
              </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}


