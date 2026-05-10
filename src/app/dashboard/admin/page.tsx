import Admin from '../../pages/dashboard/Admin';
import { StatsPageLoader } from '../../components/PageLoader';

export default function AdminPage() {
  return (
    <StatsPageLoader>
      <Admin />
    </StatsPageLoader>
  );
}