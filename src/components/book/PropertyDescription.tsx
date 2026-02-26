import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function PropertyDescription() {
  return (
    <div className="py-8 md:py-10">
      <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">About the Estate</h2>

        <div className="font-sans text-muted-foreground leading-relaxed space-y-4 mb-8">
          <p>
            Casa Sempre Avanti is a private 5-bedroom beachfront estate in the exclusive Patzcuaro Beach community, formed by renting Villa Luisa (3BR) and Casa Pietro (2BR) together as one complete property. Set along 250 feet of secluded beachfront, the estate offers luxury, privacy, and space in a secluded oceanfront setting—just 8–10 minutes from Sayulita and a short drive to Punta de Mita.
          </p>
          <p>
            Designed for large groups, multi-family stays, retreats, and hosted gatherings, Casa Sempre Avanti offers the rare combination of togetherness and privacy, with two fully independent villas sharing one secluded beachfront estate.
          </p>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="space">
            <AccordionTrigger className="font-serif text-xl font-light">The Space</AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground leading-relaxed space-y-4">
              <p>
                Casa Sempre Avanti is a single private estate comprising two separate villas, allowing groups to stay together while maintaining space and privacy. This layout works especially well for extended families, multiple households travelling together, retreats, and groups who want shared experiences without shared bedrooms.
              </p>
              <p>
                <strong>Villa Luisa (3BR)</strong> features open, light-filled living spaces that flow seamlessly to the outdoors. The villa includes three spacious, air-conditioned bedrooms, each with ocean views and en-suite bathrooms with double sinks and walk-in showers. Outdoor amenities include a private infinity pool, multiple lounge and dining areas, a poolside tiki bar, and a pizza oven. Villa Luisa often serves as the estate's main gathering space for shared meals and group time.
              </p>
              <p>
                <strong>Casa Pietro (2BR)</strong> offers a more intimate villa experience with two elegant, air-conditioned bedrooms, each with ocean views and a private en-suite bathroom with natural stone finishes and walk-in showers. The open-concept living area opens directly to its own private infinity pool, shaded lounging areas, outdoor dining space, BBQ grill, and pizza oven. Casa Pietro provides a quieter, more private counterpart within the estate while remaining fully connected to the group.
              </p>
              <p>
                Together, both villas create a cohesive beachfront estate surrounded by tropical jungle and the Pacific Ocean, offering privacy, comfort, and flexibility for group stays.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="access">
            <AccordionTrigger className="font-serif text-xl font-light">Guest Access</AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
              <p>
                Guests booking Casa Sempre Avanti have exclusive access to the entire estate, including both villas (Villa Luisa and Casa Pietro), two private infinity pools, all outdoor living and dining areas, and direct beachfront access. No other guests are present on the property during your stay.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="neighborhood">
            <AccordionTrigger className="font-serif text-xl font-light">Neighborhood</AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground leading-relaxed">
              <p>
                Patzcuaro Beach is a secluded and unique beachfront community. Close to the popular surf town of Sayulita with its restaurants and shops, and a short drive from the resorts and golf courses of Punta de Mita, Patzcuaro offers a peaceful retreat with direct beach access and uninterrupted ocean views.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="getting-around">
            <AccordionTrigger className="font-serif text-xl font-light">Getting Around</AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground leading-relaxed space-y-2">
              <p>Casa Sempre Avanti is located at Patzcuaro Beach, approximately 5 km south of Sayulita.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>8–10 minute drive to Sayulita</li>
                <li>Short drive to Punta de Mita, La Cruz, Bucerías, and San Pancho</li>
                <li>Approximately 55 minutes from Puerto Vallarta International Airport</li>
                <li>ATV rental available for local transportation</li>
                <li>Airport transportation coordination upon request</li>
                <li>Car and golf cart rentals available in nearby towns</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes">
            <AccordionTrigger className="font-serif text-xl font-light">Other Things to Note</AccordionTrigger>
            <AccordionContent className="font-sans text-muted-foreground leading-relaxed space-y-4">
              <p>
                Casa Sempre Avanti is frequently chosen by large groups and retreat organizers who value privacy, staff support, and a layout that allows guests to gather comfortably while still having personal space. Any retreat-specific planning or services should be discussed in advance.
              </p>
              <p><strong>Your stay includes:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Housekeeping services</li>
                <li>On-site caretaker</li>
                <li>Private chef service (food not included)</li>
              </ul>
              <p><strong>Dining & chef service details:</strong></p>
              <p>
                Ricardo and Crethell prepare Mexican breakfast, lunch, and dinner upon request. Meals must be ordered in advance so preparations can be made prior to arrival. A menu will be provided. One main course is prepared per meal (no individual plating). Please request preferred meal times in advance. Staff service concludes at 5:00 PM. Meals are for registered guests only. Dietary restrictions and allergies must be shared ahead of time.
              </p>
            </AccordionContent>
          </AccordionItem>
      </Accordion>
    </div>
  );
}
