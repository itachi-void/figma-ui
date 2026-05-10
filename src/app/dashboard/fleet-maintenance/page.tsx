import FleetMaintenance from '../../pages/dashboard/FleetMaintenance';
import { TablePageLoader } from '../../components/PageLoader';

export default function FleetMaintenancePage() {
  return (
    <TablePageLoader>
      <FleetMaintenance />
    </TablePageLoader>
  );
}