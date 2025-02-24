import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { href: "/admin/products", label: "Məhsullar" },
  { href: "/admin/categories", label: "Kateqoriyalar" },
  { href: "/admin/messages", label: "Mesajlar" },
];

export function AdminNav() {
  const [location] = useLocation();

  return (
    <nav className="bg-muted mb-8">
      <div className="container mx-auto">
        <div className="flex h-12 items-center gap-4">
          {ADMIN_NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                location === item.href
                  ? "bg-background text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
