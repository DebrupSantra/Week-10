import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert, Avatar, Badge, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, IconButton, InputLabel,
  Menu, MenuItem, Pagination, Select, Snackbar, Stack, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Tooltip, Typography
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Add, ArrowDownward, ArrowUpward, AssessmentOutlined, BarChartOutlined,
  ChevronLeft, ChevronRight, DashboardOutlined, DownloadOutlined, Logout, Menu as MenuIcon,
  MoreHoriz, NotificationsNone, PeopleOutline, Search, SettingsOutlined, ShoppingBagOutlined,
  TrendingUp, WbSunnyOutlined, DarkModeOutlined, Close, MarkEmailReadOutlined, ShieldOutlined,
  QueryStatsOutlined
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis
} from 'recharts';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { signedIn, signedOut } from './features/auth/authSlice';
import { addRevenueOffset, setDateRange } from './features/dashboard/dashboardSlice';
import { addNotification, markAllRead } from './features/notifications/notificationSlice';
import { toggleTheme } from './features/theme/themeSlice';
import { addUser, removeUser, updateUser } from './features/users/userSlice';
import { useAuth } from './hooks/useAuth';
import { useDebounce } from './hooks/useDebounce';
import { useWebSocket } from './hooks/useWebSocket';
import i18n from './i18n';
import { loginMock } from './services/authService';
import { fetchTransactions } from './services/dashboardService';
import { activityData, productData, revenueData, salesData, transactions } from './data/mockData';
import type { AppUser, OrderStatus, UserRole, UserStatus } from './types';

const DashboardPage = lazy(async () => ({ default: Dashboard }));
const UsersPage = lazy(async () => ({ default: Users }));
const OrdersPage = lazy(async () => ({ default: Orders }));
const AnalyticsPage = lazy(async () => ({ default: Analytics }));
const SettingsPage = lazy(async () => ({ default: Settings }));

const navItems = [
  { path: '/', labelKey: 'dashboard', icon: <DashboardOutlined /> },
  { path: '/users', labelKey: 'users', icon: <PeopleOutline /> },
  { path: '/orders', labelKey: 'orders', icon: <ShoppingBagOutlined /> },
  { path: '/analytics', labelKey: 'analytics', icon: <BarChartOutlined /> }
];

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Shell />}>
            <Route index element={<Suspense fallback={<PageLoading />}><DashboardPage /></Suspense>} />
            <Route element={<AdminRoute />}>
              <Route path="users" element={<Suspense fallback={<PageLoading />}><UsersPage /></Suspense>} />
            </Route>
            <Route path="orders" element={<Suspense fallback={<PageLoading />}><OrdersPage /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<PageLoading />}><AnalyticsPage /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoading />}><SettingsPage /></Suspense>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function PageLoading() {
  return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}><CircularProgress size={28} /></Box>;
}

