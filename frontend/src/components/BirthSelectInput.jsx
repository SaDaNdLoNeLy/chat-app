import BirthSelectDropDown from "./BirthSelectDropDown";
import { useState } from "react";
import { MONTHS, DATES, YEARS } from "../util/date";

export default function BirthSelectInput({ onChange, value }) {
  const [selectedDropDown, setSelectedDropDown] = useState(null);

  const handleDropDownClick = (label) => {
    setSelectedDropDown(label);
  };

  const handleChangeInput = (type, value) => {
    onChange(type, value);
  };

  return (
    <div className="flex flex-col  py-2 text-gray-400">
      <label className="text-xs">Date of birth</label>

      <div className="mt-2 flex w-full justify-between">
        <BirthSelectDropDown
          label="Day"
          inputValue={value.date}
          onClickInput={handleChangeInput.bind(null, "date")}
          onClickDropDown={handleDropDownClick}
          isSelectDropDown={selectedDropDown === "Day"}
          data={DATES}
        />
        <BirthSelectDropDown
          label="Month"
          inputValue={value.month}
          onClickInput={handleChangeInput.bind(null, "month")}
          onClickDropDown={handleDropDownClick}
          isSelectDropDown={selectedDropDown === "Month"}
          data={MONTHS}
        />
        <BirthSelectDropDown
          label="Year"
          inputValue={value.year}
          onClickInput={handleChangeInput.bind(null, "year")}
          onClickDropDown={handleDropDownClick}
          isSelectDropDown={selectedDropDown === "Year"}
          data={YEARS}
        />
      </div>
      <div className="error"></div>
    </div>
  );
}
