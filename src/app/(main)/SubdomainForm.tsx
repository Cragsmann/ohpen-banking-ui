"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTenantAction } from "@/lib/actions";
import { rootDomain } from "@/lib/utils";
import { useState } from "react";

const AVAILABLE_RULES = [
  { id: "read-transactions", label: "Read Transactions" },
  { id: "create-transactions", label: "Create Transactions" },
  { id: "view-reports", label: "View Reports" },
  { id: "manage-users", label: "Manage Users" },
];

export function CreateTenantForm() {
  const [subdomain, setSubdomain] = useState("");
  const [accessRules, setAccessRules] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");

  const addLabel = () => {
    const trimmed = newLabel.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
      setNewLabel("");
    }
  };

  const removeLabel = (label: string) =>
    setLabels((prev) => prev.filter((l) => l !== label));

  const toggleRule = (id: string) =>
    setAccessRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  return (
    <form action={createTenantAction} className="space-y-6">
      {/* Subdomain */}
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomain</Label>
        <div className="flex">
          <Input
            id="subdomain"
            name="subdomain"
            placeholder="your-tenant"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
          />
          <span className="px-3 flex items-center">.{rootDomain}</span>
        </div>
      </div>

      {/* Access Rules */}
      <div className="space-y-1">
        <Label>Access Rules</Label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_RULES.map((rule) => (
            <label key={rule.id} className="flex items-center space-x-2">
              <Checkbox
                checked={accessRules.includes(rule.id)}
                onCheckedChange={() => toggleRule(rule.id)}
              />
              <span>{rule.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-2">
        <Label>Labels (Branches)</Label>
        <div className="flex space-x-2">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Retail"
          />
          <Button type="button" onClick={addLabel} variant="secondary">
            Add
          </Button>
        </div>
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {labels.map((label) => (
              <div
                key={label}
                className="flex items-center bg-gray-200 text-black rounded-md px-3 py-1 text-sm"
              >
                <span>{label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => removeLabel(label)}
                  aria-label={`Remove label ${label}`}
                  className="ml-2 text-red-600 hover:text-red-800 p-0"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Inputs */}
      <input type="hidden" name="accessRules" value={accessRules.join(",")} />
      <input type="hidden" name="labels" value={labels} />

      <Button type="submit">Create Tenant</Button>
    </form>
  );
}
