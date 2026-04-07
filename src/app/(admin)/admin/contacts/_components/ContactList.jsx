"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import LoadingBar from "@/components/LoadingBar";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/contact?search=${encodeURIComponent(search)}`);
      const result = await response.json();

      if (response.ok) {
        setContacts(result.data || []);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    await fetchContacts();
  };

  const handleDelete = async (contactId) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم حذف الرسالة بنجاح");
        fetchContacts();
      } else {
        const result = await response.json();
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
  };

  const closeModal = () => {
    setSelectedContact(null);
  };

  if (loading) {
    return <LoadingBar fullScreen={false} className="py-20" />;
  }

  return (
    <div className="space-y-6">
      {/* Header with search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="البحث في الرسائل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contacts table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الموضوع</TableHead>
              <TableHead className="text-right">الرسالة</TableHead>
              <TableHead className="text-right">تاريخ الإرسال</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  لا توجد رسائل
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </TableCell>
                  <TableCell>{contact.subject}</TableCell>
                  <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewContact(contact)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-700"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">تفاصيل الرسالة</h3>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-medium text-sm text-gray-600">الاسم:</label>
                <p className="text-lg">{selectedContact.name}</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">البريد الإلكتروني:</label>
                <p className="text-lg">
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">الموضوع:</label>
                <p className="text-lg">{selectedContact.subject}</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">الرسالة:</label>
                <p className="text-lg whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">تاريخ الإرسال:</label>
                <p className="text-sm text-gray-500">
                  {new Date(selectedContact.createdAt).toLocaleString("ar-SA")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
