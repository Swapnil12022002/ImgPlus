export interface CustomDropzoneProps {
  setFile?: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewImg?: React.Dispatch<React.SetStateAction<File | null>>;
  setSearchImg?: React.Dispatch<React.SetStateAction<File | null>>;
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  file?: File | null;
}
