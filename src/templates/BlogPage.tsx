import EditorialGuidePage from "./EditorialGuidePage";
import type { SeoPage } from "@/lib/seo-content";

const BlogPage = ({ page }: { page: SeoPage }) => <EditorialGuidePage page={page} />;

export default BlogPage;
