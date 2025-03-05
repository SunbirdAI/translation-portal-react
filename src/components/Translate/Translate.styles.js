import tw, { styled } from "twin.macro";
import { motion } from "framer-motion";

export const MainContainer = styled.div`
  ${tw`
    h-full
    flex
    flex-col
    items-center
    p-4
    transition-all
    duration-300
    ease-in-out
  `}
  @media (min-width: 768px) {
    ${tw`p-6`}
  }
  @media (min-width: 1024px) {
    ${tw`p-2`}
  }
  @media (min-width: 1280px) {
    ${tw`p-8`}
  }
`;

// export const Note = styled.div`
//   ${tw`
//     fixed
//     bottom-0
//     left-0
//     z-40
//     w-full
//     flex
//     items-center
//     justify-between
//     bg-white shadow-lg
//     border
//     text-gray-700
//     px-16
//     py-4

//   `}
// `;

// export const CloseButton = styled.button`
//   ${tw`
//     absolute
//     top-2
//     right-2
//     bg-transparent
//     border-none
//     text-yellow-800
//     cursor-pointer
//     text-lg
//   `}
// `;

export const SplitContainer = styled.div`
  ${tw`
    w-full
    flex
    flex-col
    lg:flex-row
    gap-4
  `}
`;

export const Note = styled(motion.div)`
  ${tw`
    fixed 
    bottom-0 
    left-0 
    z-50 
    w-full 
    flex 
    items-center 
    justify-between 
    bg-white 
    shadow-2xl 
    border-t 
    border-blue-100 
    text-gray-800 
    px-6 
    py-4 
    text-sm
  `}
`;

export const NoteContent = styled.div`
  ${tw`
    flex 
    items-center 
    space-x-4 
    max-w-5xl 
    mx-auto 
    w-full
  `}
`;

export const NoteText = styled.p`
  ${tw`
    grow 
    text-sm 
    leading-relaxed
  `}
`;

export const CloseButton = styled.button`
  ${tw`
    absolute
    top-0
    right-0
    text-gray-500 
    hover:text-gray-700 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-300 
    rounded-full 
    p-2 
    transition-colors 
    duration-200
  `}
`;
