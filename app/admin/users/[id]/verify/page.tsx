"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { paths } from "@/config/paths";
import { useUserDetails } from "@/features/users/api/user.details";
import { UserReview } from "@/features/users/components/user.review";
import { notFound, useParams, redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function VerifyUserPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const { data, isFetching } = useUserDetails({ id });

  const user = data?.data!;

  if (user && user.status === "approved") {
    redirect(paths.admin.users.route());
  }

  return (
    <DashLayout
      title={t("users.page.review.title")}
      desc={t("users.page.review.desc")}
      breadcrumbs={[
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          active: false,
        },
        {
          label: t("navigation.users"),
          url: paths.admin.users.route(),
          active: false,
        },
        {
          label: user ? `${user.first_name} ${user.last_name}` : undefined,
          url: paths.admin.users.verify.route(id),
          active: true,
        },
      ]}
    >
      <UserReview user={user} isFetching={isFetching} />
    </DashLayout>
  );
}
