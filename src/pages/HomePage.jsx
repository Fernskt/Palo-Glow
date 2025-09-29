import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck, Heart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
//import { featuredProducts } from '@/data/products';
import { useCatalog } from '@/data/catalog'
import Joyeria from '@/assets/Joyería.png';
import About from '@/assets/NosotrosJoyas.png';

export function HomePage() {
  const testimonials = [
    {
      name: "Lucía Pérez",
      rating: 5,
      text: "La pulsera no ha perdido color y combina con todo. Amé el empaque reutilizable.",
      location: "Buenos Aires, José Mármol"
    },
    {
      name: "Martina García",
      rating: 5,
      text: "El anillo ajustable es hipoalergénico y cómodo. Detalle fino, cero níquel.",
      location: "Buenos Aires, Lanús"
    },
    {
      name: "Sofía López",
      rating: 5,
      text: "Nada me dió alergia. Excelente calidad. Súper recomendable.",
      location: "Buenos Aires, CABA"
    }
  ];


  const features = [
    {
      icon: Shield,
      title: "Hipoalergénico 316L",
      description: "Acero quirúrgico 316L, cómodo y apto para piel sensible."
    },
    {
      icon: Award,
      title: "Buena calidad",
      description: "Terminación pulido espejo, cierres seguros y brillo duradero. Apliques de strass de alta calidad."
    },
    {
      icon: Truck,
      title: "Envío Rápido",
      description: "Envíos a todo el país con seguimiento. Envío gratis desde ARS 20.000 y cambios simples."
    },
    {
      icon: Heart,
      title: "Atención Personalizada",
      description: "Asesoría por WhatsApp para armar tu look, elegir medidas y combinar piezas."
    }
  ];

  const { featuredProducts, loading, error } = useCatalog();


  return (
    <>
      <Helmet>
        <title>Palo Glow | brillo que cuenta tu historia</title>
        <meta name="description" content="Joyas para elevar tus outfits: collares, pulseras, anillos y aros hipoalergénicos en acero 316L bañados en oro 18k." />
        <link rel="canonical" href="https://fernskt.github.io/Palo-Glow/" />
        {/* JSON-LD Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Palo Glow",
            url: "https://fernskt.github.io/Palo-Glow/",
            sameAs: ["https://www.instagram.com/paloglow"]
          })}
        </script>
      </Helmet>


      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-pattern bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium"
                  >
                    👑​ Viví a la moda.
                  </motion.div>

                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight text-shadow">
                    Palo Glow - brillo que cuenta tu historia.
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Descubre nuestra colección de joyas: collares, pulseras y accesorios únicos que realzan tu estilo y cuentan tu historia. Cada pieza está pensada para acompañarte en cada momento especial.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/shop">
                    <Button size="lg" className="honey-gradient text-white border-0 hover:opacity-90 text-lg px-8">
                      Productos
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="text-lg px-8 border-amber-300 text-amber-700 hover:bg-amber-50">
                      Nuestra Historia
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Clientes Felices</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">4.9★</div>
                    <div className="text-sm text-gray-600">Puntuación</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Calidad</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10">
                  <img
                    className="w-full h-auto rounded-2xl shadow-2xl animate-float"
                    alt="Artisanal honey jars and beeswax products arranged beautifully"
                    src={Joyeria} />
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-20 h-20 honey-gradient rounded-full opacity-20"
                />
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-8 -left-8 w-32 h-32 beeswax-gradient rounded-full opacity-20"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Por qué elegir Palo Glow?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calidad, sostenibilidad y pasión en cada detalle.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 honey-gradient rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Productos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Descubre piezas únicas que combinan elegancia, calidad y significado. Encuentra el accesorio perfecto para cada ocasión.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link to="/shop">
                <Button size="lg" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                  Todos los productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img
                  className="w-full h-auto rounded-2xl shadow-xl"
                  alt="Beekeeper working with honeybees in natural setting"
                  src={About} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Nuestra historia
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Palo Glow es un emprendimiento que nace desde la moda, la feminidad y el deseo de elevar tus outfits con el complemento perfecto.
                    No fabricamos: curamos joyas y accesorios que se sienten actuales, combinables y cómodos —pulseras, anillos, aros y collares pensados para el día a día y para ocasiones especiales.
                    Seleccionamos piezas hipoalergénicas para que puedas expresar tu estilo con confianza.
                    Creemos en el detalle y en la atención cercana: te ayudamos a armar sets, regalar con intención y sumar ese glow que transforma cualquier look.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 honey-gradient rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      <strong>Enfoque Sustentable</strong>: Usamos materiales reciclados y empaques eco-friendly para cuidar el planeta.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 honey-gradient rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      <strong>Calidad:</strong> Cada pieza es tratada con atención al detalle y materiales de calidad.
                    </p>
                  </div>
                </div>

                <Link to="/about">
                  <Button className="honey-gradient text-white border-0 hover:opacity-90">
                    Más acerca de nosotros
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Qué opinan nuestros clientes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                La satisfacción de nuestros clientes es nuestra mayor recompensa. Aquí algunas de sus experiencias.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 honey-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Listo para brillar todos los días?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Sumate a la comunidad Palo Glow y sentí la diferencia: diseño consciente, y materiales de calidad. Envío gratis en compras desde ARS 20.000.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" variant="secondary" className="bg-white text-amber-700 hover:bg-gray-50 text-lg px-8">
                    Comprar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                    Contactanos
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}