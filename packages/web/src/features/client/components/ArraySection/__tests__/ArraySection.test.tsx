import userEvent from '@testing-library/user-event';
import { RelativeExperience } from '@two/shared';
import { StepsClient } from '@app/features/client/profileDataTypes';
import { render } from '@test';
import { ArraySection } from '../ArraySection';

const experience: RelativeExperience & { stillWork: boolean } = {
  title: 'Title',
  location: 'Location',
  company: 'Company',
  description: 'Description',
  startAtMonth: '5',
  startAtYear: '2010',
  endAtMonth: '',
  endAtYear: '',
  stillWork: true,
};

describe('ArraySection', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(
      <ArraySection
        titleField="title"
        titleNewItem="Add New Position"
        items={[experience]}
        stepId={StepsClient.relativeExperience}
        onEdit={jest.fn()}
      />,
    );
    expect(await findByText('Add New Position')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('opens empty form after click Add New button', async () => {
    const { container, findByRole, queryByRole } = render(
      <ArraySection
        titleField="title"
        titleNewItem="Add New Position"
        items={[experience]}
        stepId={StepsClient.relativeExperience}
        onEdit={jest.fn()}
      />,
    );

    await userEvent.click(await findByRole('button', { name: 'Add New' }));
    expect(queryByRole('button', { name: 'Add New' })).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
