import { filteredTargetArea } from "./OCRtrimmer.js";

const targetAreaDrawing = {
  topLeft: { x: 1883, y: 1564 },
  bottomRight: { x: 2167, y: 1617 },
};
const targetAreaName = {
  topLeft: { x: 1883, y: 1450 },
  bottomRight: { x: 2279, y: 1548 },
};
const targetAreaScale = {
  topLeft: { x: 1589, y: 1448 },
  bottomRight: { x: 1678, y: 1496 },
};
const targetAreaDraftingDate = {
  topLeft: { x: 1741, y: 1449 },
  bottomRight: { x: 1854, y: 1494 },
};
const targetCompanyName = {
  topLeft: { x: 1441, y: 1574 },
  bottomRight: { x: 1828, y: 1611 },
};

export const filteredImgObjects = (detections) => {
  const filteredDrawingNumber = filteredTargetArea(
    targetAreaDrawing,
    detections
  );
  const filteredName = filteredTargetArea(targetAreaName, detections);
  const filteredScale = filteredTargetArea(targetAreaScale, detections);
  const filteredDraftingDate = filteredTargetArea(
    targetAreaDraftingDate,
    detections
  );
  const filteredCompanyName = filteredTargetArea(targetCompanyName, detections);
  return {
    drawingNumber: filteredDrawingNumber,
    name: filteredName,
    scale: filteredScale,
    draftDate: filteredDraftingDate,
    company: filteredCompanyName,
  };
};
