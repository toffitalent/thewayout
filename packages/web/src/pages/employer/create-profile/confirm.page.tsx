import { UserType } from '@two/shared';
import { CreatorLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { ConfirmCreateProfilePage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const ConfirmPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <ConfirmCreateProfilePage />
  </AuthGuard>
);

ConfirmPageWithLayout.getLayout = (page) => <CreatorLayout>{page}</CreatorLayout>;

export default ConfirmPageWithLayout;
