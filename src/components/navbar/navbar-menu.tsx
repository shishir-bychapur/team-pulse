import { verifySession } from "@/src/utils/session";
import Navbar from "./navbar";

export const NavbarMenu = async () => {
  const session = await verifySession();
  const isLoggedIn = session?.isAuth ?? false;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
    </>
  );
};
