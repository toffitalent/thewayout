import { useWizardContext } from '@disruptive-labs/ui';
import { offenseCategories, offenseText } from '@two/shared';
import { render, waitFor } from '@test';
import {
  CustomStepAllowedOffense,
  CustomStepOffenseCategoryProps,
} from '../CustomStepAllowedOffense';

const offensesStep = Object.entries(offenseCategories).map(([key, values]) => ({
  name: `offense${key[0].toUpperCase() + key.slice(1)}`,
  label: values.name,
  type: 'choices',
  options: values.categories.map((el) => ({ label: offenseText[el], value: el })),
  inline: true,
  multiple: true,
  className: 'offenseCategoryStep',
}));

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepAllowedOffense', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByRole } = render(
      <CustomStepAllowedOffense
        fields={(offensesStep as CustomStepOffenseCategoryProps)?.fields || []}
      />,
    );
    await waitFor(async () =>
      expect(await findByRole('button', { name: 'Select All' })).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});
