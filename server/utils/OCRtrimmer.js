export const filteredTargetArea = (targetArea, detections) => {
  const filteredTextArray = detections
    .filter((detection) => {
      return detection.boundingPoly.vertices.some(
        (vertex) =>
          vertex.x >= targetArea.topLeft.x &&
          vertex.x <= targetArea.bottomRight.x &&
          vertex.y >= targetArea.topLeft.y &&
          vertex.y <= targetArea.bottomRight.y
      );
    })
    .map((detection) => detection.description);
  return filteredTextArray;
};
