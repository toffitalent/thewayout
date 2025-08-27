import { UserType } from '@two/shared';
import { CreatorLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { JobQuestionsPage } from '@app/features/client';
import { NextPageWithLayout } from '@app/types';

const JobQuestionsPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Client}>
    <JobQuestionsPage />
  </AuthGuard>
);

JobQuestionsPageWithLayout.getLayout = (page) => <CreatorLayout>{page}</CreatorLayout>;

export default JobQuestionsPageWithLayout;
