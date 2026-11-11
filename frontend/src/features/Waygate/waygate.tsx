import { LoaderPinwheel } from "lucide-react";
import { Card } from "../../components/ui/card";
import { useFetch } from "../../hooks/useFetch";
import type { WaygateItemResponse } from "../../types/waygate";
import { cn } from "../../utils/cn";
import { WaygateItem } from "./waygate-item";

export const Waygate = () => {
  const {
    data: waygateItems,
    refetch,
    loading,
    error,
  } = useFetch<WaygateItemResponse[]>({ url: "http://slab:8008/items" });

  if (error) return <>Error!</>;

  return (
    <Card
      headerTitle="Waygate"
      headerIcon={
        <LoaderPinwheel
          size={16}
          className={cn(
            "cursor-pointer",
            loading ? "animate-spin text-amber-300" : "",
          )}
          onClick={() => refetch()}
        />
      }
    >
      <div className="flex flex-col gap-1">
        {waygateItems && waygateItems.length > 0
          ? waygateItems.map((item) => (
              <WaygateItem key={item.id} item={item} refetch={refetch} />
            ))
          : null}
      </div>
    </Card>
  );
};
