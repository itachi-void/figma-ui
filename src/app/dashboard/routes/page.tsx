import Routes from '../../pages/dashboard/Routes';
import { TablePageLoader } from '../../components/PageLoader';

export default function RoutesPage() {
  return (
    <TablePageLoader>
      <Routes />
    </TablePageLoader>
  );
}