function Shell() {
  const dispatch = useAppDispatch();
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const [toast, setToast] = useState('');
  const unread = useAppSelector((state) => state.notifications.items.filter((item) => !item.read).length);
  const notifications = useAppSelector((state) => state.notifications.items);
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = navItems.find((item) => item.path === location.pathname)?.labelKey ?? 'settings';

  const renderNavigation = (closeOnSelect = false) => (
    <Box>
      <Typography className="rail-label">Workspace</Typography>
      {navItems.filter((item) => item.path !== '/users' || isAdmin).map((item) => (
        <Button
          key={item.path}
          component={NavLink}
          to={item.path}
          title={t(item.labelKey)}
          onClick={() => closeOnSelect && setMobileOpen(false)}
          className={`nav-item ${location.pathname === item.path ? 'selected' : ''}`}
          startIcon={item.icon}
          sx={{ width: '100%' }}
        ><span className="nav-text">{t(item.labelKey)}</span></Button>
      ))}
      <Typography className="rail-label">Manage</Typography>
      <Button component={NavLink} to="/settings" title={t('settings')} onClick={() => closeOnSelect && setMobileOpen(false)}
        className={`nav-item ${location.pathname === '/settings' ? 'selected' : ''}`} startIcon={<SettingsOutlined />} sx={{ width: '100%' }}>
        <span className="nav-text">{t('settings')}</span>
      </Button>
    </Box>
  );

  const nav = (
    <Box className={`side-rail ${collapsed ? 'collapsed' : ''}`}>
      <Box className="brand"><Box className="brand-mark">N</Box><span className="brand-name">northstar</span></Box>
      {renderNavigation()}
      <Box className="rail-bottom">
        <Divider sx={{ mb: 1 }} />
        <Button className="nav-item" title="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}
          startIcon={collapsed ? <ChevronRight /> : <ChevronLeft />} sx={{ width: '100%' }}>
          <span className="nav-text">Collapse</span>
        </Button>
        <Button className="nav-item" onClick={() => { dispatch(signedOut()); navigate('/login'); }}
          startIcon={<Logout />} sx={{ width: '100%' }}><span className="nav-text">Sign out</span></Button>
      </Box>
    </Box>
  );

  return (
    <div className="app-shell">
      {nav}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 252 } }}>
        <Box className="brand"><Box className="brand-mark">N</Box><span>northstar</span><IconButton sx={{ ml: 'auto' }} onClick={() => setMobileOpen(false)}><Close /></IconButton></Box>
        {renderNavigation(true)}
      </Drawer>
      <Box className="main-column">
        <header className="topbar">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><MenuIcon /></IconButton>
            <Typography variant="subtitle1" fontWeight={650}>{t(pageTitle)}</Typography>
            <Chip size="small" icon={<span className="activity-dot" style={{ width: 7, height: 7, margin: 0 }} />} label="Live" variant="outlined"
              sx={{ height: 25, borderColor: 'divider', '& .MuiChip-label': { px: 1, fontSize: 11 } }} />
          </Stack>
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
            <Tooltip title="Toggle theme"><IconButton onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme">
              {useAppSelector((state) => state.theme.mode) === 'light' ? <DarkModeOutlined /> : <WbSunnyOutlined />}
            </IconButton></Tooltip>
            <Tooltip title="Notifications"><IconButton onClick={(event) => setNotificationAnchor(event.currentTarget)} aria-label="Notifications">
              <Badge badgeContent={unread} color="error"><NotificationsNone /></Badge>
            </IconButton></Tooltip>
            <IconButton onClick={(event) => setAccountAnchor(event.currentTarget)} aria-label="Account menu">
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#e8e7ff', color: '#5145e5', fontSize: 13, fontWeight: 700 }}>{user?.name.slice(0, 1)}</Avatar>
            </IconButton>
          </Stack>
        </header>
        <main className="page-content"><Outlet /></main>
      </Box>
      <Menu anchorEl={notificationAnchor} open={Boolean(notificationAnchor)} onClose={() => setNotificationAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Box className="notification-menu">
          <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={1}>
            <Typography fontWeight={700}>Notifications</Typography>
            <Tooltip title="Mark all as read"><IconButton size="small" onClick={() => dispatch(markAllRead())}><MarkEmailReadOutlined fontSize="small" /></IconButton></Tooltip>
          </Stack>
          <Divider />
          {notifications.slice(0, 5).map((item) => <MenuItem key={item.id} sx={{ whiteSpace: 'normal', py: 1.3, alignItems: 'flex-start' }}>
            <Box><Typography variant="body2" fontWeight={item.read ? 500 : 700}>{item.title}</Typography><Typography variant="caption" color="text.secondary">{item.detail} · {item.time}</Typography></Box>
          </MenuItem>)}
          {notifications.length === 0 && <Typography p={2} variant="body2" color="text.secondary">You’re all caught up.</Typography>}
        </Box>
      </Menu>
      <Menu anchorEl={accountAnchor} open={Boolean(accountAnchor)} onClose={() => setAccountAnchor(null)}>
        <MenuItem disabled><Box><Typography variant="body2" fontWeight={700}>{user?.name}</Typography><Typography variant="caption">{user?.email}</Typography></Box></MenuItem>
        <MenuItem onClick={() => { setAccountAnchor(null); navigate('/settings'); }}>Settings</MenuItem>
        <MenuItem onClick={() => { dispatch(signedOut()); setAccountAnchor(null); navigate('/login'); }}>Sign out</MenuItem>
      </Menu>
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </div>
  );
}

