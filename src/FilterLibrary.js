import Enumerable from 'linq-es6'

export class FilterLibrary
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
}