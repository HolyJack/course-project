"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import type { PutBlobResult } from "@vercel/blob";
import { Button } from "@/components/ui/Button";
import { ThreeDots } from "react-loader-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import * as z from "zod";
import {
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
  Select,
} from "@/components/ui/Select";
import { CustomFieldTypes } from "@prisma/client";
import { Textarea } from "@/components/ui/TextArea";
import { Label } from "@/components/ui/Label";
import { addCollection } from "@/shared/serverActions/addCollection";
import { useState } from "react";
import { toast } from "sonner";
import { collectionFormSchema } from "@/shared/serverActions/schemas";

export default function AddCollection({
  labels,
  topics,
}: {
  labels: {
    title: string;
    description: string;
    topic: string;
    customField: string;
    image: string;
    submit: string;
    addCustomField: string;
    removeCustomField: string;
    toast: {
      success: string;
      failure: string;
    };
  };
  topics: string[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof collectionFormSchema>>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      customFields: [],
      image: undefined,
      topic: topics[0],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "customFields",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof collectionFormSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/collection-img/upload?filename=${values.image?.name}`,
        {
          method: "POST",
          body: values.image,
        },
      );
      const blob = (await response.json()) as PutBlobResult;
      if (!blob || !blob.url) {
        throw new Error("Unable to save image");
      }
      const res = await addCollection({ ...values, image: blob.url });
      toast(labels.toast.success, {
        description: (res.createdAt as Date).toLocaleString(),
      });
      form.reset();
    } catch {
      toast(labels.toast.failure);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{labels.title}</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Favorite books"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{labels.description}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="My Favorite books is so Amazing..."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{labels.topic}</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder={labels.topic} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="capitalize">
                  {topics.map((topic, id) => (
                    <SelectItem value={topic} key={id} className="capitalize">
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-6">
          {fields.map((field, index) => (
            <section key={field.id} className="space-y-2">
              <Label>
                {labels.customField} {index}
              </Label>
              <div className="flex gap-1">
                <FormField
                  control={form.control}
                  name={`customFields.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(CustomFieldTypes).map((type, id) => (
                            <SelectItem
                              value={type}
                              key={id}
                              className="capitalize"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`customFields.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="outline" onClick={() => remove(index)}>
                  {labels.removeCustomField}
                </Button>
              </div>
            </section>
          ))}
          <Button
            className="w-full"
            type="button"
            variant="secondary"
            onClick={() => {
              append({ value: "", type: "INT" });
            }}
          >
            {labels.addCustomField}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, onBlur, ref, name } }) => (
            <FormItem>
              <FormLabel className="capitalize">{labels.image}</FormLabel>
              <FormControl>
                <Input
                  ref={ref}
                  name={name}
                  type="file"
                  accept="image/*"
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChange(e.target.files?.[0]);
                  }}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="default"
          className="w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <ThreeDots width={36} color="white" /> : labels.submit}
        </Button>
      </form>
    </Form>
  );
}
