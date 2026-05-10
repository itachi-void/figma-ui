import PickupRequests from '../../pages/dashboard/PickupRequests';
import { TablePageLoader } from '../../components/PageLoader';

export default function PickupRequestsPage() {
  return (
    <TablePageLoader>
      <PickupRequests />
    </TablePageLoader>
  );
}