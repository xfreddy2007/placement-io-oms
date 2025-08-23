import React from "react";

type DetailElementProps = {
  title: string;
  element: string;
};

const DetailElement: React.FC<DetailElementProps> = ({ title, element }) => {
  return (
    <div className="text-base py-2 px-4 flex gap-x-2 h-10">
      <span className="font-bold">{title}:</span>
      <span>{element}</span>
    </div>
  );
};

export default React.memo(DetailElement);
