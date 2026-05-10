import SupportTickets from '../../pages/dashboard/SupportTickets';
import { TablePageLoader } from '../../components/PageLoader';

export default function SupportTicketsPage() {
  return (
    <TablePageLoader>
      <SupportTickets />
    </TablePageLoader>
  );
}