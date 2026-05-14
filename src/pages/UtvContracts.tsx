import { useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const polarisEN = `COMMERCIAL OFF-ROAD VEHICLE RENTAL AGREEMENT
(English Version – Digital Acceptance)

This Agreement governs the rental of the following vehicle:

2024 Polaris UTV
VIN: 3NSM4A573RE015189
Plates: State of Nayarit

Between:
Scott Matthew Coffrini ("Lessor")
and
The individual completing the booking ("Lessee").

1. RENTAL TERM
The rental period begins and ends as stated in the booking confirmation. Minimum rental: 2 days.

2. RENTAL RATE
$2,200 MXN per day (unlimited kilometers). Prices subject to change.
Total rental amount is reflected in the booking confirmation.
UTV must be returned with a full tank of gas.

3. CREDIT CARD AUTHORIZATION HOLD
A $2,000 USD credit card authorization hold will be placed prior to delivery of the vehicle.

This hold:
- Covers the insurance deductible
- Covers damage, fines, towing, recovery, and contract violations
- Is not a charge — no funds are withdrawn unless damages or violations occur
- May be converted into a charge if damages are identified

The hold is automatically released after 5 days, subject to the issuing bank's processing times.

If the rental period exceeds 5 days, Lessee agrees that a second $2,000 USD authorization hold may be required to maintain continuous coverage.

If damages exceed $2,000 USD, Lessee authorizes additional charges to the same credit card.

4. DRIVER IDENTIFICATION REQUIREMENT
Prior to delivery of the vehicle, Lessee must provide:
- A clear photo of a valid government-issued driver's license
- Identification matching the name on the booking
- Any additional authorized driver documentation (if applicable)

All documentation is submitted electronically.
Failure to provide valid identification may result in cancellation of the rental without refund.
Lessee confirms that all provided identification is valid and current.

5. INSURANCE
The vehicle is commercially insured.

Lessee is responsible for:
- $2,000 USD deductible per incident
- All damages resulting from:
  • Alcohol or drug use
  • Reckless operation
  • Unauthorized drivers
  • Contract violations
  • Tampering with speed limiter
  • Use outside permitted areas

Violation of this Agreement may void insurance coverage and result in full personal liability.

6. PERMITTED USE
Vehicle may be operated within Sayulita and authorized surrounding areas only.

Permitted:
- Beach driving
- Dirt trails
- Night driving

Prohibited:
- Federal highways
- Driving in ocean surf
- Water submersion above wheel hub
- Racing, jumping, or stunts
- Towing
- Commercial passenger transport
- Removal or tampering with speed limiter

Operation on beaches and off-road terrain is at Lessee's own risk and subject to local municipal regulations.

7. SAFETY REQUIREMENTS
The Polaris UTV is equipped with:
- Full roll cage
- Factory-installed seatbelts
- Speed governor

Lessee agrees:
- All occupants must remain seated while the vehicle is in motion
- Seatbelts must be worn at all times
- No standing passengers
- No operation under the influence of alcohol or drugs

Lessee acknowledges that off-road and beach driving carry increased rollover and collision risks.
Violation results in immediate termination of the rental and full financial liability.

8. MINORS
If minors are passengers:
- Legal guardian assumes full responsibility
- Guardian waives claims on behalf of the minor
- Minor must remain seated and properly restrained at all times

9. LATE RETURN
Lessee is granted a 60-minute grace period beyond the scheduled return time.
If the vehicle is returned more than 60 minutes late, an additional full rental day will be charged.
Unauthorized retention beyond the agreed return date may result in charges of 1.5 times the daily rental rate per day, plus recovery and related costs.

10. DAMAGE RESPONSIBILITY
Lessee is responsible for:
- Rollover damage
- Collision damage
- Sand ingestion or drivetrain damage
- Tire punctures and rim damage
- Mechanical damage resulting from misuse
- Theft resulting from negligence
- Recovery or towing costs

Total loss value shall be determined by commercial valuation at time of incident.

11. INDEMNIFICATION
Lessee agrees to defend, indemnify, and hold harmless the Lessor from:
- Injury or death
- Third-party claims
- Property damage
- Legal actions
- Attorney fees
arising from Lessee's operation, possession, or control of the vehicle.

12. GOVERNING LAW
This Agreement shall be governed by the laws of Mexico.
Jurisdiction: Courts of Bahía de Banderas, Nayarit, Mexico.

DIGITAL ACCEPTANCE
By completing the booking and digitally accepting this Agreement, Lessee confirms:
- They have read and understood this Agreement in full
- They authorize the $2,000 USD credit card hold
- They consent to additional charges if damages exceed the hold
- They agree to provide valid driver identification electronically
- They accept this electronic agreement as legally binding
- They acknowledge the inherent risks associated with operating a UTV
`;

const polarisES = `CONTRATO DE ARRENDAMIENTO DE VEHÍCULO TODOTERRENO COMERCIAL
(Versión en Español – Aceptación Digital)

El presente Contrato regula el arrendamiento del siguiente vehículo:

Polaris UTV 2024
VIN: 3NSM4A573RE015189
Placas: Estado de Nayarit

Entre:
Scott Matthew Coffrini ("Arrendador")
y
La persona que realiza la reservación ("Arrendatario").

1. PERÍODO DE ARRENDAMIENTO
El período de arrendamiento inicia y termina conforme a lo indicado en la confirmación de la reserva. Renta mínima: 2 días.

2. TARIFA DE ARRENDAMIENTO
$2,200 MXN por día (kilometraje ilimitado). Precios sujetos a cambio.
El monto total del arrendamiento se refleja en la confirmación de la reserva.
El UTV debe devolverse con el tanque lleno de gasolina.

3. AUTORIZACIÓN DE RETENCIÓN EN TARJETA DE CRÉDITO
Se realizará una retención de autorización por $2,000 USD en la tarjeta de crédito antes de la entrega del vehículo.

Dicha retención:
- Cubre el deducible del seguro
- Cubre daños, multas, remolque, recuperación y violaciones al contrato
- No es un cargo — no se retiran fondos salvo que existan daños o incumplimientos
- Puede convertirse en cargo si se detectan daños

La retención se libera automáticamente después de 5 días, sujeto a los tiempos de procesamiento del banco emisor.

Si el período de arrendamiento excede los 5 días, el Arrendatario acepta que podrá requerirse una segunda retención de $2,000 USD para mantener la cobertura continua.

Si los daños exceden los $2,000 USD, el Arrendatario autoriza cargos adicionales a la misma tarjeta.

4. REQUISITO DE IDENTIFICACIÓN DEL CONDUCTOR
Antes de la entrega del vehículo, el Arrendatario deberá proporcionar:
- Fotografía clara de una licencia de conducir vigente
- Identificación que coincida con el nombre de la reserva
- Documentación de cualquier conductor adicional autorizado

Toda la documentación se entrega electrónicamente.
La falta de identificación válida podrá resultar en la cancelación del arrendamiento sin reembolso.
El Arrendatario confirma que la documentación proporcionada es válida y vigente.

5. SEGURO
El vehículo cuenta con seguro comercial.

El Arrendatario es responsable de:
- Deducible de $2,000 USD por incidente
- Todos los daños derivados de:
  • Consumo de alcohol o drogas
  • Conducción imprudente
  • Conductores no autorizados
  • Violaciones al contrato
  • Manipulación del limitador de velocidad
  • Uso fuera de las zonas permitidas

La violación de este Contrato podrá invalidar la cobertura del seguro y generar responsabilidad personal total.

6. USO PERMITIDO
El vehículo podrá operarse únicamente dentro de Sayulita y zonas autorizadas cercanas.

Permitido:
- Conducción en playa
- Caminos de terracería
- Conducción nocturna

Prohibido:
- Carreteras federales
- Conducir dentro del oleaje del mar
- Inmersión en agua por encima del centro de la rueda
- Carreras, saltos o maniobras acrobáticas
- Remolque
- Transporte comercial de pasajeros
- Retirar o manipular el limitador de velocidad

La operación en playas y terrenos irregulares es bajo responsabilidad del Arrendatario y sujeta a regulaciones municipales vigentes.

7. REQUISITOS DE SEGURIDAD
El Polaris UTV está equipado con:
- Jaula antivuelco
- Cinturones de seguridad instalados de fábrica
- Limitador de velocidad

El Arrendatario acepta que:
- Todos los ocupantes deben permanecer sentados mientras el vehículo esté en movimiento
- Los cinturones deben usarse en todo momento
- No se permiten pasajeros de pie
- Está prohibido conducir bajo la influencia de alcohol o drogas

El incumplimiento dará lugar a la terminación inmediata del arrendamiento y responsabilidad financiera total.

8. MENORES DE EDAD
Si hay menores como pasajeros:
- El tutor legal asume responsabilidad total
- El tutor renuncia a reclamaciones en nombre del menor
- El menor debe permanecer sentado y correctamente sujeto en todo momento

9. DEVOLUCIÓN TARDÍA
El Arrendatario dispone de un período de gracia de 60 minutos posteriores al horario acordado.
Si el vehículo se devuelve con más de 60 minutos de retraso, se cobrará un día adicional completo.
La retención no autorizada del vehículo podrá generar cargos equivalentes a 1.5 veces la tarifa diaria por día, más costos de recuperación relacionados.

10. RESPONSABILIDAD POR DAÑOS
El Arrendatario es responsable de:
- Daños por volcadura
- Daños por colisión
- Ingreso de arena o daño al tren motriz
- Ponchaduras y daño en rines
- Daños mecánicos derivados de uso indebido
- Robo por negligencia
- Costos de remolque o recuperación

El valor de pérdida total se determinará conforme a valuación comercial al momento del incidente.

11. INDEMNIZACIÓN
El Arrendatario acepta defender, indemnizar y mantener en paz y a salvo al Arrendador frente a:
- Lesiones o fallecimiento
- Reclamaciones de terceros
- Daños a propiedad
- Acciones legales
- Honorarios legales
derivados de la operación, posesión o control del vehículo por parte del Arrendatario.

12. LEY APLICABLE
Este Contrato se rige por las leyes de México.
Jurisdicción: Tribunales de Bahía de Banderas, Nayarit, México.

ACEPTACIÓN DIGITAL
Al completar la reserva y aceptar digitalmente este Contrato, el Arrendatario confirma que:
- Ha leído y comprendido el Contrato en su totalidad
- Autoriza la retención de $2,000 USD
- Autoriza cargos adicionales si los daños exceden dicha retención
- Acepta proporcionar identificación válida electrónicamente
- Reconoce este acuerdo electrónico como legalmente vinculante
- Reconoce los riesgos inherentes a la operación de un vehículo UTV
`;

const canamEN = `COMMERCIAL OFF-ROAD VEHICLE RENTAL AGREEMENT
(English Version – Digital Acceptance)

This Agreement governs the rental of the following vehicle:

2025 Can-Am UTV
VIN: 3JBUBAJ47SK001423
Plates: State of Nayarit

Between:
Scott Matthew Coffrini ("Lessor")
and
The individual completing the booking ("Lessee").

1. RENTAL TERM
The rental period begins and ends as stated in the booking confirmation. Minimum rental: 2 days.

2. RENTAL RATE
$2,500 MXN per day (unlimited kilometers). Prices subject to change.
The total rental amount is reflected in the booking confirmation.
UTV must be returned with a full tank of gas.

3. CREDIT CARD AUTHORIZATION HOLD
A $2,000 USD credit card authorization hold will be placed prior to delivery of the vehicle.

This hold:
- Covers the insurance deductible
- Covers damage, fines, towing, recovery, and contract violations
- Is not a charge — no funds are withdrawn unless damages or violations occur
- May be converted into a charge if damages are identified

The hold is automatically released after 5 days, subject to the issuing bank's processing times.

If the rental period exceeds 5 days, Lessee agrees that a second $2,000 USD authorization hold may be required to maintain continuous coverage.

If damages exceed $2,000 USD, Lessee authorizes additional charges to the same credit card.

4. DRIVER IDENTIFICATION REQUIREMENT
Prior to delivery of the vehicle, Lessee must provide:
- A clear photo of a valid government-issued driver's license
- Identification matching the name on the booking
- Any additional authorized driver documentation (if applicable)

All documentation is submitted electronically.
Failure to provide valid identification may result in cancellation of the rental without refund.
Lessee confirms that all provided identification is valid and current.

5. INSURANCE
The vehicle is commercially insured.

Lessee is responsible for:
- $2,000 USD deductible per incident
- All damages resulting from:
  • Alcohol or drug use
  • Reckless operation
  • Unauthorized drivers
  • Contract violations
  • Tampering with speed limiter
  • Use outside permitted areas

Violation of this Agreement may void insurance coverage and result in full personal liability.

6. PERMITTED USE
Vehicle may be operated within Sayulita and authorized surrounding areas only.

Permitted:
- Beach driving
- Dirt trails
- Night driving

Prohibited:
- Federal highways
- Driving in ocean surf
- Water submersion above wheel hub
- Racing, jumping, or stunts
- Towing
- Commercial passenger transport
- Removal or tampering with speed limiter

Operation on beaches and off-road terrain is at Lessee's own risk and subject to local municipal regulations.

7. SAFETY REQUIREMENTS
The Can-Am UTV is equipped with:
- Full roll cage
- Factory-installed seatbelts
- Speed governor

Lessee agrees:
- All occupants must remain seated while the vehicle is in motion
- Seatbelts must be worn at all times
- No standing passengers
- No operation under the influence of alcohol or drugs

Violation results in immediate termination of the rental and full financial liability.

8. MINORS
If minors are passengers:
- Legal guardian assumes full responsibility
- Guardian waives claims on behalf of the minor
- Minor must remain seated and properly restrained at all times

9. LATE RETURN
Lessee is granted a 60-minute grace period beyond the scheduled return time.
If the vehicle is returned more than 60 minutes late, an additional full rental day will be charged.
Unauthorized retention beyond the agreed return date may result in charges of 1.5 times the daily rental rate per day, plus recovery and related costs.

10. DAMAGE RESPONSIBILITY
Lessee is responsible for:
- Rollover damage
- Collision damage
- Sand ingestion or drivetrain damage
- Tire punctures and rim damage
- Mechanical damage resulting from misuse
- Theft resulting from negligence
- Recovery or towing costs

Total loss value shall be determined by commercial valuation at time of incident.

11. INDEMNIFICATION
Lessee agrees to defend, indemnify, and hold harmless the Lessor from:
- Injury or death
- Third-party claims
- Property damage
- Legal actions
- Attorney fees
arising from Lessee's operation, possession, or control of the vehicle.

12. GOVERNING LAW
This Agreement shall be governed by the laws of Mexico.
Jurisdiction: Courts of Bahía de Banderas, Nayarit, Mexico.
`;

const canamES = `CONTRATO DE ARRENDAMIENTO DE VEHÍCULO TODOTERRENO COMERCIAL
(Versión en Español – Aceptación Digital)

El presente Contrato regula el arrendamiento del siguiente vehículo:

Can-Am UTV 2025
Número de serie (VIN): 3JBUBAJ47SK001423
Placas: Estado de Nayarit

Entre:
Scott Matthew Coffrini ("Arrendador")
y
La persona que realiza la reservación ("Arrendatario").

1. PERÍODO DE ARRENDAMIENTO
El período de arrendamiento inicia y termina conforme a lo indicado en la confirmación de la reserva. Renta mínima: 2 días.

2. TARIFA DE ARRENDAMIENTO
$2,500 MXN por día (kilometraje ilimitado). Precios sujetos a cambio.
El monto total del arrendamiento se refleja en la confirmación de la reserva.
El UTV debe devolverse con el tanque lleno de gasolina.

3. AUTORIZACIÓN DE RETENCIÓN EN TARJETA DE CRÉDITO
Se realizará una retención de autorización por $2,000 USD en la tarjeta de crédito antes de la entrega del vehículo.

Dicha retención:
- Cubre el deducible del seguro
- Cubre daños, multas, remolque, recuperación y violaciones al contrato
- No es un cargo — no se retiran fondos salvo que existan daños o incumplimientos
- Puede convertirse en cargo si se detectan daños

La retención se libera automáticamente después de 5 días, sujeto a los tiempos de procesamiento del banco emisor.

Si el período de arrendamiento excede los 5 días, el Arrendatario acepta que podrá requerirse una segunda retención de $2,000 USD para mantener la cobertura continua.

Si los daños exceden los $2,000 USD, el Arrendatario autoriza cargos adicionales a la misma tarjeta.

4. REQUISITO DE IDENTIFICACIÓN DEL CONDUCTOR
Antes de la entrega del vehículo, el Arrendatario deberá proporcionar:
- Fotografía clara de una licencia de conducir vigente
- Identificación que coincida con el nombre de la reserva
- Documentación de cualquier conductor adicional autorizado

Toda la documentación se entrega electrónicamente.
La falta de identificación válida podrá resultar en la cancelación del arrendamiento sin reembolso.
El Arrendatario confirma que la documentación proporcionada es válida y vigente.

5. SEGURO
El vehículo cuenta con seguro comercial.

El Arrendatario es responsable de:
- Deducible de $2,000 USD por incidente
- Todos los daños derivados de:
  • Consumo de alcohol o drogas
  • Conducción imprudente
  • Conductores no autorizados
  • Violaciones al contrato
  • Manipulación del limitador de velocidad
  • Uso fuera de las zonas permitidas

La violación de este Contrato podrá invalidar la cobertura del seguro y generar responsabilidad personal total.

6. USO PERMITIDO
El vehículo podrá operarse únicamente dentro de Sayulita y zonas autorizadas cercanas.

Permitido:
- Conducción en playa
- Caminos de terracería
- Conducción nocturna

Prohibido:
- Carreteras federales
- Conducir dentro del oleaje del mar
- Inmersión en agua por encima del centro de la rueda
- Carreras, saltos o maniobras acrobáticas
- Remolque
- Transporte comercial de pasajeros
- Retirar o manipular el limitador de velocidad

La operación en playas y terrenos irregulares es bajo responsabilidad del Arrendatario y sujeta a regulaciones municipales vigentes.

7. REQUISITOS DE SEGURIDAD
El Can-Am UTV está equipado con:
- Jaula antivuelco
- Cinturones de seguridad instalados de fábrica
- Limitador de velocidad

El Arrendatario acepta que:
- Todos los ocupantes deben permanecer sentados mientras el vehículo esté en movimiento
- Los cinturones deben usarse en todo momento
- No se permiten pasajeros de pie
- Está prohibido conducir bajo la influencia de alcohol o drogas

El incumplimiento dará lugar a la terminación inmediata del arrendamiento y responsabilidad financiera total.

8. MENORES DE EDAD
Si hay menores como pasajeros:
- El tutor legal asume responsabilidad total
- El tutor renuncia a reclamaciones en nombre del menor
- El menor debe permanecer sentado y correctamente sujeto en todo momento

9. DEVOLUCIÓN TARDÍA
El Arrendatario dispone de un período de gracia de 60 minutos posteriores al horario acordado.
Si el vehículo se devuelve con más de 60 minutos de retraso, se cobrará un día adicional completo.
La retención no autorizada del vehículo podrá generar cargos equivalentes a 1.5 veces la tarifa diaria por día, más costos de recuperación relacionados.

10. RESPONSABILIDAD POR DAÑOS
El Arrendatario es responsable de:
- Daños por volcadura
- Daños por colisión
- Ingreso de arena o daño al tren motriz
- Ponchaduras y daño en rines
- Daños mecánicos derivados de uso indebido
- Robo por negligencia
- Costos de remolque o recuperación

El valor de pérdida total se determinará conforme a valuación comercial al momento del incidente.

11. INDEMNIZACIÓN
El Arrendatario acepta defender, indemnizar y mantener en paz y a salvo al Arrendador frente a:
- Lesiones o fallecimiento
- Reclamaciones de terceros
- Daños a propiedad
- Acciones legales
- Honorarios legales
derivados de la operación, posesión o control del vehículo por parte del Arrendatario.

12. LEY APLICABLE
Este Contrato se rige por las leyes de México.
Jurisdicción: Tribunales de Bahía de Banderas, Nayarit, México.
`;

const contracts = [
  { id: "canam-en", label: "Can-Am · English", text: canamEN, vehicle: "Can-Am UTV 2025", price: "$2,500 MXN / day" },
  { id: "canam-es", label: "Can-Am · Español", text: canamES, vehicle: "Can-Am UTV 2025", price: "$2,500 MXN / día" },
  { id: "polaris-en", label: "Polaris · English", text: polarisEN, vehicle: "Polaris UTV 2024", price: "$2,200 MXN / day" },
  { id: "polaris-es", label: "Polaris · Español", text: polarisES, vehicle: "Polaris UTV 2024", price: "$2,200 MXN / día" },
];

function ContractBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectAll = () => {
    if (!ref.current) return;
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-3">
        <Button onClick={copy} size="sm" variant="default" className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy contract"}
        </Button>
        <Button onClick={selectAll} size="sm" variant="outline">
          Select all
        </Button>
      </div>
      <pre
        ref={ref}
        className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-card border border-border rounded-lg p-6 max-h-[70vh] overflow-y-auto text-foreground"
      >
        {text}
      </pre>
    </div>
  );
}

