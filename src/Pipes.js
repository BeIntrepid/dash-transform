import * as steps from './steps'

export class Pipe
{
    constructor()
    {
        this.steps = [];
    }

    addFunctionStep(name,func)
    {
        let s = new steps.FunctionStep(name,func);
        this.steps.push(s);
    }

    call()
    {
        let input = {};
        var callPromise = new Promise((res,rej)=>{

        var startNextStep = (step,outputFromLastStep)=>{

            var nextStepIndex = this.steps.indexOf(step) + 1;
            if(nextStepIndex < this.steps.length)
            {
                var nextStep = this.steps[nextStepIndex];
                nextStep.execute(outputFromLastStep).then((output) => {startNextStep(nextStep,output);});
            }
            else
            {
                return res(outputFromLastStep);
            }

        };

        this.steps[0].execute().then((output) => {startNextStep(this.steps[0],output);});
        });

        return callPromise;
    }
}