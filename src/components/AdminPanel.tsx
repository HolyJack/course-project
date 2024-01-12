"use client";

import { AgGridReact } from "ag-grid-react";
import AdminDashboard from "./AdminDashboard";
import { useRef } from "react";
import { IDatasource } from "ag-grid-community";
import serverAction from "./AdminPanel/serverAction";

export default function AdminPanel() {
  const ref = useRef<AgGridReact>(null);

  const datasource: IDatasource = {
    getRows: (params) => {
      async function getUsers() {
        try {
          const users = await serverAction(params.startRow, params.endRow);
          let endRow: number | undefined = undefined;
          if (users.length < params.endRow - params.startRow)
            endRow = params.startRow + users.length;
          params.successCallback(users, endRow);
        } catch (e) {
          params.failCallback();
        }
      }
      getUsers();
    },
  };

  return <AdminDashboard ref={ref} datasource={datasource} />;
}
