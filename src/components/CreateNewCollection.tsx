"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
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
} from "./ui/Select";
import { CustomFieldTypes } from "@prisma/client";
import { Textarea } from "./ui/TextArea";
import { Label } from "./ui/Label";

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  topic: z.string(),
  image: z.any().optional(),
  customFields: z
    .array(
      z.object({ type: z.nativeEnum(CustomFieldTypes), value: z.string() }),
    )
    .optional(),
});

export default function CreateNewCollection({ topics }: { topics: string[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      customFields: [],
      image: "",
      topic: topics[0],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "customFields",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("wow2");
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[500px] max-w-full space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Input placeholder="My Favorite books" {...field} />
              </FormControl>
              <FormDescription>This is your Collection Tittle</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="My Favorite books is so Amazing..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell more about your collection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder={field.name} />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    {topics.map((topic, id) => (
                      <SelectItem value={topic} key={id} className="capitalize">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>This is your Collection topic.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-6">
          {fields.map((field, index) => (
            <section key={field.id} className="space-y-2">
              <Label>Custom field {index}</Label>
              <div className="flex gap-1">
                <FormField
                  control={form.control}
                  name={`customFields.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder={field.value}
                            />
                          </SelectTrigger>
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
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`customFields.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="outline" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
              <FormDescription>
                This is your Collection Custom Field. It is used for Collection
                Items.
              </FormDescription>
            </section>
          ))}
          <Button
            className="w-full"
            type="button"
            variant="secondary"
            onClick={() => {
              append({ value: "", type: "INT" });
              console.log("wow");
            }}
          >
            Add Custom Field
          </Button>
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Input {...field} type="file" accept="image/*" />
              </FormControl>
              <FormDescription>
                This image will represent your Collection
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="default" className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}