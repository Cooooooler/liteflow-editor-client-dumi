import { Cell, Graph } from '@antv/x6';

/**
 * Checks if any cell is selected in the graph
 * @param {Graph} flowGraph - The X6 graph instance
 * @returns {boolean} True if at least one cell is selected
 */
export const hasCellSelected = (flowGraph: Graph): boolean => {
  return flowGraph.getSelectedCellCount() > 0;
};

/**
 * Checks if any node is selected in the graph
 * @param {Graph} flowGraph - The X6 graph instance
 * @returns {boolean} True if at least one node is selected
 */
export const hasNodeSelected = (flowGraph: Graph): boolean => {
  return (
    flowGraph.getSelectedCells().filter((cell: Cell) => cell.isNode()).length >
    0
  );
};

/**
 * Checks if any edge is selected in the graph
 * @param {Graph} flowGraph - The X6 graph instance
 * @returns {boolean} True if at least one edge is selected
 */
export const hasEdgeSelected = (flowGraph: Graph): boolean => {
  return (
    flowGraph.getSelectedCells().filter((cell: Cell) => cell.isEdge()).length >
    0
  );
};

/**
 * Gets all selected nodes from the graph
 * @param {Graph} flowGraph - The X6 graph instance
 * @returns {Cell[]} Array of selected node cells
 */
export const getSelectedNodes = (flowGraph: Graph): Cell[] => {
  return flowGraph.getSelectedCells().filter((cell: Cell) => cell.isNode());
};

/**
 * Gets all selected edges from the graph
 * @param {Graph} flowGraph - The X6 graph instance
 * @returns {Cell[]} Array of selected edge cells
 */
export const getSelectedEdges = (flowGraph: Graph): Cell[] => {
  return flowGraph.getSelectedCells().filter((cell: Cell) => cell.isEdge());
};

/**
 * Converts selected cells to JSON format
 * @param {Graph} flowGraph - The X6 graph instance
 * @returns {Object} Object containing selected cells as JSON
 */
export const toSelectedCellsJSON = (
  flowGraph: Graph,
): { cells: Cell.Properties[] } => {
  const json = flowGraph.toJSON();
  const selectedCells = flowGraph.getSelectedCells();
  return {
    cells: json.cells.filter((cell) =>
      selectedCells.find((o) => o.id === cell.id),
    ),
  };
};

/**
 * Handles time-consuming operations with proper UI feedback
 * @param {Function} beforeTimeConsuming - Function to call before starting the operation
 * @param {Function} afterTimeConsuming - Function to call after completing the operation
 * @param {Function} timeConsuming - The time-consuming operation that returns a Promise
 * @returns {Promise<void>} A promise that resolves when the operation is complete
 */
export const handleTimeConsumingOperations = async (
  beforeTimeConsuming: () => void,
  afterTimeConsuming: () => void,
  timeConsuming: () => Promise<any>,
) => {
  // Start loading state
  beforeTimeConsuming();

  // Ensure UI updates before heavy operation
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 100);
    });
  });

  try {
    if (window.requestIdleCallback) {
      // Use idle time for browsers that support it
      await new Promise<void>((resolve) => {
        window.requestIdleCallback(
          async () => {
            try {
              await timeConsuming();
              resolve();
            } catch (error) {
              console.error('Layout operation failed in idle callback:', error);
              resolve();
            }
          },
          { timeout: 2000 },
        );
      });
    } else {
      // Fallback for unsupported browsers
      await timeConsuming();
    }
  } catch (error) {
    console.error('Layout operation failed:', error);
  } finally {
    // End loading state
    afterTimeConsuming();
  }
};
