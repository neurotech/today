import { useState } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { Textbox } from "../../../../components/Textbox";
import { EMPTY_BIRTHDAY, type Birthday } from "../../../../hooks/useConfig";

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
              ...p.value,
              person: e.target.value,
            },
          }))
        }
      />
      <input
        type="date"
        className="w-full flex-1 px-1 py-0.5 border-1 rounded-sm text-sm border-velvet-800 bg-velvet-950 text-velvet-400 focus-within:text-velvet-100 focus-visible:outline-3 focus-visible:outline-velvet-800/20"
        value={newBirthday.value.birthdate || ""}
        onChange={(e) =>
          setNewBirthday((p) => ({
            ...p,
            value: {
              ...p.value,
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
