import Link from "next/link";
import type { THeader } from "@/types";
import { Logo } from "@/components/custom/Logo";
import { Button } from "@/components/ui/button";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { LogoutButton } from "./LogoutButton";
import { SummaryForm } from "../forms/SummaryForm";

const styles = {
  header:
    "flex  items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800",
  actions: "flex items-center gap-4",
  summaryContainer: "flex-1 flex justify-center max-w-2xl mx-auto",
};

interface IHeaderProps {
  data?: THeader | null;
}

interface ILoggedInUserProps {
  username: string;
  email: string;
}

export function LoggedInUser({
  userData,
}: {
  readonly userData: ILoggedInUserProps;
}) {
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard/account"
        className="font-semibold hover:text-primary"
      >
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}

export async function Header({ data }: IHeaderProps) {
  const user = await getUserMeLoader();
  if (!data) return null;

  const { logoText, ctaButton } = data;

  return (
    <div className={styles.header}>
      <Logo text={logoText.text} />
      {user.ok && <SummaryForm />}
      <div className={styles.actions}>
        {user.ok ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={ctaButton.url}>
            <Button>{ctaButton.text}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
