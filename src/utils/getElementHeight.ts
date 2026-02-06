// utils/getElementHeight.ts
//$ Return the height of an element by passing in the element ref HTMLElement.

export function getElementHeight(el?: HTMLElement | null): number {
  return el ? el.getBoundingClientRect().height : 0;
}
