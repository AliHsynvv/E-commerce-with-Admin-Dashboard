import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AdminNav } from "@/components/layout/admin-nav";

export default function AdminMessages() {
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  if (isLoading) {
    return <div>Yüklənir...</div>;
  }

  return (
    <>
      <AdminNav />
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mesajlar</h1>
        </div>
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {contact.created_at ? format(new Date(contact.created_at), "PPP") : ""}
                </span>
              </div>
              <p className="mt-2">{contact.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}