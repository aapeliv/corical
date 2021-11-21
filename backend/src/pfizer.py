import xdsl

pfizer = xdsl.Model("CoRiCAL_2.0_01112021_JS.xdsl")

# nodes:
# n1_Pfizer_dose
# n2_Age_distribution_of_population
# n3_SARSCoV2_variant
# n4_State
# n5_Community_transmission
# n6_Sex
# n7_Vaccine_associated_myocarditis
# n8_Myocarditis_background
# n9_Vaccine_effectiveness_against_symptomatic_infection_by_age
# n10_Vaccine_effectiveness_against_symptomatic_infection_by_variant
# n11_Vaccine_effectiveness_against_infection
# n12_Vaccine_effectiveness_against_death_if_infected_by_age
# n13_Vaccine_effectiveness_against_death_if_infected_by_variant
# n14_Vaccine_effectiveness_against_death
# n15_Risk_of_infection_by_age_variant_and_sex
# n16_Risk_of_infection_under_current_transmission_and_vaccination_status
# n17_Myocarditis_from_COVID19
# n18_Die_from_Pfizer_myocarditis
# n19_Die_from_background_myocarditis
# n20_Die_from_COVID19
# n21_Die_from_COVID19_myocarditis


def compute_probs(n1_pfizer_dose, n2_age, n5_ct, sex_vec):
    values = {
        "n6_Sex": sex_vec,
    }

    # always hardcode delta
    pfizer.set_fact(values, "n3_SARSCoV2_variant", "Delta")
    pfizer.set_fact(values, "n1_Pfizer_dose", n1_pfizer_dose)
    pfizer.set_fact(values, "n2_Age_distribution_of_population", n2_age)
    pfizer.set_fact(values, "n5_Community_transmission", n5_ct)

    n18 = pfizer.infer(values, "n18_Die_from_Pfizer_myocarditis")[0]
    n19 = pfizer.infer(values, "n19_Die_from_background_myocarditis")[0]
    n20 = pfizer.infer(values, "n20_Die_from_COVID19")[0]
    n21 = pfizer.infer(values, "n21_Die_from_COVID19_myocarditis")[0]

    return n18, n19, n20, n21