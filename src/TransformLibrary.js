import Enumerable from 'linq-es6'
import {TransformNode} from './Nodes'

export class TransformLibrary
{

    static filters = [];

    registerFilter(filter)
    {
        TransformLibrary.filters.push(filter);
    }

    getFilter(filterName)
    {
        return Enumerable(TransformLibrary.filters).where((f)=>{f.name == filterName}).single();
    }

    getFilterWrapped(filterName)
    {
        return new TransformNode('',Enumerable(TransformLibrary.filters).where((f)=>{ return f.name == filterName}).single());
    }
}