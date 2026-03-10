import { Helmet } from "react-helmet-async";

const SITE_URL = "https://renora.com.au";
const SITE_NAME = "Renora";
const DEFAULT_TITLE = "Renora";
const DEFAULT_DESCRIPTION =
  "Premium cleaning services for homes and businesses. Residential, commercial, deep cleaning, and more.";

function toAbsoluteUrl(pathname) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

export function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noIndex = false,
  jsonLd,
}) {
  const canonicalUrl = toAbsoluteUrl(path);
  const logoUrl = toAbsoluteUrl("/renoralogo.svg");

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    name: SITE_NAME,
    url: SITE_URL,
    logo: logoUrl,
    image: logoUrl,
    description,
    areaServed: "AU",
  };

  const jsonLdList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={logoUrl} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logoUrl} />

      <script type="application/ld+json">
        {JSON.stringify(defaultJsonLd)}
      </script>
      {jsonLdList.map((blob, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(blob)}
        </script>
      ))}
    </Helmet>
  );
}
