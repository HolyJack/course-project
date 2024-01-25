"use client";

import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState } from "react";
import { ColDef, ColGroupDef, ValueGetterParams } from "ag-grid-community";
import { Link } from "@/shared/navigation";
import { CollectionWithAuthorAndTopic } from "@/shared/utils/types";

function CustomTitleField(
  props: CustomCellRendererProps<CollectionWithAuthorAndTopic>,
) {
  return (
    <Link
      href={`/collection/${props.data?.author.slug}/${props.data?.slug}`}
      className="hover:text-primary"
    >
      {props.value}
    </Link>
  );
}

export default function CollectionsGrid({
  labels,
  collections,
}: {
  labels: {
    name: string;
    topic: string;
    description: string;
    createdAt: string;
  };
  collections: CollectionWithAuthorAndTopic[];
}) {
  const [colDef] = useState<(ColDef | ColGroupDef)[]>([
    { field: "id", width: 100 },
    {
      field: "title",
      headerName: labels.name,
      cellRenderer: CustomTitleField,
      flex: 1,
    },
    {
      field: "topic",
      headerName: labels.topic,
      width: 100,
      valueGetter: (
        params: ValueGetterParams<CollectionWithAuthorAndTopic>,
      ) => {
        return params.data?.topic.name;
      },
    },
    {
      field: "descripton",
      headerName: labels.description,
      flex: 1,
      autoHeight: true,
      wrapText: true,
    },
    { field: "createdAt", headerName: labels.createdAt, width: 120 },
  ]);
  return (
    <div className="ag-theme-quartz w-full">
      <AgGridReact<CollectionWithAuthorAndTopic>
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
          --ag-borders: none;
        }
      `}</style>
    </div>
  );
}
