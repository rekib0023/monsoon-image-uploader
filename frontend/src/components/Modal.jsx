import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Modal = ({ children, title, setShowModal }) => {
  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-1/2">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
              <h3 className="text-3xl font=semibold">{title}</h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon
                  icon={faX}
                  size="lg"
                  className="cursor-pointer"
                />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Modal;
