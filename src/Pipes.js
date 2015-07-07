import {TransformLibrary} from './TransformLibrary'
import {FunctionFilter} from './Filters'
import {Filter} from './Filters'
import {TransformNode} from './Nodes'
import {TransformConfig} from './TransformConfig'
import {InputSpec} from './InputSpec'

export class Pipe
{
    rootNode = [];

    constructor(name,rootNode)
    {
        this.name = name;
        this.rootNode = rootNode;
    }

    getName()
    {
        return this.name;
    }

    add(filterObj)
    {

        var n = null;
        if(filterObj instanceof Function)
        {
            n = new TransformNode('NoName',new FunctionFilter('Implicit Pipe',filterObj));
        }
        else if(filterObj instanceof TransformNode)
        {
            n = filterObj;
        }
        else if(filterObj instanceof Filter)
        {
            n = new TransformNode('NoName',filterObj);
        }
        else if(typeof(filterObj) == "string")
        {
            var tl = new TransformLibrary();
            n = tl.getFilterWrapped(filterObj);
        }

        if(this.rootNode != null)
        {
            var rn = this.rootNode;
            this.rootNode = n;
            this.rootNode.addInput(rn);
        }
        else
        {
            this.rootNode = n;
        }

        return this;
    }

    execute(inputObject,args)
    {
        if(TransformConfig.enableDebugMessages) console.log('Executing pipe ' + this.name);
        return this.executeNode(this.rootNode,inputObject,args);
    }

    buildNodeInputSpec(parentSpec,node,f)
    {

        if(node.ancestors != null) {
            node.ancestors.forEach((a)=> {
                this.traverseAncestors(node, a);
            });

            f(node);
        }
    }

    flattenPipeSpec(spec)
    {
//        spec.inputs.forEach(()=>{})

        return spec;
    }

    buildInputSpec(parentSpec,node)
    {
        if(TransformConfig.enableDebugMessages) console.log('Building InputSpec for ' + this.name);

        if(node == null)
        {
            node = this.rootNode;
        }

        var nodeSpec = new InputSpec(node.pipe.name,[],[]);

            node.ancestors.forEach((a)=> {
                nodeSpec.ancestors.push(this.buildInputSpec(nodeSpec, a));
            });

            var inputSpec = node.buildInputSpec(nodeSpec, node);

            inputSpec.inputs.forEach((inSpec)=>{
                nodeSpec.inputs.push(inSpec);
            });

        //nodeSpec.inputs.push(node.buildInputSpec(nodeSpec, node).inputs);


        return nodeSpec;
    }


    executeAncestors(node,inputObject,args)
    {
        if(TransformConfig.enableDebugMessages) console.log('Executing ancestors for ' + this.name);

        var executeMethodResults = [];

        if(node.ancestors != null) {

            node.ancestors.forEach((a)=> {
                var ancestorPromise = this.executeNode(a, inputObject, args);
                executeMethodResults.push(ancestorPromise);
            });
        }

        if(TransformConfig.enableDebugMessages) console.log('Finished ancestors for ' + this.name);

        return Promise.all(executeMethodResults);
    }

    extractInputs(inputs)
    {
        var extratedInputs = [];
        inputs.forEach((s)=>{
            extratedInputs.push(s);
        });

        return extratedInputs;
    }

    executeNode(node,inputObject,args)
    {

        var executePromise = new Promise((res,rej)=>{
            var inputPromise = this.executeAncestors(node,inputObject,args);

            //Inputs should be an array of the results of executing the parent nodes
            inputPromise.then((inputs) =>{

                // this lets us apply the function which should give the correct argument the correct value
                if(inputs.length == 0 && args != null)
                {
                        inputs.push(args);
                }

                //Build the current scope name

                var extractedInputs = this.extractInputs(inputs);
                var inputForFunction = [inputObject].concat(extractedInputs);

                var nodeExecutionResult = node instanceof Pipe ?
                    node.execute.apply(node,inputForFunction) :
                    nodeExecutionResult = node.execute(inputObject,extractedInputs);

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