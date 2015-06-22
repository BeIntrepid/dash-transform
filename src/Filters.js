//import * as Enumerable from 'linq-es6'

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

    extractInputs(inputs)
    {
        var extratedInputs = [];
        for(var s in inputs)
        {
            extratedInputs.push(inputs[s]);
        }

        return extratedInputs;
    }

    execute(inputObject,args)
    {
        var executePromise = new Promise((res,rej)=>{
            var inputPromise = super.execute(inputObject,args);

            inputPromise.then((inputs) =>{

                //Inputs should be an array of the results of executing the parent nodes

                // this lets us apply the function which should give the correct argument the correct value

                var extractedInputs = this.extractInputs(inputs);

                var inputForFunction = [inputObject].concat(extractedInputs);
                var functionFilterExecutionResult = this.toExecute.apply(null,inputForFunction);
                var functionFilterExecutionPromise = Promise.resolve(functionFilterExecutionResult);

                functionFilterExecutionPromise.then((i)=>{
                    //let exInputs = this.extractInputs(i);

                    //var result = [inputObject].concat(exInputs);

                    res(i);
                })
            });
        });

        return executePromise;

    }
}