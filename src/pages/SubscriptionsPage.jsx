import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheck, FaCrown, FaStar, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SubscriptionsPage = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const planNumericIds = {
    basic: 1001,
    professional: 1002,
    enterprise: 1003
  };

  const plans = [
    {
      id: 'basic',
      name: 'Normal',
      icon: FaShieldAlt,
      color: 'blue',
      priceMonthly: 29.99,
      priceAnnual: 299.99,
      description: 'Perfecto para emprendedores',
      features: [
        'Consultas Básicas del Consejo de la Judicatura',
        'Consultas de servicios del SRI',
        'Sesiones básicas de asesoría legal (2 por mes)',
        'Acceso al Blog Legal con artículos actualizados',
        'Notificaciones de actualizaciones legales'
      ]
    },
    {
      id: 'professional',
      name: 'Intermedio',
      icon: FaRocket,
      color: 'purple',
      priceMonthly: 49.99,
      priceAnnual: 499.99,
      description: 'Ideal para profesionales',
      features: [
        'Consultas de causas penales y civiles',
        'Consultas de multas de tránsito',
        'Sesiones avanzadas de asesoría legal (4 por mes)',
        'Acceso a cursos y eBooks legales premium',
        'Descuentos en servicios adicionales',
        'Acceso al Blog Legal con contenido exclusivo'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Premium',
      icon: FaCrown,
      color: 'yellow',
      priceMonthly: 99.99,
      priceAnnual: 999.99,
      description: 'Solución para empresas',
      features: [
        'Acceso ilimitado a todas las consultas disponibles',
        'Sesiones premium de asesoría legal (8 por mes)',
        'Acceso completo a biblioteca de cursos y eBooks',
        'NFTs y servicios Blockchain exclusivos',
        'Redacción ilimitada de certificados y documentos',
        'Prioridad en atención al cliente 24/7',
        'Acceso VIP al Blog Legal'
      ]
    }
  ];

  const getPrice = (plan) => billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;

  const getSavings = (plan) => {
    if (billingCycle === 'annual') {
      return (plan.priceMonthly * 12 - plan.priceAnnual).toFixed(2);
    }
    return 0;
  };

  const handleSubscribe = (plan) => {
    if (!user) {
      toast.error('Debes iniciar sesión para suscribirte');
      navigate('/login');
      return;
    }

    addToCart({
      id: planNumericIds[plan.id] || 1000,
      name: `${plan.name} - ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`,
      price: getPrice(plan),
      type: 'subscription',
      category: 'Suscripción',
      duration: billingCycle === 'monthly' ? 1 : 12,
      billingCycle,
      planId: plan.id
    });
  };

  return (
    <>
      <Helmet>
        <title>Suscripciones | Abg. Wilson Ipiales</title>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 mt-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planes de Suscripción
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Asesoría legal continua con acceso a servicios premium
            </p>

            {/* Toggle de facturación */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                Mensual
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-blue-600 transition-colors"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
              </button>
              <span className={`text-lg ${billingCycle === 'annual' ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                Anual
              </span>
              {billingCycle === 'annual' && (
                <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Ahorra hasta 16%
                </span>
              )}
            </div>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 ${plan.popular ? 'ring-4 ring-purple-500 transform scale-105' : ''
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaStar /> Más Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <Icon className={`text-5xl text-${plan.color}-600 mx-auto mb-4`} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${getPrice(plan).toFixed(0)}
                      </span>
                      <span className="text-gray-600">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && getSavings(plan) > 0 && (
                      <p className="text-green-600 text-sm mt-2">
                        Ahorras ${getSavings(plan)} al año
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${plan.popular
                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                  >
                    Seleccionar Plan
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Puedo cambiar de plan en cualquier momento?
                </h3>
                <p className="text-gray-600">
                  Sí, puedes actualizar o degradar tu plan cuando lo desees. Los cambios se aplicarán en el próximo ciclo de facturación.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Cómo funciona la facturación?
                </h3>
                <p className="text-gray-600">
                  Se te cobrará automáticamente al inicio de cada período (mensual o anual) según el plan elegido.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Hay período de prueba?
                </h3>
                <p className="text-gray-600">
                  Ofrecemos 7 días de garantía de devolución del dinero si no estás satisfecho con el servicio.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default SubscriptionsPage;
