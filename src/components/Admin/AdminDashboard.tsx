"use client";

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
      { field: "email" },
      { field: "username" },
      { field: "collections" },
      { field: "role" },
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
              --ag-active-color: var(--accent);
              --ag-foreground-color: var(--text);
              --ag-background-color: var(--background);
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
