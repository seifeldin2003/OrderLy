import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminMenuTable } from "../../components/admin/AdminMenuTable";
import { MenuItemForm } from "../../components/admin/MenuItemForm";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { deleteAdminMenuItem, getAdminMenu, saveAdminMenuItem } from "../../services/adminService";
import type { MenuItem } from "../../types/menu";

export function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | undefined>();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function refresh() {
    setItems(await getAdminMenu());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function save(item: MenuItem) {
    await saveAdminMenuItem(item);
    setOpen(false);
    setEditing(undefined);
    await refresh();
    setToast("Menu item saved");
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-3xl font-extrabold">Menu Management</h1><p className="text-muted">Add, edit, delete, and control item availability.</p></div>
        <Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus size={18} /> Add item</Button>
      </header>
      <AdminMenuTable
        items={items}
        onEdit={(item) => { setEditing(item); setOpen(true); }}
        onDelete={async (id) => { await deleteAdminMenuItem(id); refresh(); }}
        onToggle={async (item) => { await saveAdminMenuItem({ ...item, available: !item.available }); refresh(); }}
      />
      <Modal open={open} title={editing ? "Edit menu item" : "Add menu item"} onClose={() => setOpen(false)}>
        <MenuItemForm key={editing?.id ?? "new"} item={editing} onSubmit={save} />
      </Modal>
      <Toast message={toast} />
    </div>
  );
}
