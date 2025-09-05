import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <div className="py-10 bg-[#2563EBDB]/90 text-white flex flex-col sm:flex-row gap-3 justify-center items-center">
      <Image
        src={"/logo2.svg"}
        width={120}
        height={120}
        alt={"logo"}
        className=" invert brightness-0"
      />
      <p className="text-[16px]">© 2025 Blog genzet. All rights reserved.</p>
    </div>
  );
}

export default Footer;
