"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateLabelSubdomainHref } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function LabelDropdown({
  tenant,
  labels,
}: {
  tenant: string;
  labels: { id: number; name: string }[];
}) {
  const router = useRouter();

  if (labels.length === 0) return null;

  return (
    <Select
      onValueChange={(label) =>
        router.push(generateLabelSubdomainHref(tenant, label))
      }
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select Label" />
      </SelectTrigger>
      <SelectContent>
        {labels.map((label) => (
          <SelectItem key={label.id} value={label.name}>
            {label.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
