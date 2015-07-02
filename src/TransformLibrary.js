import Enumerable from 'linq-es6'
import {TransformNode} from './Nodes'

export class TransformLibrary
{
    static filters = [];
    static pipes = [];

    registerFilter(filter)
    {
        TransformLibrary.filters.push(filter);
        return filter;
    }

    getFilter(filterName)
    {
        return Enumerable(TransformLibrary.filters).where((f)=>{f.name == filterName}).single();
    }

    getFilterWrapped(filterName)
    {
        return new TransformNode('',Enumerable(TransformLibrary.filters).where((f)=>{ return f.name == filterName}).single());
    }

    clearAll()
    {
        TransformLibrary.filters = [];
        TransformLibrary.pipes = [];
    }


    registerPipe(pipe)
    {
        TransformLibrary.pipes.push(pipe);
    }

    getPipe(pipeName)
    {
        return Enumerable(TransformLibrary.pipes).where((f)=>{f.name == pipeName}).single();
    }

    getPipeWrapped(pipeName)
    {
        return new TransformNode('',Enumerable(TransformLibrary.pipes).where((f)=>{ return f.name == pipeName}).single());
    }
}