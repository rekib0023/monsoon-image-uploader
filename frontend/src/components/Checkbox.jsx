const Checkbox = ({ id, label, handleChange }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-gray-900 checked:border-gray-900 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
          id={id}
          onClick={handleChange}
        />
        <label className="form-check-label inline-block text-gray-800" for={id}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
