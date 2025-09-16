export interface Institution {
  id: string;
  name: string;
  category: 'bank' | 'government' | 'healthcare' | 'utility' | 'education' | 'retail';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'open' | 'closed' | 'busy';
  currentQueue: number;
  estimatedWaitTime: number;
  operatingHours: {
    open: string;
    close: string;
  };
  services: string[];
  phone?: string;
  isPopular?: boolean;
}

export const zambianInstitutions: Institution[] = [
  // Banks
  {
    id: 'zanaco-bank-cairo',
    name: 'Zanaco Bank - Cairo Branch',
    category: 'bank',
    location: 'Cairo Road, Lusaka',
    coordinates: { lat: -15.3875, lng: 28.3228 },
    status: 'open',
    currentQueue: 12,
    estimatedWaitTime: 45,
    operatingHours: { open: '08:00', close: '15:30' },
    services: ['Account Opening', 'Loans', 'Money Transfer', 'Foreign Exchange'],
    phone: '+260-211-229087',
    isPopular: true
  },
  {
    id: 'stanbic-bank-lusaka',
    name: 'Stanbic Bank Zambia - Main Branch',
    category: 'bank',
    location: 'Stanbic House, Cairo Road, Lusaka',
    coordinates: { lat: -15.3925, lng: 28.3201 },
    status: 'busy',
    currentQueue: 18,
    estimatedWaitTime: 65,
    operatingHours: { open: '08:30', close: '15:00' },
    services: ['Personal Banking', 'Corporate Banking', 'Investment Services'],
    phone: '+260-211-256969',
    isPopular: true
  },
  {
    id: 'fnb-zambia-lusaka',
    name: 'First National Bank Zambia',
    category: 'bank',
    location: 'FNB Building, Cairo Road, Lusaka',
    coordinates: { lat: -15.3901, lng: 28.3215 },
    status: 'open',
    currentQueue: 8,
    estimatedWaitTime: 30,
    operatingHours: { open: '08:00', close: '16:00' },
    services: ['Retail Banking', 'Business Banking', 'Card Services'],
    phone: '+260-211-366900'
  },
  {
    id: 'barclays-bank-lusaka',
    name: 'Absa Bank Zambia (formerly Barclays)',
    category: 'bank',
    location: 'Barclays House, Kafue Road, Lusaka',
    coordinates: { lat: -15.3889, lng: 28.3167 },
    status: 'open',
    currentQueue: 6,
    estimatedWaitTime: 25,
    operatingHours: { open: '08:30', close: '15:30' },
    services: ['Current Accounts', 'Savings', 'Mortgages', 'Insurance'],
    phone: '+260-211-366700'
  },
  {
    id: 'indo-zambia-bank',
    name: 'Indo Zambia Bank',
    category: 'bank',
    location: 'Indo Zambia House, Cairo Road, Lusaka',
    coordinates: { lat: -15.3912, lng: 28.3234 },
    status: 'open',
    currentQueue: 4,
    estimatedWaitTime: 20,
    operatingHours: { open: '08:00', close: '15:00' },
    services: ['Personal Banking', 'Trade Finance', 'SME Banking'],
    phone: '+260-211-256400'
  },

  // Government Offices
  {
    id: 'rtsa-lusaka',
    name: 'Road Transport and Safety Agency (RTSA)',
    category: 'government',
    location: 'RTSA House, Dedan Kimathi Road, Lusaka',
    coordinates: { lat: -15.3967, lng: 28.3289 },
    status: 'busy',
    currentQueue: 25,
    estimatedWaitTime: 90,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Driving Licenses', 'Vehicle Registration', 'Road Tax', 'Fitness Certificates'],
    phone: '+260-211-251055',
    isPopular: true
  },
  {
    id: 'nro-lusaka',
    name: 'National Registration Office',
    category: 'government',
    location: 'Haile Selassie Avenue, Lusaka',
    coordinates: { lat: -15.3845, lng: 28.3156 },
    status: 'open',
    currentQueue: 15,
    estimatedWaitTime: 60,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['National ID Cards', 'Birth Certificates', 'Death Certificates'],
    phone: '+260-211-252566'
  },
  {
    id: 'zra-lusaka',
    name: 'Zambia Revenue Authority (ZRA)',
    category: 'government',
    location: 'ZRA House, Cairo Road, Lusaka',
    coordinates: { lat: -15.3934, lng: 28.3189 },
    status: 'open',
    currentQueue: 20,
    estimatedWaitTime: 75,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Tax Returns', 'TPIN Registration', 'VAT Services', 'Customs'],
    phone: '+260-211-251010',
    isPopular: true
  },
  {
    id: 'pacra-lusaka',
    name: 'Patents and Companies Registration Agency (PACRA)',
    category: 'government',
    location: 'PACRA House, Haile Selassie Avenue, Lusaka',
    coordinates: { lat: -15.3823, lng: 28.3201 },
    status: 'open',
    currentQueue: 8,
    estimatedWaitTime: 40,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Company Registration', 'Patent Applications', 'Trademark Registration'],
    phone: '+260-211-252566'
  },
  {
    id: 'ministry-health',
    name: 'Ministry of Health - Head Office',
    category: 'government',
    location: 'Ndeke House, Haile Selassie Avenue, Lusaka',
    coordinates: { lat: -15.3801, lng: 28.3178 },
    status: 'open',
    currentQueue: 5,
    estimatedWaitTime: 35,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Health Permits', 'Medical Licenses', 'Public Health Services'],
    phone: '+260-211-253776'
  },

  // Healthcare
  {
    id: 'uth-lusaka',
    name: 'University Teaching Hospital (UTH)',
    category: 'healthcare',
    location: 'Nationalist Road, Lusaka',
    coordinates: { lat: -15.3723, lng: 28.3445 },
    status: 'busy',
    currentQueue: 45,
    estimatedWaitTime: 120,
    operatingHours: { open: '24/7', close: '24/7' },
    services: ['Emergency Services', 'Outpatient Clinics', 'Specialist Consultations'],
    phone: '+260-211-256981',
    isPopular: true
  },
  {
    id: 'lusaka-trust-hospital',
    name: 'Lusaka Trust Hospital',
    category: 'healthcare',
    location: 'Leopards Hill Road, Lusaka',
    coordinates: { lat: -15.3456, lng: 28.3889 },
    status: 'open',
    currentQueue: 12,
    estimatedWaitTime: 45,
    operatingHours: { open: '06:00', close: '22:00' },
    services: ['General Medicine', 'Surgery', 'Maternity', 'Pediatrics'],
    phone: '+260-211-264051'
  },
  {
    id: 'fairview-hospital',
    name: 'Fairview Hospital',
    category: 'healthcare',
    location: 'Fairview Area, Lusaka',
    coordinates: { lat: -15.3612, lng: 28.3234 },
    status: 'open',
    currentQueue: 8,
    estimatedWaitTime: 30,
    operatingHours: { open: '07:00', close: '19:00' },
    services: ['General Practice', 'Laboratory', 'X-Ray', 'Pharmacy'],
    phone: '+260-211-293844'
  },
  {
    id: 'coptic-hospital',
    name: 'Coptic Hospital',
    category: 'healthcare',
    location: 'Coptic Hospital Road, Lusaka',
    coordinates: { lat: -15.3534, lng: 28.3567 },
    status: 'open',
    currentQueue: 6,
    estimatedWaitTime: 25,
    operatingHours: { open: '07:00', close: '18:00' },
    services: ['General Medicine', 'Obstetrics', 'Surgery', 'Emergency'],
    phone: '+260-211-294091'
  },
  {
    id: 'cfb-hospital',
    name: 'Care For Business Hospital',
    category: 'healthcare',
    location: 'Great East Road, Lusaka',
    coordinates: { lat: -15.3789, lng: 28.3956 },
    status: 'open',
    currentQueue: 4,
    estimatedWaitTime: 20,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Occupational Health', 'Medical Examinations', 'Vaccinations'],
    phone: '+260-211-255666'
  },

  // Utilities
  {
    id: 'zesco-cairo',
    name: 'ZESCO - Cairo Road Customer Service',
    category: 'utility',
    location: 'Electra House, Cairo Road, Lusaka',
    coordinates: { lat: -15.3923, lng: 28.3198 },
    status: 'busy',
    currentQueue: 22,
    estimatedWaitTime: 80,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Bill Payments', 'New Connections', 'Fault Reporting', 'Meter Services'],
    phone: '+260-211-213000',
    isPopular: true
  },
  {
    id: 'lwsc-lusaka',
    name: 'Lusaka Water and Sewerage Company',
    category: 'utility',
    location: 'Cairo Road, Lusaka',
    coordinates: { lat: -15.3945, lng: 28.3167 },
    status: 'open',
    currentQueue: 10,
    estimatedWaitTime: 40,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Water Bills', 'New Connections', 'Pipe Repairs', 'Account Queries'],
    phone: '+260-211-252051'
  },
  {
    id: 'multichoice-lusaka',
    name: 'MultiChoice Zambia (DSTV)',
    category: 'utility',
    location: 'MultiChoice Building, Great East Road, Lusaka',
    coordinates: { lat: -15.3756, lng: 28.3834 },
    status: 'open',
    currentQueue: 7,
    estimatedWaitTime: 25,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Subscription Payments', 'Decoder Installation', 'Channel Packages'],
    phone: '+260-211-366200'
  },
  {
    id: 'airtel-lusaka',
    name: 'Airtel Zambia - Manda Hill',
    category: 'utility',
    location: 'Manda Hill Shopping Mall, Great East Road, Lusaka',
    coordinates: { lat: -15.3845, lng: 28.3723 },
    status: 'open',
    currentQueue: 9,
    estimatedWaitTime: 30,
    operatingHours: { open: '09:00', close: '19:00' },
    services: ['SIM Cards', 'Mobile Money', 'Data Bundles', 'Device Repairs'],
    phone: '+260-976-000111',
    isPopular: true
  },
  {
    id: 'mtn-lusaka',
    name: 'MTN Zambia - Cairo Road',
    category: 'utility',
    location: 'Cairo Road, Lusaka',
    coordinates: { lat: -15.3889, lng: 28.3223 },
    status: 'open',
    currentQueue: 11,
    estimatedWaitTime: 35,
    operatingHours: { open: '08:30', close: '18:00' },
    services: ['Mobile Services', 'MoMo', 'Internet Packages', 'Customer Support'],
    phone: '+260-966-000100'
  },

  // Education and Other Services
  {
    id: 'unza-lusaka',
    name: 'University of Zambia - Registry',
    category: 'education',
    location: 'Great East Road, Lusaka',
    coordinates: { lat: -15.3456, lng: 28.4123 },
    status: 'open',
    currentQueue: 14,
    estimatedWaitTime: 50,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Student Registration', 'Transcripts', 'Certificate Collection', 'Admissions'],
    phone: '+260-211-256483'
  },
  {
    id: 'cbu-lusaka',
    name: 'Copperbelt University - Lusaka Campus',
    category: 'education',
    location: 'Longacres, Lusaka',
    coordinates: { lat: -15.3567, lng: 28.3345 },
    status: 'open',
    currentQueue: 6,
    estimatedWaitTime: 25,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Part-time Programs', 'Executive Education', 'Alumni Services'],
    phone: '+260-212-216121'
  },
  {
    id: 'zampost-lusaka',
    name: 'Zampost - Main Post Office',
    category: 'utility',
    location: 'Cairo Road, Lusaka',
    coordinates: { lat: -15.3934, lng: 28.3212 },
    status: 'open',
    currentQueue: 8,
    estimatedWaitTime: 30,
    operatingHours: { open: '08:00', close: '17:00' },
    services: ['Mail Services', 'Parcel Delivery', 'PO Box Rentals', 'Money Orders'],
    phone: '+260-211-228848'
  },
  {
    id: 'shoprite-manda',
    name: 'Shoprite Zambia - Manda Hill',
    category: 'retail',
    location: 'Manda Hill Shopping Centre, Great East Road, Lusaka',
    coordinates: { lat: -15.3834, lng: 28.3712 },
    status: 'open',
    currentQueue: 12,
    estimatedWaitTime: 35,
    operatingHours: { open: '08:00', close: '20:00' },
    services: ['Customer Service', 'Money Services', 'Gift Cards', 'Returns'],
    phone: '+260-211-366555',
    isPopular: true
  },
  {
    id: 'pick-n-pay-lusaka',
    name: 'Pick n Pay Zambia - Levy Junction',
    category: 'retail',
    location: 'Levy Junction Mall, Great East Road, Lusaka',
    coordinates: { lat: -15.3678, lng: 28.3889 },
    status: 'open',
    currentQueue: 5,
    estimatedWaitTime: 20,
    operatingHours: { open: '08:00', close: '19:00' },
    services: ['Customer Service', 'Smart Shopper', 'Financial Services', 'Returns'],
    phone: '+260-211-255777'
  }
];

export const getInstitutionsByCategory = (category: Institution['category']) => {
  return zambianInstitutions.filter(institution => institution.category === category);
};

export const getPopularInstitutions = () => {
  return zambianInstitutions.filter(institution => institution.isPopular);
};

export const getInstitutionById = (id: string) => {
  return zambianInstitutions.find(institution => institution.id === id);
};