import { DefaultLayout } from '@app/components/Layout';
import { JobsListPage } from '@app/features/jobs';
import { NextPageWithLayout } from '@app/types';

const JobsListPageWithLayout: NextPageWithLayout = () => <JobsListPage />;

JobsListPageWithLayout.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default JobsListPageWithLayout;
