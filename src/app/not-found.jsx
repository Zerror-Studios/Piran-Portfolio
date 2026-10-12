import NotFoundContent from "@/components/common/NotFoundContent";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Page not found | ${siteConfig.name}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