export default function UtvContracts() {
  return (
    <Layout>
      <SEO
        title="UTV Rental Contracts — Internal"
        description="Internal page for UTV rental contracts."
        path="/utv-contracts"
        noindex
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="mb-10">
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-accent mb-3">Internal · Unlisted</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">UTV Rental Contracts</h1>
            <p className="text-sm font-sans text-muted-foreground max-w-2xl">
              Copy-and-paste templates for the Can-Am and Polaris UTV rental agreements (English & Spanish).
              Signature placeholders intentionally omitted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Can-Am UTV 2025</p>
              <p className="font-serif text-2xl">$2,500 MXN <span className="text-sm font-sans text-muted-foreground">/ day</span></p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Polaris UTV 2024</p>
              <p className="font-serif text-2xl">$2,200 MXN <span className="text-sm font-sans text-muted-foreground">/ day</span></p>
            </div>
          </div>
          <p className="text-xs font-sans text-muted-foreground mb-10 italic">
            2-day minimum rental · Prices subject to change
          </p>

          <Tabs defaultValue="canam-en" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto mb-6">
              {contracts.map((c) => (
                <TabsTrigger key={c.id} value={c.id} className="text-xs md:text-sm">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {contracts.map((c) => (
              <TabsContent key={c.id} value={c.id}>
                <ContractBlock text={c.text} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
