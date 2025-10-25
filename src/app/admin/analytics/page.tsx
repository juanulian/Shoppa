import { auth } from '@/auth';
import AnalyticsClient from './analytics-client';

export default async function AnalyticsPage() {
  const session = await auth();
  const userEmail = session?.user?.email || 'Admin';

  return <AnalyticsClient userEmail={userEmail} />;
}
