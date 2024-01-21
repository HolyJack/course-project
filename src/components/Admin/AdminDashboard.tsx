"use client";

import { Role } from "@prisma/client";
import { ColDef, IDatasource } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useMemo, useState } from "react";

import { toast } from "sonner";
import {
  blockUser,
  demoteUser,
  promoteUser,
  unblockUser,
} from "@/shared/serverActions/adminActions";

interface AdminDashboardProps {
  datasource: IDatasource;
}

const AdminDashboard = forwardRef<AgGridReact, AdminDashboardProps>(
  (props, ref) => {
    const [columnDefs] = useState<ColDef[]>([
      {
        field: "email",
        checkboxSelection: true,
      },
      { field: "name" },
      {
        field: "active",
        editable: true,
        cellDataType: "boolean",
        onCellValueChanged: async (event) => {
          const oldVal = event.oldValue;
          const newVal = event.newValue;
          const email = event.data.email;

          try {
            if (oldVal === true && newVal === false) {
              await blockUser({ email });
              toast("Blocked");
            } else if (oldVal === false && newVal === true) {
              await unblockUser({ email });
              toast("Unblocked");
            }
          } catch {
            toast("Something went wrong");
          }
        },
      },
      {
        field: "role",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: [Role.ADMIN, Role.AUTHOR] },
        onCellValueChanged: async (event) => {
          const oldVal = event.oldValue;
          const newVal = event.newValue;
          const email = event.data.email;

          try {
            if (oldVal === Role.ADMIN && newVal === Role.AUTHOR) {
              const res = await demoteUser({ email });
              toast(res);
            } else if (oldVal === Role.ADMIN && newVal === Role.AUTHOR) {
              const res = await promoteUser({ email });
              toast(res);
            }
          } catch {
            toast("Something went wrong");
          }
        },
      },
    ]);
    const defaultColDef = useMemo<ColDef>(() => {
      return {
        flex: 1,
        minWidth: 50,
        sortable: false,
      };
    }, []);
    return (
      <div className="ag-theme-quartz h-full w-full">
        <AgGridReact
          ref={ref}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          datasource={props.datasource}
          rowModelType={"infinite"}
          maxConcurrentDatasourceRequests={1}
          cacheBlockSize={10}
        />
        <style jsx global>{`
          .ag-theme-quartz {
            --ag-active-color: rgb(var(--accent));
            --ag-foreground-color: rgb(var(--text));
            --ag-background-color: rgb(var(--background));
            --ag-border-color: rgb(var(--shadow));
            --ag-wrapper-border-radius: 0;
          }
        `}</style>
      </div>
    );
  },
);

AdminDashboard.displayName = "AdminDashboard";

export default AdminDashboard;
