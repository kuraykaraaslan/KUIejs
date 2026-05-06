export type ThemeStatus = 'planned' | 'in-progress' | 'done';

export type ThemeMeta = {
  id: string;
  title: string;
  description: string;
  route: string;
  vertical: string;
  status: ThemeStatus;
  tags: string[];
  pages: ThemePageMeta[];
};

export type ThemePageMeta = {
  title: string;
  path: string;
};

export type ShowcaseMeta = {
  themes: ThemeMeta[];
};

export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export type ShowcaseNavItem = {
  id: string;
  title: string;
  category: string;
  abbr: string;
  href?: string;
  status?: ComponentStatus;
  since?: string;
};

export type ShowcaseNavGroup = {
  label: string;
  items: ShowcaseNavItem[];
  collapsible?: boolean;
  sectionStart?: string;
};

export type ShowcaseVariant = {
  title: string;
  previewHtml: string;
  code: string;
  layout?: 'side' | 'stack';
};

export type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  abbr: string;
  description: string;
  filePath: string;
  sourceCode: string;
  variants: ShowcaseVariant[];
};
