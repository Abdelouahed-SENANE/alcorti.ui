"use client";
import { autocompleteCache } from "@/components/ui/autocomplete/autocomplete.cache";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { SummaryStep } from "@/features/shipments/components/steps/summary.step";
import { ShipmentOrderInputs } from "@/features/shipments/shipment.type";
import { AuthGuard, useLogout } from "@/lib/auth";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const logout = useLogout();

  useEffect(() => {
    // Seed locations for the preview
    autocompleteCache.set(
      "locations",
      "loc-casablanca",
      "Casablanca, Morocco",
      {
        value: "loc-casablanca",
        name_ar: "الدار البيضاء",
        name_en: "Casablanca",
        name_fr: "Casablanca",
        lat: 33.5731,
        lng: -7.5898,
      },
    );
    autocompleteCache.set("locations", "loc-tangier", "Tangier, Morocco", {
      value: "loc-tangier",
      name_ar: "طنجة",
      name_en: "Tangier",
      name_fr: "Tangier",
      lat: 35.7595,
      lng: -5.834,
    });
    // Seed categories for the preview
    autocompleteCache.set("categories", "electronics", "Electronics", {
      id: "electronics",
      name_ar: "إلكترونيات",
      name_en: "Electronics",
      name_fr: "Électronique",
    });
  }, []);

  const mockForm = useForm<ShipmentOrderInputs>({
    defaultValues: {
      category_id: "electronics",
      description:
        "This is a sample shipment description for design purposes. It should be long enough to test the layout and wrapping of text in the summary view.",
      from_date: new Date().toISOString(),
      to_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      origin_id: "loc-casablanca",
      destination_id: "loc-tangier",
      items: [
        {
          description: "Apple iPhone 15 Pro",
          length: 15,
          width: 8,
          height: 1,
          weight: 0.2,
          image: null,
        },
        {
          description: "MacBook Pro 16-inch",
          length: 36,
          width: 25,
          height: 2,
          weight: 2.1,
          image: null,
        },
        {
          description: "Sony WH-1000XM5 Headphones",
          length: 20,
          width: 15,
          height: 8,
          weight: 0.3,
          image: null,
        },
      ],
    },
  });

  return (
    <AuthGuard requireCompleted>
      <div className="p-8 space-y-8">
        <div className="flex gap-4">
          <Button className="w-fit">
            <Link href={paths.admin.dashboard.route()}>Dashboard</Link>
          </Button>
          <Button className="w-fit" onClick={() => logout.mutate(undefined)}>
            Logout
          </Button>
          <Button className="w-fit">
            <Link href={paths.client.shipments.orders.route()}>Client</Link>
          </Button>
        </div>

        <div className="border-t max-w-4xl mx-auto pt-8">
          <SummaryStep control={mockForm.control} />
        </div>
      </div>
    </AuthGuard>
  );
}
