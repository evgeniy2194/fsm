import { Process, ProcessCondition, ProcessStep, ProcessTypeEnum, ProcessWithChildren } from './types';
import { Store } from './Store';

export class FSM {
  readonly store?: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async run(process: Process, args: any) {
    switch (process.type) {
      case ProcessTypeEnum.SUCCESSIVELY:
        return this.execSuccessively((process as ProcessWithChildren).children, args);
      case ProcessTypeEnum.STEP:
        return this.execStep(process as ProcessStep, args)
      case ProcessTypeEnum.PARALLEL:
        return this.execParallel((process as ProcessWithChildren).children, args);
      case ProcessTypeEnum.CONDITION:
        return this.execCondition(process as ProcessCondition, args)
    }
  }

  async execSuccessively(children: Process[], args: any): Promise<any> {
    return children.reduce(async (acc: any, process: Process) => {
      return await this.run(process, await acc);
    }, args)
  }

  async execStep(process: ProcessStep, args: any) {
    return await process.run(this.store as Store, args)
  }

  async execCondition(process: ProcessCondition, args: any): Promise<any> {
    const condition = typeof process.condition === 'function' ?
      process.condition(this.store as Store, args) :
      process.condition;

    return this.run(condition ? process.then : process.else, args);
  }

  async execParallel(children: Process[], args: any): Promise<Array<any>> {
    return await Promise.all(
      children.map(async (process: Process) => await this.run(process, args))
    )
  }
}