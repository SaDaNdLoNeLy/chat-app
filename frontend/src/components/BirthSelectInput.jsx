import BirthSelectDropDown from "./BirthSelectDropDown";
import { useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dates = [...Array(31).keys()].map((idx) => idx + 1);
const years = [...Array(100).keys()]
  .reverse()
  .map((idx) => new Date().getFullYear() - 99 + idx);

export default function BirthSelectInput({ onChange, value }) {
  const [selectedDropDown, setSelectedDropDown] = useState(null);

  const handleDropDownClick = (label) => {
    setSelectedDropDown(label);
  };

  const handleChangeInput = (type, value) => {
    onChange(type, value);
  };

  return (
    <div className="flex flex-col  text-gray-400 py-2">
      <label className="text-xs">Date of birth</label>

      <div className="mt-2 w-full flex justify-between">
        <BirthSelectDropDown
          label="Day"
          inputValue={value.date}
          onClickInput={handleChangeInput.bind(null, "date")}
          onClickDropDown={handleDropDownClick}
          isSelectDropDown={selectedDropDown === "Day"}
          data={dates}
        />
        <BirthSelectDropDown
          label="Month"
          inputValue={value.month}
          onClickInput={handleChangeInput.bind(null, "month")}
          onClickDropDown={handleDropDownClick}
          isSelectDropDown={selectedDropDown === "Month"}
          data={months}
        />
        <BirthSelectDropDown
          label="Year"
          inputValue={value.year}
          onClickInput={handleChangeInput.bind(null, "year")}
          onClickDropDown={handleDropDownClick}
          isSelectDropDown={selectedDropDown === "Year"}
          data={years}
        />
      </div>
      <div className="error"></div>
    </div>
  );
}
