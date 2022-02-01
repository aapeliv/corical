// top of page
export const TITLE = "CoRiCal: Covid Risk Calculator";
export const BY_LINE = "By, credits, etc";

// form elements
export const STEP1_TITLE = "Personal information";
export const STEP1_HELPER =
  "Enter a person's age, sex, and vaccination status to check their risks.";

export const FIELD_REQUIRED = "This field is required.";

export const AGE_LABEL = "Age";
export const AGE_TOO_SMALL = "Must be at least 18 years old.";
export const AGE_TOO_BIG = "Please enter an age under 100.";

export const SEX_LABEL = "Sex";
export const SEX_OPTIONS = [
  {
    value: "female",
    label: "Female",
  },
  {
    value: "male",
    label: "Male",
  },
  {
    value: "other",
    label: "Unspecified",
  },
];

export const VACCINE_LABEL = "Vaccine";
export const VACCINE_SECOND_VAL = "Two";
export const VACCINE_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "OneAZ_under_3_weeks",
    label: "One dose of AstraZeneca (less than 3 weeks ago)",
  },
  {
    value: VACCINE_SECOND_VAL,
    label: "Two doses of AstraZeneca",
  },
  {
    value: "TwoAZ_OnePfz_under_2_months",
    label: "Two doses of AstraZeneca and one dose of Pfizer (less than 2 months ago)",
  },
];

export const VACCINE_LABEL_TIME = 
  "Time since second dose (Only if you selected 2 doses of AstraZeneca without a dose of Pfizer)"
export const VACCINE_OPTIONS_TIME = [
  {
    value: "TwoAZ_under_2_months",
    label: "Less than 2 months",
  },
  {
    value: "TwoAZ_2to4_months",
    label: "Between 2 and 4 months",
  },
  {
    value: "TwoAZ_4to6_months",
    label: "Between 4 and 6 months",
  },
]


export const PZ_VACCINE_LABEL = "Vaccine";
export const PZ_VACCINE_SECOND_VAL = "Two";
export const PZ_VACCINE_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "One_under_3wks",
    label: "One dose of Pfizer (less than 3 weeks ago)",
    description: "Data not available for those overdue for their second dose",
  },
  {
    value: PZ_VACCINE_SECOND_VAL,
    label: "Two doses of Pfizer",
  },
  {
    value: "Three",
    label: "Three doses of Pfizer",
  },
];

export const PZ_VACCINE2_LABEL =
  "Time since second dose (only if you selected two doses)";
export const PZ_VACCINE2_OPTIONS = [
  {
    value: "Two_under_2mths",
    label: "Less than 2 months",
  },
  {
    value: "Two_2_4mths",
    label: "Between 2 and 4 months",
  },
  {
    value: "Two_4_6mths",
    label: "Between 4 and 6 months",
    description: "Data not available for those overdue for their third dose",
  },
  // {
  //   value: "Two_last_dose_more_than_6_months_ago",
  //   label: "More than 6 months",
  // },
];

export const PZ_SCENARIOS_LABEL = "Community transmission scenario";
export const PZ_SCENARIOS_DEFAULT = "Five_percent";
export const PZ_SCENARIOS = [
  {
    value: "Ten_percent",
    label: "Extremely high transmission",
    description: "Equivalent to 13600 cases per day in NSW (10% of population infected over 2 months)",
  },
  {
    value: "Five_percent",
    label: "Very high transmission",
    description: "Equivalent to 6800 cases per day in NSW (5% of population infected over 2 months)",
  },
  {
    value: "ATAGI_High",
    label: "High transmission",
    description: "Equivalent to 2500 cases per day in NSW (2% of population infected over 2 months)",
  },
  {
    value: "ATAGI_Med",
    label: "Medium transmission",
    description: "Equivalent to 200 cases per day in NSW (0.15% of population infected over 2 months)",
  },
  {
    value: "ATAGI_Low",
    label: "Low transmission",
    description: "Equivalent to 20 cases per day in NSW (0.02% of population infected over 2 months)",
  },
  // {
  //   value: "None_0",
  //   label: "No community transmission",
  //   description: "No COVID-19 circulating in the community",
  // },
];

export const SUBMIT_LABEL = "Calculate risk";

export const SCENARIOS_LABEL = "Community transmission scenario";
export const SCENARIOS_DEFAULT = "ATAGI_Med";
export const SCENARIOS = [
  {
    value: "Ten_percent",
    label: "Extremely high transmission",
    description: "Equivalent to 13600 cases per day in NSW (10% of population infected over 2 months)",
  },
  {
    value: "Five_percent",
    label: "Very high transmission",
    description: "Equivalent to 6800 cases per day in NSW (5% of population infected over 2 months)",
  },
  {
    value: "ATAGI_High",
    label: "High transmission",
    description: "Equivalent to 2500 cases per day in NSW (2% of population infected over 2 months)",
  },
  {
    value: "ATAGI_Med",
    label: "Medium transmission",
    description: "Equivalent to 200 cases per day in NSW (0.15% of population infected over 2 months)",
  },
  {
    value: "ATAGI_Low",
    label: "Low transmission",
    description: "Equivalent to 20 cases per day in NSW (0.02% of population infected over 2 months)",
  },
  {
    value: "None",
    label: "No community transmission",
    description: "No COVID-19 circulating in the community",
  },
  // {
  //   value: "One_percent",
  //   label: "1%",
  //   description: "Description for 1%",
  // },
  // {
  //   value: "Two_percent",
  //   label: "2%",
  //   description: "Description for 2%",
  // },
  // {
  //   value: "NSW_1000_cases",
  //   label: "NSW 1000 cases",
  //   description: "Description for NSW 1000 cases",
  // },
  // {
  //   value: "VIC_1000_cases",
  //   label: "VIC 1000 cases",
  //   description: "Description for VIC 1000 cases",
  // },
  // {
  //   value: "QLD_1000_cases",
  //   label: "QLD 1000 cases",
  //   description: "Description for QLD 1000 cases",
  // },
];