function AuthPage({ register = false }: { register?: boolean }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginMock(email, password);
      dispatch(signedIn(register && name.trim() ? { ...user, name: name.trim() } : user));
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally { setLoading(false); }
  };

  return <div className="login-screen">
    <Box className="login-art">
      <Box className="brand" sx={{ color: 'white', p: 0 }}><Box className="brand-mark" sx={{ bgcolor: 'rgba(255,255,255,.2)' }}>N</Box><span>northstar</span></Box>
      <Box>
        <Typography variant="h3" fontWeight={700} letterSpacing="-0.05em" mb={2}>Clarity for every decision.</Typography>
        <Typography sx={{ opacity: .78, maxWidth: 430, lineHeight: 1.8 }}>One calm, connected workspace to understand your business and move it forward.</Typography>
      </Box>
      <Typography variant="caption" sx={{ opacity: .65 }}>© 2024 Northstar Analytics</Typography>
    </Box>
    <Box className="login-form-wrap"><Box className="login-form">
      <Box className="brand" sx={{ p: 0, mb: 5, display: { xs: 'flex', md: 'none' } }}><Box className="brand-mark">N</Box><span>northstar</span></Box>
      <Typography variant="h4" mb={1}>{register ? 'Create your account' : 'Welcome back'}</Typography>
      <Typography color="text.secondary" mb={4}>{register ? 'Start exploring your workspace.' : 'Enter your details to sign in to your account.'}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={(event: React.FormEvent<HTMLFormElement>) => void submit(event)}>
        {register && <TextField fullWidth label="Full name" value={name} onChange={(event) => setName(event.target.value)} required sx={{ mb: 2.2 }} />}
        <TextField fullWidth label="Email address" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required sx={{ mb: 2.2 }} />
        <TextField fullWidth label="Password" type="password" autoComplete={register ? 'new-password' : 'current-password'} value={password}
          onChange={(event) => setPassword(event.target.value)} required helperText="Mock sign-in: any valid email and 4+ characters. Use admin@acme.co for admin access." sx={{ mb: 2.5 }} />
        <Button fullWidth size="large" variant="contained" type="submit" disabled={loading}>{loading ? 'Signing in…' : register ? 'Create account' : 'Sign in'}</Button>
      </Box>
      <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
        {register ? 'Already have an account? ' : 'New to Northstar? '}
        <Button size="small" onClick={() => navigate(register ? '/login' : '/register')}>{register ? 'Sign in' : 'Create an account'}</Button>
      </Typography>
      <Alert severity="info" icon={<ShieldOutlined />} sx={{ mt: 4, fontSize: 12 }}>
        This demo uses local mock authentication and is not suitable for protecting production data.
      </Alert>
    </Box></Box>
  </div>;
}

function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <Box className="page-heading"><Box><Typography variant="h5" mb={0.5}>{title}</Typography><Typography variant="body2" color="text.secondary">{subtitle}</Typography></Box>{action}</Box>;
}

function StatCard({ title, value, change, icon, tone = 'purple' }: { title: string; value: string; change: string; icon: React.ReactNode; tone?: string }) {
  return <Card><CardContent sx={{ p: '19px !important' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box><Typography variant="body2" color="text.secondary" mb={1}>{title}</Typography><Typography variant="h5">{value}</Typography></Box>
      <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 2, color: tone === 'green' ? '#079879' : '#6558f5', bgcolor: tone === 'green' ? '#e5f7f2' : '#efeeff' }}>{icon}</Box>
    </Stack>
    <Stack direction="row" spacing={0.7} alignItems="center" mt={1.6}>
      <Chip size="small" icon={<ArrowUpward sx={{ fontSize: '13px !important' }} />} label={change} sx={{ height: 22, bgcolor: '#ecfdf3', color: '#067647', '& .MuiChip-label': { px: .6, fontSize: 11, fontWeight: 700 } }} />
      <Typography variant="caption" color="text.secondary">vs last month</Typography>
    </Stack>
  </CardContent></Card>;
}

