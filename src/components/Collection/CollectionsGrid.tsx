"use client";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState } from "react";
import { ColDef, ColGroupDef } from "ag-grid-community";

export default function CollectionsGrid({ collections }: any) {
  const [colDef] = useState<(ColDef | ColGroupDef)[]>([
    { field: "id", width: 100 },
    {
      field: "title",
      flex: 1,
    },
    { field: "topic", width: 100 },
    { field: "description", flex: 1, autoHeight: true, wrapText: true },
    { field: "createdAt", width: 120 },
  ]);
  return (
    <div className="ag-theme-quartz w-full">
      <AgGridReact
        groupDisplayType="groupRows"
        columnDefs={colDef}
        rowData={collections}
        domLayout="autoHeight"
      />
      <style jsx global>{`
        .ag-theme-quartz {
          --ag-active-color: rgb(var(--accent));
          --ag-foreground-color: rgb(var(--text));
          --ag-background-color: rgb(var(--background));
          --ag-border-color: rgb(var(--shadow));
        }
      `}</style>
    </div>
  );
}
