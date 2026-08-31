// $ Displays asset equipment/ID — inline text for a single asset,
// or a dropdown listing all assets when there's more than one.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AssetItem } from "@/schemas/transfersSchemas";

export function AssetsDropdownCell({ assets }: { assets: AssetItem[] }) {
  if (assets.length === 0) return <p>—</p>;

  if (assets.length === 1) {
    const { equipment, assetID } = assets[0];
    return (
      <p className="capitalize">
        {equipment} <span className="text-muted-foreground">({assetID})</span>
      </p>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => e.stopPropagation()}
          className="text-cxs capitalize hover:cursor-pointer"
        >
          {assets.length} assets
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white border-gray-50 dark:border-(--clr-borderDark) dark:bg-(--bg-secondary_dark) dark:text-gray-100 shadow-lg"
        align="start"
      >
        <div className="flex">
          <DropdownMenuLabel className="flex-1 text-sm font-semibold px-0">
            Assets
          </DropdownMenuLabel>
          <DropdownMenuLabel className="text-sm font-semibold px-0">
            Asset ID
          </DropdownMenuLabel>
        </div>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup className="text-cxs">
          {assets.map((asset) => (
            <div
              key={asset.assetID}
              className=" flex items-center justify-between py-0.5 capitalize text-(--clr-textLight) dark:text-(--clr-textDark)"
            >
              <p key={asset.assetID} className="flex-1 capitalize">
                {asset.equipment}{" "}
              </p>
              <span className="text-muted-foreground">{asset.assetID}</span>
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
