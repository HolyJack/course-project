"use client";

import { Role } from "@prisma/client";
import { ColDef, IDatasource } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useMemo, useState } from "react";

interface AdminDashboardProps {
  datasource: IDatasource;
}

const AdminDashboard = forwardRef<AgGridReact, AdminDashboardProps>(
  (props, ref) => {
    const [columnDefs] = useState<ColDef[]>([
      {
        field: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { field: "email" },
      { field: "name" },
      { field: "active", editable: true, cellDataType: "boolean" },
      {
        field: "role",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: [Role.ADMIN, Role.AUTHOR] },
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
      <section className="flex-1">
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
            }
          `}</style>
        </div>
      </section>
    );
  },
);

AdminDashboard.displayName = "AdminDashboard";

export default AdminDashboard;
