import * as filters from './Filters'

export class Stream
{
    filter = null;
    input = {};
    output = {};

    constructor(filter)
    {
        this.filter = filter;

    }

    execute(args)
    {
        return this.filter.execute(args,input);
    }
}