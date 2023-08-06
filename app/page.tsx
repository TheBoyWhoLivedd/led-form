import { LedForm } from "@/components/ledform";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 lg:px-24">
        <div className="w-full md:max-w-3/4 mx-auto px-6 md:px-12 lg:px-24">
          <LedForm />
        </div>
      </main>
    </>
  );
}
