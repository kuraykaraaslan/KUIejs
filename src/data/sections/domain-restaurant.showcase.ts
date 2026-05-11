import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const BASE = path.join(process.cwd(), 'modules/domain/restaurant');

const menuCategoryBadgeSource = fs.readFileSync(path.join(BASE, 'MenuCategoryBadge.ejs'), 'utf-8');
const allergenBadgeSource     = fs.readFileSync(path.join(BASE, 'AllergenBadge.ejs'),     'utf-8');
const dietaryBadgeSource      = fs.readFileSync(path.join(BASE, 'DietaryBadge.ejs'),      'utf-8');
const tableBadgeSource        = fs.readFileSync(path.join(BASE, 'TableBadge.ejs'),         'utf-8');
const menuItemCardSource      = fs.readFileSync(path.join(BASE, 'MenuItemCard.ejs'),       'utf-8');
const menuItemRowSource       = fs.readFileSync(path.join(BASE, 'MenuItemRow.ejs'),        'utf-8');
const qrCodeDisplaySource     = fs.readFileSync(path.join(BASE, 'QrCodeDisplay.ejs'),     'utf-8');

function catBadge(cat: string, size = 'md'): string {
  const meta: Record<string, { label: string; text: string; bg: string; border: string }> = {
    STARTER: { label: 'Starter', text: 'text-amber-700',   bg: 'bg-amber-50',          border: 'border-amber-200'    },
    MAIN:    { label: 'Main',    text: 'text-blue-700',    bg: 'bg-blue-50',            border: 'border-blue-200'     },
    DESSERT: { label: 'Dessert', text: 'text-purple-700',  bg: 'bg-purple-50',          border: 'border-purple-200'   },
    DRINK:   { label: 'Drink',   text: 'text-cyan-700',    bg: 'bg-cyan-50',            border: 'border-cyan-200'     },
    SIDE:    { label: 'Side',    text: 'text-gray-600',    bg: 'bg-gray-100',           border: 'border-gray-300'     },
  };
  const m = meta[cat] || meta.MAIN;
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return `<span class="inline-flex items-center rounded-full border font-medium ${cls} ${m.text} ${m.bg} ${m.border}">${m.label}</span>`;
}

function allergenBadge(a: string): string {
  const abbr: Record<string, string> = { GLUTEN: 'Glu', DAIRY: 'Dai', NUTS: 'Nut', EGGS: 'Egg', SOY: 'Soy', SHELLFISH: 'She', FISH: 'Fsh' };
  return `<span class="inline-flex items-center rounded border font-mono text-xs px-2 py-0.5 text-gray-600 bg-gray-100 border-gray-300">${abbr[a] || a.slice(0, 3)}</span>`;
}

