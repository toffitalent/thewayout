import { Box, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@disruptive-labs/ui';
import InfoIcon from '@disruptive-labs/ui/dist/icons/InfoCircle';
import styles from './InfoBox.module.scss';

export const InfoBox = ({ content }: { content: React.ReactNode }) => (
  <Popover placement="auto" autoFocus={false}>
    <PopoverTrigger>
      <InfoIcon height={7} width={7} color="grey.500" />
    </PopoverTrigger>
    <PopoverContent rounded="xl" className={styles.popoverWrapper}>
      <PopoverArrow className={styles.popoverArrow} />
      <Box p={5} bgcolor="grey.100" maxWidth={96} rounded="xl">
        {content}
      </Box>
    </PopoverContent>
  </Popover>
);
