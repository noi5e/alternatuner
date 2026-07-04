import { BoxArrowDownIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function ScaleHeader() {
  return (
    <div className="w-full flex items-center p-4 border border-gray-800">
      <div className="flex basis-1/2 items-center gap-4">
        <div className="basis-auto text-3xl font-thin italic text-gray-500 cursor-text">
          "Untitled Scale"
        </div>
        <div className=" text-gray-400 text-sm cursor-default">7 Notes</div>
      </div>
      <div className="flex basis-1/2 justify-end">
        <Button className="max-w-fit cursor-pointer">
          <BoxArrowDownIcon />
          Save
        </Button>
      </div>
    </div>
  );
}
