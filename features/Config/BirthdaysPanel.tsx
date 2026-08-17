import { formatDate } from "date-fns";
import { HorizontalRule } from "@/components/HorizontalRule";
import { Panel } from "@/components/Panel";
import { getConfig } from "@/lib/config";
import { AddNewConfig } from "./AddNewConfig";
import { ConfigTile } from "./ConfigTile";

/** Birthdates are stored as yyyy-MM-dd and displayed long-form. Formatting here
 *  keeps the client tile free of date logic and avoids a hydration mismatch. */
const formatBirthdate = (birthdate: string) => {
  try {
    return formatDate(new Date(birthdate), "dd MMMM yyyy");
  } catch {
    return birthdate;
  }
};

export const BirthdaysPanel = () => {
  const birthdays = getConfig("birthdays");

  return (
    <Panel
      heading="Birthdays"
      content={
        <div className="flex flex-col gap-2">
          {birthdays.length === 0 && <div>Please add a birthday below.</div>}

          {birthdays.map((birthday) => (
            <ConfigTile
              key={birthday.id}
              id={birthday.id}
              configKey="birthdays"
              left={birthday.value.person}
              right={birthday.value.birthdate}
              rightDisplay={formatBirthdate(birthday.value.birthdate)}
              leftPlaceholder="Person"
              rightPlaceholder="Birthdate"
              rightInputType="date"
            />
          ))}

          <HorizontalRule />

          <AddNewConfig
            configKey="birthdays"
            leftPlaceholder="Person"
            rightPlaceholder="Birthdate"
            rightInputType="date"
          />
        </div>
      }
    />
  );
};
