import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { ProfilePage } from '@app/features/client';
import { NextPageWithLayout } from '@app/types';

const ProfilePageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Client}>
    <ProfilePage />
  </AuthGuard>
);

ProfilePageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Client}>{page}</SidebarLayout>
);

export default ProfilePageWithLayout;
