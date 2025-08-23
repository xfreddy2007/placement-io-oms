import React from "react";

type BackBtnProps = {
  onClick: () => void;
};

const BackBtn: React.FC<BackBtnProps> = ({ onClick }) => {
  return (
    <button
      className="bg-black text-white hover:bg-gray-700 transition duration-100 px-4 py-2 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      {"< Back"}
    </button>
  );
};

export default React.memo(BackBtn);
