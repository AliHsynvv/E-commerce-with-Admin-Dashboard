import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "@shared/schema";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div>Yüklənir...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div>Məhsul tapılmadı</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-2">
                {product.price} AZN
              </p>
            </div>
            <p className="text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-auto">
              <Button className="w-full" size="lg">
                Əlaqə saxlayın
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
