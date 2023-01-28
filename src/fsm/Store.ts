import { AsyncQueue } from '../asyncQueue';

export class Store {
  private data: any = {};
  private asyncQueue: AsyncQueue;

  constructor(data: any) {
    this.data = data;
    this.asyncQueue = new AsyncQueue();
  }

  getData(): any {
    return this.data;
  }

  async setData(callback: (data: any) => any) {
    return this.asyncQueue.add(async () => {
      this.data = await callback(this.getData());
    });
  }
}