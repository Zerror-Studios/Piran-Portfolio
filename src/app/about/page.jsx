import AboutHero from "@/components/about/AboutHero";
import AboutStrength from "@/components/about/AboutStrength";
import AboutWork from "@/components/about/AboutWork";
import Beleive from "@/components/about/Beleive";
import GallerySection from "@/components/about/GallerySection";
import ParallaxSection from "@/components/about/ParallaxSection";
import StorySection from "@/components/about/StorySection";
import StorySlider from "@/components/about/StorySlider";
import AboutFooter from "@/components/common/AboutFooter";
import { createPageMetadata } from "@/lib/seo";

const AboutPage = () => {
  return (
    <>
      <AboutHero />
      <StorySlider/>
      <Beleive/>
      <AboutStrength />
      <GallerySection/>
    </>
  );
};

export default AboutPage;

export async function generateMetadata() {
  return createPageMetadata("/about");
}
