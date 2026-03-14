import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const builder =
  projectId && dataset
    ? imageUrlBuilder({
        projectId,
        dataset,
      })
    : null;

type ImageSource = {
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
  alt?: string;
};

type ImageUrlOptions = {
  width?: number;
  height?: number;
};

export function getSanityImageUrl(source?: ImageSource, options: ImageUrlOptions = {}): string | undefined {
  if (!source || !builder) return undefined;
  if (!source.asset?._ref && !source.asset?.url) return undefined;

  let url = builder.image(source).auto("format");

  if (options.width) {
    url = url.width(options.width);
  }
  if (options.height) {
    url = url.height(options.height).fit("crop");
  }

  return url.url();
}
