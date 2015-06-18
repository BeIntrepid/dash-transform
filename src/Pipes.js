import * as steps from './steps'

export class Pipe extends steps.Executeable
{
    constructor(name)
    {
        super(name);
        this.endStep = null;
    }

    addStepTree(step)
    {
        this.endStep = step;
    }

    execute(input)
    {
        return this.call(input);
    }


    call(input)
    {
        return Promise.resolve(this.endStep.execute(input));
    }
}