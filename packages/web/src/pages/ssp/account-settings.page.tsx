import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { AccountSettingsPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const AccountSettingPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <AccountSettingsPage />
  </AuthGuard>
);

AccountSettingPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default AccountSettingPageWithLayout;
