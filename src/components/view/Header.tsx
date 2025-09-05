import { EyeIcon } from "lucide-react";
import React from "react";

interface HeaderProps {
  name: string;
}

function Header(props: HeaderProps) {
  const { name } = props;

  return (
    <div className="py-6 px-6 flex justify-between items-center w-full sticky top-0 bg-white">
      <p className="text-2xl font-bold">{name}</p>
      <div className="text-md flex items-center justify-center gap-2 text-white bg-[#3B82F6] py-2 px-4 rounded-full">
        <EyeIcon />
        <p>Ready to Check</p>
      </div>
    </div>
  );
}

export default Header;
