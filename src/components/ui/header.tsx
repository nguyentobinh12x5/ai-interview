import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
const Header = async () => {
  const user = await currentUser();
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                layout="fixed"
              />
            </a>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href={"/prepare-hub"}
                    className="text-gray-500 transition hover:text-gray-500/75"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="hidden md:relative md:block">
              {user ? (
                <div>Hello {user?.firstName}</div>
              ) : (
                <Button>
                  <a href="sign-in">Sign in</a>
                </Button>
              )}
            </div>

            <div className="block md:hidden">
              <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
