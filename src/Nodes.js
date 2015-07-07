import {TransformLibrary} from './TransformLibrary'
import {FunctionFilter} from './Filters'
import {TransformConfig} from './TransformConfig'
import {Filter} from './Filters'
import {Pipe} from './Pipes'
import Enumerable from 'linq-es6'


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
        var resolvedScopeName = null;
        if(flattenedInputs[name] != null)
        {
            var resolvedScopeName = this.incrementScopeName(flattenedInputs,scopeName,currentObj.name);
            valueName = this.buildInputName(resolvedScopeName,currentObj.name);
        }
        else
        {
            valueName = name;
            resolvedScopeName = scopeName;
        }

        flattenedInputs[valueName] = {value : null, name : currentObj.name};

        if(flattenedInputs.__scopeList == null)
        {
            flattenedInputs.__scopeList = {};
        }

        flattenedInputs.__scopeList[resolvedScopeName] = false;

    }

    incrementScopeName(flattenedInputs,scopeName,inputName)
    {
        var i = 1;
        while(true)
        {
            var incrementedScopeName = scopeName + i;
            var testName = this.buildInputName(incrementedScopeName,inputName);
            if(!flattenedInputs[testName])
            {
                return incrementedScopeName;
            }

            i = i +1;
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

            // Currently not checking for collisions
            var currentScope = this.buildInputName(inputObject.__executionScope.currentScope,this.pipe.getName());
            var scopeBeforeExecuting = inputObject.__executionScope.currentScope;

           if(inputObject.__executionScope.inputOverrides.__scopeList[currentScope] === false)
           {
               inputObject.__executionScope.inputOverrides.__scopeList[currentScope] = true;
           }
           else if(inputObject.__executionScope.inputOverrides.__scopeList[currentScope] == null)
           {
           }
            else
           {

               //console.log('SCOPE NEEDS CHANGING');

               var i = 1;
               while(true)
               {
                   var incrementedScopeName = currentScope + i;
                   if(inputObject.__executionScope.inputOverrides.__scopeList[incrementedScopeName] === false)
                   {
                       currentScope = incrementedScopeName;
                       inputObject.__executionScope.inputOverrides.__scopeList[incrementedScopeName] = true;
                       //console.log('SCOPE CHANGED TO ' + incrementedScopeName);


                       break;
                   }

                   i = i + 1;
               }
           }

        if(this.pipe instanceof Pipe)
        {
            inputObject.__executionScope.currentScope = currentScope;
        }

        // Currently only supporting overriding at the filter level
        if(this.pipe instanceof Filter) {


            var inputs = this.pipe.getInputSpec();


            var that = this;
            inputs.forEach((input)=>{

                var scopedName = this.buildInputName(currentScope, input.name);
                var override = inputObject.__executionScope.inputOverrides[scopedName];
                if(override.value !== null)
                {
                    console.log('Found an override for input value ' + input.name + ' on ' + this.getName() + ' which is using the scope name ' + scopedName + ', value:' + override.value);
                }
                else
                {
                    console.log('No override for input value ' + input.name + ' on ' + this.getName() + ' which is using the scope name ' + scopedName);

                }
            });

          //  var inputOverridesForCurrentNode = inputObject.__executionScope.inputOverrides[inputObject.__executionScope.currentScope];
          //  return this.pipe.execute.apply(this.pipe,[inputObject].concat(args));
        }


        return this.pipe.execute.apply(this.pipe,[inputObject].concat(args));
    }
}