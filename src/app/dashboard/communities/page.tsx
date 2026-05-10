import Communities from '../../pages/dashboard/Communities';
import { PageLoader } from '../../components/PageLoader';
import { SkeletonPageHeader, SkeletonStatsGrid, SkeletonList } from '../../components/ui/skeleton';

export default function CommunitiesPage() {
  return (
    <PageLoader
      type="custom"
      customSkeleton={
        <div className="space-y-6">
          <SkeletonPageHeader />
          <SkeletonStatsGrid count={3} />
          <SkeletonList items={4} />
        </div>
      }
      loadingTime={2000}
      simulatedDelay={8000}
    >
      <Communities />
    </PageLoader>
  );
}