"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { rootDomain } from "@/lib/utils";
import { createTenantAction } from "@/lib/actions";

const AVAILABLE_RULES = [
  { id: "read-transactions", label: "Read Transactions" },
  { id: "create-transactions", label: "Create Transactions" },
  { id: "view-reports", label: "View Reports" },
  { id: "manage-users", label: "Manage Users" },
];

function ColorInput({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type="color"
        value={value}
        onChange={onChange}
        className="w-12 h-8 border rounded cursor-pointer"
        required
      />
    </div>
  );
}

function AccessRulesInput({
  rules,
  setRules,
}: {
  rules: string[];
  setRules: (r: string[]) => void;
}) {
  const toggle = (id: string) =>
    setRules(
      rules.includes(id) ? rules.filter((x) => x !== id) : [...rules, id]
    );

  return (
    <div className="space-y-1">
      <Label>Access Rules</Label>
      <div className="grid grid-cols-2 gap-2">
        {AVAILABLE_RULES.map((rule) => (
          <label key={rule.id} className="flex items-center space-x-2">
            <Checkbox
              checked={rules.includes(rule.id)}
              onCheckedChange={() => toggle(rule.id)}
            />
            <span>{rule.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function CreateTenantForm() {
  const [subdomain, setSubdomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [accessRules, setAccessRules] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  // Simple labels input (same as before)
  const addLabel = () => setLabels([...labels, ""]);
  const updateLabel = (i: number, val: string) =>
    setLabels(labels.map((l, idx) => (idx === i ? val : l)));
  const removeLabel = (i: number) =>
    setLabels(labels.filter((_, idx) => idx !== i));

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
          <span className="bg-gray-100 px-3 flex items-center">
            .{rootDomain}
          </span>
        </div>
      </div>

      {/* Branding colors */}
      <div className="flex space-x-4">
        <ColorInput
          label="Primary Color"
          name="primaryColor"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
        <ColorInput
          label="Secondary Color"
          name="secondaryColor"
          value={secondaryColor}
          onChange={(e) => setSecondaryColor(e.target.value)}
        />
      </div>

      {/* Access rules */}
      <AccessRulesInput rules={accessRules} setRules={setAccessRules} />

      {/* Labels (branches) */}
      <div className="space-y-2">
        <Label>Labels (Branches)</Label>
        {labels.map((lab, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Input
              name={`labels[${i}]`}
              placeholder="e.g. Retail"
              value={lab}
              onChange={(e) => updateLabel(i, e.target.value)}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeLabel(i)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addLabel}>
          + Add Label
        </Button>
      </div>

      {/* Hidden fields for colors & rules */}
      <input type="hidden" name="primaryColor" value={primaryColor} />
      <input type="hidden" name="secondaryColor" value={secondaryColor} />
      <input type="hidden" name="accessRules" value={accessRules.join(",")} />

      <Button type="submit">Create Tenant</Button>
    </form>
  );
}
