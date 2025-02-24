import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Ana Səhifə" },
  { href: "/products", label: "Məhsullar" },
  { href: "/about", label: "Haqqımızda" },
  { href: "/contact", label: "Əlaqə" }
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="w-full bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold text-primary">DekorArt</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
