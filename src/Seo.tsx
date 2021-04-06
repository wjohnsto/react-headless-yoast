import React from 'react';
import isFunction from 'mintility/dist/isFunction';
import isObject from 'mintility/dist/isObject';
import isString from 'mintility/dist/isString';

export interface PageSchemaItem {
  '@type': any;
  '@id': string;
  url: string;
  name: any;
  isPartOf: {
    '@id': string;
  };
  description: any;
  inLanguage: string;
  potentialAction: {
    '@type': string;
    target: string[];
  }[];
  datePublished?: string;
  dateModified?: string;
}

export interface PageSchema {
  '@context': string;
  '@graph': PageSchemaItem[];
}

export interface SiteSchema {
  companyName: string;
  companyLogo?: {
    altText: string;
    sourceUrl: string;
    srcSet: string;
  };
  inLanguage?: string;
  siteName?: string;
  siteUrl?: string;
}

export interface Social {
  twitter: string;
}

export interface SeoImage {
  sourceUrl?: string;
  altText?: string;
  srcSet?: string;
}

export interface SeoOptions {
  title: string;
  description: string;
  locale: string;
  pageSchema?: PageSchema;
  siteSchema?: SiteSchema;
  readingTime?: string;
  canonical?: string;
  cornerstone?: string;
  focusKeyword?: string;
  keywords?: string;
  robots: {
    index: 'noindex' | 'index' | string;
    follow: 'nofollow' | 'follow' | string;
  };
  og?: {
    title?: string;
    description?: string;
    image?: SeoImage;
    type: string;
    url?: string;
    siteName?: string;
    publisher?: string;
    modifiedTime?: string;
    publishedTime?: string;
    author?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    creator?: string;
    image?: SeoImage;
  };
}

export interface PageSeo {
  title?: string;
  locale?: string;
  seo?: {
    breadcrumbs?: {
      text: string;
      url: string;
    };
    schema?: {
      articleType: string;
      pageType: string;
      raw: string;
    };
    canonical?: string;
    cornerstone?: string;
    focuskw?: string;
    metaDesc?: string;
    metaKeywords?: string;
    metaRobotsNofollow?: string;
    metaRobotsNoindex?: string;
    opengraphAuthor?: string;
    opengraphDescription?: string;
    opengraphImage?: {
      altText: string;
      srcSet: string;
      sourceUrl: string;
    };
    opengraphModifiedTime?: string;
    opengraphPublishedTime?: string;
    opengraphPublisher?: string;
    opengraphSiteName?: string;
    opengraphTitle?: string;
    opengraphType?: string;
    opengraphUrl?: string;
    readingTime?: string;
    title?: string;
    twitterDescription?: string;
    twitterImage?: {
      altText: string;
      srcSet: string;
      sourceUrl: string;
    };
    twitterTitle?: string;
  };
  author?: {
    node?: {
      seo?: {
        metaDesc?: string;
        metaRobotsNofollow?: string;
        metaRobotsNoindex?: string;
        schema?: {
          raw: string;
        };
        social?: {
          facebook?: string;
          twitter?: string;
        };
        title?: string;
      };
    };
  };
}

export function toTwitter(str?: string) {
  if (!isString(str)) {
    return str;
  }

  if (str[0] === '@') {
    return str;
  }

  return `@${str}`;
}

export function postToSeoOptions(
  page: PageSeo,
  pageSchema?: PageSchema | string,
  siteSchema?: SiteSchema | string,
): SeoOptions {
  const { seo } = page;
  let pageSchemaObject = (isString(pageSchema)
    ? JSON.parse(pageSchema)
    : pageSchema) as PageSchema | undefined;

  if (!isObject(pageSchemaObject) && isString(seo?.schema?.raw)) {
    pageSchemaObject = JSON.parse(seo?.schema?.raw ?? '') as PageSchema;
  }

  const siteSchemaObject = (isString(siteSchema)
    ? JSON.parse(siteSchema)
    : siteSchema) as SiteSchema | undefined;

  const title =
    page.title ||
    seo?.title ||
    seo?.opengraphTitle ||
    seo?.twitterTitle ||
    siteSchemaObject?.siteName ||
    '';

  const description =
    seo?.metaDesc || seo?.opengraphDescription || seo?.twitterDescription || '';

  const canonical = seo?.canonical || seo?.opengraphUrl;
  const locale = page.locale || 'en_US';
  const cornerstone = seo?.cornerstone;
  const focusKeyword = seo?.focuskw;
  const keywords = seo?.metaKeywords;
  const readingTime = seo?.readingTime;

  const robotsIndex =
    seo?.metaRobotsNoindex === 'noindex' ? 'noindex' : 'index';
  const robotsFollow =
    seo?.metaRobotsNofollow === 'nofollow' ? 'nofollow' : 'follow';

  const image = {
    sourceUrl:
      seo?.opengraphImage?.sourceUrl ||
      seo?.twitterImage?.sourceUrl ||
      siteSchemaObject?.companyLogo?.sourceUrl,
    altText:
      seo?.opengraphImage?.altText ||
      seo?.twitterImage?.altText ||
      siteSchemaObject?.companyLogo?.altText,
    srcSet:
      seo?.opengraphImage?.srcSet ||
      seo?.twitterImage?.srcSet ||
      siteSchemaObject?.companyLogo?.srcSet,
  };

  return {
    title,
    description,
    locale,
    canonical,
    cornerstone,
    focusKeyword,
    keywords,
    pageSchema: pageSchemaObject,
    siteSchema: siteSchemaObject,
    readingTime,
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
    },
    og: {
      title: seo?.opengraphTitle || title,
      description: seo?.opengraphDescription || description,
      image: (seo?.opengraphImage as SeoImage) || image,
      type: seo?.opengraphType || 'website',
      url: seo?.opengraphUrl || seo?.canonical,
      author: seo?.opengraphAuthor,
      publisher: seo?.opengraphPublisher,
      modifiedTime: seo?.opengraphModifiedTime,
      publishedTime: seo?.opengraphPublishedTime,
    },
    twitter: {
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      image: (seo?.twitterImage as SeoImage) || image,
      creator: page?.author?.node?.seo?.social?.twitter,
    },
  };
}

