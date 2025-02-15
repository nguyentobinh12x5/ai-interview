import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white">
      <div>
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <SignUp />
          </div>
        </main>
      </div>
    </section>
  );
}
