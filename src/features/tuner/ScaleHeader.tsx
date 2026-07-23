import { useState } from "react";

import { FileIcon, HeartIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { ScaleHeaderProps } from "../../types";

export function ScaleHeader({
  scaleTitle,
  notesCount,
  setScaleTitle,
}: ScaleHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState("");

  const displayedTitle = scaleTitle || "Untitled Scale";

  return (
    <div className="w-full flex flex-col items-end sm:flex-row sm:items-center p-4 gap-4">
      <div className="flex justify-center sm:justify-start sm:basis-1/2 w-full items-baseline gap-4">
        <span className="relative inline-block min-w-0">
          {/* Invisible element that determines width, height, and baseline of the scale title (both button and input) */}
          <span
            aria-hidden="true"
            className="invisible block whitespace-pre px-2 text-3xl font-thin italic"
          >
            {displayedTitle}
          </span>

          {isEditingTitle ? (
            <Input
              autoFocus
              aria-label="Scale title"
              placeholder={scaleTitle ?? "Untitled Scale"}
              onChange={(event) => setTitleInputValue(event.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                if (titleInputValue.length > 0) {
                  setScaleTitle(titleInputValue);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }

                if (event.key === "Escape" && titleInputValue === "") {
                  setIsEditingTitle(false);
                }

                if (event.key === "Escape") {
                  setScaleTitle(titleInputValue);
                }
              }}
              className="
        absolute inset-0
        h-full w-full min-w-0
        rounded-none border-0 border-b border-gray-400
        bg-gray-50/70 px-1 py-0
        text-3xl font-thin italic text-gray-500
        shadow-none
        md:text-3xl
        focus-visible:border-gray-500
        focus-visible:ring-2
        focus-visible:ring-gray-400/25
      "
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditingTitle(true);
              }}
              className="
        absolute inset-0
        h-full w-full
        appearance-none whitespace-nowrap
        border-0 bg-transparent px-1 py-0
        text-left text-3xl font-thin italic text-gray-500
        cursor-text
        hover:bg-transparent hover:text-gray-500
        focus-visible:rounded-sm
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-gray-400
      "
            >
              {displayedTitle}
            </button>
          )}
        </span>

        {/* <div className="basis-auto whitespace-nowrap text-3xl font-thin italic text-gray-500 cursor-text">
          {scaleTitle ?? "Untitled Scale"}
        </div> */}

        <div className=" text-gray-400 whitespace-nowrap italic items-end sm:items-center font-thin text-xl cursor-default">
          ( {notesCount > 0 ? notesCount : 0}{" "}
          {notesCount === 1 ? "Note" : "Notes"} )
        </div>
      </div>

      <div className="flex basis-1/2 m-auto sm:justify-end">
        <Button className="max-w-fit mr-2 cursor-pointer">
          <HeartIcon />
          Favorite
        </Button>
        <Button className="max-w-fit cursor-pointer">
          <FileIcon />
          Save
        </Button>
      </div>
    </div>
  );
}
