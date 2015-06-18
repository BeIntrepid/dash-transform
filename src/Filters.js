export class Filter
{
    ancestors = [];

    constructor(name)
    {
        this.name = name;
    }

    addInputFilter(Filter)
    {
        this.ancestors.push(Filter);
    }

    execute(input)
    {
        var executeMethodResults = [];
        for(var s in this.ancestors)
        {
            var filter = this.ancestors[s];
            executeMethodResults.push(filter.execute(input));
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