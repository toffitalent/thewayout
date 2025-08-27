import { Avatar, Badge, Box, Flex, ReadMore, SystemProps, Text } from '@disruptive-labs/ui';
import BriefcaseIcon from '@disruptive-labs/ui/dist/icons/Briefcase';
import CertificateIcon from '@disruptive-labs/ui/dist/icons/Certificate';
import ChevronDownIcon from '@disruptive-labs/ui/dist/icons/ChevronDown';
import ChevronUpIcon from '@disruptive-labs/ui/dist/icons/ChevronUp';
import CirclePlusIcon from '@disruptive-labs/ui/dist/icons/CirclePlus';
import EyeIcon from '@disruptive-labs/ui/dist/icons/Eye';
import EyeOffIcon from '@disruptive-labs/ui/dist/icons/EyeOff';
import PencilIcon from '@disruptive-labs/ui/dist/icons/Pencil';
import SchoolIcon from '@disruptive-labs/ui/dist/icons/School';
import { useState } from 'react';
import { ClientType, JusticeStatus, UserType, VeteranOrJustice } from '@two/shared';
import { clientProfile as text } from '@app/data/clientProfileText';
import {
  formatPhoneNumber,
  getDatesEducation,
  getDatesExperience,
  getDatesLicense,
  getDatesVeteranForm,
} from '@app/utils';
import styles from './ClientProfile.module.scss';
import { SectionInfoItem } from './SectionInfoItem';

export enum ActionType {
  cloaked = 'cloaked',
  edit = 'edit',
}

interface ClientProfileProps {
  client: ClientType & { avatar?: string };
  type: UserType;
  children?: JSX.Element;
  isCloaked?: boolean;
  onClick?: (type: ActionType, section?: ClientProfileSections) => void;
}

interface SectionWrapperProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  children: JSX.Element;
  accessoryRight?: JSX.Element;
}

export enum ClientProfileSections {
  account = 'account',
  personalInformation = 'personal-information',
  professionalSummary = 'professional-summary',
  militaryExperience = 'military-experience',
  offenseHistory = 'offense-history',
  employmentHistory = 'employment-history',
  education = 'education',
  licenses = 'licenses',
  personalStrengths = 'personal-strengths',
  skills = 'skills',
  languages = 'languages',
  supportNeeds = 'support-needs',
}

export const SectionWrapper = ({
  title,
  isOpen,
  setIsOpen,
  children,
  accessoryRight,
}: SectionWrapperProps) => (
  <Flex>
    <>
      <Flex container direction="row">
        <Flex item xs={12} md={8} direction="row" alignItems="center">
          {!isOpen && (
            <ChevronDownIcon
              data-testid="icon-down"
              onClick={() => setIsOpen(true)}
              cursor="pointer"
            />
          )}
          {isOpen && (
            <ChevronUpIcon
              data-testid="icon-up"
              onClick={() => setIsOpen(false)}
              cursor="pointer"
            />
          )}
          <Text fontSize="xl" fontWeight="700" ml={2}>
            {title}
          </Text>
          {accessoryRight && accessoryRight}
        </Flex>
      </Flex>
      {isOpen && <Box pt={4}>{children}</Box>}
    </>
  </Flex>
);

const InfoItem = ({ title, value }: { title: string; value: string }) => (
  <Flex direction="row" width="full" item>
    <Text width="1/2" color="grey.700">
      {title}
    </Text>
    <Text width="1/2" style={{ overflowWrap: 'break-word' }}>
      {value}
    </Text>
  </Flex>
);

const iconProps: SystemProps & { cursor?: string | number | undefined } = {
  color: 'primary',
  cursor: 'pointer',
  height: 6,
  width: 6,
  ml: 3,
};

