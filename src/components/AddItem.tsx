"use client";

import { CustomField, CustomFieldTypes } from "@prisma/client";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Button } from "./ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/Input";
import { useState } from "react";
import { Badge } from "./ui/Badge";
import { X } from "lucide-react";
import { Label } from "./ui/Label";
import addItemAction from "@/shared/serverActions/addItem";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "sonner";
import { Record } from "@prisma/client/runtime/library";

const formSchema = z.object({
  name: z.string().min(2, "Item name should be atleast 2 characters."),
  tags: z.array(z.object({ value: z.string() })),
  customFieldsValues: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal(CustomFieldTypes.INT),
        id: z.number(),
        name: z.string(),
        value: z.coerce.number(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.DATE),
        id: z.number(),
        name: z.string(),
        value: z.coerce.date(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.TEXT),
        id: z.number(),
        name: z.string(),
        value: z.string(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.STRING),
        id: z.number(),
        name: z.string(),
        value: z.string(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.BOOLEAN),
        id: z.number(),
        name: z.string(),
        value: z.coerce.boolean(),
      }),
    ]),
  ),
});

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
  collectionSlug,
  customFields,
}: {
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
      toast("Success!", date);
      form.reset();
    } catch {
      toast("Something Went Wrong!");
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
                <FormLabel className="capitalize">{field.name}</FormLabel>
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
                Add Tag
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
          {isLoading ? <ThreeDots width={36} color="white" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
