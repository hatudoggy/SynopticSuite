export default function Modal({
  handleOutsideClick,
  handleFormSubmit,
  setSubject,
  setDescription,
  header,
  firstInput,
  secondInput,
}) {
  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="z-30 flex w-2/12 flex-col rounded-xl bg-white p-10">
        <div className="py-2 text-gray-600 sm:text-2xl">{header}</div>
        <div className="flex flex-col items-center py-2">
          <form
            className="flex flex-col"
            id="createPlan"
            onSubmit={(event) => handleFormSubmit(event)}
          >
            <label htmlFor="text" className="">
              {firstInput}
              <input
                type="text"
                onChange={(e) => setSubject(e.target.value)}
                className="relative my-2 rounded-lg border-2 border-solid border-gray-900 px-3 py-1"
                required
              />
            </label>
            <label htmlFor="text" className="">
              {secondInput}
              <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                className="relative my-2 rounded-lg border-2 border-solid border-gray-900 px-3 py-1"
                required
              />
            </label>
          </form>
          <button
            type="submit"
            form="createPlan"
            className="my-2 w-fit rounded-xl border-solid border-gray-900 bg-blue-500 px-4 py-2 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
