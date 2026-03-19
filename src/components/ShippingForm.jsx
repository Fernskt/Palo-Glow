import { useState } from 'react'
import { Package, MapPin, User, Phone, Mail, Loader2, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { quotarEnvio, crearEnvio, getLabelUrl } from '@/services/correoArgentino'

// CP de la tienda (remitente) — ajustá según tu dirección real
const TIENDA = {
  nombre: 'Palo Glow',
  calle: 'Tu Calle',
  numero: '123',
  codigoPostal: '1000',    // ← CP de tu tienda
  localidad: 'Buenos Aires',
  provincia: 'B',           // Código ISO de provincia (B = Buenos Aires)
}

const BULTO_DEFAULT = { altoCm: 10, anchoCm: 15, largoCm: 20, pesoKg: 0.5 }

const PROVINCIAS = [
  { code: 'B', name: 'Buenos Aires' },
  { code: 'C', name: 'CABA' },
  { code: 'K', name: 'Catamarca' },
  { code: 'H', name: 'Chaco' },
  { code: 'U', name: 'Chubut' },
  { code: 'X', name: 'Córdoba' },
  { code: 'W', name: 'Corrientes' },
  { code: 'E', name: 'Entre Ríos' },
  { code: 'P', name: 'Formosa' },
  { code: 'Y', name: 'Jujuy' },
  { code: 'L', name: 'La Pampa' },
  { code: 'F', name: 'La Rioja' },
  { code: 'M', name: 'Mendoza' },
  { code: 'N', name: 'Misiones' },
  { code: 'Q', name: 'Neuquén' },
  { code: 'R', name: 'Río Negro' },
  { code: 'A', name: 'Salta' },
  { code: 'J', name: 'San Juan' },
  { code: 'D', name: 'San Luis' },
  { code: 'Z', name: 'Santa Cruz' },
  { code: 'S', name: 'Santa Fe' },
  { code: 'G', name: 'Santiago del Estero' },
  { code: 'V', name: 'Tierra del Fuego' },
  { code: 'T', name: 'Tucumán' },
]

/**
 * ShippingForm
 *
 * Props:
 *   cartItems   — items del carrito
 *   subtotal    — número
 *   onShipmentCreated(result) — callback cuando el envío fue creado exitosamente
 *   onSkip()    — callback para saltear el envío e ir directo a WhatsApp
 */
export function ShippingForm({ cartItems, subtotal, onShipmentCreated, onSkip }) {
  const [step, setStep] = useState('form') // 'form' | 'quoting' | 'quoted' | 'creating' | 'done' | 'error'
  const [quote, setQuote] = useState(null)
  const [shipment, setShipment] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    piso: '',
    codigoPostal: '',
    localidad: '',
    provincia: 'B',
    modalidad: 'ESTANDAR',
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleQuote = async (e) => {
    e.preventDefault()
    setStep('quoting')
    setErrorMsg('')
    try {
      const result = await quotarEnvio({
        codigoPostalOrigen: TIENDA.codigoPostal,
        codigoPostalDestino: form.codigoPostal,
        ...BULTO_DEFAULT,
        modalidad: form.modalidad,
      })
      setQuote(result)
      setStep('quoted')
    } catch (err) {
      setErrorMsg(err.message)
      setStep('error')
    }
  }

  const handleCreate = async () => {
    setStep('creating')
    setErrorMsg('')
    try {
      const result = await crearEnvio({
        remitente: {
          nombre: TIENDA.nombre,
          calle: TIENDA.calle,
          numero: TIENDA.numero,
          codigoPostal: TIENDA.codigoPostal,
          localidad: TIENDA.localidad,
          provincia: TIENDA.provincia,
        },
        destinatario: {
          nombre: `${form.nombre} ${form.apellido}`.trim(),
          email: form.email,
          telefono: form.telefono,
          calle: form.calle,
          numero: form.numero,
          piso: form.piso || undefined,
          codigoPostal: form.codigoPostal,
          localidad: form.localidad,
          provincia: form.provincia,
        },
        bultos: [BULTO_DEFAULT],
        modalidad: form.modalidad,
      })
      setShipment(result)
      setStep('done')
      onShipmentCreated?.({
        ...result,
        costoEnvio: quote?.precio ?? 0,
        destinatario: form,
      })
    } catch (err) {
      setErrorMsg(err.message)
      setStep('error')
    }
  }

  // ── DONE ────────────────────────────────────────────────────────────────────
  if (step === 'done' && shipment) {
    const labelUrl = getLabelUrl(shipment.numeroEnvio ?? shipment.id)
    return (
      <div className="space-y-4 text-center">
        <CheckCircle className="mx-auto text-green-500 w-12 h-12" />
        <h3 className="font-semibold text-lg">¡Envío generado!</h3>
        <p className="text-sm text-gray-600">
          Número de seguimiento:<br />
          <span className="font-mono font-bold text-gray-900 text-base">
            {shipment.codigoSeguimiento ?? shipment.numeroEnvio ?? shipment.id}
          </span>
        </p>
        <a
          href={labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-amber-700 underline"
        >
          <ExternalLink className="w-4 h-4" />
          Descargar etiqueta PDF
        </a>
      </div>
    )
  }

  // ── ERROR ────────────────────────────────────────────────────────────────────
  if (step === 'error') {
    return (
      <div className="space-y-3 text-center">
        <p className="text-red-600 text-sm">{errorMsg}</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => setStep('form')}>Reintentar</Button>
          <Button variant="ghost" size="sm" onClick={onSkip}>Omitir envío por Correo</Button>
        </div>
      </div>
    )
  }

  // ── QUOTED ────────────────────────────────────────────────────────────────────
  if (step === 'quoted' && quote) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 font-medium">Cotización de envío</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            ${Number(quote.precio ?? quote.cost ?? 0).toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Modalidad {form.modalidad} · Plazo estimado: {quote.plazo ?? quote.days ?? '3-5'} días hábiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1 honey-gradient text-white border-0"
            onClick={handleCreate}
            disabled={step === 'creating'}
          >
            {step === 'creating'
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando envío…</>
              : 'Confirmar y generar envío'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStep('form')}>Editar</Button>
        </div>
        <button onClick={onSkip} className="w-full text-xs text-gray-500 underline">
          Omitir y coordinar envío por WhatsApp
        </button>
      </div>
    )
  }

  // ── FORM ────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleQuote} className="space-y-4">
      <p className="text-sm text-gray-600">
        Ingresá los datos de entrega para cotizar el envío por Correo Argentino.
      </p>

      {/* Nombre y apellido */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Nombre *</label>
          <div className="relative">
            <User className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input name="nombre" value={form.nombre} onChange={onChange} required
              className="w-full border rounded pl-8 pr-3 py-2 text-sm" placeholder="María" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Apellido *</label>
          <input name="apellido" value={form.apellido} onChange={onChange} required
            className="w-full border rounded px-3 py-2 text-sm" placeholder="González" />
        </div>
      </div>

      {/* Email y Teléfono */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Email *</label>
          <div className="relative">
            <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input name="email" value={form.email} onChange={onChange} required type="email"
              className="w-full border rounded pl-8 pr-3 py-2 text-sm" placeholder="mail@ejemplo.com" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Teléfono *</label>
          <div className="relative">
            <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input name="telefono" value={form.telefono} onChange={onChange} required
              className="w-full border rounded pl-8 pr-3 py-2 text-sm" placeholder="1112345678" />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Dirección *</label>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 relative">
            <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input name="calle" value={form.calle} onChange={onChange} required
              className="w-full border rounded pl-8 pr-3 py-2 text-sm" placeholder="Calle" />
          </div>
          <input name="numero" value={form.numero} onChange={onChange} required
            className="w-full border rounded px-3 py-2 text-sm" placeholder="Nro." />
        </div>
        <input name="piso" value={form.piso} onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm mt-2" placeholder="Piso / Depto (opcional)" />
      </div>

      {/* CP, Localidad, Provincia */}
      <div className="grid grid-cols-3 gap-2">
        <input name="codigoPostal" value={form.codigoPostal} onChange={onChange} required
          className="w-full border rounded px-3 py-2 text-sm" placeholder="Cód. Postal" maxLength={8} />
        <input name="localidad" value={form.localidad} onChange={onChange} required
          className="col-span-1 w-full border rounded px-3 py-2 text-sm" placeholder="Localidad" />
        <select name="provincia" value={form.provincia} onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm">
          {PROVINCIAS.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>
      </div>

      {/* Modalidad */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Modalidad de envío</label>
        <select name="modalidad" value={form.modalidad} onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm">
          <option value="ESTANDAR">Estándar</option>
          <option value="EXPRES">Express</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1 honey-gradient text-white border-0" disabled={step === 'quoting'}>
          {step === 'quoting'
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Cotizando…</>
            : <><Package className="w-4 h-4 mr-2" />Cotizar envío</>}
        </Button>
      </div>

      <button type="button" onClick={onSkip} className="w-full text-xs text-gray-500 underline">
        Omitir y coordinar envío por WhatsApp
      </button>
    </form>
  )
}
