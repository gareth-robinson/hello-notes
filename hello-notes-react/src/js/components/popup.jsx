import React from "react";

const PopUp = props => {
  const { visible, title, text, onContinue, onCancel } = props;
  if (!visible) {
    return null;
  }

  return (
    <div
      className="z-10 absolute border border-gray-400 bg-white centre-dialog top-32 shadow-lg"
      role="dialog"
      aria-modal="true"
    >
      <div className="border-b">{title}</div>
      <div>{text}</div>
      <div>
        <span className="flex w-full">
          <button
            type="button"
            className="inline-flex justify-center w-full"
            onClick={onContinue}
          >
            Continue
          </button>
        </span>
        <span className="flex w-full">
          <button
            type="button"
            className="inline-flex justify-center w-full"
            onClick={onCancel}
          >
            Cancel
          </button>
        </span>
      </div>
    </div>
  );
};

export default PopUp;

/*
    <div class=" align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"  aria-labelledby="modal-headline">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              Deactivate account
            </h3>
            <div class="mt-2">
              <p class="text-sm leading-5 text-gray-500">
                Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
*/
