export interface SubItem {
  label: string;
  anchor?: string;
  path?: string;
}

export interface SubCategory {
  /** Treatment slug — used for stable hover state across locales. */
  id?: string;
  label: string;
  path: string;
  items?: SubItem[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  path: string;
  subcategories: SubCategory[];
}
