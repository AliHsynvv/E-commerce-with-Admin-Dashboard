import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CATEGORIES } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema, type Category, type InsertCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AdminNav } from "@/components/layout/admin-nav";

export default function AdminCategories() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const allCategories = categories || [];

  const form = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const res = await apiRequest("POST", "/api/categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Kateqoriya əlavə edildi" });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Xəta baş verdi",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; category: InsertCategory }) => {
      const res = await apiRequest("PUT", `/api/categories/${data.id}`, data.category);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Kateqoriya yeniləndi" });
      setSelectedCategory(null);
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Xəta baş verdi",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Kateqoriya silindi" });
    },
    onError: (error: Error) => {
      toast({
        title: "Xəta baş verdi",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertCategory) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, category: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const editCategory = (category: Category) => {
    setSelectedCategory(category);
    form.reset({ name: category.name });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Yüklənir...</div>;

  return (
    <>
      <AdminNav />
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kateqoriyaların İdarə Edilməsi</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedCategory(null);
                form.reset({ name: "" });
              }}>
                Yeni Kateqoriya
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedCategory ? "Kateqoriyanı Yenilə" : "Yeni Kateqoriya"}
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

                  <Button type="submit" className="w-full">
                    {selectedCategory ? "Yenilə" : "Əlavə et"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {allCategories.map(category => (
            <div
              key={category.id}
              className="border p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => editCategory(category)}
                >
                  Düzəliş et
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(category.id)}
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