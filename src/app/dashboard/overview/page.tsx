import Overview from '../../pages/dashboard/Overview';
import { OverviewPageLoader } from '../../components/PageLoader';

export default function OverviewPage() {
  return (
    <OverviewPageLoader>
      <Overview />
    </OverviewPageLoader>
  );
}