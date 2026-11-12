import { format } from "date-fns/format";
import type { WaygateItemResponse } from "../../types/waygate";

export const formatMetadata = (item: WaygateItemResponse) => {
  const created = format(item.createdAt, "Mo MMM RRRR 'at' h:mm a");
  const url = new URL(item.item);
  const formattedUrl = `${url.hostname}${url.pathname ? url.pathname : ""}`;

  return { created, formattedUrl };
};
