import React, { useState } from 'react';

import {
  PhraseList,
  PhraseListItem,
  SamplePhrasesAccordion,
} from "./SamplePhrases.styles";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { samplePhraseDict } from "../../constants";

const WordList = ({ sentences, setSamplePhrase }) => {
  const onClick = (index) => {
    setSamplePhrase(sentences[index]);
  };

  return (
    <PhraseList>
      {sentences.map((sentence, index) => (
        <PhraseListItem key={index} onClick={() => onClick(index)}>
          {sentence}
        </PhraseListItem>
      ))}
    </PhraseList>
  );
};

const TabPanel = ({ value, index, sentences, setSamplePhrase }) => (
  <div>
    {value === index && (
      <WordList sentences={sentences} setSamplePhrase={setSamplePhrase} />
    )}
  </div>
);

const SamplePhrases = ({ sourceLanguage, setSamplePhrase }) => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <SamplePhrasesAccordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 className="font-bold text-xl">Sample Phrases</h2>
        </AccordionSummary>
        <AccordionDetails>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {samplePhraseDict[sourceLanguage].map((section, index) => (
              <Tab key={index} label={section[0]} />
            ))}
          </Tabs>
          {samplePhraseDict[sourceLanguage].map((section, index) => (
            <TabPanel
              value={tab}
              key={index}
              index={index}
              sentences={section[1]}
              setSamplePhrase={setSamplePhrase}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </SamplePhrasesAccordion>
  );
};

export default SamplePhrases;
