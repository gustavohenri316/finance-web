import { api } from "./api";

interface UpdateFinancialProps {
  id: string;
  payload: {
    date?: string;
    supplier?: string;
    reason?: string;
    value?: number;
    proof?: string;
    status?: string;
  };
}
export async function updateFinancial({ id, payload }: UpdateFinancialProps) {
  const { data } = await api.patch(`/expense-reports/${id}`, payload);
  return data;
}

export async function exportData() {
  try {
    const response = await api.get("/expense-reports-export", {
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expense-reports.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
  }
}

export async function deleteData(id: string) {
  const { data } = await api.delete("/expense-reports/" + id);
  return data;
}
