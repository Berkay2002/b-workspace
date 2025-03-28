"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Check, Pencil } from "lucide-react";
import { StatusDropdown } from "./StatusDropdown";
import { DateField } from "./DateField";

interface Item {
  id: string;
  status: string;
  item: string;
  dueDate?: Date;
}

interface TableViewProps {
  items: Item[];
  onChange: (items: Item[]) => void;
}

export function TableView({ items, onChange }: TableViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleAdd = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      status: "not-started",
      item: "",
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
    setEditingItem(newItem);
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingItem(item);
  };

  const handleSave = () => {
    if (!editingItem) return;
    onChange(
      items.map((item) =>
        item.id === editingItem.id ? editingItem : item
      )
    );
    setEditingId(null);
    setEditingItem(null);
  };

  const handleChange = (field: keyof Item, value: string | Date) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const toggleDone = (id: string) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "done" ? "not-started" : "done",
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-4">
      <Table className="rounded-md border text-sm">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[160px]">Status</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="w-[180px]">Due Date</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const isDone = item.status === "done";

            return (
              <TableRow key={item.id} className="align-middle">
                <TableCell>
                  {isEditing ? (
                    <StatusDropdown
                      value={editingItem?.status || item.status}
                      onChange={(val) => handleChange("status", val)}
                    />
                  ) : (
                    <button
                      className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground capitalize hover:underline"
                      onClick={() => toggleDone(item.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleDone(item.id)}
                        className="mr-2"
                      />
                      {item.status.replace("-", " ")}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editingItem?.item || ""}
                      onChange={(e) => handleChange("item", e.target.value)}
                      placeholder="Item name..."
                      className="h-8 text-sm"
                    />
                  ) : (
                    <span className={isDone ? "line-through text-muted-foreground" : ""}>
                      {item.item}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <DateField
                      value={editingItem?.dueDate || undefined}
                      onChange={(date) => handleChange("dueDate", date as Date)}
                    />
                  ) : (
                    item.dueDate?.toLocaleDateString()
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Button
                      onClick={handleSave}
                      size="icon"
                      variant="ghost"
                      className="text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEdit(item)}
                      size="icon"
                      variant="ghost"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="pt-2">
        <Button
          onClick={handleAdd}
          variant="outline"
          className="w-full justify-center text-sm font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
