"use client";

import Search from "@/shared/serverActions/search";
import { Collection } from "@prisma/client";
import { useState } from "react";

export default function SearchBar() {
  const [resuls, setResults] = useState<Collection[]>([]);

  return (
    <div>
      <input
        type="text"
        onChange={async (e) => {
          console.log(e.target.value);
          setResults(await Search(e.target.value));
        }}
      />
      <ul>
        {resuls.map((result, id) => (
          <li key={id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
