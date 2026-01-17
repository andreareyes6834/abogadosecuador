import { Fragment, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition, Popover } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { FaUsers, FaHandshake, FaComments, FaGavel, FaBook, FaShieldAlt, FaFileContract, FaFileAlt, FaUserTie, FaWhatsapp, FaPhone, FaEnvelope, FaUserPlus, FaSignInAlt, FaLock, FaShoppingCart, FaBriefcase, FaGlobe, FaCrown, FaGraduationCap, FaGamepad, FaWallet } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThemeSwitcher from '../ThemeSwitcher';

const mainNavigation = [
  { name: 'Inicio', href: '/', current: false },
  { name: 'Servicios', href: '#', current: false, hasSubmenu: true, icon: <FaGavel className="text-blue-600" /> },
  { name: 'Consultas', href: '#', current: false, hasSubmenu: true, icon: <FaFileAlt className="text-blue-600" /> },
  { name: 'Tienda', href: '/tienda', current: false, icon: <FaShoppingCart className="text-blue-600" /> },
  { name: 'Suscripciones', href: '/suscripciones', current: false, icon: <FaCrown className="text-blue-600" /> },
  { name: 'Blog', href: '#', current: false, hasSubmenu: true, icon: <FaBook className="text-blue-600" /> },
  { name: 'Comunidad', href: '#', current: false, hasSubmenu: true, icon: <FaUsers className="text-blue-600" /> },
  { name: 'Proyectos', href: '#', current: false, hasSubmenu: true, icon: <FaBriefcase className="text-purple-600" /> },
  { name: 'Contacto', href: '/contacto', current: false, icon: <FaEnvelope className="text-blue-600" /> },
];

const serviceSubmenu = [
  { name: 'Todos los Servicios', href: '/servicios', current: false, icon: <FaGavel className="text-blue-500" /> },
  { name: 'Derecho Penal', href: '/servicios/penal', current: false, icon: <FaGavel className="text-red-500" /> },
  { name: 'Derecho Civil', href: '/servicios/civil', current: false, icon: <FaFileContract className="text-blue-500" /> },
  { name: 'Derecho Comercial', href: '/servicios/comercial', current: false, icon: <FaBriefcase className="text-green-500" /> },
  { name: 'Derecho de Tránsito', href: '/servicios/transito', current: false, icon: <FaFileAlt className="text-yellow-500" /> },
  { name: 'Derecho Aduanero', href: '/servicios/aduanero', current: false, icon: <FaFileAlt className="text-indigo-500" /> },
  { name: 'Derecho Laboral', href: '/servicios/laboral', current: false, icon: <FaUserTie className="text-purple-500" /> },
];

const consultasSubmenu = [
  { name: 'Consulta General', href: '/consultas/general', current: false, icon: <FaFileContract className="text-blue-500" /> },
  { name: 'Consulta Penal', href: '/consultas/penal', current: false, icon: <FaGavel className="text-red-500" /> },
  { name: 'Consulta Civil', href: '/consultas/civil', current: false, icon: <FaFileContract className="text-blue-500" /> },
  { name: 'Consulta Empresarial', href: '/consultas/empresarial', current: false, icon: <FaBriefcase className="text-green-500" /> },
  { name: 'Consulta Digital/Online', href: '/consultas/digital', current: false, icon: <FaGlobe className="text-purple-500" /> },
];

const blogSubmenu = [
  { name: 'Todos los Artículos', href: '/blog', current: false, icon: <FaBook className="text-blue-500" /> },
  { name: 'Noticias Judiciales', href: '/noticias', current: false, icon: <FaBook className="text-red-500" /> },
  { name: 'Newsletter', href: '/noticias?id=2', current: false, icon: <FaEnvelope className="text-orange-500" /> },
];

const comunidadSubmenu = [
  { name: 'Cursos', href: '/cursos', current: false, icon: <FaGraduationCap className="text-blue-500" /> },
  { name: 'E-Books', href: '/ebooks', current: false, icon: <FaBook className="text-green-500" /> },
  { name: 'Foro', href: '/foro', current: false, icon: <FaComments className="text-purple-500" /> },
  { name: 'Programa de Afiliados', href: '/afiliados', current: false, icon: <FaHandshake className="text-orange-500" /> },
  { name: 'Sistema de Referidos', href: '/referidos', current: false, icon: <FaUsers className="text-indigo-500" /> },
];

