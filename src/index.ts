import { FSM } from './fsm/FSM';
import { Store } from './fsm/Store';
import { Process, ProcessTypeEnum } from './fsm/types';

const randomSleep = () => new Promise((r) => setTimeout(r, 1000 * Math.random()));

// Process supports any size of nesting steps
// Each function accepts Store and result of previous function or array of results (for Parallel type)
// Example:
const process: Process = {
  type: ProcessTypeEnum.SUCCESSIVELY,
  children: [
    {
      type: ProcessTypeEnum.STEP,
      run: async (store: Store, args: any) => {
        console.log(args); // start

        return 'Step 1';
      }
    },
    {
      type: ProcessTypeEnum.STEP,
      run: async (store: Store, args: string) => {
        console.log(args); // Step 1

        await store.setData(async () => ({ count: 0 }));

        return 2222;
      }
    },
    {
      type: ProcessTypeEnum.PARALLEL,
      children: [
        {
          type: ProcessTypeEnum.STEP,
          run: async (store: Store, args: number) => {
            console.log(args); // 2222

            await store.setData(async data => {
              await randomSleep();

              return { count: data.count + 1 }
            });

            return 1;
          }
        },
        {
          type: ProcessTypeEnum.STEP,
          run: async (store: Store, args: number) => {
            console.log(args); // 2222

            await store.setData(async data => {
              await randomSleep();

              return { count: data.count + 1 }
            });

            return 2;
          }
        },
        {
          type: ProcessTypeEnum.PARALLEL,
          children: [
            {
              type: ProcessTypeEnum.STEP,
              run: async (store: Store, args: number) => {
                console.log(args); // 2222

                await store.setData(async data => {
                  await randomSleep();

                  return { count: data.count + 1 }
                });

                return 3;
              }
            },
            {
              type: ProcessTypeEnum.STEP,
              run: async (store: Store, args: number) => {
                console.log(args); // 2222

                await store.setData(async data => {
                  await randomSleep();

                  return { count: data.count + 1 }
                });

                return 4;
              }
            },
            {
              type: ProcessTypeEnum.CONDITION,
              condition: 2 > 3,
              then: {
                type: ProcessTypeEnum.STEP,
                run: async () => 5
              },
              else: {
                type: ProcessTypeEnum.STEP,
                run: async () => 6
              }
            },
          ]
        },
      ]
    },
    {
      type: ProcessTypeEnum.CONDITION,
      condition: (store: Store, args: Array<any>) => store.getData().count === 4,
      then: {
        type: ProcessTypeEnum.STEP,
        run: async (store: Store, args: string) => {
          console.log('count === 4')
          console.log(args); // [1, 2, [3, 4, 6]]
        }
      },
      else: {
        type: ProcessTypeEnum.STEP,
        run: async (store: Store) => console.log('count !== 4', store.getData()?.count)
      }
    },
  ]
}

const store = new Store({})
const fsm = new FSM(store);

fsm.run(process, 'start')
  .then(console.log)
  .catch(console.error);