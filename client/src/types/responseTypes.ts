export type responseType = {
  search: [
    {
      product: string;
      score: number;
      matchedImage: string;
    }
  ];
};

export type ocrResponse = {
  text: string[];
};

export type normalOcrResponse = {
  text: string;
};
