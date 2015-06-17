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

    wrapPromise(nextStep)
    {
        return (i)=>{
            var promise = new Promise((res,rej)=>{
                var result = nextStep.execute(i);
                res(result);
            });
            return promise;
        };
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

                var result = nextStep.execute(outputFromLastStep);

                if(typeof(result) == Promise)
                {
                    result(outputFromLastStep).then((output) => {startNextStep(nextStep,output);});
                }
                else
                {
                    startNextStep(nextStep,result);
                }


            }
            else
            {
                return res(outputFromLastStep);
            }

        };

            var pStep = this.wrapPromise(this.steps[0]);

            pStep({}).then((output) => {startNextStep(this.steps[0],output);});
        });

        return callPromise;
    }
}