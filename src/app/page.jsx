import Footer from "@/components/common/Footer";
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import MobileHero from "@/components/home/MobileHero";
import Thesis from "@/components/home/Thesis";
import RecordNotResume from "@/components/home/RecordNotResume";
import WorkBehindGrowth from "@/components/home/WorkBehindGrowth";
import WorkResult from "@/components/home/WorkResult";
import { createPageMetadata } from "@/lib/seo";
import LogoDotSpreadCanvas from "@/components/home/canvasComponent/LogoDotSpreadCanvas";
import LogoParticlesNew from "@/components/home/LogoParticlesNew";
import Portfolio from "@/components/home/Portfolio";
import Resume from "@/components/home/Resume";
import Testimonials from "@/components/home/Testimonials";

const HomePage = () => {
  return (
    <>
      <div className="w-full relative bg-[#0B1A2C]">
        <div className="sticky w-full h-screen top-0">
          <LogoParticlesNew />
        </div>
        <div className="-mt-[100vh]">
          <Hero />
          {/* <MobileHero /> */}
        </div>
        <About />
      <LogoDotSpreadCanvas colorBg="#0B1A2C" colorDots="#e3e2dc" />
      </div>
      <WorkResult />
      <WorkBehindGrowth />
      <Portfolio/>
      <Thesis />
      <Resume/>
      <Testimonials/>
    </>
  );
};

export default HomePage;

export async function generateMetadata() {
  return createPageMetadata("/");
}