function dietaryBadge(type: string): string {
  const meta: Record<string, { label: string; icon: string; cls: string }> = {
    VEGAN:       { label: 'Vegan',       icon: 'fa-leaf',          cls: 'text-green-700 bg-green-50 border-green-200'   },
    VEGETARIAN:  { label: 'Vegetarian',  icon: 'fa-seedling',      cls: 'text-green-600 bg-green-50 border-green-200'   },
    HALAL:       { label: 'Halal',       icon: 'fa-star',          cls: 'text-blue-700 bg-blue-50 border-blue-200'      },
    GLUTEN_FREE: { label: 'Gluten-Free', icon: 'fa-wheat-awn-circle-exclamation', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  };
  const m = meta[type] || { label: type, icon: 'fa-circle-check', cls: 'text-gray-600 bg-gray-100 border-gray-300' };
  return `<span class="inline-flex items-center rounded-full border font-medium text-xs px-2.5 py-1 gap-1.5 ${m.cls}"><i class="fa-solid ${m.icon} text-xs" aria-hidden="true"></i>${m.label}</span>`;
}

function sampleItemCardHtml(name: string, emoji: string, price: number, dietary: string[], desc: string): string {
  const dietBadges = dietary.map(d => dietaryBadge(d)).join('');
  return `<div class="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden w-56">
  <div class="flex items-center justify-center h-28 bg-gray-50 text-5xl">${emoji}</div>
  <div class="flex flex-col gap-1.5 p-3">
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-bold text-gray-900">${name}</span>
      <span class="shrink-0 text-sm font-bold text-blue-600">₺${price}</span>
    </div>
    <p class="text-xs text-gray-500 line-clamp-2">${desc}</p>
    ${dietBadges ? `<div class="flex flex-wrap gap-1 mt-1">${dietBadges}</div>` : ''}
  </div>
</div>`;
}

export function buildDomainRestaurantData(): ShowcaseItem[] {
  return [
    {
      id: 'restaurant-menu-category-badge',
      title: 'MenuCategoryBadge',
      category: 'Domain · Restaurant',
      abbr: 'MC',
      description: 'Color-coded pill badge for each menu category: Starter, Main, Dessert, Drink, Side.',
      filePath: 'modules/domain/restaurant/MenuCategoryBadge.ejs',
      sourceCode: menuCategoryBadgeSource,
      variants: [
        {
          title: 'All categories',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['STARTER','MAIN','DESSERT','DRINK','SIDE'].map(c => catBadge(c)).join('')}</div>`,
          code: `<%- include('../../../modules/domain/restaurant/MenuCategoryBadge', { category: 'MAIN' }) %>`,
        },
        {
          title: 'Small size',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['STARTER','MAIN','DESSERT'].map(c => catBadge(c, 'sm')).join('')}</div>`,
          code: `<%- include('../../../modules/domain/restaurant/MenuCategoryBadge', { category: 'STARTER', size: 'sm' }) %>`,
        },
      ],
    },
    {
      id: 'restaurant-allergen-badge',
      title: 'AllergenBadge',
      category: 'Domain · Restaurant',
      abbr: 'AB',
      description: 'Compact monospace badge for the 7 common allergens: Gluten, Dairy, Nuts, Eggs, Soy, Shellfish, Fish.',
      filePath: 'modules/domain/restaurant/AllergenBadge.ejs',
      sourceCode: allergenBadgeSource,
      variants: [
        {
          title: 'All allergens',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['GLUTEN','DAIRY','NUTS','EGGS','SOY','SHELLFISH','FISH'].map(a => allergenBadge(a)).join('')}</div>`,
          code: `<%- include('../../../modules/domain/restaurant/AllergenBadge', { allergen: 'GLUTEN' }) %>`,
        },
      ],
    },
    {
      id: 'restaurant-dietary-badge',
      title: 'DietaryBadge',
      category: 'Domain · Restaurant',
      abbr: 'DB',
      description: 'Dietary designation badge with icon: Vegan, Vegetarian, Halal, Gluten-Free.',
      filePath: 'modules/domain/restaurant/DietaryBadge.ejs',
      sourceCode: dietaryBadgeSource,
      variants: [
        {
          title: 'All types',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['VEGAN','VEGETARIAN','HALAL','GLUTEN_FREE'].map(t => dietaryBadge(t)).join('')}</div>`,
          code: `<%- include('../../../modules/domain/restaurant/DietaryBadge', { type: 'VEGAN' }) %>`,
        },
      ],
    },
    {
      id: 'restaurant-table-badge',
      title: 'TableBadge',
      category: 'Domain · Restaurant',
      abbr: 'TB',
      description: 'Table status badge showing table number, capacity, and availability.',
      filePath: 'modules/domain/restaurant/TableBadge.ejs',
      sourceCode: tableBadgeSource,
      variants: [
        {
          title: 'All statuses',
          previewHtml: `<div class="flex flex-wrap gap-3 p-4">
  <div class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border-green-200"><i class="fa-solid fa-chair text-xs" aria-hidden="true"></i><span>Table 2</span><span class="opacity-70">(4 seats)</span><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span><span>Available</span></div>
  <div class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border-red-200"><i class="fa-solid fa-chair text-xs" aria-hidden="true"></i><span>Table 1</span><span class="opacity-70">(2 seats)</span><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span><span>Occupied</span></div>
  <div class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border-amber-200"><i class="fa-solid fa-chair text-xs" aria-hidden="true"></i><span>Table 3</span><span class="opacity-70">(4 seats)</span><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span><span>Reserved</span></div>
</div>`,
          code: `<%- include('../../../modules/domain/restaurant/TableBadge', { tableNumber: 2, capacity: 4, status: 'AVAILABLE' }) %>`,
        },
      ],
    },
    {
      id: 'restaurant-menu-item-card',
      title: 'MenuItemCard',
      category: 'Domain · Restaurant',
      abbr: 'MI',
      description: 'Card layout for a menu item with emoji, name, description, price, dietary and allergen badges.',
      filePath: 'modules/domain/restaurant/MenuItemCard.ejs',
      sourceCode: menuItemCardSource,
      variants: [
        {
          title: 'Featured item',
          previewHtml: `<div class="p-4">${sampleItemCardHtml('Lamb Kofta', '🍖', 285, ['GLUTEN_FREE'], 'Grilled minced lamb with herbs, bulgur pilaf, charred vegetables')}</div>`,
          code: `<%- include('../../../modules/domain/restaurant/MenuItemCard', { item: menuItem }) %>`,
        },
        {
          title: 'Vegan item',
          previewHtml: `<div class="p-4">${sampleItemCardHtml('Hummus', '🫘', 89, ['VEGAN', 'GLUTEN_FREE'], 'Creamy chickpea dip with olive oil and smoked paprika')}</div>`,
          code: `<%- include('../../../modules/domain/restaurant/MenuItemCard', { item: menuItem }) %>`,
        },
      ],
    },
    {
      id: 'restaurant-menu-item-row',
      title: 'MenuItemRow',
      category: 'Domain · Restaurant',
      abbr: 'MR',
      description: 'Compact horizontal row for list-view menu display with emoji, details, and price.',
      filePath: 'modules/domain/restaurant/MenuItemRow.ejs',
      sourceCode: menuItemRowSource,
      variants: [
        {
          title: 'List view',
          previewHtml: `<div class="flex flex-col gap-2 p-4 max-w-lg">
  <div class="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-white"><span class="text-2xl">🍖</span><div class="flex-1 min-w-0"><div class="text-sm font-semibold text-gray-900">Lamb Kofta</div><p class="text-xs text-gray-500 truncate">Grilled minced lamb with herbs, bulgur pilaf</p></div><span class="text-sm font-bold text-blue-600">₺285</span></div>
  <div class="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-white"><span class="text-2xl">🫘</span><div class="flex-1 min-w-0"><div class="text-sm font-semibold text-gray-900">Hummus</div><p class="text-xs text-gray-500 truncate">Creamy chickpea dip with olive oil</p></div><span class="text-sm font-bold text-blue-600">₺89</span></div>
  <div class="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-white opacity-60"><span class="text-2xl">🐟</span><div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="text-sm font-semibold text-gray-900">Grilled Sea Bass</span><span class="text-xs text-gray-400">(unavailable)</span></div></div><span class="text-sm font-bold text-blue-600">₺380</span></div>
</div>`,
          code: `<%- include('../../../modules/domain/restaurant/MenuItemRow', { item: menuItem }) %>`,
        },
      ],
    },
    {
      id: 'restaurant-qr-code-display',
      title: 'QrCodeDisplay',
      category: 'Domain · Restaurant',
      abbr: 'QR',
      description: 'QR code panel for table-side menu scanning — shows table number, restaurant name, and scannable QR visual.',
      filePath: 'modules/domain/restaurant/QrCodeDisplay.ejs',
      sourceCode: qrCodeDisplaySource,
      variants: [
        {
          title: 'Table QR card',
          previewHtml: `<div class="p-4 flex justify-center">
  <div class="flex flex-col items-center gap-4 p-6 rounded-2xl border border-gray-200 bg-white">
    <p class="text-xs font-medium text-gray-500 uppercase tracking-widest">Table 3</p>
    <div class="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-gray-900 bg-white p-1.5">
      <div class="w-full h-full grid" style="grid-template-columns:repeat(10,1fr);grid-template-rows:repeat(10,1fr);gap:1.5px;background:#fff;">
        ${[1,1,1,1,1,1,1,0,1,0,1,0,0,0,0,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,0,1,1,1,0,1,0,1,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,1,0,1,0,0,0,1,0,1].map(c => `<div style="background:${c ? '#18181b' : '#fff'};"></div>`).join('')}
      </div>
    </div>
    <div class="text-center"><p class="text-sm font-bold text-gray-900">Tre Olive</p><p class="text-xs text-gray-500">Scan to view full menu</p></div>
  </div>
</div>`,
          code: `<%- include('../../../modules/domain/restaurant/QrCodeDisplay', { tableNumber: 3, restaurantName: 'Tre Olive', menuUrl: 'https://menu.treoilve.com' }) %>`,
        },
      ],
    },
  ];
}
