import { Box, ButtonBase } from '@disruptive-labs/ui';
import AlertIcon from '@disruptive-labs/ui/dist/icons/AlertTriangle';
import ChevronIcon from '@disruptive-labs/ui/dist/icons/ChevronRight';
import Link from 'next/link';
import { SEO } from '../SEO';
import styles from './Error.module.scss';

export function Crash() {
  return (
    <div className={styles.container}>
      <Box p={5} className={styles.alert} role="alert">
        <AlertIcon className={styles.icon} />
        <h1>Oops!</h1>
        <p>Something went wrong. Please refresh or try again later.</p>
      </Box>
    </div>
  );
}

export function NotFound() {
  return (
    <>
      <SEO title="Not Found" />
      <div className={styles.container}>
        <Box p={5} className={styles.alert} role="alert">
          <AlertIcon className={styles.icon} />
          <h1>404</h1>
          <p>Oops. We can&apos;t seem to find the page you are looking for.</p>
          <Box mt={6}>
            <ButtonBase as={Link} href="/" colorScheme="primary" accessoryRight={<ChevronIcon />}>
              Home
            </ButtonBase>
          </Box>
        </Box>
      </div>
    </>
  );
}
