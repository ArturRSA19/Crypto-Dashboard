import { LineChart } from 'lucide-react';

export function PageTitle() {
  return (
    <h1 className="flex items-center gap-2 text-3xl mb-4">
      <LineChart className="w-6 h-6" />
      Dashboard
    </h1>
  );
}
