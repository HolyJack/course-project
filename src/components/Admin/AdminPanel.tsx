"use client";

import { AgGridReact } from "ag-grid-react";
import AdminDashboard from "./AdminDashboard";
import { useRef } from "react";
import { IDatasource } from "ag-grid-community";
import getUsers from "@/shared/serverActions/getUsers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import {
  blockUsers,
  demoteUsers,
  promoteUsers,
  unblockUsers,
} from "@/shared/serverActions/adminActions";

export default function AdminPanel() {
  const ref = useRef<AgGridReact>(null);

  function getSelected() {
    return ref.current?.api.getSelectedRows().map((row) => ({
      email: row.email,
    }));
  }
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

  async function promoteSelected() {
    const emails = getSelected();
    if (!emails?.length) {
      toast("No rows selected");
      return;
    }
    try {
      const res = await promoteUsers({ emails });
      toast(`Promoted users: ${res}`);
    } catch {
      toast("Something went wrong");
    }
  }

  async function demoteSelected() {
    const emails = getSelected();
    if (!emails?.length) {
      toast("No rows selected");
      return;
    }
    try {
      const res = await demoteUsers({ emails });
      toast(`Demoted users: ${res}`);
    } catch {
      toast("Something went wrong");
    }
  }

  async function blockSelected() {
    const emails = getSelected();
    if (!emails?.length) {
      toast("No rows selected");
      return;
    }
    try {
      const res = await blockUsers({ emails });
      toast(`Blocked users: ${res}`);
    } catch {
      toast("Something went wrong");
    }
  }

  async function unblockSelected() {
    const emails = getSelected();
    if (!emails?.length) {
      toast("No rows selected");
      return;
    }
    try {
      const res = await unblockUsers({ emails });
      toast(`Unblocked users: ${res}`);
    } catch {
      toast("Something went wrong");
    }
  }

  return (
    <Card className="flex w-full flex-col overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={promoteSelected} className="w-24">
            Promote
          </Button>
          <Button variant="outline" onClick={demoteSelected} className="w-24">
            Demote
          </Button>
          <Button variant="outline" onClick={unblockSelected} className="w-24">
            Unblock
          </Button>
          <Button
            variant="outline"
            className="w-24 hover:bg-red-600"
            onClick={blockSelected}
          >
            Block
          </Button>
        </div>
      </CardHeader>
      <div className="flex-1">
        <AdminDashboard ref={ref} datasource={datasource} />
      </div>
    </Card>
  );
}
