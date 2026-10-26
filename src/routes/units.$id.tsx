import { createFileRoute } from '@tanstack/react-router';

import { UnitDetailsPage } from '@/pages/UnitDetails';

export const Route = createFileRoute('/units/$id')({
  component: UnitDetailsPage,
});
