import React from 'react';
import { Link } from 'react-router-dom';
import HelmetWrapper from '../components/Common/HelmetWrapper';
import { ShieldCheckIcon, LockClosedIcon, EyeSlashIcon, FingerPrintIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Seguridad = () => {
  const securityFeatures = [
    {
      title: 'Protección de Datos',
      description: 'Utilizamos encriptación de nivel bancario para proteger toda la información personal y legal que nos confía.',
      icon: <ShieldCheckIcon className="h-12 w-12 text-primary-600" />
    },
    {
      title: 'Confidencialidad Garantizada',
      description: 'Mantenemos estricta confidencialidad sobre todos sus asuntos legales, cumpliendo con el secreto profesional.',
      icon: <LockClosedIcon className="h-12 w-12 text-primary-600" />
    },
    {
      title: 'Privacidad Reforzada',
      description: 'No compartimos su información con terceros y cumplimos con todas las normativas de protección de datos personales.',
      icon: <EyeSlashIcon className="h-12 w-12 text-primary-600" />
    },
    {
      title: 'Autenticación Segura',
      description: 'Implementamos sistemas de autenticación de dos factores para garantizar que solo usted pueda acceder a su información.',
      icon: <FingerPrintIcon className="h-12 w-12 text-primary-600" />
    },
    {
      title: 'Documentación Protegida',
      description: 'Sus documentos legales están almacenados en servidores seguros con respaldos periódicos para prevenir pérdidas.',
      icon: <DocumentTextIcon className="h-12 w-12 text-primary-600" />
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <HelmetWrapper>
        <title>Seguridad y Confidencialidad | Abogado Wilson Ipiales</title>
        <meta name="description" content="Conozca nuestras medidas de seguridad y confidencialidad para proteger su información legal. Garantizamos la privacidad de sus datos." />
      </HelmetWrapper>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-900">Seguridad y Confidencialidad</h1>
        <p className="text-lg text-center mb-12 text-secondary-600 max-w-3xl mx-auto">
          La protección de su información y la confidencialidad de sus asuntos legales son nuestra prioridad. Implementamos las más estrictas medidas de seguridad para garantizar su tranquilidad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-secondary-900">{feature.title}</h3>
              <p className="text-secondary-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-secondary-900 text-center">Nuestro Compromiso con Su Seguridad</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Secreto Profesional</h3>
              <p className="text-secondary-700">
                Como abogados, estamos sujetos al secreto profesional establecido en el Código de Ética Profesional. Toda la información que usted comparte con nosotros está protegida por esta obligación legal y ética que nos impide divulgar cualquier dato relacionado con su caso sin su consentimiento expreso.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Infraestructura Tecnológica</h3>
              <p className="text-secondary-700">
                Utilizamos servicios de alojamiento de primer nivel con certificaciones ISO 27001 y cumplimiento de estándares internacionales de seguridad. Nuestros sistemas implementan encriptación de datos en reposo y en tránsito para asegurar que su información siempre esté protegida.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Protocolos de Acceso</h3>
              <p className="text-secondary-700">
                Implementamos estrictos controles de acceso a la información. Solo el personal autorizado y directamente involucrado en su caso puede acceder a sus datos, siempre mediante sistemas de autenticación seguros y con registros de auditoría.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Cumplimiento Normativo</h3>
              <p className="text-secondary-700">
                Cumplimos con todas las leyes y regulaciones aplicables sobre protección de datos personales, incluyendo la Ley Orgánica de Protección de Datos Personales de Ecuador, garantizando que sus derechos estén protegidos en todo momento.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-6 md:p-8 mb-12 border border-primary-100">
          <h2 className="text-2xl font-bold mb-4 text-primary-900 text-center">Preguntas Frecuentes sobre Seguridad</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary-800">¿Qué medidas toman para proteger mis comunicaciones?</h3>
              <p className="text-secondary-700">
                Todas las comunicaciones realizadas a través de nuestra plataforma están encriptadas de extremo a extremo. Para comunicaciones por correo electrónico, utilizamos protocolos seguros y ofrecemos la opción de encriptación adicional para documentos sensibles.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary-800">¿Cómo aseguran la confidencialidad cuando uso el chat legal con IA?</h3>
              <p className="text-secondary-700">
                Nuestro sistema de chat legal con IA está diseñado con estrictos controles de privacidad. La información proporcionada no se almacena permanentemente y se utiliza únicamente para generar respuestas relevantes a su consulta. Además, implementamos procesos de anonimización para proteger su identidad.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary-800">¿Por cuánto tiempo conservan mi información?</h3>
              <p className="text-secondary-700">
                Mantenemos su información legal durante el tiempo necesario para prestar nuestros servicios y cumplir con las obligaciones legales. Una vez finalizada la relación profesional, conservamos la documentación por el periodo legalmente establecido, tras el cual procedemos a su eliminación segura o anonimización.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">¿Tiene más preguntas sobre nuestra seguridad?</h3>
          <p className="text-lg text-secondary-600 mb-6 max-w-2xl mx-auto">
            Estaremos encantados de aclarar cualquier duda adicional que pueda tener sobre nuestras medidas de seguridad y confidencialidad.
          </p>
          <Link
            to="/contacto"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Seguridad;
