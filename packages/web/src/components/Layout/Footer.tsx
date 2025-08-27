import { Container, Text } from '@disruptive-labs/ui';
import Link from 'next/link';
import styles from './Footer.module.scss';

export const Footer = () => (
  <footer className={styles.footer}>
    <Container>
      <Text color="grey.500" fontWeight="700">
        The Way Out, Inc. &copy; {new Date().getFullYear()}
        <Link href="/terms/" passHref>
          Terms
        </Link>
        <Link href="/privacy/" passHref>
          Privacy
        </Link>
      </Text>
    </Container>
  </footer>
);
