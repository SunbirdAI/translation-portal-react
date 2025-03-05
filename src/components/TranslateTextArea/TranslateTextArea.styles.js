import styled from "styled-components";
import { Select, MenuItem, TextareaAutosize } from "@mui/material";

export const LanguageDropdown = styled(Select)`
  width: 120px;
  margin-right: 13px;
`;

export const DropdownOption = styled(MenuItem)`
  font-size: 14px;
`;

export const TextArea = styled(TextareaAutosize)`
  width: 100%;
  min-height: 150px;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 10px;
  font-size: 16px;
  resize: none;
  &:disabled {
    background-color: #f9f9f9;
  }
`;

export const TranslateFooter = styled.div`
  align-self: flex-end;
  margin-top: 2rem;
  display: flex;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export const OverlayContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;
