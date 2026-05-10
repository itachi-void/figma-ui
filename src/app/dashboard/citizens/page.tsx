import Citizens from '../../pages/dashboard/Citizens';
import { TablePageLoader } from '../../components/PageLoader';

export default function CitizensPage() {
  return (
    <TablePageLoader>
      <Citizens />
    </TablePageLoader>
  );
}