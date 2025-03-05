import tw, { styled } from "twin.macro";

export const SamplePhrasesAccordion = styled.div`
  ${tw`
    w-full
    mt-6
   
    border-transparent
    rounded-md
   `}
`;

export const PhraseList = styled.ul`
  ${tw`
    divide-y
    divide-gray-100
   `}
`;

export const PhraseListItem = styled.li`
  ${tw`
    p-3
    hover:bg-gray-100
   `}
`;
