"use client";
import logo from "@/assets/logo-sm.png";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { RouterLink } from "../link";
import { UserNavgation } from "../user-navigation";

export const Navbar = () => {
  const user = useUser();

  return (
    <header className="sticky top-0 z-50 bg-background/30 backdrop-filter backdrop-blur-md border-b border-border ">
      <nav className="flex items-center h-16 justify-between max-w-1/2 mx-auto py-2 px-8">
        <RouterLink
          to={paths.home.root}
          className="flex items-center cursor-pointer justify-center gap-2"
        >
          <img src={logo.src} alt="Logo" className="size-5 object-contain" />{" "}
          <span className="text-xl font-semibold text-card-foreground">
            AtlasLaw
          </span>
        </RouterLink>
        <div className="flex items-center ">
          <ul className="flex items-center gap-4">
            <li className="px-3 py-1 text-sm font-medium text-foreground/50 hover:text-card-foreground hover:bg-foreground/10 rounded-sm transition-colors duration-300 cursor-pointer">
              <a href="#">Home</a>
            </li>
            <li className="px-3 py-1 text-sm font-medium text-foreground/50 hover:text-card-foreground hover:bg-foreground/10 rounded-sm transition-colors duration-300 cursor-pointer">
              <a href="#">About</a>
            </li>
            <li className="px-3 py-1 text-sm font-medium text-foreground/50 hover:text-card-foreground hover:bg-foreground/10 rounded-sm transition-colors duration-300 cursor-pointer">
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <ul className="flex items-center gap-2">
          {user.data ? (
            <li>
              <UserNavgation />
            </li>
          ) : (
            <>
              <li className="px-3 py-1 text-sm font-medium text-foreground/50 hover:text-card-foreground hover:bg-foreground/10 rounded-sm transition-colors duration-300 cursor-pointer">
                <RouterLink to={paths.auth.login.root} className="">
                  Log In
                </RouterLink>
              </li>
              <li className="px-4 py-1 text-sm bg-primary/80 text-primary-foreground/90 hover:text-primary-foreground  hover:bg-primary rounded-sm font-semibold transition-colors duration-300 cursor-pointer">
                <RouterLink to={paths.auth.register.root}>Sign Up</RouterLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
