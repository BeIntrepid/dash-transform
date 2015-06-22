//import * as Enumerable from 'linq-es6'

export class Filter
{
    inputObject = null;

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
        return Promise.resolve(true);
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
        return Promise.resolve(this.toExecute.apply(null,arguments));
    }
}