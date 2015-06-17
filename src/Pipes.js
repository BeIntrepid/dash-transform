import * as steps from './steps'

export class Pipe
{
    constructor()
    {
        this.endStep = null;
    }

    addFunctionStep(name,func)
    {
        let s = new steps.FunctionStep(name,func);
        this.steps.push(s);
    }

    addStepTree(step)
    {
        this.endStep = step;
    }

    call()
    {
        return Promise.resolve(this.endStep.execute());
    }
}