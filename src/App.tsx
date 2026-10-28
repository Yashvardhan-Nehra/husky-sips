import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

const Menu = lazy(() => import('@/pages/Menu'));
const FindUs = lazy(() => import('@/pages/FindUs'));
const Events = lazy(() => import('@/pages/Events'));
const Story = lazy(() => import('@/pages/Story'));
const IngredientsCare = lazy(() => import('@/pages/IngredientsCare'));
const Faqs = lazy(() => import('@/pages/Faqs'));
const Contact = lazy(() => import('@/pages/Contact'));
const PolicyPage = lazy(() => import('@/pages/PolicyPage'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/menu', element: <Menu /> },
      { path: '/find-us', element: <FindUs /> },
      { path: '/events', element: <Events /> },
      { path: '/story', element: <Story /> },
      { path: '/ingredients-and-care', element: <IngredientsCare /> },
      { path: '/faqs', element: <Faqs /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy', element: <PolicyPage policyId="privacy" /> },
      { path: '/terms', element: <PolicyPage policyId="terms" /> },
      { path: '/pickup-delivery-cancellation', element: <PolicyPage policyId="pickup-delivery-cancellation" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
