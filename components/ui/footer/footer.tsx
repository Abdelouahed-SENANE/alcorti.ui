"use client";
import logo from "@/assets/logo-sm.png";
import { paths } from "@/config/paths";
import { RouterLink } from "../link";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-10 px-8">
      <div className="max-w-1/2 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <RouterLink
              to={paths.home.root}
              className="flex items-center gap-2"
            >
              <img
                src={logo.src}
                alt="Logo"
                className="size-6 object-contain"
              />{" "}
              <span className="text-2xl font-semibold text-card-foreground">
                AtlasLaw
              </span>
            </RouterLink>
            <p className="text-sm text-foreground/50 max-w-xs leading-relaxed">
              A modern platform for legal case management, designed to help law
              firms manage cases, track procedures, and maintain full
              visibility.
            </p>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-card-foreground">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-foreground/50 hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-foreground/50 hover:text-primary transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-foreground/50 hover:text-primary transition-colors"
                  >
                    How it works
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-card-foreground">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-foreground/50 hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-foreground/50 hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-foreground/50 hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} AtlasLaw. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-foreground/40 hover:text-primary"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs text-foreground/40 hover:text-primary"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-xs text-foreground/40 hover:text-primary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
