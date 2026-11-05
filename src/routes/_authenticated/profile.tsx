import { createFileRoute } from '@tanstack/react-router';
import { OrganizerProfile } from '../../components/OrganizerProfile';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="py-8">
      <OrganizerProfile />
    </div>
  );
}