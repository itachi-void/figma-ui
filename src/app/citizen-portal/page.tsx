import CitizenPortal from '../pages/CitizenPortal';
import { PageLoader } from '../components/PageLoader';
import { SkeletonPageHeader, SkeletonStatsGrid, SkeletonChart } from '../components/ui/skeleton';

export default function CitizenPortalPage() {
  return (
    <PageLoader
      type="custom"
      customSkeleton={
        <div className="space-y-8">
          <SkeletonPageHeader />
          <SkeletonStatsGrid count={3} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </div>
      }
      loadingTime={2000}
      simulatedDelay={10000}
    >
      <CitizenPortal />
    </PageLoader>
  );
}