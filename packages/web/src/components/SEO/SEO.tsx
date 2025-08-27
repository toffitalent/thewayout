import Head from 'next/head';
import React from 'react';
import imgMeta from '@app/assets/images/meta.png';

export interface SEOProps {
  children?: React.ReactNode;
  description?: string;
  image?: string;
  noIndex?: boolean;
  title?: string;
  titleTemplate?: (title?: string) => string;
}

export function SEO({
  children,
  description = process.env.NEXT_PUBLIC_DESCRIPTION,
  image = imgMeta.src,
  noIndex = false,
  title,
  titleTemplate = (title) => `${title ? `${title} | ` : ''}${process.env.NEXT_PUBLIC_TITLE}`,
}: SEOProps) {
  return (
    <Head>
      <title>{titleTemplate(title)}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={image} />
      <meta name="og:image:width" content="1200" />
      <meta name="og:image:height" content="630" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@twoutapp" />
      <meta name="twitter:creator" content="@twoutapp" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {noIndex && <meta name="robots" content="noindex" />}
      {children}
    </Head>
  );
}