export const ClientProfile = ({
  client,
  type,
  isCloaked,
  children,
  onClick,
}: ClientProfileProps) => {
  const [isOpenDetails, setIsOpenDetails] = useState(true);
  const [isOpenMilitaryExp, setIsOpenMilitaryExp] = useState(true);
  const [isOpenOffense, setIsOpenOffense] = useState(true);
  const [isOpenLanguages, setIsOpenLanguages] = useState(true);
  const [isOpenStrengths, setIsOpenStrengths] = useState(true);
  const [isOpenSkills, setIsOpenSkills] = useState(true);
  const [isOpenSupport, setIsOpenSupport] = useState(true);

  const hideCloakedSection = type === UserType.Rsp ? false : isCloaked;
  const isClient = type === UserType.Client;
  const { veteranStartAtMonth, veteranStartAtYear, veteranEndAtMonth, veteranEndAtYear } =
    getDatesVeteranForm(client);

  return (
    <Flex container>
      <Flex item xs={12} md={4} style={{ gap: '2rem' }} display="flex" direction="column">
        <Avatar size="2xl" name={`${client.firstName} ${client.lastName}`} src={client.avatar} />
        <Box>
          <Flex direction="row" alignItems="center">
            <Text fontSize="3xl" fontWeight="700">
              {`${client.firstName} ${client.lastName}`}
            </Text>
            {isClient && isCloaked && (
              <EyeIcon
                {...iconProps}
                onClick={() => onClick && onClick(ActionType.cloaked)}
                data-testid="cloaked"
              />
            )}
            {isClient && !isCloaked && (
              <EyeOffIcon
                {...iconProps}
                onClick={() => onClick && onClick(ActionType.cloaked)}
                data-testid="cloaked"
              />
            )}
          </Flex>
          {(client.veteranOrJustice || []).includes(VeteranOrJustice.veteran) && (
            <Badge bgcolor="grey.700" color="light" mb={2} ph={4}>
              US VETERAN 🇺🇸
            </Badge>
          )}
          {client.personalSummary && (
            <ReadMore buttonText="read more..." inline numberOfLines={2}>
              {client.personalSummary}
            </ReadMore>
          )}
        </Box>

        {children}

        {!hideCloakedSection && (
          <SectionWrapper
            title={isClient ? 'Personal Details' : 'Client Details'}
            isOpen={isOpenDetails}
            setIsOpen={setIsOpenDetails}
            accessoryRight={
              isClient ? (
                <PencilIcon
                  {...iconProps}
                  onClick={() => onClick && onClick(ActionType.edit, ClientProfileSections.account)}
                />
              ) : undefined
            }
          >
            <Flex container spacing={2}>
              <InfoItem title="Email" value={client.email as string} />
              {client.phone && <InfoItem title="Phone" value={formatPhoneNumber(client.phone)} />}
              <InfoItem
                title="Address"
                value={`${client.address}, \n ${client.city} ${client.state} ${client.postalCode}`}
              />
            </Flex>
          </SectionWrapper>
        )}
        {client.veteranOrJustice.includes(VeteranOrJustice.veteran) && (
          <SectionWrapper
            title="Military Experience"
            isOpen={isOpenMilitaryExp}
            setIsOpen={setIsOpenMilitaryExp}
            accessoryRight={
              isClient ? (
                <PencilIcon
                  {...iconProps}
                  onClick={() =>
                    onClick && onClick(ActionType.edit, ClientProfileSections.militaryExperience)
                  }
                />
              ) : undefined
            }
          >
            <Flex container spacing={2}>
              <InfoItem
                title="Branch of Service"
                value={client.veteranService!.map((el) => text[el]).join(', ')}
              />
              <InfoItem
                title="Dates of Service"
                value={getDatesExperience({
                  startAtMonth: veteranStartAtMonth,
                  startAtYear: veteranStartAtYear,
                  endAtMonth: veteranEndAtMonth,
                  endAtYear: veteranEndAtYear,
                })}
              />
              <InfoItem
                title="Campaigns"
                value={
                  client.veteranCampaigns?.length
                    ? client.veteranCampaigns.map((el) => text[el]).join(', ')
                    : 'None'
                }
              />
              <InfoItem title="Type of Discharge" value={text[client.veteranTypeDischarge!]} />
              <InfoItem title="Rank at Discharge" value={text[client.veteranRank!]} />
              <InfoItem title="Currently Reserve" value={client.veteranReservist ? 'Yes' : 'No'} />
              <InfoItem title="DD-214" value={client.veteranDd214 ? 'Yes' : 'No'} />
            </Flex>
          </SectionWrapper>
        )}
        {(type === UserType.Rsp || (isClient && !isCloaked)) &&
          client.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted) && (
            <SectionWrapper
              title="Offense History"
              isOpen={isOpenOffense}
              setIsOpen={setIsOpenOffense}
              accessoryRight={
                isClient ? (
                  <PencilIcon
                    {...iconProps}
                    onClick={() =>
                      onClick && onClick(ActionType.edit, ClientProfileSections.offenseHistory)
                    }
                  />
                ) : undefined
              }
            >
              <Flex container spacing={2}>
                <InfoItem title="Justice Status" value={text[client.justiceStatus!]} />
                {client.justiceStatus !== JusticeStatus.noOffense && (
                  <InfoItem
                    title="Nature of Offense"
                    value={(client.offense || []).map((el) => text[el]).join(', ')}
                  />
                )}
                {client.timeServed && (
                  <InfoItem title="Time Served" value={text[client.timeServed]} />
                )}
                {client.releasedAt && (
                  <InfoItem title="Completed Sentence" value={text[client.releasedAt]} />
                )}
                {client.stateOrFederal && (
                  <InfoItem title="State or Federal" value={text[client.stateOrFederal]} />
                )}
              </Flex>
            </SectionWrapper>
          )}
        <SectionWrapper
          title="Languages"
          isOpen={isOpenLanguages}
          setIsOpen={setIsOpenLanguages}
          accessoryRight={
            isClient ? (
              <CirclePlusIcon
                {...iconProps}
                onClick={() => onClick && onClick(ActionType.edit, ClientProfileSections.languages)}
              />
            ) : undefined
          }
        >
          <Flex container spacing={1}>
            {(client.languages || []).map((el) => (
              <Flex item key={text[el.language]}>
                <Badge mr={2} colorScheme="teal">{`${text[el.language]}: ${text[el.level]}`}</Badge>
              </Flex>
            ))}
          </Flex>
        </SectionWrapper>
        <SectionWrapper
          title="Personal Strengths"
          isOpen={isOpenStrengths}
          setIsOpen={setIsOpenStrengths}
          accessoryRight={
            isClient ? (
              <CirclePlusIcon
                {...iconProps}
                onClick={() =>
                  onClick && onClick(ActionType.edit, ClientProfileSections.personalStrengths)
                }
              />
            ) : undefined
          }
        >
          <Flex container spacing={1}>
            {(client.personalStrengths || []).map((el) => (
              <Flex item key={text[el]}>
                <Badge mr={2} colorScheme="blue">
                  {text[el]}
                </Badge>
              </Flex>
            ))}
          </Flex>
        </SectionWrapper>
        <SectionWrapper
          title="Skills"
          isOpen={isOpenSkills}
          setIsOpen={setIsOpenSkills}
          accessoryRight={
            isClient ? (
              <CirclePlusIcon
                {...iconProps}
                onClick={() => onClick && onClick(ActionType.edit, ClientProfileSections.skills)}
              />
            ) : undefined
          }
        >
          <Flex container spacing={1}>
            {(client.experience || []).map((el) => (
              <Flex item key={text[el]}>
                <Badge mr={2} colorScheme="indigo">
                  {text[el]}
                </Badge>
              </Flex>
            ))}
          </Flex>
        </SectionWrapper>
        {(type === UserType.Rsp || (type === UserType.Client && !isCloaked)) && (
          <SectionWrapper
            title="Support Needed"
            isOpen={isOpenSupport}
            setIsOpen={setIsOpenSupport}
          >
            <Flex container spacing={1}>
              {(client.support || []).map((el) => (
                <Flex item key={text[el]}>
                  <Badge mr={2} colorScheme="indigo">
                    {text[el]}
                  </Badge>
                </Flex>
              ))}
            </Flex>
          </SectionWrapper>
        )}
      </Flex>

      <Flex item xs={12} md={8} className={styles.rightColumn}>
        <Flex mb={10}>
          <Flex direction="row" alignItems="center">
            <Text fontSize="xl" fontWeight="700">
              Work Experience
            </Text>
            {isClient && (
              <PencilIcon
                {...iconProps}
                onClick={() =>
                  onClick && onClick(ActionType.edit, ClientProfileSections.employmentHistory)
                }
              />
            )}
          </Flex>
          {(client.relativeExperience || []).map((item) => (
            <Box key={JSON.stringify(item)} pv={5} borderBottom>
              <SectionInfoItem
                icon={
                  <Box bgcolor="orange.200" p={2} height={10} width={10} rounded>
                    <BriefcaseIcon height={6} width={6} color="orange.800" />
                  </Box>
                }
                title={item.title}
                text1={item.company}
                text2={getDatesExperience({
                  startAtMonth: item.startAtMonth,
                  startAtYear: item.startAtYear,
                  endAtMonth: item.endAtMonth,
                  endAtYear: item.endAtYear,
                })}
                text3={item.location}
                description={item.description}
              />
            </Box>
          ))}
        </Flex>

        <Flex mb={10}>
          <Flex direction="row" alignItems="center">
            <Text fontSize="xl" fontWeight="700">
              Education
            </Text>
            {isClient && (
              <PencilIcon
                {...iconProps}
                onClick={() => onClick && onClick(ActionType.edit, ClientProfileSections.education)}
              />
            )}
          </Flex>
          {(client.education || []).map((item) => (
            <Box key={JSON.stringify(item)} pv={5} borderBottom>
              <SectionInfoItem
                icon={
                  <Box bgcolor="purple.200" p={2} height={10} width={10} rounded>
                    <SchoolIcon height={6} width={6} color="purple.800" />
                  </Box>
                }
                title={item.schoolIssuer}
                text1={item.degree}
                text2={item.areaOfStudy}
                text3={getDatesEducation({
                  startYear: item.startYear,
                  yearEarned: item.yearEarned,
                })}
                description={item.description}
              />
            </Box>
          ))}
        </Flex>

        <Flex>
          <Flex direction="row" alignItems="center">
            <Text fontSize="xl" fontWeight="700">
              Licenses / Certifications
            </Text>
            {isClient && (
              <PencilIcon
                {...iconProps}
                onClick={() => onClick && onClick(ActionType.edit, ClientProfileSections.licenses)}
              />
            )}
          </Flex>
          {(client.license || []).map((item) => (
            <Box key={JSON.stringify(item)} pv={5} borderBottom>
              <SectionInfoItem
                icon={
                  <Box bgcolor="grey.200" p={2} height={10} width={10} rounded>
                    <CertificateIcon height={6} width={6} color="grey.800" />
                  </Box>
                }
                title={item.licenseName}
                text1={item.issuingOrganization}
                text2={getDatesLicense({
                  issueAtMonth: item.issueAtMonth,
                  issueAtYear: item.issueAtYear,
                  expirationAtMonth: item.expirationAtMonth,
                  expirationAtYear: item.expirationAtYear,
                })}
              />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
