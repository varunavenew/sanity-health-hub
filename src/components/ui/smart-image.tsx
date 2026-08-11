import { getDesktopVariant } from "@/lib/desktopImageVariants";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  alt: string;
  /** Min viewport width where the wide (1920) crop kicks in. */
  desktopFrom?: number;
  /** Class applied to the wrapping <picture> element. */
  pictureClassName?: string;
};

/**
 * <img> that automatically upgrades to the delivered 1920x1080 desktop crop on
 * wide viewports, falling back to the 1250x1080 mobile/card crop everywhere
 * else. Images without a registered desktop variant render as a plain <img>.
 */
export const SmartImage = ({
  src,
  alt,
  desktopFrom = 1024,
  pictureClassName,
  ...rest
}: Props) => {
  const wide = getDesktopVariant(src);
  if (!wide) return <img src={src} alt={alt} {...rest} />;

  return (
    <picture className={pictureClassName}>
      <source media={`(min-width: ${desktopFrom}px)`} srcSet={wide} />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
};

export default SmartImage;
