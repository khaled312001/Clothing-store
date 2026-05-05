// Real brand SVG icons for payment methods.
// Each icon is wrapped in a 40×26 viewBox for consistent sizing in checkout.

export function VisaIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#1A1F71"/>
      <path d="M16.4 17.4l1.5-8.8h2.4l-1.5 8.8h-2.4zm10.8-8.6c-.5-.2-1.3-.4-2.2-.4-2.4 0-4.1 1.3-4.1 3.1 0 1.4 1.2 2.1 2.2 2.6.9.5 1.3.8 1.3 1.2 0 .6-.8.9-1.5.9-1 0-1.6-.2-2.4-.5l-.3-.2-.4 2.1c.6.3 1.7.5 2.8.5 2.6 0 4.2-1.3 4.2-3.2 0-1.1-.6-1.9-2.1-2.6-.9-.4-1.5-.7-1.5-1.2 0-.4.5-.8 1.4-.8.8 0 1.4.2 1.9.4l.2.1.5-2zm6.2-.2h-1.9c-.6 0-1 .2-1.3.8l-3.6 8h2.6s.4-1.2.5-1.4h3.2c.1.3.3 1.4.3 1.4h2.3l-2.1-8.8zm-3 5.6c.2-.5 1-2.6 1-2.6 0 .1.2-.5.3-.9l.2.8s.5 2.2.6 2.7h-2.1zm-12-5.6l-2.4 6-.2-1.3c-.4-1.5-1.7-3.1-3.2-3.9l2.2 8h2.6l3.9-8.8h-2.9z" fill="#fff"/>
      <path d="M9.4 8.6H5.5l0 .2c3 .8 5.1 2.6 6 4.8L10.5 9.5c-.2-.6-.6-.9-1.1-.9z" fill="#F7B600"/>
    </svg>
  );
}

export function MastercardIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#fff" stroke="#e5e7eb"/>
      <circle cx="16" cy="13" r="6.5" fill="#EB001B"/>
      <circle cx="24" cy="13" r="6.5" fill="#F79E1B"/>
      <path d="M20 8.2c1.5 1.2 2.5 3 2.5 4.8s-1 3.6-2.5 4.8c-1.5-1.2-2.5-3-2.5-4.8s1-3.6 2.5-4.8z" fill="#FF5F00"/>
    </svg>
  );
}

export function MeezaIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#0E6F3F"/>
      <text x="20" y="17" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="10" fontWeight="800" fill="#fff" letterSpacing="1">MEEZA</text>
    </svg>
  );
}

export function FawryIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#FDB913"/>
      <text x="20" y="17" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="9" fontWeight="900" fill="#003D7A" letterSpacing="0.3">fawry</text>
    </svg>
  );
}

export function PaymobIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#7C3AED"/>
      <text x="20" y="17" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="9" fontWeight="800" fill="#fff" letterSpacing="0.2">paymob</text>
    </svg>
  );
}

export function VodafoneCashIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#E60000"/>
      <circle cx="11" cy="13" r="5" fill="none" stroke="#fff" strokeWidth="1.6"/>
      <path d="M9 11.5c.5-.6 1.4-.9 2.2-.6.4.1.6.4.6.7 0 .5-.5.8-1.2.6-.6-.2-1 .1-1 .6 0 .6.7 1.1 1.5.9.6-.1 1-.5 1.1-1l1.4.3c-.2 1.1-1 1.9-2.2 2.1-1.5.3-2.9-.5-3-1.9-.1-.7.2-1.3.6-1.7z" fill="#E60000"/>
      <text x="25" y="11" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="6" fontWeight="700" fill="#fff" letterSpacing="0.3">vodafone</text>
      <text x="25" y="19" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="7" fontWeight="900" fill="#fff" letterSpacing="0.4">cash</text>
    </svg>
  );
}

export function InstaPayIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ip-grad" x1="0" y1="0" x2="40" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF6B35"/>
          <stop offset="1" stopColor="#F7931E"/>
        </linearGradient>
      </defs>
      <rect width="40" height="26" rx="4" fill="url(#ip-grad)"/>
      <text x="20" y="11" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="6" fontWeight="700" fill="#fff" letterSpacing="0.4">INSTA</text>
      <text x="20" y="19" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="8" fontWeight="900" fill="#fff" letterSpacing="0.5">PAY</text>
    </svg>
  );
}

export function CashOnDeliveryIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 40 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="26" rx="4" fill="#10B981"/>
      <path d="M6 9h28v8H6z" fill="#fff" opacity="0.15"/>
      <circle cx="20" cy="13" r="3.5" fill="none" stroke="#fff" strokeWidth="1.4"/>
      <text x="20" y="15.5" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="6" fontWeight="900" fill="#fff">COD</text>
    </svg>
  );
}

// Map by payment method id
export const PAYMENT_ICONS = {
  cod:           CashOnDeliveryIcon,
  card:          VisaIcon,
  fawry:         FawryIcon,
  paymob:        PaymobIcon,
  vodafone_cash: VodafoneCashIcon,
  instapay:      InstaPayIcon,
  cash:          CashOnDeliveryIcon,
  pos_card:      MastercardIcon,
};

// Visual brand colors for backgrounds
export const PAYMENT_BRAND_COLORS = {
  cod:           '#10B981',
  card:          '#1A1F71',
  fawry:         '#FDB913',
  paymob:        '#7C3AED',
  vodafone_cash: '#E60000',
  instapay:      '#FF6B35',
  cash:          '#10B981',
  pos_card:      '#1A1F71',
};
