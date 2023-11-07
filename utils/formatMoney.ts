export function formatMoney(amount: number): string {
  if (!amount) return "R$ 0,00";
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
