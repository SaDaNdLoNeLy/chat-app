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
      <div className="relative box-border w-full text-base font-medium">
        <div
          className="min-h-40 relative  box-border flex items-center justify-between rounded-md border border-gray-700 bg-gray-700 opacity-100 transition duration-150 focus:outline-none"
          onClick={handleDropDownClick}
        >
          <div className="relative box-border flex flex-1 flex-wrap items-center overflow-hidden px-2 pb-0.5">
            <div
              className={`${
                inputValue === "" ? "text-gray-500" : "text-gray-200"
              } absolute  mx-0.5 box-border`}
            >
              <span aria-hidden="true" className="text-sm">
                {inputValue === "" ? label : inputValue}
              </span>
            </div>
            <div className="visible m-0.5 box-border bg-gray-700 py-0.5">
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
                  className="box-content w-0.5 border-0 p-0 text-inherit opacity-0 outline-none"
                  style={{ background: "0px center" }}
                />
                <div className="invisible absolute left-0 top-0 h-0 overflow-scroll whitespace-pre font-sans text-base font-normal tracking-normal "></div>
              </div>
            </div>
          </div>
          <div className="box-border flex flex-shrink-0 items-center self-stretch">
            <div
              className="box-border flex cursor-pointer pl-0 pr-1 opacity-100 transition-colors duration-150"
              aria-hidden="true"
              style={{ color: "rgb(181, 186, 193)" }}
            >
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
                className="inline-block fill-current stroke-current stroke-0 align-middle leading-none"
              >
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </div>
          </div>
        </div>

        {isSelectDropDown && (
          <div
            className="bg-gray-700 text-xs"
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
              {data.map((month, idx) => (
                <div
                  className="text-sm hover:bg-gray-500"
                  id="react-select-2-option-0"
                  key={`${month}-${idx}`}
                  tabIndex={idx + 1}
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
                  {month}
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
