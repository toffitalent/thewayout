import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { AccountSettingsPage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const AccountSettingsPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <AccountSettingsPage />
  </AuthGuard>
);

AccountSettingsPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Employer}>{page}</SidebarLayout>
);

export default AccountSettingsPageWithLayout;
