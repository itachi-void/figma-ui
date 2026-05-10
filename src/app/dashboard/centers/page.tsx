import Centers from '../../pages/dashboard/Centers';
import { TablePageLoader } from '../../components/PageLoader';

export default function CentersPage() {
  return (
    <TablePageLoader>
      <Centers />
    </TablePageLoader>
  );
}