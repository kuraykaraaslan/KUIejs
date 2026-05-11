export const invoiceData = {
  issuer: {
    name: 'Nexus Digital Ltd.',
    address: 'Levent Mahallesi, Büyükdere Cad. No:185',
    city: 'Şişli, İstanbul 34394',
    country: 'Turkey',
    email: 'billing@nexusdigital.com',
    phone: '+90 212 555 0185',
    taxId: 'TR 1234567890',
    website: 'www.nexusdigital.com',
    bankDetails: {
      bank: 'Garanti BBVA',
      iban: 'TR12 0006 2000 1234 0006 2991 26',
      swift: 'TGBATRIS',
    },
  },
  invoices: [
    {
      id: 'inv-001', number: 'INV-2026-001', status: 'PAID' as const,
      issueDate: '2026-01-15', dueDate: '2026-02-14', paidDate: '2026-02-10', terms: 'NET_30' as const,
      client: { name: 'Arya Teknoloji A.Ş.', address: 'Atatürk Bulvarı No:58', city: 'Ankara 06100', country: 'Turkey', email: 'finance@arya.com.tr', taxId: 'TR 9876543210' },
      lineItems: [
        { description: 'Web Application Development — Phase 1', quantity: 1, unitPrice: 45000, total: 45000, unit: 'project' },
        { description: 'UI/UX Design Services', quantity: 40, unitPrice: 750, total: 30000, unit: 'hour' },
        { description: 'Cloud Infrastructure Setup', quantity: 1, unitPrice: 8500, total: 8500, unit: 'project' },
      ],
      subtotal: 83500, taxRate: 20, taxAmount: 16700, discount: 5000, total: 95200, paid: 95200, balance: 0, currency: 'TRY',
      notes: 'Thank you for your business. Payment received on time.',
    },
    {
      id: 'inv-002', number: 'INV-2026-002', status: 'OVERDUE' as const,
      issueDate: '2026-02-01', dueDate: '2026-03-03', paidDate: null, terms: 'NET_30' as const,
      client: { name: 'Bosphorus Media Group', address: 'Istiklal Cad. No:314', city: 'Beyoğlu, İstanbul 34433', country: 'Turkey', email: 'accounts@bosphorus.media', taxId: 'TR 1122334455' },
      lineItems: [
        { description: 'Monthly SEO & Content Management', quantity: 3, unitPrice: 12000, total: 36000, unit: 'month' },
        { description: 'Social Media Campaign', quantity: 1, unitPrice: 18000, total: 18000, unit: 'campaign' },
      ],
      subtotal: 54000, taxRate: 20, taxAmount: 10800, discount: 0, total: 64800, paid: 0, balance: 64800, currency: 'TRY',
      notes: 'Payment was due on 3 March 2026. Please settle immediately to avoid service suspension.',
    },
    {
      id: 'inv-003', number: 'INV-2026-003', status: 'SENT' as const,
      issueDate: '2026-03-10', dueDate: '2026-04-09', paidDate: null, terms: 'NET_30' as const,
      client: { name: 'Marmara Retail Co.', address: 'Bağcılar Mah. No:22', city: 'Bağcılar, İstanbul', country: 'Turkey', email: 'ap@marmararetail.com', taxId: 'TR 5566778899' },
      lineItems: [
        { description: 'E-commerce Platform License — Annual', quantity: 1, unitPrice: 72000, total: 72000, unit: 'year' },
        { description: 'Custom Integration Development', quantity: 20, unitPrice: 800, total: 16000, unit: 'hour' },
      ],
      subtotal: 88000, taxRate: 20, taxAmount: 17600, discount: 8000, total: 97600, paid: 0, balance: 97600, currency: 'TRY', notes: '',
    },
    {
      id: 'inv-004', number: 'INV-2026-004', status: 'DRAFT' as const,
      issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: null, terms: 'DUE_ON_RECEIPT' as const,
      client: { name: 'Karadeniz Logistics', address: 'Sanayi Cad. No:7', city: 'Trabzon 61000', country: 'Turkey', email: 'billing@kdlogistics.com', taxId: 'TR 4433221100' },
      lineItems: [
        { description: 'Fleet Management Software Setup', quantity: 1, unitPrice: 25000, total: 25000, unit: 'project' },
      ],
      subtotal: 25000, taxRate: 20, taxAmount: 5000, discount: 0, total: 30000, paid: 0, balance: 30000, currency: 'TRY',
      notes: 'Draft — pending client approval',
    },
    {
      id: 'inv-005', number: 'INV-2026-005', status: 'PARTIAL' as const,
      issueDate: '2026-03-20', dueDate: '2026-04-19', paidDate: null, terms: 'NET_30' as const,
      client: { name: 'Ege Pharmaceuticals', address: 'OSB 3. Cadde No:15', city: 'Bornova, İzmir', country: 'Turkey', email: 'finance@egepharma.com', taxId: 'TR 6677889900' },
      lineItems: [
        { description: 'Regulatory Compliance Portal Development', quantity: 1, unitPrice: 60000, total: 60000, unit: 'project' },
        { description: 'Data Migration Services', quantity: 1, unitPrice: 15000, total: 15000, unit: 'project' },
        { description: 'Training & Documentation', quantity: 8, unitPrice: 600, total: 4800, unit: 'hour' },
      ],
      subtotal: 79800, taxRate: 20, taxAmount: 15960, discount: 0, total: 95760, paid: 47880, balance: 47880, currency: 'TRY',
      notes: '50% deposit received. Balance due upon project completion.',
    },
    {
      id: 'inv-006', number: 'INV-2025-089', status: 'CANCELLED' as const,
      issueDate: '2025-11-01', dueDate: '2025-12-01', paidDate: null, terms: 'NET_30' as const,
      client: { name: 'Startup Hub İstanbul', address: 'Maslak Mah. No:1', city: 'Sarıyer, İstanbul', country: 'Turkey', email: 'ops@startuphub.ist', taxId: 'TR 1357924680' },
      lineItems: [
        { description: 'Mobile App Development (iOS + Android)', quantity: 1, unitPrice: 120000, total: 120000, unit: 'project' },
      ],
      subtotal: 120000, taxRate: 20, taxAmount: 24000, discount: 0, total: 144000, paid: 0, balance: 0, currency: 'TRY',
      notes: 'Cancelled by client request on 2025-11-15.',
    },
  ],
};
