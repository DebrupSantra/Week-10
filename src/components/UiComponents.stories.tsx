import type { Meta, StoryObj } from '@storybook/react';
import { Alert, Avatar, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { NotificationsNone, PeopleOutline } from '@mui/icons-material';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function ActionButtons() {
  return <Stack direction="row" spacing={1}><Button variant="contained">Primary action</Button><Button variant="outlined">Secondary</Button><Button color="error">Destructive</Button></Stack>;
}

function MemberTable() {
  return <Card sx={{ maxWidth: 700 }}><CardContent><Typography variant="h6" mb={1}>Team members</Typography><Table size="small">
    <TableHead><TableRow><TableCell>Member</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
    <TableBody><TableRow><TableCell><Stack direction="row" spacing={1} alignItems="center"><Avatar sx={{ width: 30, height: 30 }}>OR</Avatar>Olivia Rhye</Stack></TableCell><TableCell>Admin</TableCell><TableCell><Chip size="small" color="success" label="Active" /></TableCell></TableRow></TableBody>
  </Table></CardContent></Card>;
}

function ConfirmationDialog() {
  return <Dialog open><DialogTitle>Remove team member?</DialogTitle><DialogContent><Typography color="text.secondary">They will lose access to this workspace.</Typography></DialogContent>
    <DialogActions><Button>Cancel</Button><Button color="error" variant="contained">Remove</Button></DialogActions></Dialog>;
}

function FormFields() {
  return <Stack spacing={2} sx={{ maxWidth: 360 }}><TextField label="Full name" defaultValue="Olivia Rhye" /><TextField label="Work email" type="email" placeholder="name@company.com" /><Button variant="contained">Save profile</Button></Stack>;
}

function Navigation() {
  return <Card sx={{ width: 240, p: 1 }}><Typography px={1} py={1.5} fontWeight={700}>northstar</Typography>
    <Button fullWidth startIcon={<PeopleOutline />} sx={{ justifyContent: 'flex-start', bgcolor: '#f0efff', color: '#5145e5' }}>Users</Button>
    <Button fullWidth startIcon={<NotificationsNone />} sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Notifications</Button></Card>;
}

function Notification() {
  return <Alert severity="info" sx={{ maxWidth: 440 }}><Typography fontWeight={650}>Monthly report is ready</Typography>Your October analytics report is available.</Alert>;
}

function Chart() {
  const data = [{ day: 'Mon', visitors: 28 }, { day: 'Tue', visitors: 36 }, { day: 'Wed', visitors: 32 }, { day: 'Thu', visitors: 49 }, { day: 'Fri', visitors: 44 }];
  return <div style={{ width: 560, height: 260 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}>
    <CartesianGrid stroke="#eef0f4" vertical={false} /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="visitors" stroke="#6558f5" fill="#eeedff" />
  </AreaChart></ResponsiveContainer></div>;
}

const meta = { title: 'Components/Workspace UI', component: ActionButtons, tags: ['autodocs'] } satisfies Meta<typeof ActionButtons>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = { render: () => <ActionButtons /> };
export const UserTable: Story = { render: () => <MemberTable /> };
export const Modal: Story = { render: () => <ConfirmationDialog /> };
export const Form: Story = { render: () => <FormFields /> };
export const NavigationPanel: Story = { render: () => <Navigation /> };
export const NotificationCard: Story = { render: () => <Notification /> };
export const InteractiveChart: Story = { render: () => <Chart /> };
