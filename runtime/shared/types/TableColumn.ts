export interface TableColumn {
  /**
   * Unique identifier and the key to map data from the row object
   */
  key: string
  /**
   * Display text for the column header
   */
  title?: string
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right'
  /**
   * CSS width (e.g., '100px', '20%')
   */
  width?: string
}
