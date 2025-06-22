export const trials = [
  {
    id: 'onco-vex',
    name: 'OncoVex Phase II',
    description: 'A Phase II study of OncoVex for treating non-small cell lung cancer.',
    filePath: '/data/onco_vex_trial.csv',
    outcomeMetric: 'tumorSizeChange', // Custom property to help our charts
    outcomeLabel: 'Tumor Size Change (mm)'
  },
  {
    id: 'cardia-stat',
    name: 'CardiaStat Efficacy',
    description: 'A study on the efficacy of CardiaStat in reducing systolic blood pressure.',
    filePath: '/data/cardia_stat_trial.csv',
    outcomeMetric: 'bloodPressureChange',
    outcomeLabel: 'Blood Pressure Change (mmHg)'
  },
  {
    id: 'derma-clear',
    name: 'DermaClear Psoriasis Trial',
    description: 'Evaluating the effectiveness of DermaClear cream on psoriatic lesion count.',
    filePath: '/data/derma_clear_trial.csv',
    outcomeMetric: 'lesionCount',
    outcomeLabel: 'Psoriatic Lesion Count'
  }
];