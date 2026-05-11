import type { ShowcaseItem } from '../types';
import { buildAtomsData }            from './sections/ui-atoms.showcase';
import { buildMoleculesData }        from './sections/ui-molecules.showcase';
import { buildOrganismsData }        from './sections/ui-organisms.showcase';
import { buildAppPatternsData }      from './sections/app-patterns.showcase';
import { buildDomainCommonData }     from './sections/domain-common.showcase';
import { buildDomainModemData }      from './sections/domain-modem.showcase';
import { buildApiDocDomainData }     from './sections/domain-api-doc.showcase';
import { buildDomainRestaurantData } from './sections/domain-restaurant.showcase';
import { buildDomainInvoiceData }    from './sections/domain-invoice.showcase';
import { buildDomainUpsData }        from './sections/domain-ups.showcase';

export const SHOWCASE_DATA: ShowcaseItem[] = [
  ...buildAtomsData(),
  ...buildMoleculesData(),
  ...buildOrganismsData(),
  ...buildAppPatternsData(),
  ...buildDomainCommonData(),
  ...buildDomainModemData(),
  ...buildApiDocDomainData(),
  ...buildDomainRestaurantData(),
  ...buildDomainInvoiceData(),
  ...buildDomainUpsData(),
];

export const SHOWCASE_DATA_MAP: Record<string, ShowcaseItem> = Object.fromEntries(
  SHOWCASE_DATA.map((c) => [c.id, c]),
);
