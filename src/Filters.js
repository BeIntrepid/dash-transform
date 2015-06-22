//import * as Enumerable from 'linq-es6'

export class TransformNode
{
    ancestors = [];
    filter = null;
    name = 'unnamed TransformNode';

    constructor(name,filter)
    {
        this.name = name;
        this.filter = filter;
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

    addInput(ancestor)
    {
        this.ancestors.push(ancestor);
    }

    execute(inputObject,args) {
        return this.filter.execute.apply(this.filter,arguments);
    }

}

export class Pipe
{
    rootNode = [];

    constructor(name,rootNode)
    {
        this.name = name;
        this.rootNode = rootNode;
    }

    execute(inputObject,args)
    {
        return this.executeNode(this.rootNode,inputObject,args);
    }

    executeAncestors(node,inputObject,args)
    {
        var executeMethodResults = [];
        for(var s in node.ancestors)
        {
            var ancestorPromise = this.executeNode(node.ancestors[s],inputObject,args);
            executeMethodResults.push(ancestorPromise);
        }

        return Promise.all(executeMethodResults);
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

    executeNode(node,inputObject,args)
    {
        var executePromise = new Promise((res,rej)=>{
            var inputPromise = this.executeAncestors(node,inputObject,args);

            //Inputs should be an array of the results of executing the parent nodes
            inputPromise.then((inputs) =>{

                // this lets us apply the function which should give the correct argument the correct value
                var extractedInputs = this.extractInputs(inputs);
                var inputForFunction = [inputObject].concat(extractedInputs);

                var nodeExecutionResult = node.execute.apply(node,inputForFunction);

                // We wrap the results of the execution in a resolve call as the result of a filter may or may not be a promise
                var functionFilterExecutionPromise = Promise.resolve(nodeExecutionResult);

                functionFilterExecutionPromise.then((i)=>{
                    res(i);
                })
            });
        });

        return executePromise;
    }
}

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
        return Promise.resolve(this.toExecute.apply(null,arguments));
    }
}