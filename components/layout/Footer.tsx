import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

// ADJUST: use your real routes.
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

// REPLACE: placeholder contact details, put your real ones here.
const contact = {
  email: "hello@handstogether.org",
  phone: "+880 1700-000000",
  address: "Chattogram, Bangladesh",
};

// REPLACE: point each href to your real social page.
const socials = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
];

// Light theme: light text on deep violet. Dark theme: muted text, gold on hover.
const linkClass =
  "inline-flex min-h-11 items-center gap-2 rounded-sm text-[15px] text-[#CBB8F0] transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6A94B] dark:text-muted-foreground dark:hover:text-primary dark:focus-visible:outline-primary";

const headingClass =
  "mb-3 text-[15px] font-bold text-[#F8F6FD] dark:text-foreground";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#2A2340] pb-8 pt-16 dark:border-t dark:border-border dark:bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="HandsTogether home"
              className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="h-9 w-9 shrink-0"
                aria-hidden="true"
              >
                <rect width="64" height="64" rx="16" fill="#5B3FA8" />

                <g fill="none" strokeWidth="8" strokeLinecap="round">
                  <path d="M18 15V49M18 32H30" stroke="#FFFFFF" />
                  <path d="M46 15V49M46 32H34" stroke="#E6A94B" />
                </g>
              </svg>

              <span className="font-(family-name:--font-jakarta) text-[22px] font-extrabold text-[#F8F6FD] dark:text-foreground">
                HandsTogether
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#CBB8F0] dark:text-muted-foreground">
              A platform for discovering and organizing social development
              events in your community.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <h3 className={headingClass}>Quick links</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact</h3>
            <address className="not-italic">
              <ul>
                <li>
                  <a href={`mailto:${contact.email}`} className={linkClass}>
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                    className={linkClass}
                  >
                    <Phone className="size-4 shrink-0" aria-hidden="true" />
                    {contact.phone}
                  </a>
                </li>
                <li className="inline-flex min-h-11 items-center gap-2 text-[15px] text-[#CBB8F0] dark:text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {contact.address}
                </li>
              </ul>
            </address>
          </div>

          {/* Social */}
          <div>
            <h3 className={headingClass}>Follow us</h3>
            <ul className="flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-[#43308A] text-[#F8F6FD] transition-all duration-200 ease-out hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6A94B] motion-safe:hover:-translate-y-0.5 dark:border-border dark:text-foreground dark:hover:border-primary dark:hover:text-primary dark:focus-visible:outline-primary"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#43308A] pt-6 text-sm text-[#CBB8F0] dark:border-border dark:text-muted-foreground">
          © {new Date().getFullYear()} HandsTogether. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
