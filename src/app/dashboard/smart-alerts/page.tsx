import SmartAlerts from '../../pages/dashboard/SmartAlerts';
import { ListPageLoader } from '../../components/PageLoader';

export default function SmartAlertsPage() {
  return (
    <ListPageLoader>
      <SmartAlerts />
    </ListPageLoader>
  );
}