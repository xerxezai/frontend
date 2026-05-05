export interface PricingFeature {
  text: string;
  isIncluded: boolean;
}

export interface PricingPlan {
  id: number;
  iconClass: string;
  iconBgClass: string;
  planName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: {
    text: string;
    included: boolean;
  }[];
  buttonLink: string;
}

export interface MenuItem {
  title: string;
  link: string;
  hasDropdown: boolean;
  isHomemenu?: boolean;
  img?: string;
  submenu?: MenuItem[];
}

export interface ProjectDataType {
  id: number;
  image: string;
  detailImg: string;
  category: string;
  title: string;
  slug: string;
}

export interface ServiceDataType {
  iconClass: string;
  detailImg: string;
  iconBgImg: string;
  title: string;
  description: string;
  slug: string;
}

export interface TeamDataType {
  id: number;
  socialLinks: {
    iconClass: string;
    url: string;
  }[];
  name: string;
  slug: string;
  role: string;
  image: string;
}

export interface BlogDataType {
  id: number;
  title: string;
  slug: string;
  author: string;
  image: string;
  content: string;
  category: string;
  tags: string[];
  comments: number;
  readTime: string;
  date: string;
}
