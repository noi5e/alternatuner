import type { NoteFormProps } from "../types";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NoteForm({ onCreateNote }: NoteFormProps) {
  return (
    <form
      className="bg-gray-50 p-6 rounded w-full md:w-1/4"
      action={onCreateNote}
    >
      <FieldGroup>
        <Field>
          <FieldLabel className="italic" htmlFor="hertz">
            Create a Musical Note:
          </FieldLabel>
          <Input
            id="hertz"
            className="w-1/2"
            name="hertz"
            type="number"
            placeholder="Enter a Hertz value."
            required
          />
        </Field>
        <Button className="w-1/2 cursor-pointer" type="submit">
          Submit
        </Button>
      </FieldGroup>
    </form>
  );
}
