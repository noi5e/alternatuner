import { FileIcon } from "@phosphor-icons/react";
import { HeartIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function ScaleHeader() {
  return (
    <div className="w-full flex flex-col items-end sm:flex-row sm:items-center p-4 gap-4">
      <div className="flex justify-center sm:justify-start sm:basis-1/2 w-full items-baseline gap-4">
        <div className="basis-auto whitespace-nowrap text-3xl font-thin italic text-gray-500 cursor-text">
          "Untitled Scale"
        </div>
        <div className=" text-gray-400 whitespace-nowrap italic items-end sm:items-center font-thin text-xl cursor-default">
          ( 7 Notes )
        </div>
      </div>
      <div className="flex basis-1/2 m-auto sm:justify-end">
        <Button className="max-w-fit mr-2 cursor-pointer">
          <HeartIcon />
          Add to Favorites
        </Button>
        <Button className="max-w-fit cursor-pointer">
          <FileIcon />
          Save
        </Button>
      </div>
    </div>
  );
}