function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [liveToast, setLiveToast] = useState('');
  const range = useAppSelector((state) => state.dashboard.dateRange);
  const liveOffset = useAppSelector((state) => state.dashboard.revenueOffset);
  const onLiveMetric = useCallback((amount: number) => dispatch(addRevenueOffset(amount)), [dispatch]);
  const onLiveNotification = useCallback((notification: import('./types').AppNotification) => {
    dispatch(addNotification(notification));
    setLiveToast(notification.title);
  }, [dispatch]);
  const status = useWebSocket(onLiveMetric, onLiveNotification);
  const { data: orders = [], isLoading, isError } = useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions });
  const displayedRevenue = range === '30d' ? revenueData.slice(-1)
    : range === '90d' ? revenueData.slice(-3)
      : range === '180d' ? revenueData.slice(-6) : revenueData;

  const exportCsv = () => downloadCsv('northstar-transactions.csv', ['Order', 'Customer', 'Date', 'Amount', 'Status'],
    orders.map((order) => [order.id, order.customer, order.date, order.amount, order.status]));

  return <>
    <PageHeading title={`Good morning, ${user?.name ?? 'there'}`} subtitle="Here’s what’s happening with your business today."
      action={<Stack direction="row" spacing={1.2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 130 }}><InputLabel id="date-range-label">Date range</InputLabel>
          <Select labelId="date-range-label" label="Date range" value={range} onChange={(event: SelectChangeEvent) => dispatch(setDateRange(event.target.value as typeof range))}>
            <MenuItem value="30d">Last 30 days</MenuItem><MenuItem value="90d">Last 90 days</MenuItem><MenuItem value="180d">Last 6 months</MenuItem><MenuItem value="12m">Last 12 months</MenuItem>
          </Select></FormControl>
        <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={exportCsv}>Export</Button>
      </Stack>} />
    <Stack direction="row" alignItems="center" spacing={0.8} mb={1.5}>
      <Box className="activity-dot" sx={{ width: 7, height: 7, bgcolor: status === 'connected' ? '#12b76a' : '#f79009', m: 0 }} />
      <Typography variant="caption" color="text.secondary">{status === 'connected' ? `Live data connected · updated moments ago (+$${liveOffset})` : 'Connecting to live data…'}</Typography>
    </Stack>
    <Box className="kpi-grid">
      <StatCard title="Total revenue" value={`$${(248.6 + liveOffset / 100).toFixed(1)}k`} change="12.8%" icon={<TrendingUp fontSize="small" />} />
      <StatCard title="Total users" value="24,680" change="8.2%" icon={<PeopleOutline fontSize="small" />} tone="green" />
      <StatCard title="Active users" value="18,492" change="6.4%" icon={<QueryStatsOutlined fontSize="small" />} />
      <StatCard title="Conversion rate" value="3.62%" change="0.8%" icon={<AssessmentOutlined fontSize="small" />} tone="green" />
      <StatCard title="Total orders" value="1,284" change="9.2%" icon={<ShoppingBagOutlined fontSize="small" />} />
      <StatCard title="Revenue growth" value="18.4%" change="3.2%" icon={<TrendingUp fontSize="small" />} tone="green" />
    </Box>
    <Box className="content-grid">
      <Card><CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box><Typography fontWeight={700}>Revenue over time</Typography><Typography variant="caption" color="text.secondary">Track your revenue performance</Typography></Box>
          <Chip label="Revenue" size="small" sx={{ color: '#5145e5', bgcolor: '#efeeff', fontWeight: 600 }} />
        </Stack>
        <Box className="chart-wrap"><ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayedRevenue}><CartesianGrid stroke="#eef0f4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#98a2b3' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#98a2b3' }} tickFormatter={(value: number) => `$${value}k`} />
            <ChartTooltip formatter={(value) => [`$${value}k`, '']} /><Legend verticalAlign="top" align="right" height={28} />
            <Line type="monotone" dataKey="current" name="This year" stroke="#6558f5" strokeWidth={2.8} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="previous" name="Last year" stroke="#b8b5ed" strokeWidth={2} strokeDasharray="5 5" dot={false} /></ComposedChart>
        </ResponsiveContainer></Box>
      </CardContent></Card>
      <Card><CardContent>
        <Typography fontWeight={700}>Sales distribution</Typography><Typography variant="caption" color="text.secondary">Revenue by product type</Typography>
        <Box className="mini-chart" sx={{ mt: 1 }}><ResponsiveContainer width="100%" height="100%">
          <PieChart><Pie data={salesData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={4} stroke="none">
            {salesData.map((item) => <Cell key={item.name} fill={item.color} />)}
          </Pie><ChartTooltip formatter={(value) => [`${value}%`, 'Share']} /></PieChart>
        </ResponsiveContainer></Box>
        <Stack spacing={1.1} mt={1}>{salesData.map((item) => <Stack key={item.name} direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} /><Typography variant="body2" flex={1}>{item.name}</Typography><Typography variant="body2" fontWeight={650}>{item.value}%</Typography>
        </Stack>)}</Stack>
      </CardContent></Card>
    </Box>
    <Box className="lower-grid">
      <Card><CardContent>
        <Stack direction="row" justifyContent="space-between"><Box><Typography fontWeight={700}>Recent transactions</Typography><Typography variant="caption" color="text.secondary">Your latest customer orders</Typography></Box>
          <Button size="small" onClick={exportCsv} startIcon={<DownloadOutlined />}>CSV</Button></Stack>
        {isError ? <Alert severity="error" sx={{ mt: 2 }}>Transactions could not be loaded.</Alert> : isLoading ? <Box py={4} textAlign="center"><CircularProgress size={24} /></Box> :
          <TransactionTable rows={orders.slice(0, 5)} />}
      </CardContent></Card>
      <Card><CardContent><Typography fontWeight={700}>Recent activity</Typography><Typography variant="caption" color="text.secondary">Updates from your workspace</Typography>
        <Box mt={1.5}><ActivityItem title="New user joined" detail="Drew Cano joined the workspace" time="10 minutes ago" />
          <ActivityItem title="Payment received" detail="$2,480 from Olivia Rhye" time="1 hour ago" />
          <ActivityItem title="Report generated" detail="October performance report" time="3 hours ago" />
          <ActivityItem title="New order placed" detail="Order #ORD-2398 · $3,450" time="Yesterday" /></Box>
      </CardContent></Card>
    </Box>
    <Box mt={2}><Card><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
      <Box><Typography fontWeight={700}>Top-performing products</Typography><Typography variant="caption" color="text.secondary">Best sellers this month</Typography></Box><Button size="small" href="/analytics">View analytics</Button></Stack>
      <Table size="small"><TableHead><TableRow><TableCell>Product</TableCell><TableCell>Category</TableCell><TableCell align="right">Units sold</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">Growth</TableCell></TableRow></TableHead>
        <TableBody>{productData.map((product) => <TableRow key={product.name}><TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell><TableCell>{product.category}</TableCell>
          <TableCell align="right">{product.sales.toLocaleString()}</TableCell><TableCell align="right">{product.revenue}</TableCell><TableCell align="right"><Typography color="success.main" variant="body2">{product.change}</Typography></TableCell></TableRow>)}</TableBody></Table>
    </CardContent></Card></Box>
    <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={4}>Demo data only · Date range: {range}</Typography>
    <Snackbar open={Boolean(liveToast)} autoHideDuration={3500} onClose={() => setLiveToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity="info" onClose={() => setLiveToast('')}>{liveToast}</Alert>
    </Snackbar>
  </>;
}

