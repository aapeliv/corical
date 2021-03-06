import { useState } from "react";
import TTSForm from "./TTSForm";
import PfizerForm from "./PfizerForm";
import PfizerChildrenForm from "./PfizerChildrenForm";
import { TTSFormData, PfizerFormData, computeTts, computePfizer, computePfizerChildren } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { BY_LINE, TITLE } from "./constants";
import Skel from "./Skel";
import { 
  Button , 
  Typography,   
  Box,
  Container,
} from "@material-ui/core";
import { Link, Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { FAQ_ITEMS }  from "./FAQ";
import { RELEASE_NOTES } from "./ReleaseNotes" ;

function IndexRoute() {
  return (
    <>
      <h1>Choose a risk calculator</h1>
      <Box mb={4}>
      <h2>First dose Pfizer - Omicron Variant, updated 11/03/2022</h2>
      <Button component={Link} to="/pfizer" color="primary" variant="contained">
        Pfizer calculator
      </Button>
      </Box>
      <Box mb={5}>
      <h2>First dose AstraZeneca - Omicron Variant, updated 11/03/2022</h2>
      <Button
        component={Link}
        to="/astrazeneca"
        color="primary"
        variant="contained"
      >
        AstraZeneca calculator
      </Button>
      </Box>
      <Box mb={5}>
      <h2>Pfizer for Children - Omicron Variant, updated 27/05/2022</h2>
      <Button
        component={Link}
        to="/pfizer_children"
        color="primary"
        variant="contained"
      >
        Children's calculator
      </Button>
      </Box>
      <h1>View risk chart </h1>
      <h2>Risk of dying from COVID-19 based on age, sex, and vaccination status - 90% Omicron/10% Delta Variants, updated January 2022</h2>
      <Button
        href="https://www.immunisationcoalition.org.au/wp-content/uploads/2021/05/2022_03_24_Covid-risk-chart-MJA.pdf"
        color="primary"
        variant="contained"
        rel="noreferrer" 
        target="_blank"
      >
        Risk chart
      </Button>
      
    </>
  );
}

function PfizerRoute() {
  const [error, setError] = useState<string | null>(null);
  const [pfizerOutput, setPfizerOutput] = useState<any | null>(null);
  const pfizerCallback = async (form: PfizerFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computePfizer(form);
      setPfizerOutput(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator selection
      </Button>
      <PfizerForm callback={pfizerCallback} />
      {error ? (
        <Alert severity="error">
          <AlertTitle>An error occured</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Output output={pfizerOutput} />
      )}
    </>
  );
}

function PfizerChildrenRoute() {
  const [error, setError] = useState<string | null>(null);
  const [pfizerChildrenOutput, setPfizerChildrenOutput] = useState<any | null>(null);
  const pfizerChildrenCallback = async (form: PfizerFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computePfizerChildren(form);
      setPfizerChildrenOutput(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator selection
      </Button>
      <PfizerChildrenForm callback={pfizerChildrenCallback} />
      {error ? (
        <Alert severity="error">
          <AlertTitle>An error occured</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Output output={pfizerChildrenOutput} />
      )}
    </>
  );
}
function AZRoute() {
  const [error, setError] = useState<string | null>(null);
  const [ttsOutput, setTTSOutput] = useState<any | null>(null);
  const ttsCallback = async (form: TTSFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computeTts(form);
      setTTSOutput(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator selection
      </Button>
      <TTSForm callback={ttsCallback} />
      {error ? (
        <Alert severity="error">
          <AlertTitle>An error occured</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Output output={ttsOutput} />
      )}
    </>
  );
}

function PubRoute() {
  return (
    <>
      <Box my={4}>
        <h1>Publications</h1>
        <Container maxWidth="lg">
          <h2>Peer Reviewed</h2>
          <Container maxWidth="lg">
            <Typography>
              Lau, C. L., H. J. Mayfield, J. E. Sinclair, S. J. Brown, M. Waller, 
              A. K. Enjeti, A. Baird, K. Short, K. Mengersen and J. Litt (2021). 
              "Risk-benefit analysis of the AstraZeneca COVID-19 vaccine in Australia 
              using a Bayesian network modelling framework." Vaccine.  
              <a
                href="https://doi.org/10.1016/j.vaccine.2021.10.079"
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >https://doi.org/10.1016/j.vaccine.2021.10.079</a>
            </Typography>
          </Container>
          <h2>Pre-prints</h2>
          <Container maxWidth="lg">
            <Typography>
              Mayfield, H. J., C. L. Lau, J. E. Sinclair, S. J. Brown, A. Baird, 
              J. Litt, A. Vuorinen, K. R. Short, M. Waller and K. Mengersen (2021). 
              "Designing an evidence-based Bayesian network for estimating the risk 
              versus benefits of AstraZeneca COVID-19 vaccine."  
              medRxiv: 2021.2010.2028.21265588. 
              <a
                href="https://www.medrxiv.org/content/10.1101/2021.10.28.21265588v1" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >https://www.medrxiv.org/content/10.1101/2021.10.28.21265588v1</a>
              <br />
              <br />
              Sinclair, J. E., H. J. Mayfield, K. R. Short, S. J. Brown, R. Puranik, 
              K. Mengersen, J. C. Litt and C. L. Lau (2022). 
              "Quantifying the risks versus benefits of the Pfizer COVID-19 vaccine 
              in Australia: a Bayesian network analysis." 
              medRxiv: 2022.2002.2007.22270637.  
              <a
                href="https://www.medrxiv.org/content/10.1101/2022.02.07.22270637v1" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >https://www.medrxiv.org/content/10.1101/2022.02.07.22270637v1</a>
            </Typography>
          </Container>
        </Container>
      </Box>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
    </>
  );
}

function FaqRoute() {
  return (
    <>
      <Box my={4}>
        <h1>FAQs</h1>
        <Container maxWidth="lg">
          <Typography>
          {FAQ_ITEMS.map(({ question, answer }) => (
            <>
              <b>{question}</b>
              <br />
              {answer}
              <br />
              <br />
            </>
          ))}
          </Typography>
        </Container>
      </Box>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
    </>
  );
}

function NewRoute() {
  return (
    <>
      <Box my={4}>
        <h1>What's New</h1>
        <Container maxWidth="lg">
          {RELEASE_NOTES}
        </Container>
      </Box>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
    </>
  );
}

export default function App() {
  return (
    <Skel title={TITLE} subtitle={BY_LINE}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexRoute />} />
          <Route path="/pfizer" element={<PfizerRoute />} />
          <Route path="/pfizer_children" element={<PfizerChildrenRoute />} />
          <Route path="/astrazeneca" element={<AZRoute />} />
          <Route path="/publications" element={<PubRoute />} />
          <Route path="/faq" element={<FaqRoute />} />
          <Route path="/whatsnew" element={<NewRoute />} />
        </Routes>
      </BrowserRouter>
    </Skel>
  );
}
