import Enumerable from 'linq-es6'
import {TransformNode} from './Pipes'

export class TransformLibrary
{
    filters = [];

    registerFilter(filter)
    {
        this.filters.push(filter);
    }

    getFilter(filterName)
    {
        return Enumerable(this.filters).where((f)=>{f.name == filterName}).single();
    }

    getFilterWrapped(filterName)
    {
        return new TransformNode('',Enumerable(this.filters).where((f)=>{ return f.name == filterName}).single());
    }
}