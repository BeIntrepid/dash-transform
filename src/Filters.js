export class Filter
{
    inputObject = null;
    ancestors = [];

    constructor(name)
    {
        this.name = name;
    }

    addInputFilter(Filter)
    {
        this.ancestors.push(Filter);
    }

    execute(inputObject,args)
    {
        var executeMethodResults = [];
        for(var s in this.ancestors)
        {
            var filter = this.ancestors[s];
            executeMethodResults.push(filter.execute(inputObject,args));
        }
        return Promise.all(executeMethodResults);
    }
}

export class FunctionFilter extends Filter
{
    constructor(name,toExecute)
    {
        super(name);
        this.toExecute = toExecute;
    }

    execute(inputObject,args)
    {
        var executePromise = new Promise((res,rej)=>{
            var inputPromise = super.execute(inputObject,args);

            inputPromise.then((inputs) =>{
                if(inputs.length == 0)
                {
                    inputs = [args];
                }

               Promise.resolve(this.toExecute.apply(null,[inputObject].concat(inputs))).then((i)=>{
                    res(inputObject,i);
                })
            });
        });

        return executePromise;

    }
}