"use client";

import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useRef, useState } from "react";
import { ColDef, ColGroupDef, ValueGetterParams } from "ag-grid-community";
import { Link } from "@/shared/navigation";
import { CollectionWithAuthorAndTopic } from "@/shared/utils/types";
import { Button } from "../ui/Button";
import {
  DeleteCollection,
  DeleteCollections,
} from "@/shared/serverActions/authorServerActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "../ui/AlertDialog";
import { toast } from "sonner";
import AddItem from "./AddItem";

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

function GridActions(
  props: CustomCellRendererProps<CollectionWithAuthorAndTopic>,
) {
  if (!props.data?.id) return null;
  const collectionId = props.data.id;

  async function deleteCollectionHandler({
    collectionId,
  }: {
    collectionId: number;
  }) {
    try {
      const res = await DeleteCollection({ collectionId });
      toast("Success", { description: `${res.title} has been deleted!` });
    } catch {
      toast("Something went wrong!");
    }
  }
  return (
    <div className="inline-flex justify-center gap-1 p-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permamently delete this
              collection and related items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCollectionHandler({ collectionId })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
  const ref = useRef<AgGridReact<CollectionWithAuthorAndTopic>>(null);
  const [colDef] = useState<(ColDef | ColGroupDef)[]>([
    {
      field: "id",
      width: 100,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
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
    { field: "createdAt", headerName: labels.createdAt, width: 120 },
    { cellRenderer: GridActions, autoHeight: true },
  ]);

  async function deleteCollectionsHandler() {
    const selected = ref.current?.api.getSelectedRows();
    if (!selected) return;

    const collectionsIds = selected.map((row) => row.id);
    try {
      const res = await DeleteCollections({ collectionsIds });
      toast("Success", {
        description: `${res.count} collections were deleted`,
      });
    } catch {
      toast("Something went wrong!");
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Selected</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permamently delete
                selected collections and related items.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteCollectionsHandler()}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="ag-theme-quartz w-full">
        <AgGridReact<CollectionWithAuthorAndTopic>
          ref={ref}
          groupDisplayType="groupRows"
          columnDefs={colDef}
          rowData={collections}
          domLayout="autoHeight"
          rowSelection="multiple"
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
    </div>
  );
}
