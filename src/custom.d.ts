// src/custom.d.ts or src/types/swiper-declarations.d.ts

// Declarations for Swiper's bare module CSS imports
declare module "swiper/css";
declare module "swiper/css/autoplay";
declare module "swiper/css/effect-fade";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
declare module "swiper/css/scrollbar";

// Your existing declaration for local CSS files (still useful for other custom CSS imports)
declare module "*.css" {
  const content: any;
  export default content;
}

// You might also need specific declarations for other file types if you import them directly,
// like images:
// declare module '*.png' {
//   const value: string;
//   export default value;
// }