function ActivityItem({ title, detail, time }: { title: string; detail: string; time: string }) {
  return <Box className="activity-row"><Box className="activity-dot" /><Box flex={1}><Typography variant="body2" fontWeight={600}>{title}</Typography><Typography variant="caption" color="text.secondary">{detail}</Typography><Typography variant="caption" display="block" color="text.secondary" mt={0.4}>{time}</Typography></Box></Box>;
}

function TransactionTable({ rows }: { rows: typeof transactions }) {
  return <Box className="table-wrap" mt={1.5}><Table size="small" aria-label="Recent transactions"><TableHead><TableRow>
    <TableCell>Customer</TableCell><TableCell>Date</TableCell><TableCell align="right">Amount</TableCell><TableCell>Status</TableCell>
  </TableRow></TableHead><TableBody>{rows.map((row) => <TableRow key={row.id} hover>
    <TableCell><Typography variant="body2" fontWeight={600}>{row.customer}</Typography><Typography variant="caption" color="text.secondary">{row.email}</Typography></TableCell>
    <TableCell>{row.date}</TableCell><TableCell align="right">${row.amount.toLocaleString()}</TableCell><TableCell><StatusBadge value={row.status} /></TableCell>
  </TableRow>)}</TableBody></Table></Box>;
}

function StatusBadge({ value }: { value: UserStatus | OrderStatus }) {
  return <span className={`status-pill status-${value.toLowerCase()}`}>{value}</span>;
}

