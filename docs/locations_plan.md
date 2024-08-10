# Locations Plan
Well, this is basically a CRUD service for "locations".

## Location
A location is:
```
{
  name: string,
  latitude: number,
  longitude: number
}
```

In addition, there could be groupings of locations, hidden locations, etc. But, initially, just a table here will do.


## Implementation
The pattern I used in DWF would work pretty well. Something like picture service I'd say.

### How to accomplish this
Well, it would be nice to copy paste from DWF, but that service relies on `app_config` and `api` modules.

No problem, just copy those! Wrong! Now there is a duplication in my portfolio.
So really, I need to extract those modules into their own repos, and use them in both projects.
