import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NismQuestionBank from "@/components/NismQuestionBank";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ||
  "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

export default async function NismQuestionsPage() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase.auth.getUser();

  const email = data.user?.email
    ?.trim()
    .toLowerCase();

  if (
    error ||
    !email ||
    email !== ADMIN_EMAIL
  ) {
    redirect("/admin/login");
  }

  return (
    <NismQuestionBank
      email={email}
    />
  );
}
