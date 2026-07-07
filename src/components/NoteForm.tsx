import type { NoteFormProps } from "../types";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";

export function NoteForm({ onCreateNote }: NoteFormProps) {
  return (
    <form
      className="w-full border-y border-gray-200 p-4 bg-muted/20"
      action={onCreateNote}
    >
      <FieldGroup>
        <Field className="mx-auto w-full max-w-xl gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FieldLabel
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground min-w-fit"
              htmlFor="hertz"
            >
              Add note
            </FieldLabel>
            <div className="flex w-full items-center gap-2">
              <Input
                id="hertz"
                className="rounded-none text-lg flex-1 font-semibold tabular-nums"
                name="hertz"
                placeholder="Enter frequency in Hz..."
                required
              />
              <Button
                aria-label="Add note"
                className="rounded-none cursor-pointer shrink-0"
                size="icon"
                type="submit"
              >
                <PlusIcon weight="bold" />
              </Button>
            </div>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
