import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface InquiryNotificationProps {
  inquiryType?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  checkIn?: string
  checkOut?: string
  preferredDates?: string
  groupSize?: string
  guestCount?: string
  occasion?: string
  eventType?: string
  selectedActivities?: string[]
  message?: string
  source?: string
}

const fields = (props: InquiryNotificationProps): Array<[string, string]> => {
  const out: Array<[string, string]> = []
  const fullName = [props.firstName, props.lastName].filter(Boolean).join(' ').trim()
  if (fullName) out.push(['Name', fullName])
  if (props.email) out.push(['Email', props.email])
  if (props.phone) out.push(['Phone', props.phone])
  if (props.checkIn || props.checkOut) {
    out.push(['Dates', `${props.checkIn ?? '—'} → ${props.checkOut ?? '—'}`])
  } else if (props.preferredDates) {
    out.push(['Preferred Dates', props.preferredDates])
  }
  if (props.groupSize) out.push(['Group Size', props.groupSize])
  if (props.guestCount) out.push(['Guest Count', props.guestCount])
  if (props.occasion) out.push(['Occasion', props.occasion])
  if (props.eventType) out.push(['Event Type', props.eventType])
  if (props.selectedActivities?.length) {
    out.push(['Activities', props.selectedActivities.join(', ')])
  }
  return out
}

const InquiryNotificationEmail = (props: InquiryNotificationProps) => {
  const rows = fields(props)
  const heading = props.inquiryType
    ? `New ${props.inquiryType} Inquiry`
    : 'New Website Inquiry'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`${heading} — ${props.firstName ?? ''} ${props.lastName ?? ''}`.trim()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Text style={subtle}>
            Submitted via {props.source ?? 'villassempreavanti.com'}
          </Text>
          <Hr style={hr} />
          <Section>
            {rows.map(([label, value]) => (
              <Section key={label} style={row}>
                <Text style={labelStyle}>{label}</Text>
                <Text style={valueStyle}>{value}</Text>
              </Section>
            ))}
          </Section>
          {props.message ? (
            <>
              <Hr style={hr} />
              <Text style={labelStyle}>Message</Text>
              <Text style={messageStyle}>{props.message}</Text>
            </>
          ) : null}
          <Hr style={hr} />
          <Text style={footer}>
            Reply directly to {props.email ?? 'the guest'} to respond.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InquiryNotificationEmail,
  subject: (data: Record<string, any>) => {
    const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim()
    const type = data.inquiryType ? `${data.inquiryType} ` : ''
    return `New ${type}inquiry${name ? ` — ${name}` : ''}`
  },
  displayName: 'Inquiry notification',
  previewData: {
    inquiryType: 'Villa Stay',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '+1 555 123 4567',
    checkIn: '2026-03-15',
    checkOut: '2026-03-22',
    groupSize: '8 adults, 2 children',
    selectedActivities: ['Surfing', 'Private Chef', 'Yoga & Wellness'],
    message: 'Looking forward to celebrating an anniversary.',
    source: 'villassempreavanti.com',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Georgia, "Times New Roman", serif',
  color: '#2a2a2a',
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 400,
  color: '#1a1a1a',
  margin: '0 0 4px',
  letterSpacing: '0.5px',
}
const subtle = { fontSize: '12px', color: '#888888', margin: '0 0 16px' }
const hr = { borderColor: '#eaeaea', margin: '20px 0' }
const row = { margin: '0 0 12px' }
const labelStyle = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  color: '#999999',
  margin: '0 0 2px',
  fontFamily: 'Arial, sans-serif',
}
const valueStyle = {
  fontSize: '15px',
  color: '#1a1a1a',
  margin: '0',
  lineHeight: '1.5',
}
const messageStyle = {
  fontSize: '14px',
  color: '#2a2a2a',
  margin: '4px 0 0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}
const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '20px 0 0',
  fontStyle: 'italic',
}
