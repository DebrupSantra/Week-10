import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return <Card sx={{ width: 280 }}><CardContent><Stack direction="row" justifyContent="space-between">
    <div><Typography color="text.secondary">{title}</Typography><Typography variant="h5" mt={1}>{value}</Typography></div>
    <TrendingUp color="primary" /></Stack><Chip size="small" color="success" label={`${change} vs last month`} sx={{ mt: 2 }} /></CardContent></Card>;
}

const meta = { title: 'Dashboard/Metric Card', component: MetricCard, tags: ['autodocs'] } satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Revenue: Story = { args: { title: 'Total revenue', value: '$248.6k', change: '+12.8%' } };
export const ActiveUsers: Story = { args: { title: 'Active users', value: '18,492', change: '+6.4%' } };
