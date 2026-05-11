import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const BASE = path.join(process.cwd(), 'modules/domain/ups');

const upsStatusBadgeSource  = fs.readFileSync(path.join(BASE, 'UpsStatusBadge.ejs'),  'utf-8');
const batteryLevelBarSource = fs.readFileSync(path.join(BASE, 'BatteryLevelBar.ejs'), 'utf-8');
const powerLoadGaugeSource  = fs.readFileSync(path.join(BASE, 'PowerLoadGauge.ejs'),  'utf-8');
const outletCardSource      = fs.readFileSync(path.join(BASE, 'OutletCard.ejs'),      'utf-8');
const eventLogRowSource     = fs.readFileSync(path.join(BASE, 'EventLogRow.ejs'),     'utf-8');
const upsInfoCardSource     = fs.readFileSync(path.join(BASE, 'UpsInfoCard.ejs'),     'utf-8');

function upsBadge(status: string): string {
  const meta: Record<string, { dot: string; text: string; bg: string; border: string; pulse: boolean }> = {
    ON_LINE:     { dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  pulse: false },
    ON_BATTERY:  { dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  pulse: true  },
    LOW_BATTERY: { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    pulse: true  },
    FAULT:       { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    pulse: false },
    CALIBRATING: { dot: 'bg-cyan-500',   text: 'text-cyan-700',   bg: 'bg-cyan-50',   border: 'border-cyan-200',   pulse: false },
    BYPASSED:    { dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  pulse: false },
    OFFLINE:     { dot: 'bg-gray-400',   text: 'text-gray-600',   bg: 'bg-gray-100',  border: 'border-gray-300',   pulse: false },
  };
  const m = meta[status] || meta.OFFLINE;
  const label = status.replace('_', ' ').charAt(0) + status.replace('_', ' ').slice(1).toLowerCase();
  return `<span class="inline-flex items-center gap-1.5 rounded-full border font-medium text-xs px-2.5 py-1 ${m.text} ${m.bg} ${m.border}"><span class="h-1.5 w-1.5 rounded-full ${m.dot}${m.pulse ? ' animate-pulse' : ''}" aria-hidden="true"></span>${label}</span>`;
}

function batteryBar(pct: number, status: string, runtime: number): string {
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500';
  const text  = pct > 50 ? 'text-green-700' : pct > 20 ? 'text-amber-700' : 'text-red-700';
  const h = Math.floor(runtime / 60), m = runtime % 60;
  return `<div class="flex flex-col gap-2 p-4 w-56">
  <div class="flex items-end justify-between"><div><span class="text-xl font-bold ${text}">${pct}%</span> <span class="text-xs text-gray-500">battery</span></div><span class="text-xs text-gray-500">${status.toLowerCase()}</span></div>
  <div class="w-full h-2 rounded-full bg-gray-200"><div class="h-full rounded-full ${color}" style="width:${pct}%"></div></div>
  <p class="text-xs text-gray-500">${h}h ${m}m remaining</p>
</div>`;
}

