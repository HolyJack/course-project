"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { CustomField, CustomFieldTypes } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import { ThreeDots } from "react-loader-spinner";

import addItemAction from "@/shared/serverActions/addItem";
import { itemFormSchema } from "@/shared/serverActions/schemas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/PopOver";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
} from "@/components/ui/Command";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/shared/utils";
import { useCommandState } from "cmdk";

const defaultCustomFieldsValues: Record<CustomFieldTypes, any> = {
  INT: 0,
  BOOLEAN: false,
  STRING: "",
  TEXT: "",
  DATE: Date.now(),
};

const inputTypeMap: Record<CustomFieldTypes, string> = {
  INT: "number",
  BOOLEAN: "checkbox",
  DATE: "Date",
  TEXT: "Text",
  STRING: "Text",
};

function TagsInput({
  labels: { tags: label, addTag, selectTags },
  form,
  defaultTags,
}: {
  labels: { tags: string; addTag: string; selectTags: string };
  defaultTags: string[];
  form: UseFormReturn<z.infer<typeof itemFormSchema>>;
}) {
  const [tag, setTag] = useState("");
  const [open, setOpen] = useState(false);
  const [tagsToSelect, setTagsToSelect] = useState(defaultTags);

  function CommandEmptyAddNew() {
    const isEmpty = useCommandState((state) => state.filtered.count) === 0;
    if (!isEmpty) return null;
    return (
      <div className="p-1">
        <Button
          onClick={() => {
            appendTag({ value: tag });
            setTagsToSelect((prev) => prev.concat([tag]));
          }}
          className="bg-accent hover:bg-accent/50 w-full"
        >
          {`${addTag} "${tag}"`}
        </Button>
      </div>
    );
  }

  const {
    fields: tags,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    name: "tags",
    control: form.control,
  });
  return (
    <section className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, id) => (
          <Badge
            className="flex justify-between gap-2 text-sm"
            variant="secondary"
            key={tag.id}
          >
            <p>{tag.value}</p>
            <button onClick={() => removeTag(id)}>
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="w-full"
            type="button"
            variant={"outline"}
            role="combobox"
            aria-expanded={open}
          >
            {selectTags}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput value={tag} onValueChange={setTag} />
            <CommandEmptyAddNew />
            <CommandGroup>
              {tagsToSelect.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => {
                    if (tags.map((tag) => tag.value).includes(tag)) {
                      const index = tags.findIndex(
                        ({ value }) => value === tag,
                      );
                      removeTag(index);
                    } else {
                      appendTag({ value: tag });
                    }
                  }}
                >
                  {tag}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      tags.map((tag) => tag.value).includes(tag)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />{" "}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </section>
  );
}

export default function AddItemForm({
  labels,
  defaultTags,
  collectionId,
  customFields,
}: {
  labels: {
    name: string;
    tags: string;
    addTag: string;
    submit: string;
    selectTags: string;
    toast: { success: string; failure: string };
  };
  defaultTags: string[];
  collectionId: number;
  customFields: CustomField[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      tags: [],
      customFieldsValues: customFields.map((customField) => ({
        id: customField.id,
        type: customField.type,
        name: customField.value,
        value: defaultCustomFieldsValues[customField.type],
      })),
    },
  });

  const { fields: cfValues } = useFieldArray({
    name: "customFieldsValues",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof itemFormSchema>) {
    setIsLoading(true);
    try {
      const date = await addItemAction(collectionId, values);
      if (!date) throw "Error";
      toast(labels.toast.success, date);
      form.reset();
    } catch {
      toast(labels.toast.failure);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{labels.name}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TagsInput
          form={form}
          defaultTags={defaultTags ?? []}
          labels={{
            tags: labels.tags,
            addTag: labels.addTag,
            selectTags: labels.selectTags,
          }}
        />
        {cfValues.map((val, index) => (
          <FormField
            key={val.id}
            control={form.control}
            name={`customFieldsValues.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{val.name}</FormLabel>
                <FormControl>
                  <Input
                    type={inputTypeMap[val.type]}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <ThreeDots width={36} color="white" /> : labels.submit}
        </Button>
      </form>
    </Form>
  );
}
