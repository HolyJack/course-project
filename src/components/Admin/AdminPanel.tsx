"use client";

import { AgGridReact } from "ag-grid-react";
import AdminDashboard from "./AdminDashboard";
import { useRef } from "react";
import { IDatasource } from "ag-grid-community";
import getUsers from "@/shared/serverActions/getUsers";

export default function AdminPanel() {
  const ref = useRef<AgGridReact>(null);

  const datasource: IDatasource = {
    getRows: (params) => {
      async function getData() {
        try {
          const users = await getUsers(params.startRow, params.endRow);
          let endRow: number | undefined = undefined;
          if (users.length < params.endRow - params.startRow)
            endRow = params.startRow + users.length;
          params.successCallback(users, endRow);
        } catch (e) {
          params.failCallback();
        }
      }
      getData();
    },
  };

  return <AdminDashboard ref={ref} datasource={datasource} />;
}
