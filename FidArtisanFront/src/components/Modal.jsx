// components/Modal.jsx
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
  