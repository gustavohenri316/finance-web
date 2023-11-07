import Template from "@/components/template";
import { Button } from "@/components/ui/button";
import { DataTable } from "./components/datatable";
import RegisterModalFinancial from "./components/register-modal-financials";
import { api } from "@/service/api";
import { formatMoney } from "@/utils/formatMoney";
import ButtonExport from "./components/export-button";

interface ExpenseReport {
  expenseReports: ExpenseReportData[];
  totalBilled: number;
  totalUnbilled: number;
  totalOverall: number;
}

interface ExpenseReportData {
  id: string;
  date: string;
  supplier: string;
  reason: string;
  value: number;
  status: string;
  proof: string;
}

async function getData(): Promise<ExpenseReport> {
  const { data } = await api.get("/expense-reports");
  return data;
}

export default async function Admin() {
  const data: ExpenseReport = await getData();

  return (
    <Template>
      <div className="flex justify-between items-center gap-2 max-sm:flex-col max-sm:gap-4">
        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center">
            <span>Faturado</span>
            <b className="text-sm">{formatMoney(data.totalBilled)}</b>
          </div>
          <div className="flex flex-col items-center">
            <span>Não faturado</span>
            <b className="text-sm">{formatMoney(data.totalUnbilled)}</b>
          </div>
          <div className="flex flex-col items-center">
            <span>Total</span>
            <b className="text-sm">{formatMoney(data.totalOverall)}</b>
          </div>
        </div>
        <div className="flex items-center gap-2 max-sm:w-full">
          <ButtonExport />
          <RegisterModalFinancial />
        </div>
      </div>
      <DataTable
        data={data.expenseReports}
        page={1}
        itemsPerPage={10}
        totalItems={500}
      />
    </Template>
  );
}
