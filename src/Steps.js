export class Executeable
{
    ancestors = [];

    constructor(name)
    {
        this.name = name;
    }

    addInputStep(step)
    {
        this.ancestors.push(step);
    }

    execute(input)
    {
        var executeMethodResults = [];
        for(var s in this.ancestors)
        {
            var step = this.ancestors[s];
            executeMethodResults.push(step.execute(input));
        }
        return Promise.all(executeMethodResults);
    }
}

export class FunctionStep extends Executeable
{
    constructor(name,toExecute)
    {
        super(name);
        this.toExecute = toExecute;
    }

    execute(i)
    {
        var executePromise = new Promise((res,rej)=>{
            var inputPromise = super.execute(i);

            inputPromise.then((inputs) =>{

               Promise.resolve(this.toExecute.apply(null,inputs)).then((i)=>{
                    res(i);
                })
            });
        });

        return executePromise;

    }
}