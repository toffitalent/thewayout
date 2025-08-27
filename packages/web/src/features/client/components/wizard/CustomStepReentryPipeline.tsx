import {
  Badge,
  Box,
  Button,
  classNames,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalTitle,
  Text,
  useWizardContext,
} from '@disruptive-labs/ui';
import { useCallback, useEffect, useState } from 'react';
import { RspListType, zipcodesCounties } from '@two/shared';
import { selectAuthUser } from '@app/features/auth';
import { listRsp } from '@app/features/client/actions';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { WizardData } from '../../profileDataTypes';
import { selectAllRsp } from '../../reducer';
import styles from './CustomStepReentryPipeline.module.scss';

const Item = ({
  label,
  value,
  chosen,
  onClick,
  ...rsp
}: RspListType & {
  label: string;
  value: string;
  chosen: boolean;
  onClick: (option: string) => void;
}) => (
  <Flex
    pv={8}
    ph={5}
    className={classNames(styles.listItem, chosen ? styles.listItemChosen : '')}
    onClick={() => onClick(value)}
  >
    <Text fontSize="2xl" fontWeight="700" lineHeight="none">
      {label}
    </Text>
    <Flex mv={3} container spacing={1}>
      {rsp.servicesArea.map((service) => (
        <Flex item key={service}>
          <Badge>{service}</Badge>
        </Flex>
      ))}
    </Flex>
    <Text>{rsp.description}</Text>
    <Text className={styles.listItemServices} mt={2}>
      Services offered: {rsp.support.join(', ')}
    </Text>
  </Flex>
);

export const CustomStepReentryPipeline = () => {
  const dispatch = useAppDispatch();
  const rspList = useAppSelector(selectAllRsp);
  const user = useAppSelector(selectAuthUser);
  const { data, next } = useWizardContext<WizardData>();
  const [chosen, setChosen] = useState(data.isNewRspMember && data.rspId ? data.rspId : undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const {
        support,
        offenseDrugs,
        offenseMotorVehicle,
        offensePropertyDamage,
        offenseSexual,
        offenseTheft,
        offenseViolent,
        offenseWhiteCollar,
        releasedCounty,
        postalCode,
        veteranOrJustice,
      } = data;

      const offenses = offenseDrugs
        ? [
            ...offenseDrugs,
            ...offenseMotorVehicle,
            ...offensePropertyDamage,
            ...offenseSexual,
            ...offenseTheft,
            ...offenseViolent,
            ...offenseWhiteCollar,
          ]
        : undefined;

      const county = releasedCounty || zipcodesCounties[postalCode];

      dispatch(
        listRsp({ userId: user.id, support, offenses, county: county || ' ', veteranOrJustice }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (option: string) => {
    setChosen(option);
  };

  const handleNext = () => {
    if (!chosen) {
      setIsModalOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = useCallback(async () => {
    await next({ rspId: rspList.length ? chosen : undefined });
  }, [chosen, next, rspList]);

  const options = rspList.map((rsp) => ({ label: rsp.name, value: rsp.id, ...rsp }));

  return (
    <>
      <Box>
        {options.map((el) => (
          <Item key={el.value} {...el} onClick={handleClick} chosen={el.value === chosen} />
        ))}
      </Box>

      <Button colorScheme="primary" mt={12} fluid maxWidth={96} onClick={handleNext}>
        Next
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl" className={styles.modal} p={7}>
          <ModalTitle fontSize="xl" mb={3}>
            No Supportive Services Provider (SSP) Selected
          </ModalTitle>
          <ModalBody textAlign="center">
            Are you sure you want to move forward without a service provider?
          </ModalBody>
          <ModalFooter pt={10}>
            <Button
              width="1/2"
              variant="text"
              color="grey.700"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button width="1/2" colorScheme="primary" onClick={handleSubmit}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
