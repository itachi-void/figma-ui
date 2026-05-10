import Settings from '../../pages/dashboard/Settings';
import { FormPageLoader } from '../../components/PageLoader';

export default function SettingsPage() {
  return (
    <FormPageLoader>
      <Settings />
    </FormPageLoader>
  );
}