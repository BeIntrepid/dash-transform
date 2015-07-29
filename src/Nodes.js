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
        if(name != null && typeof name != "string" )
        {
            throw "The wrong type of object has been passed into a TransformNodes's constructor. You probably forgot to pass name as a first parameter";
        }

        this.name = name;
        this.pipe = filter;
    }

    addInput(ancestor)
    {
        var n = ancestor;
        if(ancestor instanceof Pipe)
        {
            n = new TransformNode(null,ancestor);
        }
        else if(!(ancestor instanceof TransformNode))
        {
            throw "Can only add TransformNodes as Input";
        }

        this.ancestors.push(n);
    }

    getNodeName()
    {
        return this.name != null ? this.name : this.pipe.name;
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
                if(nodeInputSpec == null)
                {
                    return;
                }
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

        var newNode = new TransformNode( newName ,this.pipe);

        if(this.pipe instanceof Pipe)
        {
            newNode.pipe = new Pipe(this.pipe.getName(),this.pipe.rootNode.cloneTree());
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
                    var value = inputOverride.value;
                    if(inputOverride.value instanceof Function)
                    {
                        value = inputOverride.value();
                    }
                    else
                    {
                        value = inputOverride.value;
                    }

                    args[i] = value;
                }
            }
        }

        var inputArgs = [inputObject].concat(args);
        return this.pipe.execute.apply(this.pipe,inputArgs);
    }
}