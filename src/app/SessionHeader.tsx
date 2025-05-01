import React from "react";

interface SessionHeaderProps {
  headerTitle: string
  headerTime: string
}


const SessionHeader: React.FC<SessionHeaderProps> = ({
  headerTitle, headerTime
}) => {
  return (
    <div>
      <div className="flex items-center justify-center mx-auto">
        <div className="flex items-center gap-3 w-fit">
          <div className="bg-[#733a84] text-white px-2 py-2.5 tracking-wide rounded-lg flex items-center justify-center font-semibold text-sm shadow-md whitespace-nowrap w-fit">
            <span className="font-bold">{headerTitle}</span>
          </div>
          <span className="text-gray-800 text-sm font-medium truncate">
            {headerTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;
