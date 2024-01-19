"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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

import addItemAction, { formSchema } from "@/shared/serverActions/addItem";

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

export default function AddItem({
  labels,
  collectionSlug,
  customFields,
}: {
  labels: {
    name: string;
    tags: string;
    addTag: string;
    submit: string;
    toast: { success: string; failure: string };
  };
  collectionSlug: string;
  customFields: CustomField[];
}) {
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const {
    fields: tags,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  const { fields: cfValues } = useFieldArray({
    name: "customFieldsValues",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const date = await addItemAction(collectionSlug, values);
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <section className="space-y-2">
            <Label>{"Tags"}</Label>
            <div className="flex flex-wrap gap-5">
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
            <div className="flex">
              <Input value={tag} onChange={(e) => setTag(e.target.value)} />
              <Button type="button" onClick={() => appendTag({ value: tag })}>
                {labels.addTag}
              </Button>
            </div>
          </section>
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
        </div>
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
