import FleetMapDemo from "../../pages/dashboard/FleetMapDemo";
import { PageLoader } from "../../components/PageLoader";
import {
  SkeletonPageHeader,
  SkeletonChart,
} from "../../components/ui/skeleton";

export default function FleetMapPage() {
  return (
    <PageLoader
      type="custom"
      customSkeleton={
        <div className="space-y-6">
          <SkeletonPageHeader />
          <SkeletonChart height="h-96" />
        </div>
      }
      loadingTime={2000}
      simulatedDelay={8000}
    >
      <FleetMapDemo />
    </PageLoader>
  );
}
