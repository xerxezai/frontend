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
    const basePath = import.meta.env.VITE_APP_BASE_PATH;
    return (
      <img
        ref={ref}
        src={`${basePath}${src}`}
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
