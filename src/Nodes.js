import {TransformLibrary} from './TransformLibrary'
import {FunctionFilter} from './Filters'
import {TransformConfig} from './TransformConfig'
import {Filter} from './Filters'
import {Pipe} from './Pipes'


export class TransformNode
{
    ancestors = [];
    pipe = null;
    name = 'unnamed TransformNode';

    constructor(name,filter)
    {
        this.name = name;
        this.pipe = filter;
    }

    addInput(ancestor)
    {
        this.ancestors.push(ancestor);
    }

    getName()
    {
        return this.pipe.name;
    }

    mapInputs(scope,inputMapping)
    {
        var allTopLevelNodes = [];
        this.addSelfAndAncestorsToArray(allTopLevelNodes,this);


        allTopLevelNodes.forEach((n)=>{

            if(n.pipe instanceof Filter)
            {
                let nodeInputSpec = n.pipe.getInputSpec(scope,inputMapping);
                nodeInputSpec.forEach((nodeInput)=>{
                    this.resolveInputName(inputMapping,this.buildInputName(scope,n.getName()),nodeInput);
                });
            }
            else if(n.pipe instanceof Pipe)
            {
                n.pipe.rootNode.mapInputs(this.buildInputName(scope,n.getName()),inputMapping);
            }
        });
    }

    buildInputName(scopeName,inputName)
    {
        return (scopeName.length > 0 ? scopeName + '_' : '') + inputName;
    }

    resolveInputName(flattenedInputs,scopeName,currentObj)
    {
        var name = this.buildInputName(scopeName,currentObj.name);

        var valueName = null;
        if(flattenedInputs[name] != null)
        {
            valueName = this.incrementScopeName(flattenedInputs,scopeName,currentObj.name);
        }
        else
        {
            valueName = name;
        }

        flattenedInputs[valueName] = 0;
    }

    incrementScopeName(flattenedInputs,scopeName,inputName)
    {
        var i = 1;
        while(true)
        {
            var testName = this.buildInputName(scopeName + i,inputName);
            if(!flattenedInputs[testName])
            {
                return testName;
            }
            i = i + 1;
        }
    }

    addSelfAndAncestorsToArray(ancestorArray,node)
    {
        node.ancestors.forEach((n)=>{
            this.addSelfAndAncestorsToArray(ancestorArray,n);
        });

        ancestorArray.push(node);
    }

    execute(inputObject,args) {
        //if(TransformConfig.enableDebugMessages) console.log('Executing node ' + this.pipe.name);

        return this.pipe.execute.apply(this.pipe,[inputObject].concat(args));
    }

    buildInputSpec(parentSpec)
    {
        if(TransformConfig.enableDebugMessages) console.log('Building InputSpec for Node of ' + this.pipe.name);
        return this.pipe.buildInputSpec(parentSpec);
    }
}