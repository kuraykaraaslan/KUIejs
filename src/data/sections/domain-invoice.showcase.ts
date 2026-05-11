import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const BASE = path.join(process.cwd(), 'modules/domain/invoice');

const invoiceStatusBadgeSource  = fs.readFileSync(path.join(BASE, 'InvoiceStatusBadge.ejs'),  'utf-8');
const paymentTermsBadgeSource   = fs.readFileSync(path.join(BASE, 'PaymentTermsBadge.ejs'),   'utf-8');
const clientInfoBlockSource     = fs.readFileSync(path.join(BASE, 'ClientInfoBlock.ejs'),     'utf-8');
const invoiceLineItemSource     = fs.readFileSync(path.join(BASE, 'InvoiceLineItem.ejs'),     'utf-8');
const invoiceTotalsSource       = fs.readFileSync(path.join(BASE, 'InvoiceTotals.ejs'),       'utf-8');
const invoiceNotesSource        = fs.readFileSync(path.join(BASE, 'InvoiceNotes.ejs'),        'utf-8');

function statusBadge(status: string): string {
  const meta: Record<string, { text: string; bg: string; border: string }> = {
    DRAFT:     { text: 'text-gray-600',  bg: 'bg-gray-100',  border: 'border-gray-300'  },
    SENT:      { text: 'text-cyan-700',  bg: 'bg-cyan-50',   border: 'border-cyan-200'  },
    PAID:      { text: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200' },
    OVERDUE:   { text: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200'   },
    PARTIAL:   { text: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200' },
    CANCELLED: { text: 'text-gray-500',  bg: 'bg-gray-50',   border: 'border-gray-200'  },
  };
  const m = meta[status] || meta.DRAFT;
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return `<span class="inline-flex items-center rounded-full border font-semibold text-xs px-2.5 py-1 ${m.text} ${m.bg} ${m.border}">${label}</span>`;
}

export function buildDomainInvoiceData(): ShowcaseItem[] {
  return [
    {
      id: 'invoice-status-badge',
      title: 'InvoiceStatusBadge',
      category: 'Domain · Invoice',
      abbr: 'IS',
      description: 'Invoice lifecycle status badge: Draft, Sent, Paid, Overdue, Partial, Cancelled.',
      filePath: 'modules/domain/invoice/InvoiceStatusBadge.ejs',
      sourceCode: invoiceStatusBadgeSource,
      variants: [
        {
          title: 'All statuses',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['DRAFT','SENT','PAID','OVERDUE','PARTIAL','CANCELLED'].map(statusBadge).join('')}</div>`,
          code: `<%- include('../../../modules/domain/invoice/InvoiceStatusBadge', { status: 'PAID' }) %>`,
        },
      ],
    },
    {
      id: 'invoice-payment-terms-badge',
      title: 'PaymentTermsBadge',
      category: 'Domain · Invoice',
      abbr: 'PT',
      description: 'Payment terms badge: Net 7, Net 15, Net 30, Net 60, Due on Receipt, Immediate.',
      filePath: 'modules/domain/invoice/PaymentTermsBadge.ejs',
      sourceCode: paymentTermsBadgeSource,
      variants: [
        {
          title: 'Payment terms',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">
  ${['NET_7','NET_15','NET_30','NET_60','DUE_ON_RECEIPT'].map(t => {
    const labels: Record<string, string> = { NET_7: 'Net 7', NET_15: 'Net 15', NET_30: 'Net 30', NET_60: 'Net 60', DUE_ON_RECEIPT: 'Due on Receipt' };
    return `<span class="inline-flex items-center gap-1 rounded-full border font-medium text-xs px-2.5 py-1 text-cyan-700 bg-cyan-50 border-cyan-200"><i class="fa-solid fa-calendar-days text-xs" aria-hidden="true"></i>${labels[t]}</span>`;
  }).join('')}
</div>`,
          code: `<%- include('../../../modules/domain/invoice/PaymentTermsBadge', { terms: 'NET_30' }) %>`,
        },
      ],
    },
    {
      id: 'invoice-client-info-block',
      title: 'ClientInfoBlock',
      category: 'Domain · Invoice',
      abbr: 'CI',
      description: 'Address block component for BILL TO / SHIP TO / FROM sections in an invoice.',
      filePath: 'modules/domain/invoice/ClientInfoBlock.ejs',
      sourceCode: clientInfoBlockSource,
      variants: [
        {
          title: 'Bill To block',
          previewHtml: `<div class="p-4 space-y-1">
  <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Bill To</p>
  <p class="text-sm font-bold text-gray-900">Arya Teknoloji A.Ş.</p>
  <p class="text-xs text-gray-500">Atatürk Bulvarı No:58</p>
  <p class="text-xs text-gray-500">Ankara 06100, Turkey</p>
  <p class="text-xs text-gray-400 font-mono">Tax ID: TR 9876543210</p>
  <p class="text-xs text-gray-500">finance@arya.com.tr</p>
</div>`,
          code: `<%- include('../../../modules/domain/invoice/ClientInfoBlock', { type: 'BILL_TO', entity: client }) %>`,
        },
      ],
    },
    {
      id: 'invoice-line-item',
      title: 'InvoiceLineItem',
      category: 'Domain · Invoice',
      abbr: 'IL',
      description: 'Table row for a single invoice line item with description, quantity, unit price, and total.',
      filePath: 'modules/domain/invoice/InvoiceLineItem.ejs',
      sourceCode: invoiceLineItemSource,
      variants: [
        {
          title: 'Line items table',
          previewHtml: `<div class="overflow-hidden rounded-lg border border-gray-200">
  <table class="w-full text-sm">
    <thead><tr class="bg-gray-50 border-b border-gray-200">
      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 w-8">#</th>
      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Description</th>
      <th class="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 w-16">Qty</th>
      <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 w-28">Unit Price</th>
      <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 w-28">Total</th>
    </tr></thead>
    <tbody>
      <tr class="bg-white border-b border-gray-100"><td class="px-4 py-2.5 text-xs text-gray-400">1</td><td class="px-4 py-2.5 text-sm text-gray-800">Web Application Development</td><td class="px-4 py-2.5 text-sm text-center">1</td><td class="px-4 py-2.5 text-sm text-right font-mono">₺45,000</td><td class="px-4 py-2.5 text-sm text-right font-mono font-semibold">₺45,000</td></tr>
      <tr class="bg-gray-50 border-b border-gray-100"><td class="px-4 py-2.5 text-xs text-gray-400">2</td><td class="px-4 py-2.5 text-sm text-gray-800">UI/UX Design Services</td><td class="px-4 py-2.5 text-sm text-center">40</td><td class="px-4 py-2.5 text-sm text-right font-mono">₺750</td><td class="px-4 py-2.5 text-sm text-right font-mono font-semibold">₺30,000</td></tr>
    </tbody>
  </table>
</div>`,
          code: `<% lineItems.forEach(function(item, i) { %>
<%- include('../../../modules/domain/invoice/InvoiceLineItem', { item: item, index: i, currency: 'TRY' }) %>
<% }); %>`,
        },
      ],
    },
    {
      id: 'invoice-totals',
      title: 'InvoiceTotals',
      category: 'Domain · Invoice',
      abbr: 'IT',
      description: 'Invoice totals block: subtotal, discount, VAT, total, paid amount, and balance due.',
      filePath: 'modules/domain/invoice/InvoiceTotals.ejs',
      sourceCode: invoiceTotalsSource,
      variants: [
        {
          title: 'Full totals',
          previewHtml: `<div class="p-4 flex justify-end"><div class="w-56 space-y-0">
  <div class="flex justify-between py-2 border-b border-gray-200 text-sm"><span class="text-gray-500">Subtotal</span><span class="font-mono">₺83,500</span></div>
  <div class="flex justify-between py-2 border-b border-gray-200 text-sm"><span class="text-gray-500">Discount</span><span class="font-mono text-green-600">−₺5,000</span></div>
  <div class="flex justify-between py-2 border-b border-gray-200 text-sm"><span class="text-gray-500">VAT (20%)</span><span class="font-mono">₺16,700</span></div>
  <div class="flex justify-between py-3 border-b-2 border-gray-300 text-base font-bold"><span>Total</span><span class="font-mono">₺95,200</span></div>
</div></div>`,
          code: `<%- include('../../../modules/domain/invoice/InvoiceTotals', { subtotal: inv.subtotal, taxRate: inv.taxRate, taxAmount: inv.taxAmount, discount: inv.discount, total: inv.total, currency: 'TRY' }) %>`,
        },
      ],
    },
    {
      id: 'invoice-notes',
      title: 'InvoiceNotes',
      category: 'Domain · Invoice',
      abbr: 'IN',
      description: 'Invoice footer section with optional notes text, bank details, and custom footer.',
      filePath: 'modules/domain/invoice/InvoiceNotes.ejs',
      sourceCode: invoiceNotesSource,
      variants: [
        {
          title: 'Notes + bank details',
          previewHtml: `<div class="p-4 space-y-4 max-w-sm">
  <div><p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Notes</p><p class="text-xs text-gray-500">Thank you for your business. Payment due within 30 days.</p></div>
  <div><p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Bank Details</p><div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs"><span class="text-gray-400">Bank</span><span class="font-mono">Garanti BBVA</span><span class="text-gray-400">IBAN</span><span class="font-mono text-xs">TR12 0006 2000...</span><span class="text-gray-400">SWIFT</span><span class="font-mono">TGBATRIS</span></div></div>
</div>`,
          code: `<%- include('../../../modules/domain/invoice/InvoiceNotes', { notes: inv.notes, bankDetails: issuer.bankDetails }) %>`,
        },
      ],
    },
  ];
}