export function buildDomainUpsData(): ShowcaseItem[] {
  return [
    {
      id: 'ups-status-badge',
      title: 'UpsStatusBadge',
      category: 'Domain · UPS',
      abbr: 'US',
      description: 'UPS power status badge: On Line, On Battery (pulse), Low Battery, Fault, Calibrating, Bypassed, Offline.',
      filePath: 'modules/domain/ups/UpsStatusBadge.ejs',
      sourceCode: upsStatusBadgeSource,
      variants: [
        {
          title: 'All statuses',
          previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['ON_LINE','ON_BATTERY','LOW_BATTERY','FAULT','CALIBRATING','BYPASSED','OFFLINE'].map(upsBadge).join('')}</div>`,
          code: `<%- include('../../../modules/domain/ups/UpsStatusBadge', { status: 'ON_LINE' }) %>`,
        },
      ],
    },
    {
      id: 'ups-battery-level-bar',
      title: 'BatteryLevelBar',
      category: 'Domain · UPS',
      abbr: 'BL',
      description: 'Battery charge indicator with percent, color-coded bar (green/yellow/red), charge status, and runtime remaining.',
      filePath: 'modules/domain/ups/BatteryLevelBar.ejs',
      sourceCode: batteryLevelBarSource,
      variants: [
        {
          title: 'Full charge',
          previewHtml: batteryBar(100, 'FULL', 47),
          code: `<%- include('../../../modules/domain/ups/BatteryLevelBar', { percent: battery.percent, status: battery.status, runtimeMinutes: battery.runtimeMinutes }) %>`,
        },
        {
          title: 'Low battery',
          previewHtml: batteryBar(12, 'DISCHARGING', 6),
          code: `<%- include('../../../modules/domain/ups/BatteryLevelBar', { percent: 12, status: 'DISCHARGING', runtimeMinutes: 6 }) %>`,
        },
      ],
    },
    {
      id: 'ups-power-load-gauge',
      title: 'PowerLoadGauge',
      category: 'Domain · UPS',
      abbr: 'PG',
      description: 'Load percentage gauge with watts/VA display and color-coded bar (green < 50%, yellow 50-80%, red > 80%).',
      filePath: 'modules/domain/ups/PowerLoadGauge.ejs',
      sourceCode: powerLoadGaugeSource,
      variants: [
        {
          title: 'Normal load',
          previewHtml: `<div class="flex flex-col gap-2 p-4 w-56"><div class="flex items-end justify-between"><div><span class="text-2xl font-bold text-green-700">42%</span> <span class="text-xs text-gray-500">load</span></div><span class="text-xs font-mono text-gray-500">1134 W / 874 VA</span></div><div class="w-full h-2.5 rounded-full bg-gray-200"><div class="h-full rounded-full bg-green-500" style="width:42%"></div></div><p class="text-xs text-gray-500">of 2700 W capacity</p></div>`,
          code: `<%- include('../../../modules/domain/ups/PowerLoadGauge', { loadPercent: output.loadPercent, watts: output.watts, va: output.va, capacity: ups }) %>`,
        },
        {
          title: 'Critical load',
          previewHtml: `<div class="flex flex-col gap-2 p-4 w-56"><div class="flex items-end justify-between"><div><span class="text-2xl font-bold text-red-700">87%</span> <span class="text-xs text-gray-500">load</span></div><span class="text-xs font-mono text-gray-500">2349 W / 2610 VA</span></div><div class="w-full h-2.5 rounded-full bg-gray-200"><div class="h-full rounded-full bg-red-500" style="width:87%"></div></div><p class="text-xs text-gray-500">of 2700 W capacity</p></div>`,
          code: `<%- include('../../../modules/domain/ups/PowerLoadGauge', { loadPercent: 87, watts: 2349, va: 2610 }) %>`,
        },
      ],
    },
    {
      id: 'ups-outlet-card',
      title: 'OutletCard',
      category: 'Domain · UPS',
      abbr: 'OC',
      description: 'Outlet status card showing name, ON/OFF status badge, power draw, and protection indicator.',
      filePath: 'modules/domain/ups/OutletCard.ejs',
      sourceCode: outletCardSource,
      variants: [
        {
          title: 'Outlet states',
          previewHtml: `<div class="grid grid-cols-2 gap-3 p-4">
  <div class="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3"><div class="flex items-center gap-2"><i class="fa-solid fa-plug text-gray-400 text-sm" aria-hidden="true"></i><span class="text-sm font-semibold text-gray-900">Primary Server</span></div><div class="flex items-center gap-2"><span class="inline-flex items-center gap-1.5 rounded-full border text-xs px-2.5 py-1 font-medium text-green-700 bg-green-50 border-green-200"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>On</span><span class="text-xs font-mono text-gray-500">420 W</span></div></div>
  <div class="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3"><div class="flex items-center gap-2"><i class="fa-solid fa-plug text-gray-400 text-sm" aria-hidden="true"></i><span class="text-sm font-semibold text-gray-900">Spare</span></div><div class="flex items-center gap-2"><span class="inline-flex items-center gap-1.5 rounded-full border text-xs px-2.5 py-1 font-medium text-gray-500 bg-gray-100 border-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-gray-300"></span>Off</span></div></div>
</div>`,
          code: `<%- include('../../../modules/domain/ups/OutletCard', { outlet: outlet }) %>`,
        },
      ],
    },
    {
      id: 'ups-event-log-row',
      title: 'EventLogRow',
      category: 'Domain · UPS',
      abbr: 'EL',
      description: 'Event log table row with timestamp, severity indicator, event code, and message.',
      filePath: 'modules/domain/ups/EventLogRow.ejs',
      sourceCode: eventLogRowSource,
      variants: [
        {
          title: 'Event log',
          previewHtml: `<table class="w-full"><tbody>
  <tr class="bg-white"><td class="px-4 py-2.5 text-xs font-mono text-gray-500 whitespace-nowrap">07.05.2026 14:23</td><td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-700"><span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>Info</span></td><td class="px-4 py-2.5 text-xs font-mono text-gray-400">UPS001</td><td class="px-4 py-2.5 text-xs text-gray-800">UPS is on line power.</td></tr>
  <tr class="bg-gray-50"><td class="px-4 py-2.5 text-xs font-mono text-gray-500 whitespace-nowrap">07.05.2026 14:17</td><td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 text-xs font-medium text-red-700"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>Critical</span></td><td class="px-4 py-2.5 text-xs font-mono text-gray-400">UPS002</td><td class="px-4 py-2.5 text-xs text-gray-800">UPS switched to battery power.</td></tr>
</tbody></table>`,
          code: `<% events.forEach(function(ev, i) { %>
<%- include('../../../modules/domain/ups/EventLogRow', { event: ev, index: i }) %>
<% }); %>`,
        },
      ],
    },
    {
      id: 'ups-info-card',
      title: 'UpsInfoCard',
      category: 'Domain · UPS',
      abbr: 'UI',
      description: '2-column info grid displaying UPS model, serial, firmware, capacity, and voltage specs.',
      filePath: 'modules/domain/ups/UpsInfoCard.ejs',
      sourceCode: upsInfoCardSource,
      variants: [
        {
          title: 'UPS info grid',
          previewHtml: `<div class="rounded-xl border border-gray-200 bg-white overflow-hidden m-4">
  <div class="px-4 py-3 border-b border-gray-200"><h3 class="text-xs font-bold text-gray-900 uppercase tracking-wide">UPS Information</h3></div>
  <div class="grid grid-cols-2 divide-y divide-gray-100">
    <div class="px-4 py-2.5 text-xs text-gray-500 font-medium border-r border-gray-100">Model</div><div class="px-4 py-2.5 text-xs font-mono text-gray-800">SmartUPS 3000RM</div>
    <div class="px-4 py-2.5 text-xs text-gray-500 font-medium border-r border-gray-100">Firmware</div><div class="px-4 py-2.5 text-xs font-mono text-gray-800">9.11.0</div>
    <div class="px-4 py-2.5 text-xs text-gray-500 font-medium border-r border-gray-100">Capacity</div><div class="px-4 py-2.5 text-xs font-mono text-gray-800">3000 VA / 2700 W</div>
  </div>
</div>`,
          code: `<%- include('../../../modules/domain/ups/UpsInfoCard', { info: state.ups }) %>`,
        },
      ],
    },
  ];
}
