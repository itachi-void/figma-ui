import { TablePageLoader } from "../../components/PageLoader";
import Drivers from "../../pages/dashboard/Drivers";

export default function DriversPage() {
  return (
    <TablePageLoader>
      <Drivers />
    </TablePageLoader>
  );
}
