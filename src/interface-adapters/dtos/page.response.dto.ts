export class PageResponse<T> {
  constructor(props: PageResponse<T>) {
    Object.assign(this, props);
  }

  data!: T[];
  total!: number;
  size!: number;
  page!: number;
}
