# react-headless-yoast

[![Version](https://img.shields.io/npm/v/react-headless-yoast.svg)](https://npmjs.org/package/react-headless-yoast)

A React component that handles Yoast SEO in a Headless WordPress site.

The **primary objective** of this library is to make it easier to integrate Yoast SEO for WordPress in a headless React frontend.

# Table of Contents

- [Current Status](#current-status)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Example WPGraphQL Query](#example-wpgraphql-query)
  - [Using The SEO Component](#using-the-seo-component)
- [How can I Contribute](#how-can-i-contribute)
  - [Test](#test)
  - [Make a Pull Request](#make-a-pull-request)

# Current Status

This project is active and maintained. Feel free to submit issues and PRs!

- Most recent build is linted according to .eslintrc.js

# Installation

Using npm:

```shell
npm i react-headless-yoast
```

> NOTE: add `-S` if you are using npm < 5.0.0

Using yarn:

```shell
yarn add react-headless-yoast
```

# Getting Started

The recommended way to use `react-headless-yoast` is by using [WPGraphQL](https://www.wpgraphql.com/) combined with [Yoast](https://yoast.com/wordpress/plugins/seo/) and [WPGraphQL For Yoast](https://github.com/ashhitch/wp-graphql-yoast-seo) to get SEO metadata related to Posts, Pages, and custom content types on your headless WordPress site. `react-headless-yoast` is setup to work well with the API definition that WPGraphQL For Yoast uses.

> **NOTE**: `react-headless-yoast` does not provide a way of putting meta tags into the `head` element on your site. This is deliberate, as depending upon what frontend libraries you are using (e.g. `Next.js`, `Gatsby`, `react-head`, etc) you may have a specific way you want to add tags to the `head`.

## Example WPGraphQL Query

In order to get the most out of this library you will want to craft a WPGraphQL query that includes the `seo` object published by `WPGraphQL For Yoast`. This partial query works on pages, posts, and other custom content types, so add it to your query for pages/posts as a returned property.

```
seo {
  breadcrumbs {
    text
    url
  }
  schema {
    articleType
    pageType
    raw
  }
  canonical
  cornerstone
  focuskw
  metaDesc
  metaKeywords
  metaRobotsNofollow
  metaRobotsNoindex
  opengraphAuthor
  opengraphDescription
  opengraphImage {
    altText
    srcSet
    sourceUrl
  }
  opengraphModifiedTime
  opengraphPublishedTime
  opengraphPublisher
  opengraphSiteName
  opengraphTitle
  opengraphType
  opengraphUrl
  readingTime
  title
  twitterDescription
  twitterImage {
    altText
    srcSet
    sourceUrl
  }
  twitterTitle
}
```

You will also want to get the `SiteSchema` for your WordPress site using the following query:

```
{
  seo {
    schema {
      companyName
      companyLogo {
        altText
        sourceUrl
        srcSet
      }
      inLanguage
      siteName
      siteUrl
    }
  }
}
```

## Using The SEO Component

The `<Seo />` component is the primary export from `react-headless-seo`. It will render `title`, `meta`, and `script` tags related to the SEO data you pass in as props. This means you will have to use a component designed to render those elements into the `head` tag for your site (i.e. something like `react-head`). The following code uses `next/head`, but you can use whatever `head` component you want:

```tsx
import Seo, { SeoProps } from 'react-headless-yoast';
import Head from 'next/head';

export function MyComponent({
  seo,
}: {
  seo: Omit<SeoProps, 'MetaRenderElement'>;
}) {
  return (
    <Seo
      pageSchema={seo.pageSchema}
      siteSchema={seo.siteSchema}
      page={seo.page ?? { title: 'My WordPress Site' }}
      MetaRenderElement={Head}
      meta={
        <>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/favicon/apple-touch-icon.png"
          />
          ,
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
          />
          ,
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
          />
          ,
          <link rel="manifest" href="/images/favicon/site.webmanifest" />,
          <link rel="shortcut icon" href="/images/favicon/favicon.ico" />,
          <meta name="msapplication-TileColor" content="#da532c" />,
          <meta
            name="msapplication-config"
            content="/images/favicon/browserconfig.xml"
          />
          ,
          <meta name="theme-color" content="#ffffff" />,
        </>
      }
    />
  );
}
```

The code above uses the `SeoProps` type to fill out the props for `<Seo />` with the correct values. The type is defined in `react-headless-yoast` so you can see what it expects.

> **NOTE**: The example above also passes in favicon meta tags using the optional `meta` prop. You can use this to put additional tags into the `Head`.

# How can I Contribute?

`react-headless-seo` is open to contributions that improve the core functionality of the library while sticking to the primary objective listed above.

## Test

Before you share your improvement with the world, make sure you add tests to validate your contribution. Testing is done using `jest`.

## Make A Pull Request

Once you've tested your contribution, submit a pull request. Make sure to [squash your commits](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#_squashing) first!.
