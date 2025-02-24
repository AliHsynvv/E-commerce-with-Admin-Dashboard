import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type Product, type InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";
import { LogOut } from "lucide-react";
import { UploadCloud } from "lucide-react";
import cn from 'classnames';
import { AdminNav } from "@/components/layout/admin-nav";

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      price: 0,
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Məhsul əlavə edildi" });
      form.reset();
      setIsDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; product: InsertProduct }) => {
      const res = await apiRequest("PUT", `/api/products/${data.id}`, data.product);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Məhsul yeniləndi" });
      setSelectedProduct(null);
      setIsDialogOpen(false);
      form.reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Məhsul silindi" });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/check-auth"] });
      setLocation("/admin");
    }
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Şəkil yükləmə xətası');
      }

      const data = await res.json();
      form.setValue('imageUrl', data.imageUrl);
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Şəkil yükləmə zamanı xəta baş verdi",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: InsertProduct) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, product: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const editProduct = (product: Product) => {
    setSelectedProduct(product);
    form.reset(product);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <AdminNav />
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Məhsulların İdarə Edilməsi</h1>
          <div className="flex gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setSelectedProduct(null);
                  form.reset({
                    name: "",
                    description: "",
                    category: "",
                    imageUrl: "",
                    price: 0,
                  });
                }}>
                  Yeni Məhsul
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? "Məhsulu Yenilə" : "Yeni Məhsul"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Təsvir</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kateqoriya</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="">Seçin...</option>
                              {CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şəkil</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {field.value && (
                                <img
                                  src={field.value}
                                  alt="Preview"
                                  className="w-full max-w-[200px] h-auto rounded-lg"
                                />
                              )}
                              <div className="flex items-center gap-4">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      uploadImage(file);
                                    }
                                  }}
                                  className="hidden"
                                  id="image-upload"
                                />
                                <label
                                  htmlFor="image-upload"
                                  className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer hover:bg-secondary",
                                    uploading && "opacity-50 cursor-not-allowed"
                                  )}
                                >
                                  <UploadCloud className="h-4 w-4" />
                                  {uploading ? "Yüklənir..." : "Şəkil Seç"}
                                </label>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qiymət</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      {selectedProduct ? "Yenilə" : "Əlavə et"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıxış
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {products?.map(product => (
            <div
              key={product.id}
              className="border p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => editProduct(product)}
                >
                  Düzəliş et
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(product.id)}
                >
                  Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}