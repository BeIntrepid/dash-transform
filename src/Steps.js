export class Step
{
    constructor(name)
    {
        this.name = name;
    }

    execute()
    {}
}

export class FunctionStep extends Step
{
    constructor(name,toExecute)
    {
        super(name);
        this.toExecute = toExecute;
    }

    execute(i)
    {
        return this.toExecute(i);
    }
}