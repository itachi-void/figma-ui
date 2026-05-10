import Resources from '../../pages/dashboard/Resources';
import { StatsPageLoader } from '../../components/PageLoader';

export default function ResourcesPage() {
  return (
    <StatsPageLoader>
      <Resources />
    </StatsPageLoader>
  );
}