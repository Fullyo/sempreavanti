import { Helmet } from "react-helmet-async";

const SITE = "https://villassempreavanti.com";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export const SEO = ({ title, description, path, image, type = "website", noindex = false }: SEOProps) => {
  const url = `${SITE}${path}`;
  const img = image || `${SITE}/hero-villa.png`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default SEO;