export interface SeoProps {
  meta?: React.ReactFragment;
  page?: PageSeo;
  pageSchema?: PageSchema;
  siteSchema?: SiteSchema;
  processSchema?: (schema: string) => string;

  /**
   * This must be a React component that will render meta tags into the <head> element in the HTML
   *
   * @type {React.ComponentType<{ children: React.ReactNode }>}
   * @memberof SeoProps
   */
  MetaRenderElement: React.ComponentType<{ children: React.ReactNode }>;
}

export default function Seo({
  meta,
  page,
  pageSchema,
  siteSchema,
  MetaRenderElement,
  processSchema,
}: SeoProps) {
  const seoOptions = postToSeoOptions(page || {}, pageSchema, siteSchema);

  const {
    title,
    description,
    canonical,
    locale,
    keywords,
    robots,
    og,
    twitter,
  } = seoOptions;

  let { pageSchema: pageSchemaObj, siteSchema: siteSchemaObj } = seoOptions;

  let pageSchemaStr = isObject(pageSchemaObj)
    ? JSON.stringify(pageSchemaObj)
    : undefined;
  let siteSchemaStr = isObject(siteSchemaObj)
    ? JSON.stringify(siteSchemaObj)
    : undefined;

  if (isFunction(processSchema)) {
    if (isString(pageSchemaStr)) {
      pageSchemaStr = processSchema(pageSchemaStr);
      pageSchemaObj = JSON.parse(pageSchemaStr) as PageSchema;
    }

    if (isString(siteSchemaStr)) {
      siteSchemaStr = processSchema(siteSchemaStr);
      siteSchemaObj = JSON.parse(siteSchemaStr) as SiteSchema;
    }
  }

  return (
    <MetaRenderElement>
      {meta}
      <title>{title}</title>
      <meta
        name="robots"
        content={`max-snippet:-1, max-image-preview:large, max-video-preview:-1, ${robots.index}, ${robots.follow}`}
      />
      {isString(canonical) && <link rel="canonical" href={canonical} />}
      {isString(description) && (
        <meta name="description" content={description} />
      )}
      {isString(keywords) && <meta name="keywords" content={keywords} />}
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={og?.type} />
      {isString(siteSchemaObj?.siteName) && (
        <meta property="og:site_name" content={siteSchemaObj?.siteName} />
      )}
      {isString(og?.title) && <meta property="og:title" content={og?.title} />}
      {isString(og?.description) && (
        <meta property="og:description" content={og?.description} />
      )}
      {isString(og?.author) && (
        <meta property="og:author" content={og?.author} />
      )}
      {isString(og?.url) && <meta property="og:url" content={og?.url} />}
      {isString(og?.publishedTime) && (
        <meta property="article.published_time" content={og?.publishedTime} />
      )}
      {isString(og?.modifiedTime) && (
        <meta property="article.modified_time" content={og?.modifiedTime} />
      )}
      {isString(og?.image?.sourceUrl) && (
        <>
          <meta property="og:image" content={og?.image?.sourceUrl} />
          {isString(og?.image?.altText) && (
            <meta property="og:image:alt" content={og?.image?.altText} />
          )}
        </>
      )}
      {isString(twitter?.title) && (
        <meta name="twitter:title" content={twitter?.title} />
      )}
      {isString(twitter?.description) && (
        <meta name="twitter:description" content={twitter?.description} />
      )}
      {isString(twitter?.image?.sourceUrl) && (
        <>
          <meta name="twitter:image" content={twitter?.image?.sourceUrl} />
          {isString(twitter?.image?.altText) && (
            <meta name="twitter:image:alt" content={twitter?.image?.altText} />
          )}
        </>
      )}
      {isString(twitter?.creator) && (
        <meta name="twitter:creator" content={toTwitter(twitter?.creator)} />
      )}
      {isString(pageSchemaStr) && (
        <script type="application/ld+json">{pageSchemaStr}</script>
      )}
    </MetaRenderElement>
  );
}