// output
export const STEP2_TITLE = "Risk output";
export const STEP2_HELPER = "Computed risk outputs below.";
export const STEP2_SUBMIT_FORM_FIRST = "Please submit the form for output.";

export const DESCRIPTION_LABEL = "Description";
export const RISK_LABEL = "Risk";
export const COMMENT_LABEL = "Comment";

export const RISK_PER_MILLION = "in a million";
export const LESS_THAN_TENTH_MILLION = "Less than 0.1 in a million";
export const ZERO_RISK = LESS_THAN_TENTH_MILLION;
export const LESS_THAN_TENTH_MILLION_IN_X = "Less than 1 in 10,000,000";
export const ZERO_RISK_IN_X = LESS_THAN_TENTH_MILLION_IN_X;

export const RISK_TEXT = "Number of cases per million people";
export const INFOBOX_RISK_TEXT = "cases per million people";

export const TOS_HEADING = "Important information";
export const TOS_1 = "I have read and agree to the";
export const TOS_2 = "Terms and Conditions";
export const TOS_3 = "of use for the Covid-19 Risk Calculator (CoRiCal).";

export const TOS_TITLE = "Terms and Conditions";

export function TOS_TEXT() {
  return (
    <>
      <p>
        The CoRiCal risk calculator intends to provide rough estimates of
        benefits versus risks of COVID-19 vaccines to help people make informed
        decisions about vaccination. CoRiCal does not estimate an individual's
        personal risks related to COVID-19 and COVID-19 vaccination. The risks
        provided by CoRiCal (e.g. risk of dying from COVID-19) are estimates of
        the average risk for males and females in each age group, and does not
        take into account individual level factors such as medical conditions
        (e.g. diabetes, obesity) or behaviour (e.g. occupation, social
        activities). The risks were calculated using a{" "}
        <a href="https://doi.org/10.1016/j.vaccine.2021.10.079">model</a> based
        on the best known evidence, but model estimates inevitably come with
        some level of uncertainty.
      </p>
      <p>
        CoRiCal does not provide advice on diagnosis or medical management. The
        Immunisation Coalition, University of Queensland, La Trobe University,
        and the members of the CoRiCal development team accept no responsibility
        for the outcomes of any actions, decisions, or advice provided, based on
        information obtained from using CoRiCal.
      </p>
      <p>
        Users accept all risks associated with using CoRiCal. Users must
        exercise their own independent clinical skill and judgment or seek
        professional clinical advice before relying on information contained in
        CoRiCal when making a clinical decision.
      </p>
      <p>
        The Immunisation Coalition, University of Queensland, La Trobe
        University, and the members of the CoRiCal development team do not make
        any warranty or representation in relation to the accuracy, currency or
        completeness of any information contained in CoRiCal or on the website
        and do not accept any legal liability or responsibility for any injury,
        loss or damage incurred by use, reliance or interpretation of the
        information contained in CoRiCal.
      </p>
      <p>
        CoRiCal may be found in third parties' programs or materials. This does
        not imply an endorsement or recommendation by the Immunisation
        Coalition, University of Queensland, La Trobe University, and the
        members of the CoRiCal development team for such third parties'
        organisations, products, services, materials, or information. Any use of
        CoRiCal by another organisation is at its own risk.
      </p>
      <p>
        The entire contents of CoRiCal are subject to copyright protection.{" "}
      </p>
      <p>
        The CoRiCal website uses cookies to improve users' experience of the
        website, and to enable CoRiCal to collect de-identified data about the
        use of CoRiCal. These data are used for analysis and evaluation of
        CoRiCal.{" "}
      </p>
      <p>
        CoRiCal does not require users to provide any personal information.
        CoRiCal does not collect users' personal information. CoRiCal has been
        designed to be used anonymously. In using CoRiCal you consent to CoRiCal
        collecting de-identified data for the purposes of analysis and
        evaluation. These data may be collected from user inputs and from user
        surveys, noting that completion of any user surveys in CoRiCal is
        optional.{" "}
      </p>
      <p>
        CoRiCal verifies that all data are stored on secure servers in
        Australia.
      </p>
      <p>
        For further information, please refer to the Immunisation Coalition's
        statement on cookies and the{" "}
        <a
          href="https://www.immunisationcoalition.org.au/privacy-policy/"
          target="_blank"
          rel="noreferrer"
        >
          privacy policy
        </a>
        .
      </p>
    </>
  );
}
