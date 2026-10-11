import { Link as RouterLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';

const NotFound = () => {
  return (
    <Card title={COMMON_MESSAGES.NOT_FOUND}>
      <Link component={RouterLink} to={ROUTES.DASHBOARD}>
        Back to dashboard
      </Link>
    </Card>
  );
};

export default NotFound;
