import * as steps from './steps'

export class Pipe
{
    constructor()
    {
        this.endStep = null;
    }

    addStepTree(step)
    {
        this.endStep = step;
    }

    call(input)
    {
        return Promise.resolve(this.endStep.execute(input));
    }
}