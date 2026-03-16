import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Award, Truck, Heart, Star, Sparkles,
  Gem, ShoppingBag, ArrowRight, Instagram, MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import NosotrosJoyas from '@/assets/NosotrosJoyas.png'
import Joyas from '@/assets/Joyas.png'
import Brillo from '@/assets/Brillo.png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
})

const values = [
  {
    icon: Shield,
    title: 'Hipoalergénico 316L',
    text: 'Usamos exclusivamente acero quirúrgico 316L, el mismo estándar de la industria médica. Libre de níquel y metales irritantes: apto para la piel más sensible.'
  },
  {
    icon: Sparkles,
    title: 'Pulido Espejo',
    text: 'Cada pieza pasa por un proceso de pulido espejo que garantiza un brillo profundo y duradero, resistente al agua, al sudor y al paso del tiempo.'
  },
  {
    icon: Gem,
    title: 'Detalle & Precisión',
    text: 'Apliques de cristal y strass seleccionados a mano. Cierres seguros, engastes perfectos y un acabado que se nota en cada centímetro.'
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    text: 'Te asesoramos por WhatsApp para elegir tallas, combinar piezas y armar el look perfecto. No sos un número: sos parte de la comunidad PaloGlow.'
  },
  {
    icon: Truck,
    title: 'Envíos a Todo el País',
    text: 'Despachamos a toda Argentina con seguimiento en tiempo real. Envío gratis desde $20.000 y cambios simples si algo no es tu talla.'
  },
  {
    icon: Award,
    title: 'Calidad Garantizada',
    text: 'Si tu producto presenta algún defecto de fabricación, lo resolvemos. Calidad sin letra chica y sin vueltas.'
  }
]

const categories = [
  { emoji: '📿', name: 'Collares', desc: 'Desde minimalistas hasta statement. En acero 316L con acabado espejo.' },
  { emoji: '💍', name: 'Anillos', desc: 'Ajustables o en talle fijo, con y sin piedras de strass.' },
  { emoji: '✨', name: 'Esclavas & Pulseras', desc: 'Para apilar o usar solas. Brillo que no se va.' },
  { emoji: '👂', name: 'Aros', desc: 'Argollas, trepadores y pendientes para cada estilo.' },
  { emoji: '👜', name: 'Carteras & Bolsos', desc: 'Eco-cuero resistente, diseños modernos para el día a día.' },
  { emoji: '📱', name: 'Accesorios Eco-cuero', desc: 'Riñoneras, porta celulares y mochilas con terminación premium.' }
]

