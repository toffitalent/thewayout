import { UserType } from '@two/shared';
import { AuthGuard } from '@app/features/auth';
import { DashboardPage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const EmployerHome: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <DashboardPage />
  </AuthGuard>
);

export default EmployerHome;
