import { useState } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { Textbox } from "../../../../components/Textbox";
import type { Birthday } from "../../../../hooks/useConfig";
import { EMPTY_BIRTHDAY } from "./BirthdaysPanel";

type AddNewBirthdayProps = {
  handleNewBirthday: (birthday: Birthday) => void;
};

export const AddNewBirthday = ({ handleNewBirthday }: AddNewBirthdayProps) => {
  const [newBirthday, setNewBirthday] = useState<Birthday>(EMPTY_BIRTHDAY());

  return (
    <div className="flex flex-row gap-2 justify-between">
      <Textbox
        placeholder="Person"
        inputValue={newBirthday.value.person || ""}
        onChangeHandler={(e) =>
          setNewBirthday((p) => ({
            ...p,
            value: {
              ...newBirthday.value,
              person: e.target.value,
            },
          }))
        }
      />
      <input
        type="date"
        value={newBirthday.value.birthdate || ""}
        onChange={(e) =>
          setNewBirthday((p) => ({
            ...p,
            value: {
              ...newBirthday.value,
              birthdate: e.target.value,
            },
          }))
        }
      />

      <Button
        minWidth="min-w-10"
        label={"Add new"}
        disabled={
          newBirthday.value.person === "" || newBirthday.value.birthdate === ""
        }
        onClick={() => handleNewBirthday(newBirthday)}
      />
    </div>
  );
};
