import Header from "@/components/ui/header";
import Step from "@/components/ui/step";
import Banner from "@/components/ui/banner";
import Video from "@/components/ui/video";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Banner />
        {/* <Video /> */}
        <Step />
      </main>
      <Footer />
    </>
  );
}
