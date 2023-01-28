export class AsyncQueue {
  private promise: Promise<any> = Promise.resolve();

  async add(task: () => Promise<any>): Promise<any> {
    this.promise = this.promise.then(() => {
      return task()
    });

    return this.promise;
  }
}

/*
// Usage:
const task = async <T>(value: T) => {
  await new Promise((r) => setTimeout(r, 1000 * Math.random()));
  console.log(value);

  return value;
};

const queue = new AsyncQueue();

await Promise.all([
  task(1),
  task(2),
  task(3),
  task(4),
]);

await Promise.all([
  queue.add(() => task(5)),
  queue.add(() => task(6)),
  queue.add(() => task(7)),
  queue.add(() => task(8)),
]);
*/
/*
  Output:
  2
  3
  1
  4

  5
  6
  7
  8
*/
