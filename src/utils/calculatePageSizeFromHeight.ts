// utils/calculatePageSizeFromHeight.ts

export type PageSizeConfig = {
  rowHeight: number;
  headerHeight?: number;
  footerHeight?: number;
  minRows?: number;
};

export function calculatePageSizeFromHeight(
  container: HTMLElement,
  {
    rowHeight,
    headerHeight = 0,
    footerHeight = 0,
    minRows = 1,
  }: PageSizeConfig,
): number {
  const availableHeight = container.clientHeight - headerHeight - footerHeight;
  // console.log("availableHeight:", availableHeight);

  const rows = Math.floor(availableHeight / rowHeight);
  // console.log("rows:", rows);

  return Math.max(rows, minRows);
}
