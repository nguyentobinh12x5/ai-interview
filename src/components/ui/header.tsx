import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
const Header = () => {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link className="block text-indigo-600" href="/">
              <span className="sr-only">Home</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  Beat Interview
                </span>
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold">BI</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-8">
            <nav aria-label="Global" className="md:block">
              <ul className="flex items-center gap-6">
                <SignedIn>
                  <li className="bg-indigo-600 text-white hover:bg-indigo-500 py-2 px-4 rounded-md">
                    <Link href={"/resume"} className="transitio">
                      Dashboard
                    </Link>
                  </li>
                </SignedIn>
              </ul>
            </nav>
            <div className="flex gap-4">
              <SignedOut>
                <SignUpButton />
              </SignedOut>
              <SignedOut>
                <div className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md">
                  <SignInButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
