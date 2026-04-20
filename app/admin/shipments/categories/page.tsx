"use client";
import { DashLayout } from "@/components/layouts/dashboard/_dash.layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/form";
import { useQueryTable } from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useCategories } from "@/features/admin/categories/api/category.list";
import {
  CreateCategoryInputs,
  useCreateCategory,
} from "@/features/admin/categories/api/create.category";
import { Category } from "@/features/admin/categories/category.type";
import { CategoryForm } from "@/features/admin/categories/components/category.form";
import { CategorySelector } from "@/features/admin/categories/components/category.selector";
import { CategoryTable } from "@/features/admin/categories/components/category.table";
import { Download, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CategoriesPage() {
  const { t } = useTranslation();
  const table = useQueryTable<Category>();
  const categoriesQuery = useCategories({
    params: {
      page: table.page,
      limit: table.limit,
      term: table.term,
      sort: table.sort,
      order: table.order,
    },
  });

  const items = categoriesQuery.data?.data?.items || [];
  const pagination = categoriesQuery.data?.data?.pagination;

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCategoryInputs, string[]>>
  >({});
  const createMutation = useCreateCategory({
    mutationConfig: {
      onError: (res: any) => {
        const serverErrors = res.errors;
        if (serverErrors) {
          setErrors(serverErrors);
          toast({
            title: res.message || t("global.errors.validation"),
            type: "error",
          });
        } else {
          toast({
            title: res.message || t("global.errors.something_went_wrong"),
            type: "error",
          });
        }
      },
    },
  });

  const handleSubmit = useCallback((payload: CreateCategoryInputs) => {
    createMutation.mutate({ payload });
  }, []);

  return (
    <DashLayout
      title={t("categories.page.title")}
      desc={t("categories.page.desc")}
      breadcrumbs={[
        {
          label: t("navigation.dashboard"),
          url: paths.admin.dashboard.route(),
          active: false,
        },
        {
          label: t("navigation.shipments.categories"),
          url: paths.admin.shipments.categories.route(),
          active: true,
        },
      ]}
      actions={
        <div className="flex items-center gap-1">
          <CategoryForm
            apiErrors={errors}
            onSubmit={handleSubmit}
            isDone={createMutation.isSuccess}
            isLoading={createMutation.isPending}
            triggerButton={
              <Button className="gap-1 " variant={"default"}>
                <Plus className="size-4" />
                {t("categories.actions.add")}
              </Button>
            }
          />
          <Button className="gap-1 " variant={"secondary"}>
            <Download className="size-4" />
            {t("categories.actions.export")}
          </Button>
        </div>
      }
    >
      <div className="flex mb-2  gap-2 items-center">
        <SearchInput
          value={table.term}
          onChange={(val) => table.setTerm(val)}
          delay={600}
          placeholder={t("global.search")}
        />
      </div>
      <CategoryTable
        categories={items}
        isFetching={categoriesQuery.isFetching}
        table={table}
        pagination={pagination}
      />
    </DashLayout>
  );
}
