// Form field configurations for different ITR types

export const formFieldTypes = {
  TEXT: 'text',
  EMAIL: 'email',
  DATE: 'date',
  SELECT: 'select',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  FILE: 'file'
};

// Common form fields that can be reused
export const commonFields = {
  firstName: {
    id: 'firstName',
    name: 'firstName',
    label: 'First Name',
    type: formFieldTypes.TEXT,
    placeholder: 'Enter your first name',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/
    }
  },
  middleName: {
    id: 'middleName',
    name: 'middleName',
    label: 'Middle Name',
    type: formFieldTypes.TEXT,
    placeholder: 'Enter your middle name',
    required: false
  },
  lastName: {
    id: 'lastName',
    name: 'lastName',
    label: 'Last Name',
    type: formFieldTypes.TEXT,
    placeholder: 'Enter your last name',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/
    }
  },
  gender: {
    id: 'gender',
    name: 'gender',
    label: 'Gender',
    type: formFieldTypes.RADIO,
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  },
  dateOfBirth: {
    id: 'dateOfBirth',
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: formFieldTypes.DATE,
    required: true,
    validation: {
      maxDate: new Date() // Cannot be in future
    }
  },
  panNumber: {
    id: 'panNumber',
    name: 'panNumber',
    label: 'PAN Number',
    type: formFieldTypes.TEXT,
    placeholder: 'ABCDE1234F',
    required: true,
    validation: {
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      message: 'Please enter a valid PAN number (e.g., ABCDE1234F)'
    }
  },
  fatherName: {
    id: 'fatherName',
    name: 'fatherName',
    label: "Father's Name",
    type: formFieldTypes.TEXT,
    placeholder: "Enter your father's name",
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100
    }
  },
  maritalStatus: {
    id: 'maritalStatus',
    name: 'maritalStatus',
    label: 'Marital Status',
    type: formFieldTypes.SELECT,
    required: false,
    options: [
      { value: '', label: 'Select marital status' },
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'divorced', label: 'Divorced' },
      { value: 'widowed', label: 'Widowed' }
    ]
  },
  address: {
    id: 'address',
    name: 'address',
    label: 'Your Address',
    type: formFieldTypes.TEXTAREA,
    placeholder: 'Enter your complete address',
    required: false,
    rows: 4
  },
  // Additional fields that can be used for different ITR types
  email: {
    id: 'email',
    name: 'email',
    label: 'Email Address',
    type: formFieldTypes.EMAIL,
    placeholder: 'your.email@example.com',
    required: true
  },
  mobile: {
    id: 'mobile',
    name: 'mobile',
    label: 'Mobile Number',
    type: formFieldTypes.TEXT,
    placeholder: '10-digit mobile number',
    required: true,
    validation: {
      pattern: /^[6-9]\d{9}$/,
      message: 'Please enter a valid 10-digit mobile number'
    }
  },
  aadhaar: {
    id: 'aadhaar',
    name: 'aadhaar',
    label: 'Aadhaar Number',
    type: formFieldTypes.TEXT,
    placeholder: '12-digit Aadhaar number',
    required: false,
    validation: {
      pattern: /^\d{12}$/,
      message: 'Please enter a valid 12-digit Aadhaar number'
    }
  },
  // Document upload fields
  form16: {
    id: 'form16',
    name: 'form16',
    label: 'Form 16',
    type: formFieldTypes.FILE,
    required: true,
    accept: '.pdf,.jpg,.jpeg',
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'Upload Form 16 (PDF or JPG, max 5MB)'
  },
  form16Company: {
    id: 'form16Company',
    name: 'form16Company',
    label: 'Form 16 from your company',
    type: formFieldTypes.FILE,
    required: true,
    accept: '.pdf,.jpg,.jpeg',
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'Upload Form 16 from your company (PDF or JPG, max 5MB)'
  },
  form26AS: {
    id: 'form26AS',
    name: 'form26AS',
    label: 'Form 26AS Tax Credit Statement',
    type: formFieldTypes.FILE,
    required: true,
    accept: '.pdf,.jpg,.jpeg',
    maxSize: 5 * 1024 * 1024,
    description: 'Upload Form 26AS (PDF or JPG, max 5MB)'
  },
  annualInfoStatement: {
    id: 'annualInfoStatement',
    name: 'annualInfoStatement',
    label: 'Annual Information Statement',
    type: formFieldTypes.FILE,
    required: true,
    accept: '.pdf,.jpg,.jpeg',
    maxSize: 5 * 1024 * 1024,
    description: 'Upload AIS (PDF or JPG, max 5MB)'
  },
  additionalDocuments: {
    id: 'additionalDocuments',
    name: 'additionalDocuments',
    label: 'Additional Documents',
    type: formFieldTypes.FILE,
    required: false,
    accept: '.pdf,.jpg,.jpeg',
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    description: 'Upload any additional documents (PDF or JPG, max 5MB each)'
  }
};

// Form configurations for different ITR types
export const formConfigs = {
  'salary-basic-itr': {
    title: 'Salary (Basic) ITR Filing Form',
    description: 'Please fill in your details as per your PAN card',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'salary-premium': {
    title: 'Salary (Premium) ITR Filing Form',
    description: 'Comprehensive ITR filing for professionals',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'capital-gain': {
    title: 'Capital Gain ITR Filing Form',
    description: 'ITR filing for capital gains from investments',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'nri-income': {
    title: 'NRI Income ITR Filing Form',
    description: 'ITR filing for Non-Resident Indians',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  // Business services
  'business-profession': {
    title: 'Business & Profession ITR Filing Form',
    description: 'ITR filing for business owners and professionals',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16Company,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'fo-trading': {
    title: 'F&O Trading ITR Filing Form',
    description: 'ITR filing for futures and options trading',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16Company,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'house-property': {
    title: 'House Property ITR Filing Form',
    description: 'ITR filing for rental income and property investments',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16Company,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'crypto-trading': {
    title: 'Crypto Trading ITR Filing Form',
    description: 'ITR filing for cryptocurrency trading and investments',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16Company,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  'huf-filing': {
    title: 'HUF Filing Form',
    description: 'Hindu Undivided Family tax return filing',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address,
          commonFields.email,
          commonFields.mobile
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form16Company,
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  },
  // Default form for other services
  default: {
    title: 'ITR Filing Form',
    description: 'Please fill in your details',
    sections: [
      {
        title: 'Personal Information',
        note: 'Make sure your name is as per your PAN card',
        fields: [
          commonFields.firstName,
          commonFields.middleName,
          commonFields.lastName,
          commonFields.gender,
          commonFields.dateOfBirth,
          commonFields.panNumber,
          commonFields.fatherName,
          commonFields.maritalStatus,
          commonFields.address
        ]
      },
      {
        title: 'Documents Required',
        note: 'Please upload all required documents in PDF or JPG format (max 5MB each)',
        fields: [
          commonFields.form26AS,
          commonFields.annualInfoStatement,
          commonFields.additionalDocuments
        ]
      }
    ]
  }
};

// Helper function to get form config by service ID
export const getFormConfig = (serviceId) => {
  return formConfigs[serviceId] || formConfigs.default;
};
