import { auth } from "@/lib/auth";
import PasswordForm from "@/components/admin/PasswordForm";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="bg-page min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Account Settings</h1>
        <p className="text-muted text-sm mb-8">
          Signed in as <strong className="text-ink">{session?.user?.email}</strong>.
          Change your admin password below. You&apos;ll be signed out after a successful change.
        </p>
        <PasswordForm />
      </div>
    </div>
  );
}
