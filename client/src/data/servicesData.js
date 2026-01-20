import { 
  User, 
  TrendingUp, 
  Globe, 
  Briefcase, 
  Home, 
  Coins, 
  Users,
  Receipt,
  Building,
  Building2,
  Shield,
  CreditCard
} from 'lucide-react';

// Individual ITR Services Data
export const individualServices = [
  {
    id: 'salary-basic-itr',
    title: "Salary (Basic) ITR",
    description: "Simple ITR filing for salaried individuals with basic income sources",
    price: "₹799",
    icon: User,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "ITR-1 (Sahaj) form", 
      "Salary income only", 
      "Standard deductions", 
      "Up to ₹50 lakhs income"
    ],
    detailContent: {
      overview: "Perfect for salaried employees with straightforward income sources. Our basic ITR filing service covers all essential requirements for individual taxpayers.",
      inclusions: [
        "ITR-1 form preparation and filing",
        "Salary income computation",
        "Standard deduction claims",
        "Basic tax saving investments",
        "Refund processing assistance"
      ],
      documents: [
        "Form 16 from employer",
        "Bank statements",
        "Investment proofs (80C, 80D)",
        "Aadhaar and PAN card"
      ]
    }
  },
  {
    id: 'salary-premium',
    title: "Salary (Premium)",
    description: "Comprehensive ITR filing for professionals with multiple income sources",
    price: "₹1,299",
    icon: User,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    features: [
      "ITR-2 form", 
      "Multiple income sources", 
      "House property", 
      "Capital gains support"
    ],
    detailContent: {
      overview: "Comprehensive tax filing for professionals with multiple income streams including salary, house property, and investments.",
      inclusions: [
        "ITR-2 form preparation",
        "Multiple salary sources",
        "House property income",
        "Capital gains computation",
        "Advanced tax planning"
      ],
      documents: [
        "Form 16 from all employers",
        "Property rental agreements",
        "Investment statements",
        "Capital gains documents"
      ]
    }
  },
  {
    id: 'capital-gain',
    title: "Capital Gain",
    description: "Specialized filing for stock market and investment gains",
    price: "₹1,999",
    icon: TrendingUp,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    features: [
      "LTCG & STCG", 
      "Stock market gains", 
      "Mutual fund profits", 
      "Property sales"
    ],
    detailContent: {
      overview: "Expert handling of capital gains from stocks, mutual funds, and property transactions with optimal tax planning.",
      inclusions: [
        "LTCG and STCG calculations",
        "Indexation benefits",
        "Loss set-off and carry forward",
        "Securities transaction tax claims",
        "Exemption under 54/54F"
      ],
      documents: [
        "Trading account statements",
        "Mutual fund statements",
        "Property sale deed",
        "Purchase invoices and receipts"
      ]
    }
  },
  {
    id: 'nri-income',
    title: "Foreign/NRI Income",
    description: "ITR filing for NRIs and foreign income sources",
    price: "₹2,499",
    icon: Globe,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    features: [
      "NRI tax filing", 
      "Foreign income", 
      "DTAA benefits", 
      "FBAR compliance"
    ],
    detailContent: {
      overview: "Specialized NRI tax services covering foreign income, DTAA benefits, and compliance requirements for Non-Resident Indians.",
      inclusions: [
        "NRI status determination",
        "Foreign income reporting",
        "DTAA treaty benefits",
        "TDS refund claims",
        "FBAR guidance"
      ],
      documents: [
        "Passport and visa copies",
        "Foreign salary certificates",
        "Bank statements (India & abroad)",
        "Tax paid certificates abroad"
      ]
    }
  }
];

