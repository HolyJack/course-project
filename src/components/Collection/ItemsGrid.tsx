"use client";

import { ColDef } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Badge } from "../ui/Badge";

function CustomTagsRender(props: CustomCellRendererProps) {
  return (
    <div className="flex h-full flex-wrap items-center gap-1 py-2">
      {props.value.map((v: string) => (
        <Badge key={v}>{v}</Badge>
      ))}
    </div>
  );
}

export default function ItemsGrid({
  labels,
  items,
}: {
  labels: { name: string; tags: string; likes: string; createAt: string };
  items: { name: string; likes: number; tags: string[]; createdAt: Date }[];
}) {
  const [colDef] = useState<ColDef[]>([
    {
      field: "name",
      headerName: labels.name,
      sort: "asc",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "tags",
      headerName: labels.tags,
      cellRenderer: CustomTagsRender,
      autoHeight: true,
      wrapText: true,
      minWidth: 50,
      flex: 1,
    },
    {
      field: "likes",
      headerName: labels.likes,
      width: 70,
    },
    {
      field: "createdAt",
      headerName: labels.createAt,
      width: 120,
    },
  ]);

  return (
    <div className="ag-theme-quartz w-full">
      <AgGridReact
        columnDefs={colDef}
        rowData={items}
        domLayout="autoHeight"
        enableCellTextSelection={true}
        ensureDomOrder={true}
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
