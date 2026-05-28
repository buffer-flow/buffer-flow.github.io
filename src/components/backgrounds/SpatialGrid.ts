/**
 * A spatial grid for efficient spatial partitioning.
 * Divides space into cells to minimize distance calculations.
 * Reduces collision/gravity checks from O(n²) to O(n * nearby_particles)
 */
export class SpatialGrid<T extends { x: number; y: number }> {
  private cellSize: number;
  private grid: Map<string, T[]>;
  private width: number;
  private height: number;
  private colsCount: number;
  private rowsCount: number;

  constructor(width: number, height: number, cellSize: number = 100) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.colsCount = Math.ceil(width / cellSize);
    this.rowsCount = Math.ceil(height / cellSize);
    this.grid = new Map();
  }

  /**
   * Get the grid key for a given position
   */
  private getKey(x: number, y: number): string {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    return `${col},${row}`;
  }

  /**
   * Insert an item into the grid
   */
  insert(item: T): void {
    const key = this.getKey(item.x, item.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(item);
  }

  /**
   * Clear the grid
   */
  clear(): void {
    this.grid.clear();
  }

  /**
   * Get all items in the grid
   */
  getAllItems(): T[] {
    const items: T[] = [];
    for (const cells of this.grid.values()) {
      items.push(...cells);
    }
    return items;
  }

  /**
   * Query items in a cell and all adjacent cells (8-neighbor search)
   * Returns items within the querying cell and its 8 neighbors
   */
  getNearby(x: number, y: number, range: number = 1): T[] {
    const nearby: T[] = [];
    const centerCol = Math.floor(x / this.cellSize);
    const centerRow = Math.floor(y / this.cellSize);

    // Check the center cell and all neighboring cells within range
    for (let col = centerCol - range; col <= centerCol + range; col++) {
      for (let row = centerRow - range; row <= centerRow + range; row++) {
        // Skip out-of-bounds cells
        if (col < 0 || col >= this.colsCount || row < 0 || row >= this.rowsCount) {
          continue;
        }

        const key = `${col},${row}`;
        const items = this.grid.get(key);
        if (items) {
          nearby.push(...items);
        }
      }
    }

    return nearby;
  }

  /**
   * Rebuild the grid from a list of items
   */
  rebuild(items: T[]): void {
    this.clear();
    for (const item of items) {
      this.insert(item);
    }
  }

  /**
   * Update grid cellSize and dimensions (call when canvas resizes)
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.colsCount = Math.ceil(width / this.cellSize);
    this.rowsCount = Math.ceil(height / this.cellSize);
    this.clear();
  }

  /**
   * Get diagnostics info for debugging
   */
  getDiagnostics() {
    let totalItems = 0;
    let cellsUsed = 0;
    let maxItemsPerCell = 0;
    let minItemsPerCell = Infinity;

    for (const items of this.grid.values()) {
      cellsUsed++;
      totalItems += items.length;
      maxItemsPerCell = Math.max(maxItemsPerCell, items.length);
      minItemsPerCell = Math.min(minItemsPerCell, items.length);
    }

    return {
      totalItems,
      cellsUsed,
      totalCells: this.colsCount * this.rowsCount,
      avgItemsPerCell: cellsUsed > 0 ? totalItems / cellsUsed : 0,
      maxItemsPerCell,
      minItemsPerCell: cellsUsed > 0 ? minItemsPerCell : 0,
    };
  }
}
