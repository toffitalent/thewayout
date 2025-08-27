import { useWizardContext } from '@disruptive-labs/ui';
import { TypeOfWork, WorkingTime } from '@two/shared';
import { act, fireEvent, render, waitFor } from '@test';
import { Steps, steps } from '../createJobData';
import { CustomStepDetails, CustomStepProps } from '../CustomStepDetails';

const detailStep = steps.find((el) => el.id === Steps.details);

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepSalary', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        title: 'Senior Marketing Executive',
        description:
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.s",
        department: 'Customer Service',
        typeOfWork: TypeOfWork.hybrid,
        workingTime: WorkingTime.fullTime,
        numberOfOpenPositions: 3,
        startAtYear: '2023',
        startAtMonth: '1',
      },
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const testDate = new Date('2023-01-26T00:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => testDate);

    const { container, findByText } = render(
      <CustomStepDetails fields={(detailStep as CustomStepProps)?.fields || []} />,
    );
    await waitFor(async () => expect(await findByText('Job Title')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('validate start at fields', async () => {
    const testDate = new Date('2023-03-26T00:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => testDate);

    const { findAllByRole, getAllByRole } = render(
      <CustomStepDetails fields={(detailStep as CustomStepProps)?.fields || []} />,
    );

    expect((await findAllByRole('button'))[0]).toBeDisabled();

    await act(() =>
      fireEvent.change(getAllByRole('combobox')[1], {
        target: { value: '2025' },
      }),
    );
    await act(() => fireEvent.change(getAllByRole('combobox')[0], { target: { value: '2' } }));
    await waitFor(async () => expect((await findAllByRole('button'))[0]).toBeEnabled());
  });
});
