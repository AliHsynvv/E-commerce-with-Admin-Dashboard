import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { IMAGES } from "@/lib/constants";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="min-h-[600px] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${IMAGES.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-white">
          <h1 className="text-5xl font-bold mb-6">
            Dekorativ Məhsullar
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Eviniz üçün yüksək keyfiyyətli dekorativ məhsullar
          </p>
          <Link href="/products">
            <Button size="lg" variant="default">
              Məhsullarımızı Kəşf Edin
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <SectionHeader
            title="Seçilmiş Məhsullar"
            subtitle="Ən çox bəyənilən dekorativ məhsullarımız"
          />

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products?.slice(0, 3).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
