import Analytics from '../../pages/dashboard/Analytics';
import { ChartPageLoader } from '../../components/PageLoader';

export default function AnalyticsPage() {
  return (
    <ChartPageLoader>
      <Analytics />
    </ChartPageLoader>
  );
}