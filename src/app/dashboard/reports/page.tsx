import Reports from '../../pages/dashboard/Reports';
import { ChartPageLoader } from '../../components/PageLoader';

export default function ReportsPage() {
  return (
    <ChartPageLoader>
      <Reports />
    </ChartPageLoader>
  );
}