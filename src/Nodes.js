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

    getNodeName()
    {
        return this.name;
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

                    if(inputMapping[this.buildInputName(scope,n.getNodeName())] == null)
                    {
                        inputMapping[this.buildInputName(scope,n.getNodeName())] = { inputSpec : nodeInputSpec,
                                                                                     nodeRef : n,
                                                                                     inputs : [],
                                                                                     forInput : function (name) { return Enumerable(this.inputs).single((i)=>{ return i.name == name; })}
                        };
                    }

                    inputMapping[this.buildInputName(scope,n.getNodeName())].inputs.push({name: nodeInput.name, value : null});
                });
            }
            else if(n.pipe instanceof Pipe)
            {
                n.pipe.rootNode.mapInputs(this.buildInputName(scope,n.getNodeName()),inputMapping);
            }
        });
    }

    buildInputName(scopeName,inputName)
    {
        return (scopeName.length > 0 ? scopeName + '_' : '') + inputName;
    }


    incrementNodeName(currentNames,nodeName)
    {
        var i = 1;
        while(true)
        {
            var incrementedScopeName = nodeName + i;
            if(currentNames[incrementedScopeName] == null)
            {
                return incrementedScopeName;
            }

            i = i +1;
        }
    }

    addSelfAndAncestorsToArray(ancestorArray,node)
    {
        ancestorArray.push(node);

        node.ancestors.forEach((n)=>{
            this.addSelfAndAncestorsToArray(ancestorArray,n);
        });
    }

    cloneTree()
    {

        var newName = this.name == '' ? this.pipe.name : this.name;

        var newNode = new TransformNode( newName,this.pipe);

        if(this.pipe instanceof Pipe)
        {
            this.pipe.rootNode = this.pipe.rootNode.cloneTree();
        }

        this.ancestors.forEach((n)=>{
            newNode.addInput(n.cloneTree());
        });

        return newNode;
    }

    makeNodeNamesUnique()
    {
        var allTopLevelNodes = [];
        var currentLevelNodeNames = {};
        this.addSelfAndAncestorsToArray(allTopLevelNodes,this);

        allTopLevelNodes.forEach((n)=>{

            let nodeName = n.getNodeName();
            if(currentLevelNodeNames[nodeName] != null)
            {
                nodeName = this.incrementNodeName(currentLevelNodeNames,nodeName);
                n.name = nodeName;
            }

            currentLevelNodeNames[nodeName] = 1;


            if(n.pipe instanceof Pipe)
            {
                n.pipe.rootNode.makeNodeNamesUnique();
            }
        });
    }

    execute(inputObject,args) {
        //if(TransformConfig.enableDebugMessages) console.log('Executing node ' + this.pipe.name);

        var inputOverrides = inputObject.__inputResolver.getInputOverrides(this);

        if(inputOverrides != null) {
            for (var i = 0; i < inputOverrides.inputs.length; i++) {

                var inputOverride = inputOverrides.inputs[i];
                if(inputOverride.value != null)
                {
                    args[i] = inputOverride.value;
                }
            }
        }

        var inputArgs = [inputObject].concat(args);
        return this.pipe.execute.apply(this.pipe,inputArgs);
    }
}