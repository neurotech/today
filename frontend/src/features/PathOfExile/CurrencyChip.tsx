import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { plural } from "../../utils/plural";

type CurrencyChipProps = {
  variant: "buy" | "sell";
  quantity: number;
  pricePer: number;
  currencyName: string;
  currencyIcon: string;
};

export const CurrencyChip = ({
  variant,
  quantity,
  pricePer,
  currencyName,
  currencyIcon,
}: CurrencyChipProps) => {
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [recentlyCopied, setRecentlyCopied] = useState<boolean>(false);

  useEffect(() => {
    if (quantity === 0) setShowBreakdown(true);
  }, [quantity]);

  const price = quantity * pricePer;
  const formattedValue = price.toFixed(2);

  // TODO:
  // Re-design breakdown
  // Tidy

  return (
    <div className="flex flex-col select-none">
      <div className={"inline-flex"}>
        <div
          className={
            "bg-velvet-950 text-velvet-400 flex justify-center items-center gap-2 px-2 py-0.5 font-semibold rounded-l-sm min-w-20"
          }
        >
          {variant === "buy" ? "Buy" : "Sell"}
          <img
            src={currencyIcon}
            alt={`Icon for ${currencyName}`}
            className="size-4 mt-0.5"
          />
        </div>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: Shh. */}
        <div
          className={
            "bg-velvet-900 text-velvet-300 flex flex-1 justify-center px-2 py-0.5 font-semibold tabular-nums gap-2 cursor-help"
          }
          onClick={() => setShowBreakdown((prev) => !prev)}
          onKeyDown={() => setShowBreakdown((prev) => !prev)}
        >
          {formattedValue}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${formattedValue} ${currencyName}${plural(price)}`,
            );
            setRecentlyCopied(true);
            setTimeout(() => setRecentlyCopied(false), 2000);
          }}
          type="button"
          className={
            "bg-velvet-950 text-velvet-300 hover:bg-velvet-1000 hover:text-velvet-200 flex justify-center items-center px-2 py-0.5 font-semibold cursor-pointer rounded-r-sm min-w-10"
          }
        >
          {recentlyCopied ? (
            <ClipboardDocumentCheckIcon className="size-4 text-velvet-50" />
          ) : (
            <ClipboardDocumentListIcon className="size-4" />
          )}
        </button>
      </div>
      {showBreakdown && (
        <div className="flex flex-col flex-wrap gap-0.5 text-sm font-mono bg-velvet-950/30 text-velvet-400 rounded-b-sm border-t-0 border-1 border-black/30 mx-0.5">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => {
            const percentage = pricePer * (i / 10);
            const total = (price + percentage).toFixed(2);

            return (
              <button
                type="button"
                key={`${variant}-breakdown-${i}`}
                className="flex flex-row justify-between items-center leading-6 hover:text-velvet-200 hover:bg-velvet-900/40 active:text-white transition-colors cursor-pointer tabular-nums"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${total} ${currencyName}${plural(price)}`,
                  );
                  setRecentlyCopied(true);
                  setTimeout(() => setRecentlyCopied(false), 2000);
                }}
              >
                <div
                  key={`${variant}-percent-${i}`}
                  className="flex justify-center gap-2 px-2 py-0.5 min-w-20"
                >
                  {quantity}.{i}
                </div>
                <div
                  key={`${variant}-value-${i}`}
                  className="flex flex-1 justify-center px-2 py-0.5 gap-2"
                >
                  {price.toFixed(2)} + {percentage.toFixed(2)} = {total}
                </div>
                <div
                  key={`${variant}-copy-${i}`}
                  className="flex justify-center px-2 py-0.5 text-velvet-900 min-w-10"
                >
                  -
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
