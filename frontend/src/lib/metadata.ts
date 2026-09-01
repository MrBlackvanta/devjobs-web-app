import { siteName } from "@/data/site";
import type { Metadata } from "next";

const images = [
  {
    url: "/opengraph-image.jpg",
    width: 1200,
    height: 630,
    alt: "The devjobs board, listing developer roles with each company's logo, posting age, contract type and location.",
  },
];

type PageMetadata = {
  title: string;
  shareTitle: string;
  description: string;
  path: string;
};

export function pageMetadata({
  title,
  shareTitle,
  description,
  path,
}: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName,
      locale: "en_US",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images,
    },
  };
}
