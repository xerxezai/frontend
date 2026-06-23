import { forwardRef } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  [key: string]: any;
}

const Image = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, width, height, className = "", ...rest }, ref) => {
    const basePath = import.meta.env.VITE_APP_BASE_PATH ?? "";
    const resolvedSrc = src.startsWith("/") || src.startsWith("http") ? src : `${basePath}${src}`;
    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        {...rest}
      />
    );
  }
);

export default Image;
