import Performance from '../../pages/dashboard/Performance';
import { StatsPageLoader } from '../../components/PageLoader';

export default function PerformancePage() {
  return (
    <StatsPageLoader>
      <Performance />
    </StatsPageLoader>
  );
}