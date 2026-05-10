import ActivityLog from '../../pages/dashboard/ActivityLog';
import { ListPageLoader } from '../../components/PageLoader';

export default function ActivityLogPage() {
  return (
    <ListPageLoader>
      <ActivityLog />
    </ListPageLoader>
  );
}