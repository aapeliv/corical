import logging
import signal
from base64 import b64encode
from concurrent import futures
from datetime import datetime
from time import perf_counter_ns

import grpc
import numpy as np
import pytz
from google.protobuf.timestamp_pb2 import Timestamp

from pfizer import compute_probs as compute_pfizer_probs
from proto import corical_pb2, corical_pb2_grpc
from risks import generate_relatable_risks
from tts import compute_probs, scenario_to_vec
from tts_util import get_age_bracket, get_age_bracket_pz, get_link

utc = pytz.UTC

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(32))
server.add_insecure_port(f"[::]:21000")


def now():
    return datetime.now(utc)


def Timestamp_from_datetime(dt: datetime):
    pb_ts = Timestamp()
    pb_ts.FromDatetime(dt)
    return pb_ts


def generate_bar_graph_risks(input_risks):
    return sorted(
        input_risks
        + [
            corical_pb2.BarGraphRisk(
                label=r["event"],
                risk=r["risk"],
                is_relatable=True,
            )
            for r in generate_relatable_risks([risk.risk for risk in input_risks])
        ],
        key=lambda br: br.risk,
    )


class Corical(corical_pb2_grpc.CoricalServicer):
    def ComputeTTS(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        # az shots
        if request.vaccine == "az0":
            vaccine_label = f"no doses of the AstraZeneca vaccine"
            az_vec = np.array([1.0, 0.0, 0.0])
            az_vec1 = np.array([0.0, 1.0, 0.0])
            az_text1 = "with one shot"
            az_vec2 = np.array([0.0, 0.0, 1.0])
            az_text2 = "with two shots"
            first_or_second_az = "error"
            had_az = False
        elif request.vaccine == "az1":
            vaccine_label = f"one dose of the AstraZeneca vaccine"
            az_vec = np.array([0.0, 1.0, 0.0])
            az_vec1 = np.array([1.0, 0.0, 0.0])
            az_text1 = "without a shot"
            az_vec2 = np.array([0.0, 0.0, 1.0])
            az_text2 = "with two shots"
            first_or_second_az = "first"
            had_az = True
        elif request.vaccine == "az2":
            vaccine_label = f"two doses of the AstraZeneca vaccine"
            az_vec = np.array([0.0, 0.0, 1.0])
            az_vec1 = np.array([1.0, 0.0, 0.0])
            az_text1 = "without a shot"
            az_vec2 = np.array([0.0, 1.0, 0.0])
            az_text2 = "with one shot"
            first_or_second_az = "second"
            had_az = True
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid vaccine")

        # age
        age_label, age_vec, age_ix = get_age_bracket(request.age)

        link = get_link(request.sex, age_ix)

        if link:
            printable = corical_pb2.PrintableButton(
                url=link, text=f"Get printable graphs for a {age_label} {sex_label}"
            )
        else:
            printable = None

        # community transmission
        ct_vec = scenario_to_vec(request.transmission)
        if request.transmission == "None_0":
            transmission_label = "no"
        elif request.transmission == "ATAGI_High_3_544_percent":
            transmission_label = "high"
        elif request.transmission == "ATAGI_Med_0_275_percent":
            transmission_label = "medium"
        elif request.transmission == "ATAGI_Low_0_029_percent":
            transmission_label = "low"
        else:
            transmission_label = request.transmission

        if request.transmission == "None_0":
            messages.append(
                corical_pb2.Message(
                    heading="Note",
                    text="You have selected a scenario with no community transmission. This is only a temporary situation and will change when state or national borders open.",
                    severity="warning",
                )
            )

        # variant
        # hardcoded as 100% Delta
        variant_vec = np.array([0.0, 1.0])

        # explanation = f"For a {age_label} {sex_label} who has had {vaccine_label}, and under {transmission_label} community transmission, the risks of the following events are shown."

        blood_clot_brief = (
            "An atypical blood clot refers to a blood clot like thrombosis with thrombocytopenia syndrome (TTS)."
        )
        # for graphs
        subtitle = f"Results shown for a {age_label} {sex_label} who has {vaccine_label}, under {transmission_label} transmission scenario."
        # for output groups
        explanation = subtitle

        logger.info(f"{az_vec=}")
        logger.info(f"{age_vec=}")
        logger.info(f"{sex_vec=}")
        logger.info(f"{variant_vec=}")
        logger.info(f"{ct_vec=}")
        (
            symptomatic_infection,
            get_tts,
            die_from_covid_given_infected,
            die_from_tts,
            die_from_clots,
            die_from_covid,
            get_clots_covid_given_infected,
            die_from_clots_covid_given_infected,
        ) = compute_probs(az_vec, age_vec, sex_vec, variant_vec, ct_vec)
        (
            symptomatic_infection_other1,
            get_tts_other1,
            die_from_covid_given_infected_other1,
            die_from_tts_other1,
            die_from_clots_other1,
            die_from_covid_other1,
            get_clots_covid_given_infected_other1,
            die_from_clots_covid_given_infected_other1,
        ) = compute_probs(az_vec1, age_vec, sex_vec, variant_vec, ct_vec)
        (
            symptomatic_infection_other2,
            get_tts_other2,
            die_from_covid_given_infected_other2,
            die_from_tts_other2,
            die_from_clots_other2,
            die_from_covid_other2,
            get_clots_covid_given_infected_other2,
            die_from_clots_covid_given_infected_other2,
        ) = compute_probs(az_vec2, age_vec, sex_vec, variant_vec, ct_vec)
        logger.info(f"{symptomatic_infection=}, {1-symptomatic_infection=}")

        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description="This is the scenario description",
            printable=printable,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my chance of getting COVID-19 if there are {transmission_label} transmissions in the community?",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Chance of getting COVID-19 over 6 months",
                                risk=symptomatic_infection,
                            ),
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 over 6 months ({az_text1})",
                                risk=symptomatic_infection_other1,
                                is_other_shot=True,
                            ),
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 over 6 months ({az_text2})",
                                risk=symptomatic_infection_other2,
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying if I get COVID-19?",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Chance of dying from COVID-19",
                                risk=die_from_covid_given_infected,
                            ),
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from COVID-19 ({az_text1})",
                                risk=die_from_covid_given_infected_other1,
                                is_other_shot=True,
                            ),
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from COVID-19 ({az_text2})",
                                risk=die_from_covid_given_infected_other2,
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of getting an atypical blood clot?",
                    subtitle=blood_clot_brief
                    + " "
                    + subtitle
                    + (
                        f" Results below show the chances of an atypical blood clot after the {first_or_second_az} dose of the AstraZeneca vaccine."
                        if had_az
                        else ""
                    ),
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Chance of developing atypical blood clot if I get COVID-19",
                                risk=get_clots_covid_given_infected,
                            )
                        ]
                        + (
                            [
                                corical_pb2.BarGraphRisk(
                                    label=f"Due to the {first_or_second_az} dose of the AstraZeneca vaccine",
                                    risk=get_tts,
                                )
                            ]
                            if get_tts > 0.0
                            else []
                        )
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying from an atypical blood clot?",
                    subtitle=blood_clot_brief
                    + " "
                    + subtitle
                    + (
                        f" Results below show the chances of death from an atypical blood clot after the {first_or_second_az} dose of the AstraZeneca vaccine."
                        if had_az
                        else ""
                    ),
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Chance of dying from atypical blood clot if I get COVID-19",
                                risk=die_from_clots_covid_given_infected,
                            )
                        ]
                        + (
                            [
                                corical_pb2.BarGraphRisk(
                                    label=f"Due to the {first_or_second_az} dose of the AstraZeneca vaccine",
                                    risk=die_from_tts,
                                )
                            ]
                            if die_from_tts > 0.0
                            else []
                        )
                    ),
                ),
            ],
            output_groups=[
                corical_pb2.OutputGroup(
                    heading="COVID-19 and outcomes of COVID-19",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(
                            name="Risk of getting symptomatic COVID-19 under current transmission and vaccination status",
                            risk=symptomatic_infection,
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19",
                            risk=die_from_covid,
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19 if you get infected",
                            risk=die_from_covid_given_infected,
                            comment="",
                        ),
                    ],
                ),
                corical_pb2.OutputGroup(
                    heading="Death from atypical blood clots",
                    explanation=blood_clot_brief + " " + explanation,
                    risks=(
                        [
                            corical_pb2.Risk(
                                name="Risk of dying from thrombosis with thrombocytopenia syndrome (TTS) from the AstraZeneca vaccine",
                                risk=die_from_tts,
                                comment="",
                            )
                        ]
                        if die_from_tts > 0.0
                        else []
                    )
                    + [
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19 related blood clot if you are infected",
                            risk=die_from_clots_covid_given_infected,
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Background risk of dying from an atypical blood clot",
                            risk=die_from_clots,
                            comment="",
                        ),
                    ],
                ),
            ],
            success=True,
            msg=str(request),
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms

        binlog = corical_pb2.BinLog(
            time=time,
            tts_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out

    def ComputePfizer(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        age_text, age_label, age_ix = get_age_bracket_pz(request.age)
        if request.ct == "None_0":
            transmission_label = "no"
        elif request.ct == "ATAGI_High_5_76_percent":
            transmission_label = "high"
        elif request.ct == "ATAGI_Med_0_45_percent":
            transmission_label = "medium"
        elif request.ct == "ATAGI_Low_0_05_percent":
            transmission_label = "low"
        else:
            transmission_label = request.ct

        if request.ct == "None_0":
            messages.append(
                corical_pb2.Message(
                    heading="Note",
                    text="You have selected a scenario with no community transmission. This is only a temporary situation and will change when state or national borders open.",
                    severity="warning",
                )
            )

        # for graphs
        subtitle = f"Results shown for a {age_label} {sex_label} who has TODO pfizers, under {transmission_label} transmission scenario."
        # for output groups
        explanation = subtitle

        (
            n18_Die_from_Pfizer_myocarditis,
            n19_Die_from_background_myocarditis,
            n20_Die_from_COVID19,
            n21_Die_from_COVID19_myocarditis,
        ) = compute_pfizer_probs(request.dose, age_label, request.ct, sex_vec)

        out = corical_pb2.ComputeRes(
            messages=messages,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"n18_Die_from_Pfizer_myocarditis",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="n18_Die_from_Pfizer_myocarditis",
                                risk=n18_Die_from_Pfizer_myocarditis,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"n19_Die_from_background_myocarditis",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="n19_Die_from_background_myocarditis",
                                risk=n19_Die_from_background_myocarditis,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"n20_Die_from_COVID19",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="n20_Die_from_COVID19",
                                risk=n20_Die_from_COVID19,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"n21_Die_from_COVID19_myocarditis",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="n21_Die_from_COVID19_myocarditis",
                                risk=n21_Die_from_COVID19_myocarditis,
                            ),
                        ]
                    ),
                ),
            ],
            output_groups=[
                corical_pb2.OutputGroup(
                    heading="Raw outputs",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(
                            name="n18_Die_from_Pfizer_myocarditis",
                            risk=n18_Die_from_Pfizer_myocarditis,
                        ),
                        corical_pb2.Risk(
                            name="n19_Die_from_background_myocarditis",
                            risk=n19_Die_from_background_myocarditis,
                        ),
                        corical_pb2.Risk(
                            name="n20_Die_from_COVID19",
                            risk=n20_Die_from_COVID19,
                        ),
                        corical_pb2.Risk(
                            name="n21_Die_from_COVID19_myocarditis",
                            risk=n21_Die_from_COVID19_myocarditis,
                        ),
                    ],
                ),
            ],
            success=True,
            msg=str(request),
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms

        binlog = corical_pb2.BinLog(
            time=time,
            pfizer_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out


corical_pb2_grpc.add_CoricalServicer_to_server(Corical(), server)
server.start()
signal.pause()
