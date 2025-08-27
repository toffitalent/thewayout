import {
  Button,
  Field,
  Flex,
  Heading,
  Text,
  Toast,
  useForm,
  WizardChoices,
} from '@disruptive-labs/ui';
import { Tab, TabList, TabPanel, Tabs } from '@disruptive-labs/ui/dist/components/Tabs/Tabs';
import { useRouter } from 'next/router';
import { VeteranOrJustice } from '@two/shared';
import { ClientProfileSections } from '@app/components/ClientProfile';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import {
  getClientDataFromWizard,
  getClientInitialData,
  getDatesEducation,
  getDatesExperience,
  getDatesLicense,
} from '@app/utils';
import { selectAuthUser } from '../auth';
import { updateClient } from './actions';
import { AccountSettingsTab } from './components/AccountSettingsTab';
import { ArraySection, Item } from './components/ArraySection';
import { MilitaryHistoryTab } from './components/MilitaryHistoryTab';
import { OffenseHistoryTab } from './components/OffenseHistoryTab';
import { TabSectionWrapper } from './components/TabSectionWrapper';
import { steps } from './profileData';
import { CustomWizardStep, StepsClient, WizardData } from './profileDataTypes';

interface SectionForm {
  step: CustomWizardStep;
  initialData: WizardData;
  handleEdit: (data: WizardData) => void;
}

export const SectionForm = ({ step, initialData, handleEdit }: SectionForm) => {
  if (step.id === StepsClient.personalSummary) {
    step.title = 'Professional Summary';
    step.fields = [{ ...step.fields![0], label: 'Personal Summary' }];
  }

  const {
    submitForm,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: initialData,
    onSubmit: async (values) => handleEdit(values),
  });

  return (
    <TabSectionWrapper title={step.title}>
      <form onSubmit={submitForm}>
        {step.fields?.map((field) => {
          switch (field.type) {
            case 'choices':
              return <WizardChoices key={field.name} {...field} control={control} />;
            case 'checkbox':
            case 'radio':
            case 'toggle':
              return <Field key={field.name} {...field} pv={3} control={control} />;
            default:
              return <Field key={field.name} {...field} pv={3} fluid control={control} />;
          }
        })}
        <Button mt={5} colorScheme="primary" type="submit" disabled={isSubmitting || !isDirty}>
          Save
        </Button>
      </form>
    </TabSectionWrapper>
  );
};

const getExperienceDescription = (item: Item) => {
  const { company, startAtMonth, startAtYear, endAtMonth, endAtYear, location } = item;
  const dates = getDatesExperience({ startAtMonth, startAtYear, endAtMonth, endAtYear });
  return `${company} | ${dates} ${location ? `| ${location}` : ''}`;
};

const getEducationDescription = (item: Item) => {
  const { degree, startYear, yearEarned } = item;
  const dates = getDatesEducation({ startYear, yearEarned });
  return `${degree} | ${dates}`;
};

const getLicensesDescription = (item: Item) => {
  const { issuingOrganization, issueAtYear, expirationAtYear } = item;
  const dates = getDatesLicense({ issueAtYear, expirationAtYear });
  return `${issuingOrganization} | ${dates}`;
};

