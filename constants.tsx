
import React from 'react';
import { NavItem } from './types.ts';
import DashboardIcon from './components/icons/DashboardIcon.tsx';
import PortfolioIcon from './components/icons/PortfolioIcon.tsx';
import AnalyticsIcon from './components/icons/AnalyticsIcon.tsx';
import ComplianceIcon from './components/icons/ComplianceIcon.tsx';
import ReportsIcon from './components/icons/ReportsIcon.tsx';
import RiskIcon from './components/icons/RiskIcon.tsx';
import MarketIcon from './components/icons/MarketIcon.tsx';
import SettingsIcon from './components/icons/SettingsIcon.tsx';
import ClientsIcon from './components/icons/ClientsIcon.tsx';
import ScrollTextIcon from './components/icons/ScrollTextIcon.tsx';
import ResearchIcon from './components/icons/ResearchIcon.tsx';
import CompassIcon from './components/icons/CompassIcon.tsx';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, page: 'Dashboard' },
  { label: 'Clients', icon: ClientsIcon, page: 'Clients' },
  { label: 'Portfolio Management', icon: PortfolioIcon, page: 'Portfolio Management' },
  { label: 'Model Portfolios', icon: CompassIcon, page: 'Model Portfolios' },
  { label: 'AI Analytics', icon: AnalyticsIcon, page: 'AI Analytics' },
  { label: 'Market Research', icon: ResearchIcon, page: 'Market Research' },
  { label: 'Compliance Monitor', icon: ComplianceIcon, page: 'Compliance Monitor' },
  { label: 'Client Reports', icon: ReportsIcon, page: 'Client Reports' },
  { label: 'Risk Assessment', icon: RiskIcon, page: 'Risk Assessment' },
  { label: 'Market Intelligence', icon: MarketIcon, page: 'Market Intelligence' },
  { label: 'Audit Trail', icon: ScrollTextIcon, page: 'Audit Trail' },
  { label: 'Settings', icon: SettingsIcon, page: 'Settings' },
];