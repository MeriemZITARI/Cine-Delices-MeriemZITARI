import type React from "react";
import NavMobile from "../NavMobile/NavMobile";
import NavDesktop from "../NavDesktop/NavDesktop";

const Header: React.FC = () => {
  return (
    <>
      <NavMobile className="md:hidden" />
      <NavDesktop className="hidden md:block" />
    </>
  );
};

export default Header;
