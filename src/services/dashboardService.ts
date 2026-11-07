import { transactions } from '../data/mockData';

export async function fetchTransactions() {
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return transactions;
}
