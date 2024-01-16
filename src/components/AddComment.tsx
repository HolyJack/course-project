"use client";

import addComment from "@/shared/serverActions/addComment";
import { Button } from "./ui/Button";
import { useState } from "react";

export default function AddComment({ itemSlug }: { itemSlug: string }) {
  const [value, setValue] = useState("");
  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addComment({ itemSlug, text: value });
  }
  return (
    <form onSubmit={submitHandler}>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
