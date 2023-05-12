import { useEffect } from "react";

const BirthSelectDropDown = ({
  label,
  inputValue,
  onClickInput,
  isSelectDropDown,
  onClickDropDown,
  data,
}) => {

  useEffect(() => {
    const handleOutsideClick = () => {
      if (isSelectDropDown) {
        onClickDropDown(null);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => window.removeEventListener("click", handleOutsideClick);
  });

  const handleDropDownClick = (e) => {
    e.stopPropagation();

    onClickDropDown(label);
  };
  const handleInputClick = (e) => {
    onClickInput(e.target.textContent);
    if (isSelectDropDown) {
      onClickDropDown(null);
    }
  };

  return (
    <div className="w-3/10 text-inherit">
      <div className="relative box-border text-base font-medium w-full">
        <div
          className="flex items-center  bg-gray-700 border border-gray-700 rounded-md justify-between min-h-40 relative transition duration-150 box-border opacity-100 focus:outline-none"
          onClick={handleDropDownClick}
        >
          <div className="flex items-center flex-1 flex-wrap px-2 pb-0.5 relative overflow-hidden box-border">
            <div
              className={`${
                inputValue === "" ? "text-gray-500" : "text-gray-200"
              } absolute  mx-0.5 box-border`}
            >
              <span aria-hidden="true" className="text-sm">
                {inputValue === "" ? label : inputValue}
              </span>
            </div>
            <div className="m-0.5 py-0.5 visible bg-gray-700 box-border">
              <div className="inline-block">
                <input
                  id=""
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  tabIndex="0"
                  aria-autocomplete="list"
                  aria-label="Ngày"
                  className="box-content w-0.5 border-0 text-inherit opacity-0 p-0 outline-none"
                  style={{ background: "0px center" }}
                />
                <div className="absolute top-0 left-0 invisible h-0 overflow-scroll whitespace-pre text-base font-sans font-normal tracking-normal "></div>
              </div>
            </div>
          </div>
          <div className="flex items-center self-stretch flex-shrink-0 box-border">
            <div
              className="flex pl-0 pr-1 cursor-pointer transition-colors duration-150 box-border opacity-100"
              aria-hidden="true"
              style={{ color: "rgb(181, 186, 193)" }}
            >
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
                className="inline-block fill-current align-middle leading-none stroke-current stroke-0"
              >
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </div>
          </div>
        </div>

        {isSelectDropDown && (
          <div
            className="text-xs bg-gray-700"
            style={{
              bottom: "100%",
              borderRadius: "0px 0px 4px 4px",
              marginBottom: "-1px",
              marginTop: "-1px",
              position: "absolute",
              width: "100%",
              zIndex: "1",
              boxSizing: "border-box",
              boxShadow:
                "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px",
              border: "1px solid rgb(30, 31, 34)",
              color: "rgb(181, 186, 193)",
            }}
          >
            <div
              className=""
              style={{
                maxHeight: "215px",
                overflowY: "auto",
                position: "relative",
                boxSizing: "border-box",
                padding: "0px",
              }}
            >
              {data.map((idx) => (
                <div
                  className="hover:bg-gray-500 text-sm"
                  id="react-select-2-option-0"
                  tabIndex="-1"
                  key={`${label}-${idx}`}
                  style={{
                    color: "rgb(219, 222, 225)",
                    cursor: "pointer",
                    display: "flex",
                    // fontSize: "inherit",
                    padding: "12px",
                    width: "100%",
                    userSelect: "none",
                    boxSizing: "border-box",
                    alignItems: "center",
                    minHeight: "40px",
                  }}
                  onClick={handleInputClick}
                >
                  {idx}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthSelectDropDown;
