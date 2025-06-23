export const trials = [
  {
    id: 'onco-vex',
    name: 'OncoVex Phase II',
    description: 'A Phase II study of OncoVex for treating non-small cell lung cancer.',
    // The 'filePath' is now replaced with 'apiUrl'
    apiUrl: 'https://adenneal.com/ClinicalTrial/api/getOncovexData.php',
    outcomeMetric: 'tumorSizeChange',
    outcomeLabel: 'Tumor Size Change (mm)'
  },
  {
    id: 'cardia-stat',
    name: 'CardiaStat Efficacy',
    description: 'A study on the efficacy of CardiaStat in reducing systolic blood pressure.',
    // You would create a similar PHP file for this trial
    apiUrl: 'https://adenneal.com/ClinicalTrial/api/getCardiaStatData.php',
    outcomeMetric: 'bloodPressureChange',
    outcomeLabel: 'Blood Pressure Change (mmHg)'
  },
  {
    id: 'derma-clear',
    name: 'DermaClear Psoriasis Trial',
    description: 'Evaluating the effectiveness of DermaClear cream on psoriatic lesion count.',
     // And another for this one
    apiUrl: 'https://adenneal.com/ClinicalTrial/api/getDermaClearData.php',
    outcomeMetric: 'lesionCount',
    outcomeLabel: 'Psoriatic Lesion Count'
  }
];