export const EditProfilePage = () => {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const router = useRouter();

  const section = (router.query.section as ClientProfileSections) || ClientProfileSections.account;
  const initialData = getClientInitialData(user?.client);

  const handleEdit = (data: Partial<WizardData>) => {
    if (user?.client) {
      const clientData = getClientDataFromWizard({ ...initialData, ...data });
      dispatch(
        updateClient({
          id: user?.client?.id,
          ...clientData,
        }),
      )
        .unwrap()
        .catch((e) => {
          showError(e);
        })
        .then(() => {
          Toast.success('Profile updated!');
          router.replace('/client/profile');
        });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO title="Account Settings" description="" />
      <Flex width="full">
        <Heading size="3xl">Account Settings</Heading>
        <Text mv={2} color="grey.600">
          Here you can change your Account and Resume settings.
        </Text>
        <Tabs
          defaultTab={section}
          onChange={(tab) =>
            router.replace({
              pathname: `/client/edit-profile`,
              query: { section: tab },
            })
          }
        >
          <TabList mt={5}>
            <Tab id={ClientProfileSections.account}>Account</Tab>
            <Tab id={ClientProfileSections.professionalSummary}>Summary</Tab>
            {user.client?.veteranOrJustice.includes(VeteranOrJustice.veteran) ? (
              <Tab id={ClientProfileSections.militaryExperience}>Military History</Tab>
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            )}
            {user.client?.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted) ? (
              <Tab id={ClientProfileSections.offenseHistory}>Offense History</Tab>
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            )}
            <Tab id={ClientProfileSections.employmentHistory}>Employment</Tab>
            <Tab id={ClientProfileSections.education}>Education</Tab>
            <Tab id={ClientProfileSections.licenses}>Licenses</Tab>
            <Tab id={ClientProfileSections.languages}>Languages</Tab>
            <Tab id={ClientProfileSections.personalStrengths}>Strengths</Tab>
            <Tab id={ClientProfileSections.skills}>Skills</Tab>
          </TabList>

          <TabPanel id={ClientProfileSections.account}>
            <AccountSettingsTab />
          </TabPanel>
          <TabPanel id={ClientProfileSections.professionalSummary}>
            <SectionForm
              step={steps.find((el) => el.id === StepsClient.personalSummary)!}
              initialData={initialData}
              handleEdit={handleEdit}
              key={StepsClient.personalSummary}
            />
          </TabPanel>
          {user.client?.veteranOrJustice.includes(VeteranOrJustice.veteran) ? (
            <TabPanel id={ClientProfileSections.militaryExperience}>
              <MilitaryHistoryTab />
            </TabPanel>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
          {user.client?.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted) ? (
            <TabPanel id={ClientProfileSections.offenseHistory}>
              <OffenseHistoryTab />
            </TabPanel>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
          <TabPanel id={ClientProfileSections.employmentHistory}>
            <ArraySection
              titleField="title"
              titleNewItem="Add New Position"
              items={initialData.relativeExperience}
              stepId={StepsClient.relativeExperience}
              onEdit={handleEdit}
              getDescription={getExperienceDescription}
            />
          </TabPanel>
          <TabPanel id={ClientProfileSections.education}>
            <ArraySection
              titleField="schoolIssuer"
              titleNewItem="Add New Education"
              items={initialData.education}
              stepId={StepsClient.education}
              onEdit={handleEdit}
              getDescription={getEducationDescription}
            />
          </TabPanel>
          <TabPanel id={ClientProfileSections.licenses}>
            <ArraySection
              titleField="licenseName"
              titleNewItem="Add New License"
              items={initialData.license}
              stepId={StepsClient.license}
              onEdit={handleEdit}
              getDescription={getLicensesDescription}
            />
          </TabPanel>
          <TabPanel id={ClientProfileSections.languages}>
            <ArraySection
              titleField="language"
              titleNewItem="Add New Language"
              items={initialData.languages}
              stepId={StepsClient.languages}
              onEdit={handleEdit}
            />
          </TabPanel>
          <TabPanel id={ClientProfileSections.personalStrengths}>
            <SectionForm
              step={steps.find((el) => el.id === StepsClient.personalStrengths)!}
              initialData={initialData}
              handleEdit={handleEdit}
              key={StepsClient.personalStrengths}
            />
          </TabPanel>
          <TabPanel id={ClientProfileSections.skills}>
            <SectionForm
              step={steps.find((el) => el.id === StepsClient.experienceSkills)!}
              initialData={initialData}
              handleEdit={handleEdit}
              key={StepsClient.personalStrengths}
            />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};