const testimonials = [
  { name: 'Lucía P.', location: 'José Mármol, BA', text: 'La pulsera no perdió color y combina con todo. Amé el empaque reutilizable.', rating: 5 },
  { name: 'Martina G.', location: 'Lanús, BA', text: 'El anillo ajustable es hipoalergénico y súper cómodo. Detalle fino, cero níquel.', rating: 5 },
  { name: 'Sofía L.', location: 'CABA', text: 'Nada me dio alergia. Excelente calidad. 100% recomendable.', rating: 5 }
]

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Nosotros | Palo Glow</title>
        <meta
          name="description"
          content="Conocé la historia de Palo Glow: joyas hipoalergénicas en acero quirúrgico 316L y accesorios premium en eco-cuero. Calidad real, brillo duradero, atención personalizada."
        />
        <link rel="canonical" href="https://paloglow.shop/about" />
      </Helmet>

      <div className="min-h-screen bg-white">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden hero-pattern bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeUp()} className="space-y-6">
                <span className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium">
                  ✨ Nuestra historia
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Más que joyas,<br />
                  <span className="text-amber-500">una forma de brillar.</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Palo Glow nació de la convicción de que cada persona merece accesorios que duren, que luzcan y que no lastime su piel. Somos una marca argentina que combina diseño actual con materiales de primera calidad.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link to="/shop">
                    <Button size="lg" className="honey-gradient text-white border-0 hover:opacity-90">
                      Ver colección <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/5491112345678"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                      <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-amber-200/30 rounded-3xl blur-2xl" />
                <img
                  src={NosotrosJoyas}
                  alt="Equipo PaloGlow"
                  className="relative z-10 w-full rounded-2xl shadow-2xl object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-amber-500 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Clientes felices' },
                { value: '4.9★', label: 'Puntuación promedio' },
                { value: '100%', label: 'Acero quirúrgico 316L' },
                { value: '∞', label: 'Brillo garantizado' }
              ].map((stat, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)}>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-amber-100 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUIÉNES SOMOS ── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={Joyas}
                  alt="Joyas PaloGlow"
                  className="w-full rounded-2xl shadow-xl object-cover"
                />
              </motion.div>
              <motion.div {...fadeUp(0.1)} className="space-y-6">
                <span className="inline-block px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-sm font-semibold">
                  Quiénes somos
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Una marca argentina con identidad propia
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Somos un pequeño equipo con grandes sueños: hacer que la moda accesible no resigné calidad. Cada producto que elegís de PaloGlow fue pensado, diseñado y validado para que dure, luzca y te haga sentir bien.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Nacimos en Buenos Aires y hoy llegamos a todo el país. Creemos en el trato cercano, la transparencia y en construir una comunidad de personas que aman brillar con autenticidad.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href="https://www.instagram.com/paloglow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    @paloglow
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── POR QUÉ LO HACEMOS ── */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeUp()} className="max-w-3xl mx-auto space-y-6 mb-16">
              <span className="inline-block px-3 py-1 bg-amber-200 rounded-full text-amber-800 text-sm font-semibold">
                Por qué lo hacemos
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Porque la calidad no debería ser un lujo
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Cansadas de ver accesorios que se oxidan, manchan o provocan alergias a los pocos días, decidimos cambiar la historia. Nuestro propósito es simple: que cada persona pueda usar joyas y accesorios que realmente duren —sin pagar precios de joyería de alta gama.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Trabajamos solo con acero quirúrgico 316L y eco-cuero de calidad porque nos importa lo que ponés en tu piel y lo que le dejás al planeta.
              </p>
            </motion.div>

            <div className="relative">
              <div className="absolute -inset-4 bg-amber-300/20 rounded-3xl blur-2xl" />
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                src={Brillo}
                alt="Brillo PaloGlow"
                className="relative z-10 w-full max-w-2xl mx-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── NUESTROS VALORES ── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-sm font-semibold mb-4">
                Nuestros valores
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Lo que nos define
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.08)}
                  className="bg-gray-50 rounded-2xl p-6 border border-amber-100 hover:border-amber-300 transition-colors group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <val.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{val.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTOS & CATEGORÍAS ── */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block px-3 py-1 bg-amber-200 rounded-full text-amber-800 text-sm font-semibold mb-4">
                Qué vendemos
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Dos mundos, una sola marca
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Combinamos el universo de la joyería en acero con el mundo de los accesorios premium en eco-cuero. Cada categoría tiene su propia identidad y el mismo estándar de calidad.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.08)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-amber-200 hover:shadow-md transition-all"
                >
                  <span className="text-4xl mb-4 block">{cat.emoji}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm">{cat.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.div {...fadeUp(0.3)} className="text-center mt-12">
              <Link to="/shop">
                <Button size="lg" className="honey-gradient text-white border-0 hover:opacity-90">
                  Explorar toda la colección <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── EXPERIENCIA ÚNICA ── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-8 lg:p-16 text-center text-white">
              <motion.div {...fadeUp()} className="max-w-3xl mx-auto space-y-6">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">
                  Una experiencia única
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  No vendemos accesorios. Creamos momentos.
                </h2>
                <p className="text-amber-100 text-lg leading-relaxed">
                  Desde el momento en que elegís tu pieza hasta que la abrís en casa, cada detalle importa: empaque cuidado, atención personalizada y un producto que te va a sorprender. Eso es PaloGlow.
                </p>
                <div className="grid sm:grid-cols-3 gap-6 pt-4">
                  {[
                    { icon: ShoppingBag, label: 'Empaque premium reutilizable' },
                    { icon: MessageCircle, label: 'Asesoría por WhatsApp' },
                    { icon: Star, label: 'Experiencia 5 estrellas' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm text-amber-100">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-sm font-semibold mb-4">
                Lo que dicen nuestras clientas
              </span>
              <h2 className="text-3xl font-bold text-gray-900">Voces reales</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100"
                >
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.location}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-20 bg-white border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeUp()} className="space-y-6 max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900">¿Listo/a para brillar?</h2>
              <p className="text-gray-600">
                Encontrá tu pieza perfecta en nuestra tienda o escribinos por WhatsApp y te ayudamos a elegir.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" className="honey-gradient text-white border-0 hover:opacity-90">
                    Ir a la tienda <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    <MessageCircle className="mr-2 h-4 w-4" /> Escribinos
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}
