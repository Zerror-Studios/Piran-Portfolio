import { createPageMetadata } from "@/lib/seo";
import ContactHero from "@/components/contact/ContactHero";
import FAQ from "@/components/contact/FAQ";
import BombayImage from "@/components/contact/BombayImage";

const ContactPage = () => {
  return (
    <>
        <ContactHero />
        <BombayImage/>
        <FAQ />
      </>
  );
};

export default ContactPage;

export async function generateMetadata() {
  return createPageMetadata("/contact");
}
