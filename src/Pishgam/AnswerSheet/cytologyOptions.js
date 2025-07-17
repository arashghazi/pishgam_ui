// Static GUIDs for form options (guids must remain constant)
export const SPECIMEN_ADEQUACY_OPTIONS = [
  { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', value: 'satisfactory', display: 'Satisfactory for evaluation' },
  { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', value: 'unsatisfactory', display: 'Unsatisfactory for evaluation' }
];

export const ADEQUACY_DETAIL_OPTIONS = [
  { id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', value: 'present', display: 'Endocervical/metaplastic cells are present' },
  { id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', value: 'absent', display: 'Absence of endocervical/metaplastic cells' }
];

export const UNSAT_REASON_OPTIONS = [
  { id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', value: 'Scant cellularity', display: 'Scant cellularity' },
  { id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', value: 'Obscured by blood', display: 'Obscured by blood' },
  { id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', value: 'Poor preservation', display: 'Poor preservation' },
  { id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', value: 'Obscured by inflammation', display: 'Obscured by inflammation' }
];

export const INTERPRETATION_BRANCH_OPTIONS = [
  { id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', value: 'negative', display: 'Negative for intraepithelial lesion or malignancy' },
  { id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', value: 'epithelial', display: 'Epithelial cell abnormalities' },
  { id: '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', value: 'otherMalignant', display: 'Other malignant neoplasms' }
];

export const ORGANISMS_OPTIONS = [
  { id: '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', value: 'Trichomonas vaginalis', display: 'Trichomonas vaginalis' },
  { id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', value: 'Fungal organisms consistent with Candida spp.', display: 'Fungal organisms consistent with Candida spp.' },
  { id: '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', value: 'Shift in flora suggestive of bacterial vaginosis', display: 'Shift in flora suggestive of bacterial vaginosis' },
  { id: '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f', value: 'Bacteria consistent with Actinomyces spp.', display: 'Bacteria consistent with Actinomyces spp.' },
  { id: '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', value: 'Cellular changes consistent with Herpes simplex virus', display: 'Cellular changes consistent with Herpes simplex virus' }
];

export const NON_NEOPLASTIC_OPTIONS = [
  { id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', value: 'Reactive changes – Inflammation', display: 'Reactive changes – Inflammation' },
  { id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', value: 'Reactive changes – Typical repair', display: 'Reactive changes – Typical repair' },
  { id: '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', value: 'Reactive changes – Radiation', display: 'Reactive changes – Radiation' },
  { id: '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e', value: 'Reactive changes – IUD', display: 'Reactive changes – IUD' },
  { id: '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', value: 'Glandular cells post-hysterectomy', display: 'Glandular cells post-hysterectomy' },
  { id: '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', value: 'Atrophy', display: 'Atrophy' },
  { id: '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', value: 'Endometrial cells (≥45 yrs)', display: 'Endometrial cells (≥45 yrs)' }
];

export const SQUAMOUS_ABNORMALITY_OPTIONS = [
  { id: '4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c', value: 'ASC-US', display: 'ASC-US' },
  { id: '5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d', value: 'ASC-H', display: 'ASC-H' },
  { id: '6b7c8d9e-0f1a-2b3c-4d5e-6f7a8b9c0d1e', value: 'LSIL', display: 'LSIL' },
  { id: '7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f', value: 'HSIL', display: 'HSIL' },
  { id: '8d9e0f1a-2b3c-4d5e-6f7a-8b9c0d1e2f3a', value: 'HSIL with features suspicious for invasion', display: 'HSIL with features suspicious for invasion' },
  { id: '9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', value: 'Squamous cell carcinoma', display: 'Squamous cell carcinoma' }
];

export const GLANDULAR_ABNORMALITY_OPTIONS = [
  { id: '0f1a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c', value: 'Atypical endocervical cells NOS', display: 'Atypical endocervical cells NOS' },
  { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', value: 'Atypical endometrial cells NOS', display: 'Atypical endometrial cells NOS' },
  { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', value: 'Atypical glandular cells NOS', display: 'Atypical glandular cells NOS' },
  { id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', value: 'Endocervical cells favor neoplastic', display: 'Endocervical cells favor neoplastic' },
  { id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', value: 'Glandular cells favor neoplastic', display: 'Glandular cells favor neoplastic' },
  { id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', value: 'Endocervical AIS', display: 'Endocervical AIS' },
  { id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', value: 'Adenocarcinoma (Endocervical)', display: 'Adenocarcinoma (Endocervical)' },
  { id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', value: 'Adenocarcinoma (Endometrial)', display: 'Adenocarcinoma (Endometrial)' },
  { id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', value: 'Adenocarcinoma (Extrauterine)', display: 'Adenocarcinoma (Extrauterine)' },
  { id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', value: 'Adenocarcinoma NOS', display: 'Adenocarcinoma NOS' }
];

export const OTHER_MALIGNANT_OPTION = [
  { id: 'af0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', value: true, display: 'Other malignant neoplasms' }
];