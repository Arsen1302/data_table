import { createFileRoute } from '@tanstack/react-router';

import { UnitsPage, unitsSearchSchema } from '@/pages/Units';

export const Route = createFileRoute('/')({
  validateSearch: unitsSearchSchema,
  component: UnitsPage,
});