// Nuevo submenú para Proyectos Integrados
const proyectosSubmenu = [
  { name: 'Abogados OS', href: '/abogados-os', current: false, icon: <FaGavel className="text-indigo-500" /> },
  { name: 'Game Station', href: '/games', current: false, icon: <FaGamepad className="text-cyan-500" /> },
  { name: 'Crypto Banking', href: '/crypto-banking', current: false, icon: <FaWallet className="text-emerald-500" /> },
  { name: 'Hub de Proyectos', href: '/proyectos', current: false, icon: <FaBriefcase className="text-purple-500" /> },
];

// Nuevo submenú para Políticas y Seguridad
const policySubmenu = [
  { name: 'Política de Privacidad', href: '/politicas-privacidad', current: false, icon: <FaShieldAlt className="text-gray-500" /> },
  { name: 'Términos y Condiciones', href: '/terminos-condiciones', current: false, icon: <FaFileContract className="text-gray-500" /> },
  { name: 'Seguridad', href: '/seguridad', current: false, icon: <FaLock className="text-gray-500" /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const authContext = useAuth() || {};
  const { user, isAuthenticated, logout } = authContext;
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // We no longer need to manually check for auth state since we use the context
  }, []);

  const updatedNavigation = mainNavigation.map(item => ({
    ...item,
    current: location.pathname === item.href ||
      (item.href !== '#' && item.href !== '/' && location.pathname.includes(item.href))
  }));

  // Añadir entradas para Políticas y Seguridad
  const allNavigation = [...updatedNavigation,
  {
    name: 'Políticas',
    href: '#',
    current: location.pathname === '/privacidad' || location.pathname === '/terminos' || location.pathname === '/seguridad',
    hasSubmenu: true,
    icon: <FaShieldAlt className="text-blue-600" />
  }
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-lg sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto pl-0 pr-2 sm:pl-1 sm:pr-4 lg:pl-2 lg:pr-6 w-full max-w-7xl">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden z-50">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Desktop navigation */}
              <div className="flex flex-1 items-center sm:justify-start justify-center">
                {/* Logo profesional - Esquina izquierda */}
                <Link to="/" className="hidden sm:flex items-center mr-2 lg:mr-3 xl:mr-5 shrink-0 sm:-ml-1 lg:-ml-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                      <FaGavel className="text-white text-sm" />
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="text-xs font-bold text-gray-900 leading-tight">Abg. Wilson</span>
                      <span className="text-[8px] text-gray-600 leading-tight">Asesoría Legal</span>
                    </div>
                  </div>
                </Link>

                <div className="hidden sm:flex sm:space-x-0 md:space-x-0.5 lg:space-x-1">
                  {allNavigation.map((item) =>
                    item.hasSubmenu ? (
                      <Popover className="relative" key={item.name}>
                        {({ open }) => (
                          <>
                            <Popover.Button
                              className={classNames(
                                item.current ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                                'rounded-md px-1.5 py-1.5 text-[11px] lg:text-xs font-medium flex items-center group transition-colors'
                              )}
                            >
                              <span className="mr-1">{item.icon}</span>
                              <span>{item.name}</span>
                              <ChevronDownIcon
                                className={classNames(
                                  'ml-1 h-4 w-4 transition-transform',
                                  open ? 'rotate-180 transform' : ''
                                )}
                              />
                            </Popover.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                            >
                              <Popover.Panel className={`absolute z-50 mt-1 w-56 transform ${item.name === 'Políticas' ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                                <div className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                  <div className="relative grid gap-1 p-2">
                                    {(item.name === 'Servicios' ? serviceSubmenu :
                                      item.name === 'Consultas' ? consultasSubmenu :
                                        item.name === 'Blog' ? blogSubmenu :
                                          item.name === 'Comunidad' ? comunidadSubmenu :
                                            item.name === 'Proyectos' ? proyectosSubmenu :
                                              item.name === 'Políticas' ? policySubmenu : []).map((subItem) => (
                                                <Link
                                                  key={subItem.name}
                                                  to={subItem.href}
                                                  className={classNames(
                                                    subItem.current ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                                                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                                  )}
                                                >
                                                  <span className="mr-2">{subItem.icon}</span>
                                                  <span>{subItem.name}</span>
                                                </Link>
                                              ))}
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                          'rounded-md px-1.5 py-1.5 text-[11px] lg:text-xs font-medium flex items-center transition-colors'
                        )}
                      >
                        <span className="mr-1">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Right side buttons */}
              <div className="absolute inset-y-0 right-0 flex items-center gap-2 sm:static">
                {/* Botones de contacto - Solo desktop grande */}
                <div className="hidden xl:flex items-center gap-1">
                  <a
                    href="tel:+593988835269"
                    className="inline-flex items-center px-2 py-1.5 text-[11px] font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                  >
                    <FaPhone className="mr-1 text-xs" /> Llamar
                  </a>
                  <Link
                    to="/contacto"
                    className="inline-flex items-center px-2 py-1.5 text-[11px] font-semibold rounded-md text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-sm transition-all"
                  >
                    <FaEnvelope className="mr-1 text-xs" /> Consulta
                  </Link>
                </div>

                {/* Carrito de Compras */}
                <Link
                  to={itemCount > 0 ? "/checkout" : "/tienda"}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Carrito de compras"
                >
                  <FaShoppingCart className="h-5 w-5 text-gray-700" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Auth buttons */}
                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-blue-100 p-1 text-blue-600 hover:bg-blue-200 focus:outline-none">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Abrir menú de usuario</span>
                        <UserIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={classNames(
                                active ? 'bg-blue-50' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Mi Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(
                                active ? 'bg-blue-50' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-2 py-1.5 text-[11px] font-medium rounded-md text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <FaSignInAlt className="mr-1 text-xs" /> Ingresar
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-2 py-1.5 text-[11px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <FaUserPlus className="mr-1 text-xs" /> Registro
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {allNavigation.map((item) =>
                item.hasSubmenu ? (
                  <Disclosure key={item.name} as="div" className="mt-1">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={classNames(
                            item.current ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 hover:text-blue-700',
                            'group w-full flex items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium text-gray-700 focus:outline-none'
                          )}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                          <ChevronDownIcon
                            className={classNames(
                              'h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-transform',
                              open ? 'rotate-180 transform' : ''
                            )}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-1 space-y-1">
                          {(item.name === 'Servicios' ? serviceSubmenu :
                            item.name === 'Consultas' ? consultasSubmenu :
                              item.name === 'Blog' ? blogSubmenu :
                                item.name === 'Comunidad' ? comunidadSubmenu :
                                  item.name === 'Proyectos' ? proyectosSubmenu :
                                    item.name === 'Políticas' ? policySubmenu : []).map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.href}
                                        className="group flex items-center rounded-md py-2 pl-4 pr-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                      >
                                        <span className="mr-2">{subItem.icon}</span>
                                        <span>{subItem.name}</span>
                                      </Link>
                                    ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 hover:text-blue-700',
                      'flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700'
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              )}

              {/* Mobile Contact Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contacto Directo</h3>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+593988835269"
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaPhone className="mr-1" /> Llamar
                  </a>
                  <a
                    href="https://wa.me/593988835269"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                  >
                    <FaWhatsapp className="mr-1" /> WhatsApp
                  </a>
                  <Link
                    to="/contacto"
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 col-span-2 mt-1"
                  >
                    <FaEnvelope className="mr-1" /> Consulta Gratis
                  </Link>
                </div>
              </div>

              {/* Mobile Authentication Buttons */}
              {!isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mi Cuenta</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaSignInAlt className="mr-1" /> Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center p-2 text-xs font-medium rounded-md text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
                    >
                      <FaUserPlus className="mr-1" /> Registrarse
                    </Link>
                  </div>
                </div>
              )}

              {/* Theme Switcher for mobile */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tema</h3>
                <div className="flex justify-center">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
