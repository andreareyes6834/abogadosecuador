import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Gamepad2, TrendingUp, ArrowRight, Layers } from 'lucide-react';

export default function ProyectosHub() {
  const proyectos = [
    {
      id: 'abogados-os',
      nombre: 'Abogados OS',
      descripcion: 'Sistema operativo profesional para gestión legal y portafolio de abogados',
      icono: <Scale className="w-16 h-16" />,
      color: 'from-indigo-600 to-indigo-900',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-500',
      features: ['Portafolio Profesional', 'Gestión de Casos', 'Archivos Seguros', 'Calendario'],
      ruta: '/abogados-os',
      estado: 'Activo'
    },
    {
      id: 'games',
      nombre: 'Wilex Game Station',
      descripcion: 'Plataforma de juegos retro con experiencia inmersiva y multijugador',
      icono: <Gamepad2 className="w-16 h-16" />,
      color: 'from-purple-600 to-purple-900',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-500',
      features: ['Múltiples Juegos', 'Secuencia Inmersiva', 'Sistema de Puntos', 'Tienda de Juegos'],
      ruta: '/juegos',
      estado: 'Activo'
    },
    {
      id: 'crypto-banking',
      nombre: 'NexuFi Platform',
      descripcion: 'Ecosistema bancario y criptomonedas integrado con trading avanzado',
      icono: <TrendingUp className="w-16 h-16" />,
      color: 'from-cyan-600 to-cyan-900',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-500',
      features: ['Exchange 24/7', 'Wallet Seguro', 'P2P Trading', 'Staking & Rewards'],
      ruta: '/cripto',
      estado: 'Activo'
    },
    {
      id: 'hub-psp',
      nombre: 'Hub PSP Professional',
      descripcion: 'Hub profesional integrado con economía, progreso y centro de juegos',
      icono: <Layers className="w-16 h-16" />,
      color: 'from-slate-800 to-slate-900',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-700',
      features: ['Centro de juegos', 'Economía (coins/gems)', 'Perfil y progreso', 'Tienda integrada'],
      ruta: '/hub-psp',
      estado: 'Activo'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Plataforma Integrada Profesional
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Accede a todos nuestros sistemas integrados: gestión legal, entretenimiento y finanzas digitales
          </p>
        </div>
      </div>

      {/* Proyectos Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proyectos.map((proyecto) => (
            <Link
              key={proyecto.id}
              to={proyecto.ruta}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${proyecto.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                {/* Icon */}
                <div className={`${proyecto.textColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {proyecto.icono}
                </div>

                {/* Title and Description */}
                <h2 className={`text-2xl font-bold ${proyecto.textColor} mb-3`}>
                  {proyecto.nombre}
                </h2>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {proyecto.descripcion}
                </p>

                {/* Features */}
                <div className="mb-6 space-y-2">
                  {proyecto.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <span className={`w-2 h-2 rounded-full ${proyecto.textColor} mr-3`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${proyecto.textColor} bg-opacity-10`}>
                    {proyecto.estado}
                  </span>
                  <ArrowRight className={`w-5 h-5 ${proyecto.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
                </div>
              </div>

              {/* Border */}
              <div className={`absolute inset-0 border-2 ${proyecto.borderColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
            </Link>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Sobre Nuestra Plataforma
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Integración Completa
              </h4>
              <p className="text-gray-600">
                Todos nuestros sistemas están completamente integrados con autenticación unificada y sincronización en tiempo real.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Seguridad Profesional
              </h4>
              <p className="text-gray-600">
                Encriptación de datos, validaciones de seguridad y protección de privacidad en todos los módulos.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Soporte 24/7
              </h4>
              <p className="text-gray-600">
                Equipo de soporte disponible para asistirte en cualquier momento con tus consultas y problemas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-gray-600">
        <p>
          Plataforma integrada profesional • Versión 1.0.0 • Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