function Users() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query);
  const [form, setForm] = useState({ name: '', email: '', role: 'Member' as UserRole, status: 'Active' as UserStatus });
  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(debouncedQuery.toLowerCase())), [users, debouncedQuery]);
  const pageSize = 5;
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', role: 'Member', status: 'Active' }); setDialogOpen(true); };
  const openEdit = (user: AppUser) => { setEditing(user); setForm({ name: user.name, email: user.email, role: user.role, status: user.status }); setDialogOpen(true); };
  const saveUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: AppUser = { ...form, id: editing?.id ?? `u-${Date.now()}`, joined: editing?.joined ?? new Date().toISOString().slice(0, 10) };
    dispatch(editing ? updateUser(user) : addUser(user));
    setDialogOpen(false);
  };
  const deleteUser = () => { if (userToDelete) dispatch(removeUser(userToDelete)); setUserToDelete(null); };

  return <>
    <PageHeading title="Users" subtitle="Manage your team and control workspace access."
      action={<Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add user</Button>} />
    <Card><CardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" mb={2}>
        <TextField size="small" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search users…" aria-label="Search users"
          InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }} sx={{ width: { xs: '100%', sm: 300 } }} />
        <Chip label={`${filtered.length} members`} variant="outlined" />
      </Stack>
      {visible.length === 0 ? <Box textAlign="center" py={7}><PeopleOutline color="disabled" sx={{ fontSize: 42 }} /><Typography fontWeight={650} mt={1}>No users found</Typography><Typography variant="body2" color="text.secondary">Try a different search or invite a teammate.</Typography></Box> :
        <Box className="table-wrap"><Table aria-label="User management"><TableHead><TableRow><TableCell>Name</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell>Date added</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
          <TableBody>{visible.map((user) => <TableRow key={user.id} hover>
            <TableCell><Stack direction="row" spacing={1.2} alignItems="center"><Avatar sx={{ width: 34, height: 34, bgcolor: avatarColor(user.name), fontSize: 13 }}>{user.name.split(' ').map((part) => part[0]).join('')}</Avatar>
              <Box><Typography variant="body2" fontWeight={650}>{user.name}</Typography><Typography variant="caption" color="text.secondary">{user.email}</Typography></Box></Stack></TableCell>
            <TableCell><Chip size="small" label={user.role} variant="outlined" /></TableCell><TableCell><StatusBadge value={user.status} /></TableCell>
            <TableCell>{new Date(`${user.joined}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
            <TableCell align="right"><IconButton size="small" aria-label={`Edit ${user.name}`} onClick={() => openEdit(user)}><MoreHoriz /></IconButton>
              <Button size="small" color="error" onClick={() => setUserToDelete(user.id)}>Remove</Button></TableCell>
          </TableRow>)}</TableBody></Table></Box>}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}><Typography variant="caption" color="text.secondary">Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} users</Typography>
        <Pagination count={Math.max(1, Math.ceil(filtered.length / pageSize))} page={page} onChange={(_, value) => setPage(value)} size="small" /></Stack>
    </CardContent></Card>
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={saveUser}><DialogTitle>{editing ? 'Edit user' : 'Add a team member'}</DialogTitle><DialogContent>
        <Stack spacing={2} mt={1}><TextField label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required autoFocus />
          <TextField label="Email address" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <FormControl><InputLabel id="role-label">Role</InputLabel><Select labelId="role-label" label="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}>
            <MenuItem value="Admin">Admin</MenuItem><MenuItem value="Analyst">Analyst</MenuItem><MenuItem value="Member">Member</MenuItem></Select></FormControl>
          <FormControl><InputLabel id="status-label">Status</InputLabel><Select labelId="status-label" label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as UserStatus })}>
            <MenuItem value="Active">Active</MenuItem><MenuItem value="Invited">Invited</MenuItem><MenuItem value="Suspended">Suspended</MenuItem></Select></FormControl>
        </Stack></DialogContent><DialogActions><Button onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" variant="contained">{editing ? 'Save changes' : 'Add user'}</Button></DialogActions></Box>
    </Dialog>
    <Dialog open={Boolean(userToDelete)} onClose={() => setUserToDelete(null)}><DialogTitle>Remove this user?</DialogTitle><DialogContent><Typography variant="body2" color="text.secondary">This user will lose access to the workspace. This action cannot be undone.</Typography></DialogContent>
      <DialogActions><Button onClick={() => setUserToDelete(null)}>Cancel</Button><Button color="error" variant="contained" onClick={deleteUser}>Remove user</Button></DialogActions></Dialog>
  </>;
}

function avatarColor(name: string) { return ['#e8e7ff', '#e3f7f3', '#fff1df', '#ffe8ec'][name.length % 4]; }

function Orders() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const debouncedQuery = useDebounce(query);
  const { data = [], isLoading, isError } = useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions });
  const filtered = data.filter((order) => `${order.id} ${order.customer} ${order.email}`.toLowerCase().includes(debouncedQuery.toLowerCase()) && (status === 'All' || order.status === status));
  const exportOrders = () => downloadCsv('northstar-orders.csv', ['Order', 'Customer', 'Email', 'Date', 'Amount', 'Status'],
    filtered.map((order) => [order.id, order.customer, order.email, order.date, order.amount, order.status]));
  return <>
    <PageHeading title="Orders" subtitle="Track sales, payments, and customer orders."
      action={<Button variant="outlined" startIcon={<DownloadOutlined />} onClick={exportOrders}>Export CSV</Button>} />
    <Box className="kpi-grid" mb={2}><StatCard title="Total orders" value="1,284" change="9.2%" icon={<ShoppingBagOutlined />} /><StatCard title="Gross sales" value="$86,420" change="14.6%" icon={<TrendingUp />} tone="green" />
      <StatCard title="Pending" value="18" change="2.1%" icon={<MoreHoriz />} /><StatCard title="Refunds" value="$1,240" change="4.3%" icon={<ArrowDownward />} /></Box>
    <Card><CardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" mb={2}>
        <TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders…" aria-label="Search orders" sx={{ width: { xs: '100%', sm: 300 } }} />
        <FormControl size="small" sx={{ minWidth: 145 }}><InputLabel id="order-status-label">Status</InputLabel><Select labelId="order-status-label" label="Status" value={status} onChange={(event) => setStatus(event.target.value)}><MenuItem value="All">All statuses</MenuItem><MenuItem value="Paid">Paid</MenuItem><MenuItem value="Pending">Pending</MenuItem><MenuItem value="Refunded">Refunded</MenuItem></Select></FormControl>
      </Stack>
      {isError ? <Alert severity="error">Orders could not be loaded. Please try again.</Alert> : isLoading ? <PageLoading /> : <TransactionTable rows={filtered} />}
      {!isLoading && !isError && filtered.length === 0 && <Typography textAlign="center" color="text.secondary" py={4}>No orders match your filters.</Typography>}
    </CardContent></Card>
  </>;
}

function Analytics() {
  const [metric, setMetric] = useState<'revenue' | 'users'>('revenue');
  return <>
    <PageHeading title="Analytics" subtitle="Explore the trends behind your business performance."
      action={<FormControl size="small" sx={{ minWidth: 155 }}><InputLabel id="metric-label">Metric</InputLabel><Select labelId="metric-label" label="Metric" value={metric} onChange={(event) => setMetric(event.target.value as typeof metric)}>
        <MenuItem value="revenue">Revenue</MenuItem><MenuItem value="users">User activity</MenuItem></Select></FormControl>} />
    <Box className="kpi-grid"><StatCard title="Revenue growth" value="18.4%" change="3.2%" icon={<TrendingUp />} /><StatCard title="New customers" value="2,846" change="11.5%" icon={<PeopleOutline />} tone="green" />
      <StatCard title="Avg. order value" value="$186.40" change="4.6%" icon={<ShoppingBagOutlined />} /><StatCard title="Conversion rate" value="3.62%" change="0.8%" icon={<AssessmentOutlined />} tone="green" /></Box>
    <Box className="content-grid">
      <Card><CardContent><Typography fontWeight={700}>{metric === 'revenue' ? 'Revenue performance' : 'User activity'}</Typography><Typography variant="caption" color="text.secondary">Monthly trend · 2024</Typography>
        <Box className="chart-wrap"><ResponsiveContainer width="100%" height="100%">{metric === 'revenue' ?
          <BarChart data={revenueData}><CartesianGrid stroke="#eef0f4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><ChartTooltip /><Bar dataKey="current" name="Revenue ($k)" fill="#6558f5" radius={[5, 5, 0, 0]} /></BarChart> :
          <AreaChart data={activityData}><CartesianGrid stroke="#eef0f4" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><ChartTooltip /><Area dataKey="newUsers" name="New users" stroke="#6558f5" fill="#eeedff" /><Area dataKey="returning" name="Returning" stroke="#34b3a0" fill="#e5f7f2" /></AreaChart>}
        </ResponsiveContainer></Box>
      </CardContent></Card>
      <Card><CardContent><Typography fontWeight={700}>Audience activity</Typography><Typography variant="caption" color="text.secondary">Daily active users</Typography>
        <Box className="mini-chart" sx={{ mt: 2 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={activityData}><CartesianGrid stroke="#eef0f4" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis hide /><ChartTooltip /><Area dataKey="newUsers" stroke="#6558f5" fill="#eeedff" /></AreaChart></ResponsiveContainer></Box>
        <Stack direction="row" justifyContent="space-between" mt={2}><Box><Typography variant="caption" color="text.secondary">Daily average</Typography><Typography variant="h6">4,280</Typography></Box><Typography color="success.main" variant="body2">↑ 12.5%</Typography></Stack>
      </CardContent></Card>
    </Box>
    <Box mt={2}><Card><CardContent><Typography fontWeight={700} mb={1}>Monthly comparison</Typography><Box className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenueData}><CartesianGrid stroke="#eef0f4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><ChartTooltip /><Legend /><Bar dataKey="current" name="This year" fill="#6558f5" radius={[4, 4, 0, 0]} /><Bar dataKey="previous" name="Last year" fill="#d8d5fa" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></Box></CardContent></Card></Box>
  </>;
}

function Settings() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const { user } = useAuth();
  const [language, setLanguage] = useState(localStorage.getItem('northstar-language') ?? 'en');
  const [saved, setSaved] = useState(false);
  const changeLanguage = async (event: SelectChangeEvent) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    localStorage.setItem('northstar-language', nextLanguage);
    await i18n.changeLanguage(nextLanguage);
  };
  return <>
    <PageHeading title="Settings" subtitle="Personalize how you work with Northstar." />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.3fr) minmax(280px, .7fr)' }, gap: 2 }}>
      <Card><CardContent><Typography variant="h6" mb={0.5}>Profile</Typography><Typography variant="body2" color="text.secondary" mb={3}>Update your personal details and preferences.</Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}><Avatar sx={{ width: 58, height: 58, bgcolor: '#e8e7ff', color: '#5145e5', fontSize: 20 }}>{user?.name.slice(0, 1)}</Avatar><Box><Typography fontWeight={650}>{user?.name}</Typography><Typography variant="body2" color="text.secondary">{user?.email}</Typography></Box></Stack>
        <Divider sx={{ mb: 2.5 }} /><Stack spacing={2.5} maxWidth={520}><TextField label="Full name" defaultValue={user?.name} /><TextField label="Email address" defaultValue={user?.email} disabled />
          <FormControl><InputLabel id="language-label">Language</InputLabel><Select labelId="language-label" label="Language" value={language} onChange={(event) => void changeLanguage(event)}>
            <MenuItem value="en">English</MenuItem><MenuItem value="hi">Hindi</MenuItem><MenuItem value="bn">Bengali</MenuItem></Select></FormControl>
          <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2500); }}>{saved ? 'Preferences saved' : 'Save preferences'}</Button>
        </Stack>
      </CardContent></Card>
      <Stack spacing={2}>
        <Card><CardContent><Typography variant="h6" mb={.5}>Appearance</Typography><Typography variant="body2" color="text.secondary" mb={2}>Choose a comfortable workspace theme.</Typography>
          <Stack direction="row" spacing={1}><Button variant={mode === 'light' ? 'contained' : 'outlined'} onClick={() => dispatch(toggleTheme())} startIcon={<WbSunnyOutlined />}>Light</Button>
            <Button variant={mode === 'dark' ? 'contained' : 'outlined'} onClick={() => dispatch(toggleTheme())} startIcon={<DarkModeOutlined />}>Dark</Button></Stack></CardContent></Card>
        <Card><CardContent><Typography variant="h6" mb={.5}>Notifications</Typography><Typography variant="body2" color="text.secondary" mb={2}>Keep up with important workspace activity.</Typography>
          <Stack spacing={1.4}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">Product updates</Typography><Chip label="On" size="small" color="success" /></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography variant="body2">Weekly summary</Typography><Chip label="On" size="small" color="success" /></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography variant="body2">Security alerts</Typography><Chip label="On" size="small" color="success" /></Stack></Stack></CardContent></Card>
        <Alert severity="info">Authentication is a local demo. Never use mock sign-in to protect real data.</Alert>
      </Stack>
    </Box>
  </>;
}

function downloadCsv(filename: string, headers: (string | number)[], rows: (string | number)[][]) {
  const escapeCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default App;
