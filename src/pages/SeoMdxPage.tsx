import NotFound from "./NotFound";
import { useLocation } from "react-router-dom";
import { getSeoPageByPath } from "@/lib/seo-content";
import BlogPage from "@/templates/BlogPage";
import InsuranceTypePage from "@/templates/InsuranceTypePage";
import LocationPage from "@/templates/LocationPage";

const SeoMdxPage = () => {
  const { pathname } = useLocation();
  const page = getSeoPageByPath(pathname);

  if (!page) {
    return <NotFound />;
  }

  switch (page.frontmatter.template) {
    case "insurance-type-page":
      return <InsuranceTypePage page={page} />;
    case "location-page":
      return <LocationPage page={page} />;
    default:
      return <BlogPage page={page} />;
  }
};

export default SeoMdxPage;
