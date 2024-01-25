"use client";

import { ColDef } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Link } from "@/shared/navigation";
import { item_fts } from "@prisma/client";

function CustomNameRender(props: CustomCellRendererProps<item_fts>) {
  return (
    <Link
      href={`/collection/${props.data?.authorslug}/${props.data?.collectionslug}/${props.data?.slug}`}
      className="hover:text-primary"
    >
      {props.value}
    </Link>
  );
}

export default function SearchGrid({ items }: { items: item_fts[] }) {
  const [colDef] = useState<ColDef[]>([
    {
      field: "name",
      cellRenderer: CustomNameRender,
    },
    {
      field: "author",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Collection",
      flex: 1,
    },
    {
      field: "createdAt",
      width: 120,
    },
  ]);

  return (
    <div className="ag-theme-quartz w-full">
      <AgGridReact<item_fts>
        columnDefs={colDef}
        rowData={items}
        domLayout="autoHeight"
        enableCellTextSelection={true}
        ensureDomOrder={true}
        suppressCellFocus={true}
      />

      <style jsx global>{`
        .ag-theme-quartz {
          --ag-active-color: rgb(var(--accent));
          --ag-foreground-color: rgb(var(--text));
          --ag-background-color: rgb(var(--background));
          --ag-grid-border: none;
          --ag-border-color: rgb(var(--t));
          --ag-wrapper-border-radius: 0;
          --ag-row-border-width: 1px;
          --ag-row-border-color: rgb(var(--shadow));
        }
      `}</style>
    </div>
  );
}
