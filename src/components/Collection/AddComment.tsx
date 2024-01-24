"use client";

import addComment from "@/shared/serverActions/addComment";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/TextArea";

const formSchema = z.object({ message: z.string().min(1).max(250) });

export default function AddComment({ itemId }: { itemId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await addComment({ itemId, text: values.message });
      toast("Success", {
        description: (res.createdAt as Date).toLocaleString(),
      });
      form.reset();
    } catch {
      toast("Failure");
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add your comment:"
                  {...field}
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
          {isLoading ? (
            <ThreeDots width={36} color="white" />
          ) : (
            "Add New Comment"
          )}
        </Button>
      </form>
    </Form>
  );
}
