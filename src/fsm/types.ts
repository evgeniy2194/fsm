import { Store } from './Store';

export enum ProcessTypeEnum {
  SUCCESSIVELY = 'SUCCESSIVELY',
  STEP = 'STEP',
  PARALLEL = 'PARALLEL',
  CONDITION = 'CONDITION'
}

export type ConditionFn = (store: Store, args: any) => boolean

export type Process = ProcessWithChildren | ProcessStep | ProcessCondition

interface BaseProcess {
  type: ProcessTypeEnum
}

export interface ProcessWithChildren extends BaseProcess {
  children: Process[],
}

export interface ProcessStep extends BaseProcess {
  run: (store: Store, args?: any) => Promise<any>
}

export interface ProcessCondition extends BaseProcess {
  condition: ConditionFn | boolean
  then: Process
  else: Process
}