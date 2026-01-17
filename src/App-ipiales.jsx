import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Componentes de navegación y estructura - siempre cargar de forma estática
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer';
import FloatingCart from './components/Cart/FloatingCart';
import { CartProvider } from './context/CartContext';
import { ModuleProvider, useModules } from './context/ModuleContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componente de carga para usar con React.lazy
function LoadingIndicator() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">AW</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Abogado Wilson</h1>
        <p className="text-lg text-gray-600">Cargando aplicación...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

// Componentes principales cargados dinámicamente con React.lazy
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const BlogComponent = lazy(() => import('./components/Blog'));
const ProcessSearch = lazy(() => import('./components/ProcessSearch'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Newsletter = lazy(() => import('./components/Newsletter/Newsletter'));

// Módulos integrados
const AbogadosOSPage = lazy(() => import('./pages/AbogadosOSPage'));
const GamesPlatform = lazy(() => import('./pages/GamesPlatform'));
const CryptoBankingModule = lazy(() => import('./modules/crypto-banking/App'));
const ProyectosHub = lazy(() => import('./pages/ProyectosHub'));
const HubPspPage = lazy(() => import('./pages/HubPspPage'));

// Política de privacidad y términos
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const PoliticasCondiciones = lazy(() => import('./pages/PoliticasCondiciones'));
const Seguridad = lazy(() => import('./pages/Seguridad'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const ConsultaGeneral = lazy(() => import('./pages/ConsultaGeneral'));
const ConsultaIA = lazy(() => import('./pages/ConsultaIA'));

// Componentes de foro y comunicación
const Chat = lazy(() => import('./components/Chat'));
const Forum = lazy(() => import('./components/Forum'));
const TopicDetail = lazy(() => import('./components/Forum/TopicDetail'));

// Componentes de páginas informativas
const JudicialNews = lazy(() => import('./components/JudicialNews'));
const Blog = lazy(() => import('./pages/Blog'));
const Afiliados = lazy(() => import('./components/Afiliados'));
const Referidos = lazy(() => import('./components/Referidos'));
const Registration = lazy(() => import('./components/Registration'));
const ContactPage = lazy(() => import('./components/Contact/ContactPage'));

// Componentes de dashboard y administración
const DashboardPage = lazy(() => import('./components/Dashboard/DashboardPage'));
const ClientDashboard = lazy(() => import('./components/Dashboard/ClientDashboard'));
const AppointmentCalendar = lazy(() => import('./components/Appointment/AppointmentCalendar'));
const AdminDashboardComplete = lazy(() => import('./components/Admin/AdminDashboardComplete'));
const DataExporter = lazy(() => import('./components/Admin/DataExporter'));

// Componentes comunes y complementarios
const CookieConsent = lazy(() => import('./components/Common/CookieConsent'));
const ConsultationHub = lazy(() => import('./components/Consultation/ConsultationHub'));
const Ebooks = lazy(() => import('./components/Ebooks'));

// Componentes de pagos y transacciones
const PaymentForm = lazy(() => import('./components/Payment/PaymentForm'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));

// Consultas - Páginas profesionales con formularios completos y BD
const PenalConsultationPage = lazy(() => import('./pages/PenalConsultationPage'));
const CivilConsultationPage = lazy(() => import('./pages/CivilConsultationPage'));
const ConsultationsPage = lazy(() => import('./pages/ConsultationsPage'));
const FreeConsultationPage = lazy(() => import('./pages/FreeConsultationPage'));
// Consultas alternativas con paquetes de precios
const PenalConsultationPackages = lazy(() => import('./pages/ConsultationTypes/PenalConsultationPage'));
const CivilConsultationPackages = lazy(() => import('./pages/ConsultationTypes/CivilConsultationPage'));
const EmpresarialConsultationPage = lazy(() => import('./pages/ConsultationTypes/EmpresarialConsultationPage'));
const DigitalConsultationPage = lazy(() => import('./pages/ConsultationTypes/DigitalConsultationPage'));
const QuickConsultationPage = lazy(() => import('./pages/ConsultationTypes/QuickConsultationPage'));

// Componentes de autenticación
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.tsx'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));

// Páginas principales
const ServicesLandingPage = lazy(() => import('./pages/ServicesLandingPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage.jsx'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const TiendaStore = lazy(() => import('./components/Store/ProfessionalStore'));
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'));

// Servicios específicos - Páginas completas con mejor diseño
const ServicioPenalPage = lazy(() => import('./pages/ServicioPenalPage'));
const ServicioCivilPage = lazy(() => import('./pages/ServicioCivilPage'));
const ServicioComercialPage = lazy(() => import('./pages/ServicioComercialPage'));
const ServicioTransitoPage = lazy(() => import('./pages/ServicioTransitoPage'));
const ServicioAduaneroPage = lazy(() => import('./pages/ServicioAduaneroPage'));
const ServicioLaboralPage = lazy(() => import('./pages/ServicioLaboralPage'));

// Componentes de chat
const WhatsAppChat = lazy(() => import('./components/Chat/WhatsAppChat'));
const LiveChat = lazy(() => import('./components/Chat/LiveChat'));
const AILegalChatbot = lazy(() => import('./components/Chat/AILegalChatbot'));
// Juegos
const TicTacToe = lazy(() => import('./components/Games/TicTacToe'));

// Importamos el componente para descarga protegida
const ProtectedDownload = lazy(() => import('./components/ProtectedDownload'));

// Determinar la URL base según el entorno
const getBaseUrl = () => {
  // En desarrollo local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8787';
  }
  // En producción, usar la misma URL del worker
  return window.location.origin;
};

function App() {
  const [apiReady, setApiReady] = useState(true); // Optimista por defecto
  const [isLoading, setIsLoading] = useState(true);

// ... rest of the code remains the same ...
  // Verificar la API al iniciar
  useEffect(() => {
    const verifyApiConnection = async () => {
      try {
        // En desarrollo local, siempre asumir que la API está disponible
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          setApiReady(true);
          setIsLoading(false);
          return;
        }

        // En producción, verificar conexión real
        const healthEndpoint = `${getBaseUrl()}/api/health`;
        const response = await axios.get(healthEndpoint, { timeout: 3000 });
        
        if (response.status === 200) {
          setApiReady(true);
          toast.success('Conexión a la API establecida', {
            id: 'api-connection',
            duration: 3000
          });
        } else {
          throw new Error('API no disponible');
        }
      } catch (error) {
        console.warn('No se pudo conectar a la API. Trabajando en modo offline.', error);
        // En desarrollo, podemos seguir a pesar de no tener API
        setApiReady(true);
        toast.error('API no disponible. Trabajando en modo offline', {
          id: 'api-connection',
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyApiConnection();
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!apiReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Servicio no disponible</h2>
            <p className="mt-2 text-sm text-gray-600">
              Lo sentimos, el servicio no está disponible en este momento. Por favor, inténtelo más tarde.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <AuthProvider>
        <ModuleProvider>
          <ThemeProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </ThemeProvider>
        </ModuleProvider>
      </AuthProvider>
    </Suspense>
  );
}

// Componente AppContent separado para usar el contexto de autenticación
function AppContent() {
  // Protección contra errores en el contexto de autenticación
  const authContext = useAuth() || {};
  const { user, isAuthenticated = false, loading = false } = authContext;
  const location = useLocation();

  const isHubPspRoute = location.pathname.startsWith('/hub-psp');
  
  // Obtener el contexto de módulos
  const { preloadCriticalModules, isLoading: modulesLoading } = useModules();
  
  // Cargar módulos críticos al iniciar (solo una vez y sin logs repetidos)
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('modules_preloaded');
    if (!hasLoaded) {
      preloadCriticalModules().catch(error => {
        console.warn('[AppContent] Error al precargar módulos:', error);
      });
      sessionStorage.setItem('modules_preloaded', 'true');
    }
  }, []);
  
  // Mostrar un spinner mientras se determina si el usuario está autenticado o los módulos están cargando
  if (loading || modulesLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      {!isHubPspRoute && <Navbar />}
      {!isHubPspRoute && <FloatingCart />}
      
      <main className="flex-grow">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Testimonials />
              <BlogComponent />
              <ProcessSearch />
              <Newsletter />
            </>
          } />
          
          {/* Páginas principales */}
          <Route path="/servicios" element={<ServicesLandingPage />} />
          <Route path="/tienda" element={<TiendaStore />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/cursos/:id" element={<CourseDetailPage />} />
          <Route path="/suscripciones" element={<SubscriptionsPage />} />
          
          {/* Servicios específicos - Páginas completas */}
          <Route path="/servicios/penal" element={<ServicioPenalPage />} />
          <Route path="/servicios/civil" element={<ServicioCivilPage />} />
          <Route path="/servicios/comercial" element={<ServicioComercialPage />} />
          <Route path="/servicios/transito" element={<ServicioTransitoPage />} />
          <Route path="/servicios/familia" element={<ServicioCivilPage />} />
          <Route path="/servicios/aduanas" element={<ServicioAduaneroPage />} />
          <Route path="/servicios/aduanero" element={<ServicioAduaneroPage />} />
          <Route path="/servicios/laboral" element={<ServicioLaboralPage />} />
          
          {/* Consultas - Páginas con diseño profesional */}
          <Route path="/consultas" element={<ConsultationsPage />} />
          <Route path="/consultas/general" element={<QuickConsultationPage />} />
          <Route path="/consultas/rapida" element={<QuickConsultationPage />} />
          <Route path="/consultas/gratis" element={<FreeConsultationPage />} />
          {/* Consultas específicas con paquetes (diseño profesional como imagen) */}
          <Route path="/consultas/penales" element={<PenalConsultationPackages />} />
          <Route path="/consultas/penal" element={<PenalConsultationPackages />} />
          <Route path="/consultas/civiles" element={<CivilConsultationPackages />} />
          <Route path="/consultas/civil" element={<CivilConsultationPackages />} />
          <Route path="/consultas/empresarial" element={<EmpresarialConsultationPage />} />
          <Route path="/consultas/digital" element={<DigitalConsultationPage />} />
          <Route path="/consultas/online" element={<DigitalConsultationPage />} />
          
          {/* Otras rutas */}
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/chat" element={<LiveChat />} />
          <Route path="/noticias" element={<JudicialNews />} />
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/referidos" element={<Referidos />} />
          <Route path="/consulta" element={<ConsultationHub />} />
          {/* Juegos */}
          <Route path="/juegos/3enraya" element={<TicTacToe />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/politicas-privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/terminos-condiciones" element={<TermsOfServicePage />} />
          <Route path="/terminos" element={<TermsOfServicePage />} />
          <Route path="/seguridad" element={<Seguridad />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/consulta-general" element={<ConsultaGeneral />} />
          <Route path="/consulta-ia" element={<ConsultaIA />} />
          
          {/* Foro */}
          <Route path="/foro" element={<Forum />} />
          <Route path="/foro/tema/:id" element={<TopicDetail />} />
          
          {/* Rutas de autenticación */}
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          } />
          <Route path="/registro" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          } />
          <Route path="/recuperar-password" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />
          } />
          <Route path="/reset-password" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />
          } />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          } />
          <Route path="/cliente" element={
            <RequireAuth>
              <ClientDashboard />
            </RequireAuth>
          } />
          <Route path="/calendario" element={
            <RequireAuth>
              <AppointmentCalendar />
            </RequireAuth>
          } />
          <Route path="/citas" element={<AppointmentsPage />} />
          <Route path="/agendar-cita" element={<AppointmentsPage />} />
          <Route path="/pago" element={
            <RequireAuth>
              <PaymentForm />
            </RequireAuth>
          } />
          <Route path="/checkout" element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          } />
          <Route path="/gracias" element={<ThankYouPage />} />
          <Route path="/payment/success" element={<ThankYouPage />} />
          <Route path="/ebooks/download/:id" element={<ProtectedDownload />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/usuarios" element={
            <RequireAuth requireAdmin={true}>
              <DataExporter />
            </RequireAuth>
          } />
          <Route path="/admin/productos" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/cursos" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/blog" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/citas" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/afiliados" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/configuracion" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          <Route path="/admin/analiticas" element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardComplete />
            </RequireAuth>
          } />
          
          {/* Hub de Proyectos */}
          <Route path="/proyectos" element={<Suspense fallback={<LoadingIndicator />}><ProyectosHub /></Suspense>} />
          <Route path="/hub-psp/*" element={<Suspense fallback={<LoadingIndicator />}><HubPspPage /></Suspense>} />
          
          {/* Módulos integrados */}
          <Route path="/abogados-os" element={<Suspense fallback={<LoadingIndicator />}><AbogadosOSPage /></Suspense>} />
          <Route path="/juegos/*" element={<Suspense fallback={<LoadingIndicator />}><GamesPlatform /></Suspense>} />
          <Route path="/games/*" element={<Suspense fallback={<LoadingIndicator />}><GamesPlatform /></Suspense>} />
          <Route path="/cripto/*" element={<Suspense fallback={<LoadingIndicator />}><CryptoBankingModule /></Suspense>} />
          <Route path="/crypto/*" element={<Suspense fallback={<LoadingIndicator />}><CryptoBankingModule /></Suspense>} />
          <Route path="/crypto-banking/*" element={<Suspense fallback={<LoadingIndicator />}><CryptoBankingModule /></Suspense>} />
          <Route path="/nexufi/*" element={<Suspense fallback={<LoadingIndicator />}><CryptoBankingModule /></Suspense>} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-4xl font-extrabold text-red-600">404</h1>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Página no encontrada
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  La página que estás buscando no existe o ha sido movida.
                </p>
                <div className="mt-5">
                  <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      {!isHubPspRoute && <Footer />}
      {!isHubPspRoute && <CookieConsent />}
      {!isHubPspRoute && <WhatsAppChat />}
      {!isHubPspRoute && <AILegalChatbot />}
    </>
  );
}

// Componente para proteger rutas que requieren autenticación
function RequireAuth({ children, requireAdmin = false }) {
  const authContext = useAuth() || {};
  const { isAuthenticated, loading, user } = authContext;
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redireccionar al login, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si se requiere rol de admin
  if (requireAdmin) {
    const isAdmin = user?.email === 'ecuadorabogado1@gmail.com' || 
                    user?.role === 'admin' || 
                    (Array.isArray(user?.roles) && user.roles.includes('admin')) ||
                    user?.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      toast.error('No tienes permisos para acceder a esta página');
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default App;
