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

  const [errors, setErrors] = useState<{
    subdomain?: string;
    accessRules?: string;
    labels?: string;
  }>({});

  const addLabel = () => {
    const trimmed = newLabel.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
      setNewLabel("");
      setErrors((prev) => ({ ...prev, labels: undefined }));
    }
  };

  const removeLabel = (label: string) => {
    setLabels((prev) => prev.filter((l) => l !== label));
  };

  const toggleRule = (id: string) => {
    setAccessRules((prev) => {
      const updatedRules = prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id];
      setErrors((prev) => ({ ...prev, accessRules: undefined }));
      return updatedRules;
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const trimmedSubdomain = subdomain.trim();

    if (!trimmedSubdomain) {
      newErrors.subdomain = "Tenant name (subdomain) is required.";
    } else if (!/^[a-z0-9-]+$/.test(trimmedSubdomain)) {
      newErrors.subdomain =
        "Subdomain must be lowercase letters, numbers, or hyphens.";
    }

    if (accessRules.length === 0) {
      newErrors.accessRules = "At least one access rule must be selected.";
    }

    if (labels.length === 0) {
      newErrors.labels = "At least one label must be defined.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("subdomain", subdomain);
      formData.append("accessRules", accessRules.join(","));
      formData.append("labels", labels.join(","));

      await createTenantAction(formData);
      alert("Tenant created successfully!");
      setSubdomain("");
      setAccessRules([]);
      setLabels([]);
      setNewLabel("");
    } else {
      console.log("Form validation failed.", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subdomain */}
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomain</Label>
        <div className="flex">
          <Input
            id="subdomain"
            name="subdomain"
            placeholder="your-tenant"
            value={subdomain}
            onChange={(e) => {
              setSubdomain(e.target.value);
              setErrors((prev) => ({ ...prev, subdomain: undefined }));
            }}
            className={errors.subdomain ? "border-red-500" : ""}
          />
          <span className="px-3 flex items-center">.{rootDomain}</span>
        </div>
        {errors.subdomain && (
          <p className="text-red-500 text-sm">{errors.subdomain}</p>
        )}
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
        {errors.accessRules && (
          <p className="text-red-500 text-sm">{errors.accessRules}</p>
        )}
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
              <Button
                variant="default"
                size="sm"
                type="button"
                onClick={() => removeLabel(label)}
                aria-label={`Remove label ${label}`}
                className=" p-2"
                key={label}
              >
                <span>{label}</span>✕
              </Button>
            ))}
          </div>
        )}
        {errors.labels && (
          <p className="text-red-500 text-sm">{errors.labels}</p>
        )}
      </div>

      <input type="hidden" name="accessRules" value={accessRules.join(",")} />
      <input type="hidden" name="labels" value={labels.join(",")} />
      <Button type="submit">Create Tenant</Button>
    </form>
  );
}