// Business ITR Services Data
export const businessServices = [
  {
    id: 'business-profession',
    title: "Business & Profession",
    description: "Comprehensive ITR filing for business owners and professionals",
    price: "₹2,999",
    icon: Briefcase,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    features: [
      "ITR-3 or ITR-4 form", 
      "Business income", 
      "Professional income", 
      "Presumptive taxation"
    ],
    detailContent: {
      overview: "Complete business tax filing for proprietors, professionals, and small businesses with comprehensive income and expense management.",
      inclusions: [
        "ITR-3/ITR-4 form selection",
        "P&L statement preparation",
        "Business expense optimization",
        "Presumptive taxation benefits",
        "Advance tax calculations"
      ],
      documents: [
        "Books of accounts",
        "Bank statements",
        "Purchase and sales invoices",
        "Expense receipts and bills"
      ]
    }
  },
  {
    id: 'fo-trading',
    title: "F&O Trading",
    description: "Specialized filing for futures and options trading income",
    price: "₹3,499",
    icon: TrendingUp,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    features: [
      "F&O trading income", 
      "Speculative income", 
      "Business income treatment", 
      "Loss carry forward"
    ],
    detailContent: {
      overview: "Expert F&O trading tax services with proper classification of speculative vs business income and loss optimization.",
      inclusions: [
        "F&O income classification",
        "Speculative vs business income",
        "Loss carry forward strategies",
        "Turnover calculations",
        "Audit threshold management"
      ],
      documents: [
        "Trading account statements",
        "Contract notes",
        "P&L statements from broker",
        "Bank statements"
      ]
    }
  },
  {
    id: 'house-property',
    title: "House Property",
    description: "ITR filing for rental income and property investments",
    price: "₹1,799",
    icon: Home,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    features: [
      "Rental income", 
      "Property tax deductions", 
      "Home loan interest", 
      "Multiple properties"
    ],
    detailContent: {
      overview: "Comprehensive house property income filing with rental income optimization and maximum deduction benefits.",
      inclusions: [
        "Rental income calculations",
        "Property tax deductions",
        "Home loan interest benefits",
        "Repair and maintenance claims",
        "Vacancy period adjustments"
      ],
      documents: [
        "Rental agreements",
        "Property tax receipts",
        "Home loan statements",
        "Maintenance bills"
      ]
    }
  },
  {
    id: 'crypto-trading',
    title: "Crypto Trading",
    description: "ITR filing for cryptocurrency trading and investments",
    price: "₹2,799",
    icon: Coins,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    features: [
      "Crypto trading income", 
      "Virtual digital assets", 
      "30% tax rate", 
      "TDS compliance"
    ],
    detailContent: {
      overview: "Specialized cryptocurrency tax filing with proper VDA classification and compliance with new crypto tax regulations.",
      inclusions: [
        "Crypto income calculations",
        "VDA classification",
        "30% tax rate application",
        "TDS compliance check",
        "Exchange transaction records"
      ],
      documents: [
        "Exchange trading statements",
        "Wallet transaction history",
        "Purchase receipts",
        "TDS certificates"
      ]
    }
  },
  {
    id: 'huf-filing',
    title: "HUF Filing",
    description: "Hindu Undivided Family tax return filing",
    price: "₹2,199",
    icon: Users,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    features: [
      "HUF income", 
      "Family business", 
      "Property income", 
      "Investment income"
    ],
    detailContent: {
      overview: "Complete HUF tax filing services covering family business income, property investments, and tax optimization strategies.",
      inclusions: [
        "HUF income assessment",
        "Family business profits",
        "Property rental income",
        "Investment returns",
        "Member contribution tracking"
      ],
      documents: [
        "HUF deed/declaration",
        "Business partnership deeds",
        "Property documents",
        "Investment statements"
      ]
    }
  }
];

// Registration Services Data
export const registrationServices = [
  {
    id: 'gst-registration',
    title: "GST Registration",
    description: "Complete GST registration for businesses",
    price: "₹1,499",
    icon: Receipt,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "Online GST registration", 
      "Document preparation", 
      "GSTIN certificate", 
      "Compliance guidance"
    ]
  },
  {
    id: 'huf-registration',
    title: "HUF Registration",
    description: "Hindu Undivided Family registration services",
    price: "₹999",
    icon: Users,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    features: [
      "HUF deed preparation", 
      "PAN application", 
      "Bank account opening", 
      "Legal documentation"
    ]
  },
  {
    id: 'company-registration',
    title: "Company Registration",
    description: "Private Limited Company incorporation",
    price: "₹4,999",
    icon: Building,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    features: [
      "ROC filing", 
      "Certificate of incorporation", 
      "Digital signatures", 
      "Compliance calendar"
    ]
  },
  {
    id: 'llp-registration',
    title: "LLP Registration",
    description: "Limited Liability Partnership registration",
    price: "₹3,999",
    icon: Building2,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    features: [
      "LLP agreement", 
      "ROC registration", 
      "Partner certificates", 
      "Compliance setup"
    ]
  }
];

// Other Filing Services Data
export const otherServices = [
  {
    id: 'gst-filing',
    title: "GST Filing",
    description: "Monthly and quarterly GST return filing",
    price: "₹799",
    icon: Receipt,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "GSTR-1 filing", 
      "GSTR-3B filing", 
      "Input tax credit", 
      "Penalty management"
    ]
  },
  {
    id: 'tds-filing',
    title: "TDS Filing",
    description: "TDS return filing and compliance",
    price: "₹1,299",
    icon: CreditCard,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    features: [
      "TDS return filing", 
      "Certificate generation", 
      "Penalty avoidance", 
      "Compliance tracking"
    ]
  },
  {
    id: 'pf-esic',
    title: "PF & ESIC",
    description: "Provident Fund and ESIC compliance",
    price: "₹1,599",
    icon: Shield,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    features: [
      "PF registration", 
      "ESIC registration", 
      "Monthly returns", 
      "Employee management"
    ]
  }
];

// Service Categories
export const serviceCategories = {
  individual: {
    title: "Individual ITR Filing Services",
    description: "Choose the perfect ITR filing service based on your income sources and requirements",
    icon: User,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    services: individualServices
  },
  business: {
    title: "Business ITR Filing Services", 
    description: "Professional tax filing services for businesses, traders, and specialized income sources",
    icon: Briefcase,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    services: businessServices
  },
  registration: {
    title: "Registration Services",
    description: "Complete business registration and compliance setup services",
    icon: Building,
    bgColor: "bg-purple-100", 
    iconColor: "text-purple-600",
    services: registrationServices
  },
  other: {
    title: "Other Filing Services",
    description: "Additional compliance and filing services for businesses",
    icon: Receipt,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600", 
    services: otherServices
  }
};